import { Options, Types } from 'types/prettify';
import { prettify } from '@prettify/model';
import { parse } from '@parser/parse';
import { StripEnd } from '@utils/regex';
import { getTagName, is, not, repeatChar, ws } from '@utils/helpers';
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
prettify.beautify.markup = function (options: Options) {

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
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Reference to `options.parsed`
   */
  const data = parse.data;

  /**
   * Source count. This holds reference to data token
   * length or the source length.
   */
  const c = (prettify.end < 1 || prettify.end > data.token.length) ? data.token.length : prettify.end + 1;

  /**
   * External Lexer reference  when dealing with
   * markup elements that require external handling.
   * ie: `<script>` tags etc etc.
   */
  const extidx = {};

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
   * Cached option markup beautification rules
   */
  const { liquid } = options;

  /**
   * Force Attribute rule reference (used for handling newline attribute values)
   */
  const attrs = rules.forceAttribute;

  /**
   * Delimiter forcing references
   */
  const delim: Map<number, number> = new Map();

  /**
   * The newline / spacing store reference
   */
  const level = prettify.start > 0 ? Array(prettify.start).fill(0, 0, prettify.start) : [];

  /**
   * Holds the data~structure indentation levels
   */
  const levels: number[] = getLevels();

  /**
   * Indentation level / character
   */
  const ind: string = spaces();

  /**
   * The constructed output
   */
  const build: string[] = [];

  /* -------------------------------------------- */
  /* UTILITIES                                    */
  /* -------------------------------------------- */

  /**
   * Is Type
   *
   * Check whether the token type at specific index
   * equals the provided name. Returns a truthy.
   *
   * > Use `isNotType` for false comparisons.
   */
  function isType (index: number, name: Types) {

    return data.types[index] === name;

  }

  /**
   * Is Token
   *
   * Check whether the token equals the provided tag.
   * Returns a truthy.
   */
  function isToken (index: number, tag: string) {

    return data.token[index] === tag;
  }

  /**
   * Is Index
   *
   * Returns the `indexOf` a `data.types` name. This
   * is used rather frequently to determine the token
   * type we are dealing with.
   */
  function isIndex (index: number, name: Types) {

    return index > -1 && (data.types[index] || NIL).indexOf(name);

  }

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Newline
   *
   * Applies a new line character plus the correct
   * amount of identation for the given line of code
   */
  function nl (tabs: number) {

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
  function ml () {

    let lines = data.token[a].split(lf);

    const line = data.lines[a + 1];

    if (isType(a, 'comment') && (
      (
        is(data.token[a][1], cc.PER) &&
        liquid.preserveComment === false
      ) || (
        is(data.token[a][1], cc.PER) === false &&
        rules.preserveComment === false
      )
    )) {

      lines = lines.map(l => l.trimStart());

    }

    const lev = (levels[a - 1] > -1) ? isType(a, 'attribute')
      ? levels[a - 1] + 1
      : levels[a - 1] : (() => {

      let bb = a - 1; // add + 1 for inline comment formats
      let start = (bb > -1 && isIndex(bb, 'start') > -1);

      if (levels[a] > -1 && isType(a, 'attribute')) return levels[a] + 1;

      do {

        bb = bb - 1;

        if (levels[bb] > -1) return isType(a, 'content') && start === false ? levels[bb] : levels[bb] + 1;
        if (isIndex(bb, 'start') > -1) start = true;

      } while (bb > 0);

      // HOT PATCH
      // Prevent indenting when document has no levels
      // The value of bb will be -2 when no content is first
      //
      return bb === -2 ? 0 : 1;

    })();

    let aa = 0;

    // console.log(data.token[a - 1]);

    data.lines[a + 1] = 0;
    const len = lines.length - 1;

    do {

      // Fixes newlines in comments
      // opposed to generation '\n     ' a newline character is applied
      //
      if (isType(a, 'comment')) {

        if (aa === 0 && (
          (
            is(data.token[a][1], cc.PER) &&
            liquid.commentNewline === true
          ) || (
            is(data.token[a][1], cc.PER) === false &&
            rules.commentNewline === true
          )
        )) {

          // When preserve line is zero, we will insert
          // the new line above the comment.
          //
          if (options.preserveLine === 0) {

            build.push(nl(lev));

          } else {

            // We need to first count the number of line proceeded by the comment
            // to determine whether or not we should insert an additional lines.
            // We need to add an additional 1 value as lines are not zero based.
            //
            if (build.length > 0 && (build[build.length - 1].lastIndexOf(NWL) + 1) < 2) {
              build.push(nl(lev));
            }

          }
        }

        if (lines[aa] !== NIL) {

          // Indent comment contents
          //
          if (aa > 0 && (
            (
              is(data.token[a][1], cc.PER) &&
              liquid.commentIndent === true
            ) || (
              is(data.token[a][1], cc.PER) === false &&
              rules.commentIndent === true
            )
          )) {

            build.push(ind);

          }

          if (lines[aa + 1].trimStart() !== NIL) {

            build.push(lines[aa], nl(lev));

          } else {

            build.push(lines[aa], NWL);

          }

        } else {
          if (lines[aa + 1].trimStart() === NIL) {
            build.push(NWL);
          } else {
            build.push(nl(lev));
          }
        }

      } else {

        build.push(lines[aa]);
        build.push(nl(lev));
      }

      aa = aa + 1;

    } while (aa < len);

    data.lines[a + 1] = line;

    build.push(lines[len]);

    if (isType(a, 'comment') && (
      isType(a + 1, 'template_end') ||
      isType(a - 1, 'template_end')
    )) {

      build.push(nl(levels[a]));

    } else if (levels[a] === -10) {

      build.push(WSP);

    } else if (levels[a] > 1) {

      build.push(nl(levels[a]));

    } else if (levels[a] === 0 && a === 0 && isType(a, 'comment')) {

      build.push(nl(levels[a]));

    } else if (isType(a, 'comment') && levels[a] === 0 && (
      isType(a + 1, 'template_start') ||
      isType(a + 1, 'ignore')
    )) {

      build.push(nl(levels[a]));

    }
  };

  /**
   * Spaces
   *
   * Generate the indentation level and character
   * indentation spacingto be applied.
   */
  function spaces () {

    const indc = [ options.indentChar ];
    const size = options.indentSize - 1;

    let aa = 0;

    if (aa < size) {
      do {
        indc.push(options.indentChar);
        aa = aa + 1;
      } while (aa < size);
    }

    return indc.join(NIL);

  }

  /**
   * Next Index
   *
   * Advances the structure to the next index in the uniform.
   */
  function forward () {

    let x = a + 1;
    let y = 0;

    if (isType(x, undefined)) return x - 1;
    if (isType(x, 'comment') || (a < c - 1 && isIndex(x, 'attribute') > -1)) {

      do {

        if (isType(x, 'jsx_attribute_start')) {

          y = x;

          do {

            if (isType(x, 'jsx_attribute_end') && data.begin[x] === y) break;

            x = x + 1;

          } while (x < c);

        } else if (isType(x, 'comment') === false && isIndex(x, 'attribute') < 0) return x;

        x = x + 1;

      } while (x < c);
    }

    return x;

  };

  /* -------------------------------------------- */
  /* STRUCTURE PROCESSING                         */
  /* -------------------------------------------- */

  /**
   * Attribute End
   *
   * The final process for attributes and tokens. It's
   * here were the cycle is concluded for tags.
   */
  function onAttributeEnd () {

    const regend = /(?!=)\/?>$/;
    const parent = data.token[a];
    const end = regend.exec(parent);

    if (end === null) return;

    let y = a + 1;
    let isjsx = false;
    let space = rules.selfCloseSpace === true && end !== null && end[0] === '/>' ? WSP : NIL;

    data.token[a] = parent.replace(regend, NIL);

    do {

      if (isType(y, 'jsx_attribute_end') && data.begin[data.begin[y]] === a) {

        // console.log(data.token[y], JSON.stringify(space), end[0], parent);

        isjsx = false;

      } else if (data.begin[y] === a) {

        if (isType(y, 'jsx_attribute_start')) {
          isjsx = true;
        } else if (isIndex(y, 'attribute') < 0 && isjsx === false) {
          break;
        }

      } else if (isjsx === false && (data.begin[y] < a || isIndex(y, 'attribute') < 0)) {
        break;
      }

      y = y + 1;

    } while (y < c);

    if (isType(y - 1, 'comment_attribute')) space = nl(levels[y - 2] - 1);

    if (!parse.attributes.has(a)) {

      // Connects the ending delimiter of HTML tags, eg: >
      data.token[y - 1] = `${data.token[y - 1]}${space}${end[0]}`;

    }

    // HOT PATCH
    //
    // Fixes attributes being forced when proceeded by a comment
    //
    if (isType(y, 'comment') && data.lines[a + 1] < 2) levels[a] = -10;

  };

  /**
   * Delimiter Forcing
   *
   * Applies newline delimiter structures. Does some additional
   * processing to ensure special structures produce correct
   * output, like that we need to reason with when using `valueForce`
   * rule on attributes.
   */
  function onDelimiterForce () {

    if (parse.attributes.has(a) && is(data.token[a], cc.LAN) && not.last(data.token[a], cc.RAN)) {

      delim.set(a, 2);

    } else if (
      isType(a, 'end') === false &&
      not(data.token[a], cc.LAN) &&
      delim.get(data.begin[a]) >= 2 &&
      is.last(data.token[a], cc.RAN)
    ) {

      const newline: string = nl(levels[a - 1] - 1).replace(/\n+/, NWL);
      const replace = `${data.token[a].slice(0, -1)}${newline}>`;

      if (isType(data.begin[a], 'singleton')) {
        if (is(data.token[a][data.token[a].length - 2], cc.FWS)) {
          data.token[a] = `${data.token[a].slice(0, -2)}${newline}/>`;
        } else {
          data.token[a] = replace;
        }
      } else {
        data.token[a] = replace;
      }

    }
  }

  /**
   * Anchor List
   *
   * Tokens like `<a>` and `<li>` or link lists
   * handling - I am unsure of the exact use for this.
   */
  function onAnchorList () {

    const stop = data.begin[a];

    let aa = a;

    // Verify list is only a link list
    // before making changes
    //
    do {

      aa = aa - 1;

      if (
        isToken(aa, '</li>') &&
        isToken(aa - 1, '</a>') &&
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

      if (isType(aa + 1, 'attribute')) {
        level[aa] = -10;
      } else if (isToken(aa, '</li>') === false) {
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
  function onComment () {

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

      // Ensure newline when template singleton tag is followed
      // by a comment tag, eg:
      //
      // {% section 'foo' %} {% comment %}
      //
      if (isType(data.begin[x] - 1, 'template')) {
        level[data.begin[x] - 1] = indent;
      }

      const ind = (isType(next, 'end') || isType(next, 'template_end'))
        ? indent + 1
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
        isType(x, 'attribute') ||
        isType(x, 'template_attribute') ||
        isType(x, 'jsx_attribute_start')
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
  function onContent () {

    let ind = indent;

    if (rules.forceIndent === true || rules.forceAttribute === true) {
      level.push(indent);
      return;
    }

    if (next < c && (
      isIndex(next, 'end') > -1 ||
      isIndex(next, 'start') > -1
    ) && data.lines[next] > 0) {

      level.push(indent);
      ind = ind + 1;

      if (
        a > 0 &&
        isType(a, 'singleton') &&
        isIndex(a - 1, 'attribute') > -1 &&
        isType(data.begin[a - 1], 'singleton')
      ) {

        if (data.begin[a] < 0 || (
          isType(data.begin[a - 1], 'singleton') &&
          data.begin[data.ender[a] - 1] !== a
        )) {
          level[a - 1] = indent;
        } else {
          level[a - 1] = indent + 1;
        }
      }

    } else if (a > 0 && isType(a, 'singleton') && isIndex(a - 1, 'attribute') > -1) {

      level[a - 1] = indent;
      count = data.token[a].length;
      level.push(-10);

    } else if (data.lines[next] === 0) {

      level.push(-20);

    } else if ((options.wrap === 0 || (
      a < c - 2 &&
      data.token[a] !== undefined &&
      data.token[a + 1] !== undefined &&
      data.token[a + 2] !== undefined && (
        data.token[a].length
        + data.token[a + 1].length
        + data.token[a + 2].length
        + 1
      ) > options.wrap && isIndex(a + 2, 'attribute') > -1
    ) || (
      data.token[a] !== undefined &&
        data.token[a + 1] !== undefined &&
        data.token[a].length + data.token[a + 1].length > options.wrap
    )) && (
      isType(a + 1, 'singleton') ||
      isType(a + 1, 'template')
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
      isIndex(a - 1, 'attribute') > -1 &&
      data.lines[a] < 1
    ) {
      level[a - 1] = -20;
    }

    if (count > options.wrap) {

      let d = a;
      let e = Math.max(data.begin[a], 0);

      if (isType(a, 'content') && rules.preserveText === false) {

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

          if (isIndex(d, 'start') > -1) {
            count = 0;
            return;
          }

          if (data.lines[d + 1] > 0 && (
            isType(d, 'attribute') === false || (
              isType(d, 'attribute') &&
              isType(d + 1, 'attribute')
            )
          )) {

            if (isType(d, 'singleton') === false || (isType(d, 'attribute') && isType(d + 1, 'attribute'))) {
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
  function onEmbedded () {

    const skip = a;

    // HOT PATCH
    // Inline embedded JSX expressions
    if (data.types[skip - 1] === 'script_start' && is(data.token[skip - 1], cc.LCB)) {
      level[skip - 1] = -20;
    }

    do {

      if (
        data.lexer[a + 1] === 'markup' &&
        data.begin[a + 1] < skip &&
        isType(a + 1, 'start') === false &&
        isType(a + 1, 'singleton') === false) break;

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
      data.lexer[next] === 'markup' &&
      data.stack[a].indexOf('attribute') < 0 && (
        data.types[next] === 'end' ||
        data.types[next] === 'template_end'
      )
    ) {

      indent = indent - 1;
    }

  };

  /**
   * Attribute Wrap
   *
   * This function is responsible for wrapping
   * applied to attributes.
   */
  function onAttributeWrap (index: number) {

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

  /**
   * Attributes
   *
   * Used in the final beautification cycle to beautify
   * attributes and attribute values in accordance with
   * levels that were defined earlier.
   */
  function onAttribute () {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /**
     * The parent node - used to determine forced leading attribute
     */
    const parent = a - 1;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /**
     * References index position of `a` - we use a reference of `w` to infer "wrap"
     */
    let w = a;

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
    let attcount = data.types.indexOf('end', parent + 1);

    /**
     * The token length
     */
    let len = data.token[parent].length + 1;

    /**
     * The level to be applied to identation
     */
    let lev = (() => {

      if (isIndex(a, 'start') > 0) {

        let x = a;

        do {

          if (isType(x, 'end') && data.begin[x] === a) {
            if (x < c - 1 && isIndex(x + 1, 'attribute') > -1) {
              plural = true;
              break;
            }
          }

          x = x + 1;

        } while (x < c);

      } else if (a < c - 1 && isIndex(a + 1, 'attribute') > -1) {

        plural = true;

      }

      if (isType(next, 'end') || isType(next, 'template_end')) {
        return indent + (isType(parent, 'singleton') ? 2 : 1);
      }

      if (isType(parent, 'singleton')) return indent + 1;

      return indent;

    })();

    if (plural === false && isType(a, 'comment_attribute')) {

      // lev must be indent unless the "next" type is end then its indent + 1
      level.push(indent);
      level[parent] = data.types[parent] === 'singleton' ? indent + 1 : indent;

      return;
    }

    /* -------------------------------------------- */
    /* BEGIN WALK                                   */
    /* -------------------------------------------- */

    if (lev < 1) lev = 1;

    attcount = 0;

    do attcount = attcount + 1;
    while (isIndex(a + attcount, 'attribute') > -1 && (
      isType(a + attcount, 'end') === false ||
      isType(a + attcount, 'singleton') === false ||
      isType(a + attcount, 'start') === false ||
      isType(a + attcount, 'comment') === false
    ));

    // First, set levels and determine if there
    // are template attributes. When we have template
    // attributes we handle them in a similar manner
    // as HTML attributes, with only slight differences.
    //
    do {

      count = count + data.token[a].length + 1;

      if (data.types[a].indexOf('attribute') > 0) {

        if (isType(a, 'comment_attribute')) {

          level.push(lev);

        } else if (isIndex(a, 'start') > 0 && isIndex(a, 'template') < 0) {

          attrstart = true;

          // Typically this condition when true infers the last attribute token
          // in languages like JSX
          if (a < c - 2 && data.types[a + 2].indexOf('attribute') > 0) {

            level.push(-20);

            a = a + 1;

            extidx[a] = a;

          } else {

            if (parent === a - 1 && plural === false) {

              // Prevent embedded expression content being indented
              // onto newlines.
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

            if (data.lexer[a + 1] !== 'markup') {
              a = a + 1;
              onEmbedded();
            }
          }

        } else if (isIndex(a, 'end') > 0) {

          if (level[a - 1] !== -20) level[a - 1] = level[data.begin[a]] - 1;

          if (data.lexer[a + 1] !== 'markup') {
            level.push(-20);
          } else {
            level.push(lev);
          }

        } else {

          level.push(lev);

        }

      } else if (isType(a, 'attribute')) {

        len = len + data.token[a].length + 1;

        if (rules.preserveAttributes === true) {

          level.push(-10);

        } else if (
          rules.forceAttribute === true ||
          rules.forceAttribute >= 1 ||
          attrstart === true || (
            a < c - 1 &&
            isIndex(a + 1, 'attribute') > 0
          )
        ) {

          if (rules.forceAttribute === false && data.lines[a] === 1) {

            level.push(-10);

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

    } while (a < c);

    a = a - 1;

    if (
      isIndex(a, 'template') < 0 &&
      isIndex(a, 'end') > 0 &&
      isIndex(a, 'attribute') > 0 &&
      isType(parent, 'singleton') === false &&
      level[a - 1] > 0 &&
      plural === true
    ) {

      level[a - 1] = level[a - 1] - 1;
    }

    if (level[a] !== -20) {

      if (jsx === true && isIndex(parent, 'start') > -1 && isType(a + 1, 'script_start')) {

        level[a] = lev;

      } else {

        // We need to handle self closers if they get indentation
        // likely hapening with JSX.
        //
        if (isToken(a, '/') && level[a - 1] !== 10) {
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

      if (attcount >= 2 && rules.delimiterForce === true) {
        delim.set(parent, attcount);
      }

    } else if (rules.forceAttribute >= 1) {

      if (attcount >= (rules.forceAttribute as number)) {

        level[parent] = lev;

        let fa = a - 1;

        do {

          if (isType(fa, 'template') && level[fa] === -10) {
            level[fa] = lev;
          } else if (isType(fa, 'attribute') && level[fa] === -10) {
            level[fa] = lev;
          }

          fa = fa - 1;

        } while (fa > parent);

        if (rules.delimiterForce === true && attcount >= 2) {
          delim.set(parent, attcount);
        }

      } else {

        level[parent] = -10;
      }

    } else {

      //

      level[parent] = -10;

    }

    if (
      rules.preserveAttributes === true ||
      isToken(parent, '<%xml%>') ||
      isToken(parent, '<?xml?>')) {
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

          if (data.token[w].length > options.wrap && ws(data.token[w])) onAttributeWrap(w);

          if (isIndex(w, 'template') > -1 && level[w] === -10) {
            level[w] = lev;
          } else if (isType(w, 'attribute') && level[w] === -10) {
            level[w] = lev;
          }

          w = w - 1;

        } while (w > parent);

      }
    } else if (
      options.wrap > 0 &&
      isType(a, 'attribute') &&
      data.token[a].length > options.wrap &&
      ws(data.token[a])
    ) {

      onAttributeWrap(a);

    }

  };

  /**
   * Liquid Tag
   *
   * Applied indentation to the content of `{% liquid %}`
   * tag tokens. Employs its own level alogirthm.
   */
  function onLiquidTag (indent: string, token: string[]) {

    let idx = 1;
    let name = NIL;
    let toke = NIL;
    let ind = indent;

    do {

      toke = token[idx].trimStart();

      if (idx === token.length - 1) {
        token[idx] = indent.slice(2) + toke;
        break;
      }

      if (toke.indexOf(WSP) > -1) {
        name = toke.slice(0, toke.indexOf(WSP));
      } else {
        name = toke.trimEnd();
      }

      if (grammar.liquid.tags.has(name)) {

        token[idx] = ind + toke;
        ind += repeatChar(options.indentSize);

      } else if (grammar.liquid.else.has(name)) {

        token[idx] = ind.slice(options.indentSize) + toke;

      } else if (toke.startsWith('end')) {

        ind = ind.slice(options.indentSize);
        token[idx] = ind + toke;

      } else {

        token[idx] = ind + toke;

      }

      idx = idx + 1;

    } while (idx < token.length);

    data.token[a] = token.join(NWL);

  }

  /**
   * Line Breaks
   *
   * Used in beautification of Liquid operator tokens,
   * like commas and filters.
   */
  function onLineBreak () {

    const token = data.token[a].split(NWL);
    const trims = is(data.token[a][2], cc.DSH);

    let offset = 0;
    let idx = 0;
    let nls = 0;
    let tok = NIL;
    let chr = NIL;

    // Handle tokens in starting positions
    //
    if (level.length >= 2) {
      offset = level[level.length - 2] + 1;
    } else if (level.length === 1) {
      offset = level[level.length - 1] + 1;
    }

    let ind = trims
      ? repeatChar(offset * options.indentSize)
      : repeatChar(offset * options.indentSize - 1);

    if (getTagName(data.token[a]) === 'liquid') return onLiquidTag(ind, token);

    do {

      if (idx === 0) {

        tok = token[idx].trimEnd();

        if (tok.endsWith(',')) {

          chr = ',' + WSP;
          token[idx] = tok.slice(0, -1);

        } else if (tok.endsWith('|')) {

          chr = '|' + WSP;
          token[idx] = tok.slice(0, -1);

        } else if (/^{[{%]-?$/.test(tok)) {

          // NEWLINE NAME STRUCTURE
          //
          // Newline structure is inferred - according to input
          // the object name or tag name is expressed on newline.
          // Delimiter characters likely look like this:
          //
          // {{
          //   object
          //
          // OR
          //
          // {%-
          //   tag
          //
          token[idx] = tok;
          idx = idx + 1;

          // Safetey check incase empty line is present
          do {

            tok = token[idx].trim();

            if (tok.length > 0) break;

            token.splice(idx, 1);

            if (idx > token.length) break;

          } while (idx < token.length);

          const close = token[token.length - 1].trim();

          if (/^-?[%}]}$/.test(close)) {

            nls = 1;

            if (trims) {
              token[idx] = ind + tok;
              token[token.length - 1] = ind.slice(2) + close;
              ind = ind.slice(2) + repeatChar(options.indentSize);
            } else {
              token[idx] = ind + repeatChar(options.indentSize) + tok;
              token[token.length - 1] = ind.slice(1) + close;
              ind = ind + repeatChar(options.indentSize);
            }

          } else {

            token[idx] = ind + repeatChar(options.indentSize) + tok;

          }

        } else if (
          tok.endsWith(',') === false &&
          is(token[idx + 1].trimStart(), cc.COM) &&
          liquid.lineBreakSeparator === 'after'
        ) {

          // APPLY COMMA AT THIS POINT
          //
          // Structure looks like the following:
          //
          // {%- tag
          //   , param: 'x' -}
          //

          token[idx] = tok + ',';

        }

        idx = idx + 1;
        continue;

      }

      tok = token[idx].trim();

      if (is(tok, cc.COM) && liquid.lineBreakSeparator === 'after') {
        if (tok.endsWith('%}')) {
          tok = WSP + tok.slice(1);
        } else {
          tok = WSP + tok.slice(1) + ',';
        }
      }

      if (tok.length === 0) {
        token.splice(idx, 1);
        continue;
      }

      if (idx === token.length - 1 && nls === 1) break;

      if (tok.endsWith(',') && liquid.lineBreakSeparator === 'before') {

        token[idx] = ind + chr + tok.slice(0, -1);
        chr = ',' + WSP;

      } else if (tok.endsWith('|')) {

        token[idx] = ind + chr + tok.slice(0, -1);
        chr = ind + '|' + WSP;

      } else {

        token[idx] = ind + chr + tok;
        chr = NIL;
      }

      idx = idx + 1;

    } while (idx < token.length);

    // TODO
    //
    // This enforced delimiterSpacing, should maybe consider making this optional
    //
    if (liquid.normalizeSpacing === true) {

      data.token[a] = token
        .join(NWL)
        .replace(/\s*-?[%}]}$/, m => m.replace(/\s*/, WSP));

    } else {

      const space = repeatChar((data.lines[a] - 1) === -1 ? options.indentSize : data.lines[a] - 1);

      data.token[a] = token
        .join(NWL)
        .replace(/\s*-?[%}]}$/, m => m.replace(StripEnd, space));
    }

    // console.log(data.lines[a] - 1);
  }

  /**
   * Is Line Break
   *
   * Determine whether or not the provided index can
   * be tranformed by `onLineBreak` handler.
   */
  function isLineBreak (idx: number) {

    return (
      isType(idx, 'template') &&
      data.token[idx].indexOf(lf) > 0
    );

  }

  /**
   * Contained Controls
   *
   * This is a quick hack for aligning nested control tags
   * which contain HTML start/end markup tokens. For example:
   *
   * ```liquid
   * {% if x %}
   *  <div class="foo">
   * {% endif %}
   *
   *  {% # applied correct indentation %}
   *
   * {% if x %}
   *  </div>
   * {% endif %}
   * ```
   */
  function onContainedControls (last: number) {

    if (
      isType(data.begin[a - 1] - 1, 'template_start') &&
      isType(data.begin[a - 1], 'start') &&
      isType(a, 'template_end')
    ) {

      build[last] = build[last].replace(/ +/, m => m.slice(options.indentSize));

    } else if (
      isType(a, 'template_start') &&
      isType(a + 1, 'end') &&
      isType(data.ender[a + 1] + 1, 'template_end')
    ) {

      build[last] = build[last].replace(/ +/, m => m.slice(options.indentSize));

    }
  }

  /**
   * Get Levels
   *
   * Responsible for composing the indentations,
   * newlines and spacing. The `levels` constant holds
   * reference to the returned value generated.
   */
  function getLevels () {

    /* -------------------------------------------- */
    /* SPACING AND INDENTATION                      */
    /* -------------------------------------------- */

    // Ensure correct spacing is applied
    //
    // NOTE: data.lines -> space before token
    // NOTE: level -> space after token
    //
    do {

      if (data.lexer[a] === 'markup') {

        if (isType(a, 'doctype')) level[a - 1] = indent;

        if (isIndex(a, 'attribute') > -1) {

          if (parse.attributes.has(data.begin[a]) && attrs !== true) {
            rules.forceAttribute = true;
          } else if (attrs !== rules.forceAttribute) {
            rules.forceAttribute = attrs;
          }

          onAttribute();

        } else if (isType(a, 'comment')) {

          if (comstart < 0) comstart = a;

          if (isType(a + 1, 'comment') === false || (a > 0 && isIndex(a - 1, 'end') > -1)) {

            onComment();

          }

        } else if (isType(a, 'comment') === false) {

          next = forward();

          if (isType(next, 'end') || isType(next, 'template_end')) {

            // Handle force Value for void tags
            //
            // if (parse.attributes.has(data.begin[a]) || (
            //   data.types[data.begin[a - 1]] === 'singleton' &&
            //   data.types[a - 1] === 'attribute'
            // )) {

            //   // indent = indent - 1;
            //   // level[a - 1] = indent;
            // }

            indent = indent - 1;

            if (
              isType(next, 'template_end') &&
              isType(data.begin[next] + 1, 'template_else')) {

              indent = indent - 1;

            }

            if (
              isToken(a, '</ol>') ||
              isToken(a, '</ul>') ||
              isToken(a, '</dl>')) {

              onAnchorList();
            }

          }

          if (isType(a, 'script_end') && isType(next, 'end')) {

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

          } else if ((
            rules.forceIndent === false || (
              rules.forceIndent === true &&
              isType(next, 'script_start')
            )
          ) && (
            isType(a, 'content') ||
            isType(a, 'singleton') ||
            isType(a, 'template')
          )) {

            count = count + data.token[a].length;

            if (data.lines[next] > 0 && isType(next, 'script_start')) {

              level.push(-10);

            } else if (options.wrap > 0 && (isIndex(a, 'template') < 0 || (
              next < c &&
              isIndex(a, 'template') > -1 &&
              isIndex(next, 'template') < 0)
            )) {

              onContent();

            } else if (next < c && (
              isIndex(next, 'end') > -1 ||
              isIndex(next, 'start') > -1
            ) && (
              data.lines[next] > 0 ||
              isIndex(a, 'template_') > -1
            )) {

              level.push(indent);

              if (isLineBreak(a)) onLineBreak();

            } else if (data.lines[next] === 0) {

              level.push(-20);

              if (isLineBreak(a)) onLineBreak();

            } else if (data.lines[next] === 1) {

              level.push(-10);

            } else {

              level.push(indent);

              if (isLineBreak(a)) onLineBreak();

            }

          } else if (isType(a, 'start') || isType(a, 'template_start')) {

            // Indents the content from the left, for example:
            //
            // <div>
            //   ^here
            // </div>
            //
            indent = indent + 1;

            if (isType(a, 'template_start') && isType(next, 'template_else')) {

              indent = indent + 1;

            }

            if (jsx === true && isToken(a + 1, '{')) {

              // HOT PATCH
              //
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

            } else if ((
              isType(a, 'start') &&
              isType(next, 'end')
            ) || (
              isType(a, 'template_start') &&
              isType(next, 'template_end')
            )) {

              // EMPTY TOKENS
              //
              // This level of indentation is applied whe no content exists
              // within the expressed tokens, ie: They are empty. For example:
              //
              // <div>
              //
              // </div>
              //
              // {% if x %}
              //
              // {% endif %}
              //
              // The above structures contain no content and thus formatting
              // will strip the whitespace and newlines, resulting in this:
              //
              // <div></div>
              //
              // {% if x %}{% endif %}
              //
              level.push(-20);

            } else if ((isType(a, 'start') && isType(next, 'script_start'))) {

              level.push(-10);

            } else if (rules.forceIndent === true) {

              level.push(indent);

            } else if (data.lines[next] === 0 && (
              isType(next, 'content') ||
              isType(next, 'singleton') || (
                isType(a, 'start') &&
                isType(next, 'template')
              )
            )) {

              level.push(-20);

            } else {

              level.push(indent);

            }

          } else if (
            rules.forceIndent === false &&
            data.lines[next] === 0 && (
              isType(next, 'content') ||
              isType(next, 'singleton')
            )
          ) {

            level.push(-20);

          } else if (isType(a + 2, 'script_end')) {

            level.push(-20);

          } else if (isType(a, 'template_else')) {

            level[a - 1] = indent - 1;

            if (isType(next, 'template_end')) {

              level[a - 1] = indent - 1;

            }

            // else {
            // level[a - 1] = indent - 1;
            // }

            level.push(indent);

          } else if (rules.forceIndent === true && (
            (
              isType(a, 'content') && (
                isType(next, 'template') ||
                isType(next, 'content')
              )
            ) || (
              isType(a, 'template') && (
                isType(next, 'content') ||
                isType(next, 'template')
              )
            )
          )) {

            // CONTENT INDENTATION
            //
            // Respects text content and template tokens when forceIndent
            // is enabled. Tokens like {{ output }} encapsulated (surrounded) by
            // text nodes will be be excluded from forced indentations. The following
            // structure will be respected and left intact:
            //
            // Hello {{ world }}, how are you?
            //
            // The following structure will apply force indentation because content is
            // not encapsulated by template tokens or text content, instead it is encapsulted
            // by tag types:
            //
            // BEFORE FORMATTING
            //
            // <div>Hello {{ world }}, how are you?</div>
            //
            // AFTER FORMATTING
            //
            // <div>
            //   Hello {{ world }}, how are you?
            // </div>
            //
            // The same logic will follow when Liquid tags are like {% if %}, {% for %} etc
            // are the parent of the text or template (output object) token.
            //
            if (data.lines[next] < 1) {
              level.push(-20);
            } else if (data.lines[next] > 1) {
              level.push(indent);
            } else {
              level.push(-10);
            }

          } else {

            level.push(indent);

          }
        }

        if (
          isType(a, 'content') === false &&
          isType(a, 'singleton') === false &&
          isType(a, 'template') === false &&
          isType(a, 'attribute') === false) {

          count = 0;

        }

      } else {
        count = 0;
        onEmbedded();
      }

      a = a + 1;

    } while (a < c);

    return level;

  }

  /**
   * Beautify
   *
   * Constructs the generated output result. The
   * `build[]` array entries are joined after traversal
   * of the data~structure concludes.
   */
  function beautify () {

    /* -------------------------------------------- */
    /* MARKUP APPLY SCOPES                          */
    /* -------------------------------------------- */

    a = prettify.start;

    let lastLevel = options.indentLevel;

    do {

      if (data.lexer[a] === 'markup') {

        if ((
          isType(a, 'start') ||
          isType(a, 'singleton') ||
          isType(a, 'xml')
        ) &&
          isIndex(a, 'attribute') < 0 &&
          a < c - 1 && data.types[a + 1] !== undefined &&
          isIndex(a + 1, 'attribute') > -1
        ) {

          onAttributeEnd();

        }

        if (isToken(a, undefined) === false && data.token[a].indexOf(lf) > 0 && ((
          isType(a, 'content') && rules.preserveText === false) ||
          isType(a, 'comment') ||
          isType(a, 'attribute')
        )) {

          ml();

        } else if (isType(a, 'comment') && (
          (
            is(data.token[a][1], cc.PER) &&
            liquid.preserveComment === false &&
            liquid.commentNewline === true
          ) || (
            is(data.token[a][1], cc.PER) === false &&
            rules.preserveComment === false &&
            rules.commentNewline === true
          )
        ) && (
          options.preserveLine === 0 || (
            build.length > 0 &&
            build[build.length - 1].lastIndexOf(NWL) + 1 < 2
          )
        )) {

          // When preserve line is zero, we will insert
          // the new line above the comment.
          //
          build.push(
            nl(levels[a]),
            data.token[a],
            nl(levels[a])
          );

        } else {

          if (rules.delimiterForce === true) onDelimiterForce();

          onContainedControls(build.length - 1);

          build.push(data.token[a]);

          if (levels[a] === -10 && a < c - 1) {

            build.push(WSP);

          } else if (levels[a] > -1) {

            lastLevel = levels[a];

            build.push(nl(levels[a]));

          }

        }

      } else {

        prettify.start = a;
        prettify.end = extidx[a];

        const external = parse.beautify(lastLevel);
        const embedded = external.beautify.replace(StripEnd, NIL);

        if (options.language === 'jsx' && (
          data.types[a - 1] === 'template_string_end' ||
          data.types[a - 1] === 'jsx_attribute_start' ||
          data.types[a - 1] === 'script_start'
        )) {

          build.push(embedded.trimEnd());

        } else {

          build.push(embedded);

          if (embedded.endsWith(NWL)) {

            if (lastLevel - 1 > 0) build.push(repeatChar(lastLevel - 1, ind));

          } else if (rules.forceIndent === true || (
            levels[prettify.iterator] > -1 &&
            a in extidx &&
            extidx[a] > a
          )) {

            build.push(nl(levels[prettify.iterator]));

          }

        }

        a = prettify.iterator;

        external.reset();

      }

      a = a + 1;

    } while (a < c);

    prettify.iterator = c - 1;

    if (build[0] === lf || is(build[0], cc.WSP)) build[0] = NIL;

    return build.join(NIL);

  };

  // console.log('TOKE', build);

  return beautify();

};
