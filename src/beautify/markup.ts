import { Options, Helper } from 'types/prettify';
import { prettify } from '@prettify/model';
import { parse } from '@parser/parse';
import { StripEnd, StripLead } from '@utils/regex';
import { is, repeatChar, ws } from '@utils/helpers';
import { cc, WSP, NIL, NWL } from '@utils/chars';
import { grammar } from '@options/grammar';

/* -------------------------------------------- */
/* MARKUP BEAUTIFICATION                        */
/* -------------------------------------------- */

/**
 * Markup Beautification
 *
 * Used to beautify markup languages. Digests the data structure
 * created by the markup lexer.
 *
 * - HTML
 * - XML
 * - JSX
 * - XHTML
 * - Liquid.
 */
prettify.beautify.markup = (options: Options) => {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * External Lexer reference  when dealing with
   * markup elements that require external handling.
   * ie: `<script>` tags etc etc.
   */
  const extidx = {};

  /**
   * The name of the lexer used
   */
  const lexer = 'markup';

  /**
   * Reference to `options.parsed`
   */
  const { data } = parse;

  /**
   * Whether or not language mode is TSX / JSX
   */
  const jsx = options.language === 'jsx' || options.language === 'tsx';

  /**
   * Carriage return / Line Feed
   */
  const lf = options.crlf === true ? String.fromCharCode(13, 10) : String.fromCharCode(10);

  /**
   * Cached option markup beautification rules
   */
  const rules = options.markup;

  /**
   * Source count. This holds reference to data token
   * length or the source length.
   */
  const c = (prettify.end < 1 || prettify.end > data.token.length)
    ? data.token.length
    : prettify.end + 1;

  /* -------------------------------------------- */
  /* UTILITIES                                    */
  /* -------------------------------------------- */

  /**
   * Type token helper utilities for querying
   * the `data.types` (options.parsed) AST tree.
   */
  const type: Helper.Type = {
    is: (index: number, name: string) => data.types[index] === name,
    not: (index: number, name: string) => data.types[index] !== name,
    idx: (index: number, name: string) => index > -1 && (data.types[index] || NIL).indexOf(name)
  };

  /**
   * Token helper utilities for querying
   * the `data.token` (options.parsed) AST tree.
   */
  const token: Helper.Token = {
    is: (index: number, tag: string) => data.token[index] === tag,
    not: (index: number, tag: string) => data.token[index] !== tag
  };

  /* -------------------------------------------- */
  /* LOCAL SCOPES                                 */
  /* -------------------------------------------- */

  /**
   * Holds the current index position.
   */
  let a = prettify.start;

  /**
   * Comment starting positions
   */
  let comstart = -1;

  /**
   * Next token reference index
   */
  let next = 0;

  /**
   * Count reference (unsure what this holds)
   */
  let count = 0;

  /**
   * Indentation level
   */
  let indent = isNaN(options.indentLevel) ? 0 : Number(options.indentLevel);

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Levels
   *
   * This IIFE is responsible for composing the indentations,
   * newlines and spacing. The next function will reference the
   * return value applied here.
   */
  const levels = (() => {

    /**
     * The newline / spacing store reference
     */
    const level = prettify.start > 0 ? Array(prettify.start).fill(0, 0, prettify.start) : [];

    /**
     * Next Index
     *
     * Advances the structure to the next index
     * in the uniform.
     */
    function forward () {

      let x = a + 1;
      let y = 0;

      if (type.is(x, undefined)) return x - 1;
      if (type.is(x, 'comment') || (a < c - 1 && type.idx(x, 'attribute') > -1)) {

        do {

          if (type.is(x, 'jsx_attribute_start')) {

            y = x;

            do {

              if (type.is(x, 'jsx_attribute_end') && data.begin[x] === y) break;

              x = x + 1;

            } while (x < c);

          } else if (type.not(x, 'comment') && type.idx(x, 'attribute') < 0) return x;

          x = x + 1;

        } while (x < c);
      }

      return x;

    };

    /**
     * Anchors
     *
     * Tokens like `<a>` and `<li>` or link lists
     * handling - I am unsure of the exact use for this.
     */
    function anchorlist () {

      const stop = data.begin[a];

      let aa = a;

      // Verify list is only a link list
      // before making changes
      //
      do {

        aa = aa - 1;

        if (
          token.is(aa, '</li>') &&
          token.is(aa - 1, '</a>') &&
          data.begin[data.begin[aa]] === stop &&
          data.begin[aa - 1] === data.begin[aa] + 1
        ) {

          aa = data.begin[aa];

        } else {

          return;

        }

      } while (aa > stop + 1);

      // Now make the changes
      aa = a;

      do {

        aa = aa - 1;

        if (type.is(aa + 1, 'attribute')) {
          level[aa] = -10;
        } else if (token.not(aa, '</li>')) {
          level[aa] = -20;
        }

      } while (aa > stop + 1);

    };

    /**
     * Comments
     *
     * HTML / Liquid Comment Identation for markup
     * and template tags.
     */
    function comment () {

      let x = a;
      let test = false;

      if (data.lines[a + 1] === 0 && rules.forceIndent === false) {

        do {

          if (data.lines[x] > 0) {
            test = true;
            break;
          }

          x = x - 1;

        } while (x > comstart);

        x = a;

      } else {
        test = true;
      }

      // The first condition applies indentation
      // while the else block does not.
      //
      if (test === true) {

        const ind = (
          type.is(next, 'comment') ||
          type.is(next, 'end') ||
          type.is(next, 'template_end')
        ) ? indent + 1
          : indent;

        do {
          level.push(ind);
          x = x - 1;
        } while (x > comstart);

        // Indent correction so that a following end tag
        // is not indented 1 too much
        //
        if (ind === indent + 1) level[a] = indent;

        // Indentation must be applied to the tag
        // preceeding the comment
        //
        if (
          type.is(x, 'attribute') ||
          type.is(x, 'template_attribute') ||
          type.is(x, 'jsx_attribute_start')
        ) {
          level[data.begin[x]] = ind;
        } else {
          level[x] = ind;
        }

      } else {

        do {
          level.push(-20);
          x = x - 1;
        } while (x > comstart);

        level[x] = -20;

      }

      comstart = -1;

    };

    /**
     * Content
     *
     * Processes document content that is otherwise
     * not a token tag, like (for example) text.
     */
    function content () {

      let ind = indent;

      if (rules.forceIndent === true || rules.forceAttribute === true) {
        level.push(indent);
        return;
      }

      if (next < c && (
        type.idx(next, 'end') > -1 ||
        type.idx(next, 'start') > -1) && data.lines[next] > 0) {

        level.push(indent);
        ind = ind + 1;

        if (
          type.is(a, 'singleton') &&
          a > 0 &&
          type.idx(a - 1, 'attribute') > -1 &&
          type.is(data.begin[a - 1], 'singleton')
        ) {
          if (data.begin[a] < 0 || (type.is(data.begin[a - 1], 'singleton') && data.begin[data.ender[a] - 1] !== a)) {
            level[a - 1] = indent;
          } else {
            level[a - 1] = indent + 1;
          }
        }
      } else if (
        a > 0 &&
        type.is(a, 'singleton') &&
        type.idx(a - 1, 'attribute') > -1
      ) {

        level[a - 1] = indent;
        count = data.token[a].length;
        level.push(-10);

      } else if (data.lines[next] === 0) {

        level.push(-20);

      } else if ((
        options.wrap === 0 || (
          a < c - 2 &&
          data.token[a] !== undefined &&
          data.token[a + 1] !== undefined &&
          data.token[a + 2] !== undefined &&
          data.token[a].length
          + data.token[a + 1].length
          + data.token[a + 2].length
          + 1 > options.wrap && type.idx(a + 2, 'attribute') > -1
        ) || (
          data.token[a] !== undefined &&
          data.token[a + 1] !== undefined &&
          data.token[a].length + data.token[a + 1].length > options.wrap
        )
      ) && (
        type.is(a + 1, 'singleton') ||
        type.is(a + 1, 'template')
      )) {

        // Wrap
        //
        // 1. options.wrap is 0
        // 2. next token is singleton with an attribute and exceeds wrap
        // 3. next token is template or singleton and exceeds wrap
        //
        level.push(indent);

      } else {
        count = count + 1;
        level.push(-10);
      }

      if (
        a > 0 &&
        type.idx(a - 1, 'attribute') > -1 &&
        data.lines[a] < 1
      ) {
        level[a - 1] = -20;
      }

      if (count > options.wrap) {

        let d = a;
        let e = Math.max(data.begin[a], 0);

        if (type.is(a, 'content') && rules.preserveText === false) {

          let countx = 0;

          const chars = data.token[a].replace(/\s+/g, WSP).split(WSP);

          do {

            d = d - 1;

            if (level[d] < 0) {
              countx = countx + data.token[d].length;
              if (level[d] === -10) countx = countx + 1;
            } else {
              break;
            }
          } while (d > 0);

          d = 0;
          e = chars.length;

          do {

            if (chars[d].length + countx > options.wrap) {
              chars[d] = lf + chars[d];
              countx = chars[d].length;
            } else {
              chars[d] = ` ${chars[d]}`;
              countx = countx + chars[d].length;
            }

            d = d + 1;

          } while (d < e);

          if (is(chars[0], cc.WSP)) {
            data.token[a] = chars.join(NIL).slice(1);
          } else {
            level[a - 1] = ind;
            data.token[a] = chars.join(NIL).replace(lf, NIL);
          }

          if (data.token[a].indexOf(lf) > 0) {
            count = data.token[a].length - data.token[a].lastIndexOf(lf);
          }

        } else {

          do {

            d = d - 1;

            if (level[d] > -1) {

              count = data.token[a].length;
              if (data.lines[a + 1] > 0) count = count + 1;
              return;
            }

            if (type.idx(d, 'start') > -1) {
              count = 0;
              return;
            }

            if (data.lines[d + 1] > 0 && (
              type.not(d, 'attribute') || (
                type.is(d, 'attribute') &&
                type.is(d + 1, 'attribute')
              )
            )) {

              if (type.not(d, 'singleton') || (type.is(d, 'attribute') && type.is(d + 1, 'attribute'))) {
                count = data.token[a].length;
                if (data.lines[a + 1] > 0) count = count + 1;
                break;
              }
            }

          } while (d > e);

          level[d] = ind;

        }
      }

    };

    /**
     * External indentations
     *
     * Used when dealing with external lexed languages
     * like JSX, applies indentation levels accordingly.
     */
    function external () {

      const skip = a;

      // HOT PATCH
      // Inline embedded JSX expressions
      if (data.types[skip - 1] === 'script_start' && is(data.token[skip - 1], cc.LCB)) {
        level[skip - 1] = -20;
      }

      do {

        if (
          data.lexer[a + 1] === lexer &&
          data.begin[a + 1] < skip &&
          type.not(a + 1, 'start') &&
          type.not(a + 1, 'singleton')
        ) break;

        level.push(0);

        a = a + 1;

      } while (a < c);

      extidx[skip] = a;

      // HOT PATCH
      // Inline embedded JSX expressions
      if (data.types[a + 1] === 'script_end' && data.token[a + 1] === '}') {
        level.push(-20);
      } else {
        level.push(indent - 1);
        // level.push(indent - 1);
      }

      next = forward();

      if (
        data.lexer[next] === lexer &&
        data.stack[a].indexOf('attribute') < 0 && (
          data.types[next] === 'end' ||
          data.types[next] === 'template_end'
        )
      ) {

        indent = indent - 1;
      }

    };

    /**
     * Attributes
     *
     * Used in the final beautification cycle to beautify
     * attributes and attribute values in accordance with
     * levels that were defined earlier.
     */
    function attribute () {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * This function is responsible for wrapping
       * applied to attributes.
       */
      function attributeWrap (index: number) {

        const item = data.token[index].replace(/\s+/g, WSP).split(WSP);
        const size = item.length;

        let bb = 1;
        let acount = item[0].length;

        do {

          // bcount = aNWL.indexOf(item[bb], acount);

          if (acount + item[bb].length > options.wrap) {

            acount = item[bb].length;
            item[bb] = lf + item[bb];

          } else {
            item[bb] = ` ${item[bb]}`;
            acount = acount + item[bb].length;
          }

          bb = bb + 1;

        } while (bb < size);

        data.token[index] = item.join(NIL);

      };

      /* -------------------------------------------- */
      /* LOCAL SCOPES                                 */
      /* -------------------------------------------- */

      /**
       * References index position of `a` - we use a reference of `w` to infer "wrap"
       */
      let w = a;

      /**
       * The parent node - used to determine forced leading attribute
       */
      const parent = a - 1;

      /**
       * Plural - Unsure what this does, I assume it determines more than 1 attribute
       */
      let plural = false;

      /**
       * Whether or not the attribute is a start type
       */
      let attrstart: boolean = false;

      /**
       * The number of attributes contained on the tag
       */
      let attcount = 0;

      /**
       * The token length
       */
      let len = data.token[parent].length + 1;

      /**
       * The level to be applied to identation
       */
      let lev = (() => {

        if (type.idx(a, 'start') > 0) {

          let x = a;

          do {

            if (data.types[x].indexOf('end') > 0 && data.begin[x] === a) {
              if (x < c - 1 && type.idx(x + 1, 'attribute') > -1) {
                plural = true;
                break;
              }
            }

            x = x + 1;

          } while (x < c);

        } else if (a < c - 1 && type.idx(a + 1, 'attribute') > -1) {
          plural = true;
        }

        if (type.is(next, 'end') || type.is(next, 'template_end')) {
          return indent + (type.is(parent, 'singleton') ? 2 : 1);
        }

        if (type.is(parent, 'singleton')) return indent + 1;

        return indent;

      })();

      if (plural === false && type.is(a, 'comment_attribute')) {

        // lev must be indent unless the "next" type is end then its indent + 1
        level.push(indent);
        level[parent] = data.types[parent] === 'singleton'
          ? indent + 1
          : indent;

        return;
      }

      /* -------------------------------------------- */
      /* BEGIN WALK                                   */
      /* -------------------------------------------- */

      if (lev < 1) lev = 1;

      // First, set levels and determine if there
      // are template attributes. When we have template
      // attributes we handle them in a similar manner
      // as HTML attributes, with only slight differences.
      //
      do {

        count = count + data.token[a].length + 1;

        if (data.types[a].indexOf('attribute') > 0) {

          // Token with type value of template_attribute_start
          // infers a Liquid control tag is contained in the
          // HTML tag. We need to handle this accordingly
          //
          if (data.types[a] === 'template_attribute_start') {

            if (rules.preserveAttributes === true) {

              level.push(-10);

            } else {

              let nested = 1;

              do {

                if (data.lines[a] === 0) {

                  level.push(-20);

                } else if (data.lines[a] === 1) {

                  if (rules.forceAttribute === true) {
                    level.push(lev);
                  } else {
                    level.push(-10);
                  }

                } else {

                  level.push(lev);

                }

                if (nested === 0) break;

                a = a + 1;

                if (type.is(a, 'template_attribute_start')) {
                  nested = nested + 1;
                } else if (type.is(a, 'template_attribute_end')) {
                  nested = nested - 1;
                }

                attcount = attcount + 1;

                if (data.token[a] !== undefined) {
                  count = count + data.token[a].length + 1;
                  len = len + data.token[a].length + 1;
                }

              } while (a < c);

            }

          } else if (data.types[a] === 'template_attribute') {

            // console.log(data.token[a], data.lines[a]);

            if (rules.forceAttribute === true) {
              level.push(lev);
            } else {
              level.push(-10);
            }

          } else if (data.types[a] === 'comment_attribute') {

            level.push(lev);

          } else if (data.types[a].indexOf('start') > 0) {

            attrstart = true;

            // Typically this condition when true infers the last attribute token
            // in languages like JSX
            if (a < c - 2 && data.types[a + 2].indexOf('attribute') > 0) {

              level.push(-20);

              a = a + 1;

              extidx[a] = a;

            } else {

              if (parent === a - 1 && plural === false) {

                // HOT PATCH
                // Prevent embedded expression content being indented onto
                // newlines.
                //
                if (jsx) {
                  level.push(-20);
                } else {
                  level.push(lev);
                }

              } else {

                // HOT PATCH
                // Prevent embedded expression content being indented onto newlines.
                //
                if (jsx) {
                  level.push(-20);
                } else {
                  level.push(lev + 1);
                }

              }

              if (data.lexer[a + 1] !== lexer) {
                a = a + 1;
                external();
              }
            }

          } else if (data.types[a].indexOf('end') > 0 && data.types[a].indexOf('template') < 0) {

            if (level[a - 1] !== -20) level[a - 1] = level[data.begin[a]] - 1;

            if (data.lexer[a + 1] !== lexer) {
              level.push(-20);
            } else {
              level.push(lev);
            }

          } else {

            level.push(lev);

          }

        } else if (type.is(a, 'attribute')) {

          len = len + data.token[a].length + 1;

          if (rules.preserveAttributes === true) {

            level.push(-10);

          } else if (
            rules.forceAttribute === true ||
            rules.forceAttribute >= 1 ||
            attrstart === true || (
              a < c - 1 && ((
                type.idx(a + 1, 'template_attribute_') > -1 &&
                data.lines[a + 1] !== -20
              ) || (
                type.idx(a + 1, 'attribute') > 0
              ))
            )) {

            if (rules.forceAttribute === false && data.lines[a] === 1) {
              if (type.is(a + 1, 'template_attribute_start') && data.lines[a + 1] > 1) {
                level.push(lev);
              } else {
                level.push(-10);
              }
            } else {
              if (rules.forceAttribute === true) {
                level.push(lev);
              } else {
                level.push(-10);
              }
            }

          } else {

            level.push(-10);
          }

        } else if (data.begin[a] < parent + 1) {

          break;

        }

        a = a + 1;

        attcount = attcount + 1;

      } while (a < c);

      a = a - 1;

      if (
        type.idx(a, 'template') < 0 &&
        type.idx(a, 'end') > 0 &&
        type.idx(a, 'attribute') > 0 &&
        type.not(parent, 'singleton') &&
        level[a - 1] > 0 &&
        plural === true
      ) {
        level[a - 1] = level[a - 1] - 1;
      }

      if (level[a] !== -20) {

        if (jsx === true && type.idx(parent, 'start') > -1 && type.is(a + 1, 'script_start')) {

          level[a] = lev;

        } else {

          // HOT PATCH
          //
          // We need to handle self closers if they get indentation
          // likely hapening with JSX.
          //
          if (token.is(a, '/') && level[a - 1] !== 10) {
            level[a - 1] = -10;
          } else {
            level[a] = level[parent];
          }

          // console.log(data.token[a]);
        }
      }

      if (rules.forceAttribute === true) {

        count = 0;
        level[parent] = lev;

      } else if (rules.forceAttribute >= 1) {

        if (attcount >= (rules.forceAttribute as number)) {

          level[parent] = lev;

          let fa = a - 1;

          do {

            if (type.is(fa, 'template') && level[fa] === -10) {
              level[fa] = lev;
            } else if (type.is(fa, 'attribute') && level[fa] === -10) {
              level[fa] = lev;
            }

            fa = fa - 1;

          } while (fa > parent);

        } else {

          level[parent] = -10;
        }

      } else {
        level[parent] = -10;
      }

      if (
        rules.preserveAttributes === true ||
        token.is(parent, '<%xml%>') ||
        token.is(parent, '<?xml?>')
      ) {
        count = 0;
        return;
      }

      w = a;

      // Second, ensure tag contains more than one attribute
      if (w > parent + 1) {

        // finally, indent attributes if tag length exceeds the wrap limit
        if (rules.selfCloseSpace === false) len = len - 1;

        if (len > options.wrap && options.wrap > 0 && rules.forceAttribute === false) {

          if (rules.forceLeadAttribute === true) {
            level[parent] = lev;
            w = w - 1;
          }

          count = data.token[a].length;

          do {

            if (data.token[w].length > options.wrap && ws(data.token[w])) attributeWrap(w);

            if (type.idx(w, 'template') > -1 && level[w] === -10) {
              level[w] = lev;
            } else if (type.is(w, 'attribute') && level[w] === -10) {
              level[w] = lev;
            }

            w = w - 1;

          } while (w > parent);

        }
      } else if (
        options.wrap > 0 &&
        type.is(a, 'attribute') &&
        data.token[a].length > options.wrap &&
        ws(data.token[a])
      ) {

        attributeWrap(a);

      }

    };

    /* -------------------------------------------- */
    /* SPACING AND INDENTATION                      */
    /* -------------------------------------------- */

    // Ensure correct spacing is applied
    //
    // NOTE: data.lines -> space before token
    // NOTE: level -> space after token
    //
    do {

      if (data.lexer[a] === lexer) {

        if (data.token[a].toLowerCase().indexOf('<!doctype') === 0) level[a - 1] = indent;

        if (type.idx(a, 'attribute') > -1) {

          attribute();

        } else if (type.is(a, 'comment')) {

          if (comstart < 0) comstart = a;

          if (type.not(a + 1, 'comment') || (a > 0 && type.idx(a - 1, 'end') > -1)) comment();

        } else if (type.not(a, 'comment')) {

          next = forward();

          if (type.is(next, 'end')) {

            indent = indent - 1;

            // HOT PATCH
            //
            // Support <dl></dl> anchor list tags,
            // previously only ol and ul were supported
            //
            if (
              token.is(a, '</ol>') ||
              token.is(a, '</ul>') ||
              token.is(a, '</dl>')) anchorlist();

          }

          if (type.is(next, 'template_end')) {

            indent = indent - 1;

            if (
              type.is(next, 'template_end') &&
              type.is(data.begin[next] + 1, 'template_else')) indent = indent - 1;

          }

          if (type.is(a, 'script_end') && type.is(next, 'end')) {

            // HOT PATCH
            //
            // Added `indent` level for lines more than 1 so
            // JSX embedded expressions appear on newlines
            //
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }

          } else if ((rules.forceIndent === false || (
            rules.forceIndent === true &&
            type.is(next, 'script_start')
          )) && (
            type.is(a, 'content') ||
            type.is(a, 'singleton') ||
            type.is(a, 'template')
          )) {

            count = count + data.token[a].length;

            if (type.is(a, 'template')) {

              // PRESERVE INLINE
              //
              // This logic is so content can remain inline and not be indented.
              // It only applied to singleton template tags and text content
              //
              if (data.lines[next] > 1) {
                level.push(indent);
              } else if (data.lines[next] === 1) {
                level.push(-10);
              } else {
                level.push(-20);
              }

              // FILTER ALIGN
              const pos: number = data.token[a].indexOf(lf);

              if (pos > 0) {

                const offset = repeatChar(indent * options.indentSize);
                const token = data.token[a].split(NWL);

                // console.log(first);
                let idx = 0;

                do {

                  if (idx > 0) token[idx] = offset + token[idx].replace(StripLead, NIL);

                  idx = idx + 1;

                } while (idx < token.length);

                data.token[a] = token.join(NWL);

              }

            } else if (
              data.lines[next] > 0 &&
              type.is(next, 'script_start')
            ) {

              level.push(-10);

            } else if (options.wrap > 0 && (
              type.idx(a, 'template') < 0 || (
                next < c &&
                type.idx(a, 'template') > -1 &&
                type.idx(a, 'template') < 0
              )
            )) {

              content();

            } else if (next < c && (
              type.idx(next, 'end') > -1 ||
              type.idx(next, 'start') > -1
            ) && (
              data.lines[next] > 0 ||
              type.idx(a, 'template_') > -1
            )) {

              level.push(indent);

            } else if (data.lines[next] === 0) {

              level.push(-20);

            } else {

              level.push(indent);

            }

          } else if (type.is(a, 'start') || type.is(a, 'template_start')) {

            // Indents the content from the left, for example:
            //
            // <div>
            //   ^here
            // </div>
            //
            indent = indent + 1;

            if (type.is(a, 'template_start') && type.is(next, 'template_else')) {
              indent = indent + 1;
            }

            if (jsx === true && token.is(a + 1, '{')) {

              // HOT PATCH
              // Added `indent` level for lines more than 1 so
              // JSX embedded expressions appear on newlines
              //
              if (data.lines[next] === 0) {
                level.push(-20);
              } else if (data.lines[next] > 1) {
                level.push(indent);
              } else {
                level.push(-10);
              }

            } else if (type.is(a, 'start') && type.is(next, 'end')) {

              // Empty token, for example:
              //
              // <div></div>
              //
              level.push(-20);

            } else if (type.is(a, 'start') && type.is(next, 'script_start')) {

              level.push(-10);

            } else if (rules.forceIndent === true) {

              level.push(indent);

            } else if (type.is(a, 'template_start') && type.is(next, 'template_end')) {

              // Applied a single line when tag is empty
              //
              level.push(-20);

            } else if (data.lines[next] === 0 && (
              type.is(next, 'content') ||
              type.is(next, 'singleton') || (
                type.is(a, 'start') &&
                type.is(next, 'template')
              )
            )) {

              level.push(-20);

            } else {

              level.push(indent);

            }
          } else if (rules.forceIndent === false && data.lines[next] === 0 && (
            type.is(next, 'content') ||
            type.is(next, 'singleton')
          )) {

            level.push(-20);

          } else if (type.is(a + 2, 'script_end')) {

            level.push(-20);

          } else if (type.is(a, 'template_else')) {

            if (type.is(next, 'template_end')) {
              level[a - 1] = indent + 1;
            } else {
              level[a - 1] = indent - 1;
            }

            level.push(indent);

          } else {

            level.push(indent);

          }
        }

        if (
          type.not(a, 'content') &&
          type.not(a, 'singleton') &&
          type.not(a, 'template') &&
          type.not(a, 'attribute')
        ) {
          count = 0;
        }

      } else {
        count = 0;
        external();

      }

      a = a + 1;

    } while (a < c);

    return level;

  })();

  /* -------------------------------------------- */
  /* APPLY BEAUTIFICATION                         */
  /* -------------------------------------------- */

  return (() => {

    /**
     * The constructed output
     */
    const build = [];

    /**
     * Indentation level / character
     */
    const ind = (() => {

      const indy = [ options.indentChar ];
      const size = options.indentSize - 1;

      let aa = 0;

      if (aa < size) {
        do {
          indy.push(options.indentChar);
          aa = aa + 1;
        } while (aa < size);
      }

      return indy.join(NIL);

    })();

    /**
     * Newline
     *
     * Applies a new line character plus the correct
     * amount of identation for the given line of code
     */
    function newline (tabs: number) {

      const linesout = [];
      const pres = options.preserveLine + 1;
      const total = Math.min(data.lines[a + 1] - 1, pres);

      let index = 0;

      if (tabs < 0) tabs = 0;

      do {
        linesout.push(lf);
        index = index + 1;
      } while (index < total);

      if (tabs > 0) {

        index = 0;

        do {
          linesout.push(ind);
          index = index + 1;
        } while (index < tabs);

      }

      return linesout.join(NIL);

    };

    /**
     * Multiline
     *
     * Behaves similar to newline but does some extra processing.
     * Its here were we apply various augmentations
     */
    function multiline () {

      let lines = data.token[a].split(lf);

      const line = data.lines[a + 1];

      if (type.is(a, 'comment')) lines = lines.map(l => l.trimStart());

      const lev = (levels[a - 1] > -1) ? type.is(a, 'attribute')
        ? levels[a - 1] + 1
        : levels[a - 1] : (() => {

        let bb = a - 1; // add + 1 for inline comment formats
        let start = (bb > -1 && type.idx(bb, 'start') > -1);

        if (levels[a] > -1 && type.is(a, 'attribute')) {
          return levels[a] + 1;
        }

        do {

          bb = bb - 1;

          if (levels[bb] > -1) return type.is(a, 'content') && start === false ? levels[bb] : levels[bb] + 1;
          if (type.idx(bb, 'start') > -1) start = true;

        } while (bb > 0);

        // HOT PATCH
        // Prevent indenting when document has no levels
        // The value of bb will be -2 when no content is first
        //
        return bb === -2 ? 0 : 1;

      })();

      let aa = 0;

      data.lines[a + 1] = 0;
      const len = lines.length - 1;

      do {

        // HOT PATCH
        // Fixes newlines in comments
        // opposed to generation '\n     ' a newline character is applied
        //
        if (type.is(a, 'comment')) {
          if (lines[aa] !== NIL) {
            if (lines[aa + 1].trimStart() !== NIL) {
              build.push(lines[aa], newline(lev));
            } else {
              build.push(lines[aa], NWL);
            }
          } else {
            if (lines[aa + 1].trimStart() === NIL) {
              build.push(NWL);
            } else {
              build.push(newline(lev));
            }
          }
        } else {
          build.push(lines[aa]);
          build.push(newline(lev));
        }

        aa = aa + 1;

      } while (aa < len);

      // console.log(build, lines[line]);

      data.lines[a + 1] = line;

      build.push(lines[len]);

      if (levels[a] === -10) {
        build.push(WSP);
      } else if (levels[a] > 1) {
        build.push(newline(levels[a]));
      }

    };

    /**
     * Attribute End
     *
     * The final process for attributes and tokens. It's
     * here were the cycle is concluded for tags.
     */
    function endattr () {

      const regend = /\/?>$/;
      const parent = data.token[a];
      const end = regend.exec(parent);

      if (end === null) return;

      let y = a + 1;
      let isjsx = false;
      let space = (rules.selfCloseSpace === true && end !== null && end[0] === '/>')
        ? WSP as string
        : NIL;

      data.token[a] = parent.replace(regend, NIL);

      do {

        if (type.is(y, 'jsx_attribute_end') && data.begin[data.begin[y]] === a) {

          // console.log(data.token[y], JSON.stringify(space), end[0], parent);

          isjsx = false;

        } else if (data.begin[y] === a) {

          if (type.is(y, 'jsx_attribute_start')) {
            isjsx = true;
          } else if (type.idx(y, 'attribute') < 0 && isjsx === false) {
            break;
          }

        } else if (isjsx === false && (data.begin[y] < a || type.idx(y, 'attribute') < 0)) {
          break;
        }

        y = y + 1;

      } while (y < c);

      if (type.is(y - 1, 'comment_attribute')) space = newline(levels[y - 2] - 1);

      // Connects the ending delimiter of HTML tags, eg: >
      data.token[y - 1] = `${data.token[y - 1]}${space}${end[0]}`;

      // HOT PATCH
      //
      // Fixes attributes being forced when proceeded by a comment
      //
      if (type.is(y, 'comment') && data.lines[a + 1] < 2) levels[a] = -10;

    };

    /* -------------------------------------------- */
    /* MARKUP APPLY SCOPES                          */
    /* -------------------------------------------- */

    a = prettify.start;

    let lastLevel = options.indentLevel;
    let embedded: string = NIL;

    do {

      if (data.lexer[a] === lexer) {

        if ((
          type.is(a, 'start') ||
          type.is(a, 'singleton') ||
          type.is(a, 'xml')
        ) &&
          type.idx(a, 'attribute') < 0 &&
          a < c - 1 && data.types[a + 1] !== undefined &&
          type.idx(a + 1, 'attribute') > -1
        ) {

          endattr();

        }

        if (token.not(a, undefined) && data.token[a].indexOf(lf) > 0 && ((
          type.is(a, 'content') && rules.preserveText === false) ||
          type.is(a, 'comment') ||
          type.is(a, 'attribute')
        )) {

          multiline();

        } else {

          build.push(data.token[a]);

          if (levels[a] === -10 && a < c - 1) {

            build.push(WSP);

          } else if (levels[a] > -1) {

            lastLevel = levels[a];

            build.push(newline(levels[a]));

          }

        }

      } else {

        prettify.start = a;
        prettify.end = extidx[a];
        options.indentLevel = lastLevel;

        const lang = options.language;
        const id = is(data.token[a], cc.LCB) ? 'liquid' : 'html';
        let isjson = false;

        if (
          id === 'liquid' &&
          data.stack[a] in grammar[id].embed &&
          'language' in grammar[id].embed[data.stack[a]]) {
          isjson = grammar[id].embed[data.stack[a]].language === 'json';
          if (isjson) options.language = 'json';

        }

        embedded = prettify.beautify[data.lexer[a]](options).replace(StripEnd, NIL);

        build.push(embedded);

        if (embedded.endsWith(NWL)) {
          if (lastLevel - 1 > 0) build.push(repeatChar(lastLevel - 1, ind));
        } else {
          if (rules.forceIndent === true || (levels[prettify.iterator] > -1 && extidx[a] > a)) {
            build.push(newline(levels[prettify.iterator]));
          }
        }

        a = prettify.iterator;

        // Reset indentation level, if not reset to 0 then
        // content will shift on save
        options.indentLevel = 0;

        if (isjson) options.language = lang;
      }

      a = a + 1;

    } while (a < c);

    // console.log(prettify);
    prettify.iterator = c - 1;

    if (build[0] === lf || is(build[0], cc.WSP)) build[0] = NIL;

    // console.log('TOKE', build);
    return build.join(NIL);

  })();

};
