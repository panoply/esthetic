import type { Types } from 'types/index';
import { cc } from 'lexical/codes';
import { WSP, NIL, NWL } from 'chars';
import { is, isBoolean, isLast, isLastAt, isNumber, isUndefined, not, ws } from 'utils/helpers';
import { parse } from 'parse/parser';
import * as rx from 'lexical/regex';

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
 * - rules.Liquid.
 */

export function markup () {

  /* -------------------------------------------- */
  /* DESTRUCTED RULES                             */
  /* -------------------------------------------- */

  const { rules } = parse;
  const { lineBreakValue } = rules.markup;

  /* -------------------------------------------- */
  /* LOCAL SCOPES                                 */
  /* -------------------------------------------- */

  /**
   * Holds the current index position.
   */
  let a = parse.start;

  /**
   * Holds the last level
   */
  let p: number;

  /**
   * Comment starting positions
   */
  let comstart = -1;

  /**
   * Prev token reference index
   */
  let prev = 0;

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
  let indent = isNaN(rules.indentLevel) ? 0 : rules.indentLevel;

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Reference to `rules.parsed`
   */
  const data = parse.data;

  /**
   * Source count. This holds reference to data tokenx length or the source length.
   */
  const c = (parse.ender < 1 || parse.ender > data.token.length) ? data.token.length : parse.ender + 1;

  /**
   * External Lexer reference  when dealing with
   * markup elements that require external handling.
   * ie: `<script>` tags etc etc.
   */
  const extidx = {};

  /**
   * Whether or not language mode is TSX / JSX
   */
  const jsx = rules.language === 'jsx' || rules.language === 'tsx';

  /**
   * Dendentation Tags
   */
  const dedent: Set<string> = new Set(rules.liquid.dedentTagList);

  /**
   * Padded Tags - NOT YET SUPPORTED
   *
   * const padded: Set<string> = new Set(rules.liquid.paddedTagList);
   *
   */

  /**
   * Delimiter forcing references
   */
  const delim: Map<number, number> = new Map();

  /**
   * The newline / spacing store reference
   */
  const level: number[] = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];

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
   * Is Stack
   *
   * Check whether the token type at specific index
   * equals the provided name. Returns a truthy.
   *
   * > Use `isNotType` for false comparisons.
   */
  function isStack (index: number, name: string) {

    return data.stack[index] === name;

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
  function nl (tabs: number, newlines = true, spaces = true) {

    const linesout = [];
    const pres = rules.preserveLine + 1;
    const total = Math.min(data.lines[a + 1] - 1, pres);

    let index = 0;

    if (tabs < 0) tabs = 0;

    if (newlines) {
      do {
        linesout.push(parse.crlf);
        index = index + 1;
      } while (index < total);
    }

    if (tabs > 0 && spaces) {

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

    /**
     * Token split on newline occurances
     */
    let lines: string[];

    /**
     * The next lines value
     */
    const line = data.lines[a + 1];

    const isHTML = not(data.token[a][1], cc.PER) && (
      rules.markup.commentIndent === true &&
      (
        rules.markup.commentDelimiters === 'inline' ||
        (
          rules.markup.commentDelimiters === 'consistent' &&
          /<!--\n/.test(data.token[a]) === false
        )
      )
    );

    // if (isType(a, 'comment') && (
    //   (
    //     is(data.token[a][1], cc.PER) &&
    //     rules.liquid.preserveComment === false
    //   ) || (
    //     not(data.token[a][1], cc.PER) &&
    //     rules.markup.preserveComment === false
    //   )
    // )) {

    //   if (isHTML) {
    //     lines = data.token[a].split(parse.crlf);
    //   } else {
    //     lines = data.token[a].split(parse.crlf).map(l => l.trimStart());
    //   }

    // } else {

    //   lines = data.token[a].split(parse.crlf);

    // }

    lines = data.token[a].split(parse.crlf);

    const att = isType(a, 'attribute');
    const len = lines.length - 1;
    const lev = levels[a - 1] > -1 ? att ? levels[a - 1] + 1 : levels[a - 1] : (() => {

      let bb = a - 1; // add + 1 for inline comment formats
      let start = (bb > -1 && isIndex(bb, 'start') > -1);

      if (isType(a, 'comment') && not(data.token[a][1], cc.PER)) return levels[a] - 1;

      if (levels[a] > -1 && isType(a, 'attribute')) return levels[a] + 1;

      do {

        bb = bb - 1;

        if (levels[bb] > -1) return isType(a, 'content') && start === false ? levels[bb] : levels[bb] + 1;
        if (isIndex(bb, 'start') > -1) start = true;
      } while (bb > 0);

      // Prevent indenting when document has no levels
      // The value of bb will be -2 when no content is first
      //
      return bb === -2 ? 0 : 1;

    })();

    let aa = 0;

    // console.log(data.token[a - 1]);

    data.lines[a + 1] = 0;

    do {

      // Fixes newlines in comments
      // opposed to generation '\n     ' a newline character is applied
      //
      if (isType(a, 'comment')) {

        // console.log(build);

        if (aa === 0 && (
          (
            is(data.token[a][1], cc.PER) &&
            rules.liquid.commentNewline === true
          ) || (
            is(data.token[a][1], cc.PER) === false &&
            rules.markup.commentNewline === true
          )
        )) {

          // When preserve line is zero, we will insert
          // the new line above the comment.
          //
          if (rules.preserveLine === 0) {

            build.push(nl(lev));

          } else {

            // We need to first count the number of lines proceeded by the comment
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
              rules.liquid.commentIndent === true
            ) || (
              is(data.token[a][1], cc.PER) === false &&
              rules.markup.commentIndent === true
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

        if (att) {

          if (lineBreakValue === 'align' || lineBreakValue === 'force-align') {

            build.push(lines[aa].trim(), nl(levels[a]));

          } else if (lineBreakValue === 'indent' || lineBreakValue === 'force-indent') {

            if (aa + 1 === len) {

              build.push(lines[aa].trimEnd(), nl(levels[a]));

            } else {

              if (aa === 0) {

                build.push(lines[aa].replace(/(["'])\s+/, '$1' + nl(lev)).trim(), nl(lev));

              } else {
                build.push(lines[aa], nl(lev));
              }

            }
          } else {

            build.push(lines[aa]);

            if (lineBreakValue === 'force-preserve' && (
              aa + 1 === len ||
              aa === 0
            )) {
              build.push(nl(levels[a]));
            } else {
              build.push(parse.crlf);
            }

          }

        } else {

          build.push(lines[aa], nl(lev));

        }

      }

      aa = aa + 1;

    } while (aa < len);

    if (
      att &&
      not(lines[len], cc.LAN) &&
      delim.get(a - 1) >= 2 &&
      isLast(lines[len], cc.RAN) &&
      rules.markup.delimiterTerminus !== 'inline'
    ) {

      delim.delete(a - 1);

      const ind = nl(levels[a - 1] - 1);

      if (build[build.length - 1] === ind) build.push(rules.indentChar.repeat(rules.indentSize));

      if (isType(a - 1, 'singleton') && isLastAt(lines[len], cc.FWS)) {
        build.push(lines[len].slice(0, -2), ind, '/>');
      } else {
        build.push(lines[len].slice(0, -1), ind, '>');
      }

    } else {

      // if (lineBreakValue === 'force-indent') {

      //   if (rules.markup.delimiterTerminus === 'adapt') {

      //     build.push(lines[len].replace(/\s*(["'])\s*>/, nl(levels[a - 1]) + '$1').trim());

      //     if (isLast(lines[len], cc.RAN)) {
      //       build.push(nl(levels[a - 1] - 1) + '>');
      //     }

      //   } else {
      //     build.push(lines[len].replace(/\s*(["'])/, nl(levels[a - 1]) + '$1').trim());
      //   }

      // } else {

      if (isHTML) {

        // build.push('  ' + lines[len]);

      } else {

      }

      build.push(lines[len]);
      // }
    }

    data.lines[a + 1] = line;

    if (isType(a, 'comment') && (
      isType(a + 1, 'liquid_end') ||
      isType(a - 1, 'liquid_end')
    )) {

      build.push(nl(levels[a]));

    } else if (levels[a] === -10) {

      build.push(WSP);

    } else {

      build.push(nl(levels[a]));

    }

    //  else if (levels[a] > 1) { build.push(nl(levels[a]));

  };

  /**
   * Spaces
   *
   * Generate the indentation level and character
   * indentation spacing to be applied.
   */
  function spaces () {

    const indc = [ rules.indentChar ];
    const size = rules.indentSize - 1;

    let aa = 0;

    if (aa < size) {
      do {
        indc.push(rules.indentChar);
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

    if (next > 0) prev = next - 1;

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

    const parent = data.token[a];
    const end = rx.HTMLAttributeEnd.exec(parent);

    if (end === null) return;

    let y = a + 1;
    let isjsx = false;
    let space = rules.markup.selfCloseSpace === true && end[0] === '/>' ? WSP : NIL;

    data.token[a] = parent.replace(rx.HTMLAttributeEnd, NIL);

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

    // Connects the ending delimiter of HTML tags, eg: >
    data.token[y - 1] = `${data.token[y - 1]}${space}${end[0]}`;

    // TODO
    //
    // Fixes attributes being forced when proceeded by a comment
    // unsure the issue which occuring here but it is effecting
    // some logic somewhere.
    //
    // I had commented this out at some point during esthetic update
    // and only after testing in brixtol webshop did I notice that without
    // this conditional were comments following or tags with attributes
    // was content being forced onto newlines.
    //
    if (isType(y, 'comment')) {

      // levels[a] = -10;

    }

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

    if (
      isType(a, 'end') === false &&
      isLast(data.token[a], cc.RAN) &&
      not(data.token[a], cc.LAN) &&
      delim.get(data.begin[a]) >= 2) {

      delim.delete(data.begin[a]);

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
   * HTML / Liquid Comment Identation for markup and template tags.
   */
  function onComment () {

    let x = a;
    let test = false;

    if (data.lines[a + 1] === 0 && rules.markup.forceIndent === false) {

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
      if (isType(data.begin[x] - 1, 'liquid')) {

        level[data.begin[x] - 1] = indent;

      }

      // Patch fix 10/06/2023 - See the level[a] = indent variable below
      // as it related
      //
      // const ind = (isType(next, 'end') || isType(next, 'liquid_end')) ? indent + 1 : indent;

      do {

        level.push(indent);
        x = x - 1;

      } while (x > comstart);

      // Indent correction so that a following end tag
      // is not indented 1 too much, level `a` is the end token, eg: </div>
      //
      // Patched logic applied here on the 10/06/2023 which fixed comment
      // indentation logic. The above `ind` variable was also excluded in the patch
      //
      // if (ind === indent + 1)
      //
      level[a] = indent;

      // Indentation must be applied to the tag following the comment
      // this logic is important as comment indentation can break the
      // intended structures.
      //
      if ((
        (
          isType(x, 'attribute') ||
          isType(x, 'liquid_attribute') ||
          isType(x, 'jsx_attribute_start') ||
          isType(x, 'start')
        ) && (
          isType(a + 1, 'comment') === false &&
          isType(a + 1, 'start') === false &&
          data.types[a + 1].startsWith('liquid') === false
        )
      ) || (
        isType(a + 1, 'liquid_end')
      )) {

        // Removed in the 10/06/23 patch
        //
        // level[data.begin[x]] = ind;

        // This will ensure comments are indented folowing a tag with attributes
        //
        level[x] = indent + 1;

      } else if (isType(a + 1, 'liquid_else')) {

        // Here we are countering comment indentation for {% else %} or {% elsif %}
        // tokens. Wherein comments will align directly above, for example
        //
        // Example
        //
        // {% if condition %}
        //
        //   <!-- This comment is indented -->
        //   <div>
        //   </div>
        //
        // {% comment %}
        //   This comment is followed by an else tag so will align
        //   to the starting point of the opening delimiter
        // {% endcomment %}
        // {% else %}
        //
        // {% endif %}
        //
        // Comment this out to have the comment indent
        //
        level[x] = indent - 1;

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

    if (rules.markup.forceIndent === true || rules.markup.forceAttribute === true) {
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

    } else if ((rules.wrap === 0 || (
      a < c - 2 &&
      data.token[a] !== undefined &&
      data.token[a + 1] !== undefined &&
      data.token[a + 2] !== undefined && (
        data.token[a].length
        + data.token[a + 1].length
        + data.token[a + 2].length
        + 1
      ) > rules.wrap && isIndex(a + 2, 'attribute') > -1
    ) || (
      data.token[a] !== undefined &&
      data.token[a + 1] !== undefined &&
      data.token[a].length + data.token[a + 1].length > rules.wrap
    )) && (
      isType(a + 1, 'singleton') ||
      isType(a + 1, 'liquid')
    )) {

      // Wrap
      //
      // 1. rules.wrap is 0
      // 2. next token is singleton with an attribute and exceeds wrap
      // 3. next token is liquid or singleton and exceeds wrap
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

    if (count > rules.wrap) {

      let d = a;
      let e = Math.max(data.begin[a], 0);

      if (isType(a, 'content') && rules.markup.preserveText === false) {

        let countx = 0;

        const chars = data.token[a].replace(rx.SpacesGlob, WSP).split(WSP);

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

          if (chars[d].length + countx > rules.wrap) {
            chars[d] = parse.crlf + chars[d];
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
          data.token[a] = chars.join(NIL).replace(parse.crlf, NIL);
        }

        if (data.token[a].indexOf(parse.crlf) > 0) {
          count = data.token[a].length - data.token[a].lastIndexOf(parse.crlf);
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

          if (data.lines[d + 1] > 0 && (isType(d, 'attribute') === false || (
            isType(d, 'attribute') &&
            isType(d + 1, 'attribute')
          ))) {

            if (isType(d, 'singleton') === false || (
              isType(d, 'attribute') &&
              isType(d + 1, 'attribute'))) {

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

      if (data.types[a + 1] === 'liquid_end') {
        // console.log(data.types[a + 1]);
        level.push(indent - 1);
      } else {
        level.push(indent - 1);
      }
      // level.push(indent - 1);
    }

    next = forward();

    if (
      data.lexer[next] === 'markup' &&
      data.stack[a].indexOf('attribute') < 0 && (
        data.types[next] === 'end' ||
        data.types[next] === 'liquid_end'
      )
    ) {

      indent = indent - 1;
    }

  };

  /**
   * Attribute Wrap
   *
   * This function is responsible for wrapping applied to attributes.
   */
  function onAttributeWrap (index: number) {

    const item = data.token[index].replace(/\s+/g, WSP).split(WSP);
    const size = item.length;

    let bb = 1;
    let acount = item[0].length;

    do {

      // bcount = aNWL.indexOf(item[bb], acount);

      if (acount + item[bb].length > rules.wrap) {

        acount = item[bb].length;
        item[bb] = parse.crlf + item[bb];

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
    const parent: number = a - 1;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /**
     * References index position of `a` - we use a reference of `w` to infer "wrap"
     */
    let w: number = a;

    /**
     * Plural - Unsure what this does, I assume it determines more than 1 attribute
     */
    let plural = false;

    /**
     * Whether or not the attribute is a start type
     */
    let attstart: boolean = false;

    /**
     * The number of attributes contained on the tag
     */
    let attcount: number = isIndex(parent + 1, 'end');

    /**
     * The token length
     */
    let length: number = data.token[parent].length + 1;

    /**
     * Liquid level
     */
    let levliq: number = 0;

    /**
     * The level to be applied to identation
     */
    let levatt: number = (() => {

      if (isIndex(a, 'start') > 0) {

        let x: number = a;

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

      if (isType(next, 'end') || isType(next, 'liquid_end') || (
        isType(next, 'liquid_when') &&
        rules.markup.forceIndent === true
      )) {

        return isType(parent, 'singleton')
          ? indent + 2
          : indent + 1;
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

    function doAttributeForce (attcount: number) {

      if (rules.markup.forceAttribute === false) {

        level.push(-10);

      } else {

        if (rules.markup.forceAttribute === true || attcount >= (rules.markup.forceAttribute as number)) {
          if (rules.liquid.indentAttribute === true) {
            if (isType(a - 1, 'liquid_attribute_start')) level[a - 1] = levatt + levliq;
            level.push(levatt + levliq);
          } else {
            level.push(levatt);
          }
        } else {

          level.push(-10);
        }

      }
    }

    /* -------------------------------------------- */
    /* BEGIN WALK                                   */
    /* -------------------------------------------- */

    if (levatt < 1) levatt = 1;

    attcount = 0;

    do attcount = attcount + 1;
    while (isIndex(a + attcount, 'attribute') > -1 && (
      isType(a + attcount, 'end') === false ||
      isType(a + attcount, 'liquid_when') === false ||
      isType(a + attcount, 'singleton') === false ||
      isType(a + attcount, 'start') === false ||
      isType(a + attcount, 'comment') === false
    ));

    if ((
      lineBreakValue === 'force-preserve' ||
      lineBreakValue === 'force-align' ||
      lineBreakValue === 'force-indent'
    ) && ((
      isBoolean(rules.markup.forceAttribute) &&
      rules.markup.forceAttribute === false
    ) || (
      isNumber(rules.markup.forceAttribute) &&
      attcount <= (rules.markup.forceAttribute as number)
    ))) {

      attcount = Infinity;

    }

    // First, set attrs and determine if there
    // are template attributes. When we have template
    // attributes we handle them in a similar manner
    // as HTML attributes, with only slight differences.
    //
    do {

      count = count + data.token[a].length + 1;

      if (data.types[a].indexOf('attribute') > 0) {

        if (isType(a, 'comment_attribute')) {

          level.push(levatt);

        } else if (isIndex(a, 'start') > 0 && isIndex(a, 'liquid') < 0) {

          attstart = true;

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
                level.push(levatt);
              }

            } else {

              // HOT PATCH
              // Prevent embedded expression content being indented onto newlines.
              //
              if (jsx) {
                level.push(-20);
              } else {
                level.push(levatt + 1);
              }

            }

            if (data.lexer[a + 1] !== 'markup') {
              a = a + 1;
              onEmbedded();
            }
          }

        } else if (rules.liquid.indentAttribute === true) {

          if (isType(a, 'liquid_attribute_start')) {

            if (levliq > 0) {
              level.push(levatt + levliq);
            } else {
              level.push(levatt);
            }

            levliq = levliq + 1;

          } else if (isType(a, 'liquid_attribute_else')) {

            level[a - 1] = levatt + levliq - 1;

          } else if (isType(a, 'liquid_attribute_end')) {

            levliq = levliq - 1;
            level[a - 1] = levatt + levliq;

          } else {

            doAttributeForce(attcount);
          }

        } else if (isIndex(a, 'end') > 0 && isType(a, 'liquid_attribute_end') === false) {

          if (level[a - 1] !== -20) level[a - 1] = level[data.begin[a]] - 1;

          if (data.lexer[a + 1] !== 'markup') {
            level.push(-20);
          } else {
            level.push(levatt);
          }

        } else if (isIndex(a, 'liquid_attribute') > -1) {

          length = length + data.token[a].length + 1;

          if (rules.markup.preserveAttribute === true) {

            level.push(-10);

          } else if (
            rules.markup.forceAttribute === true ||
            (rules.markup.forceAttribute as number) >= 1 ||
            attstart === true || (
              a < c - 1 &&
              isIndex(a + 1, 'attribute') > -1
            )
          ) {

            doAttributeForce(attcount);

          } else {

            level.push(-10);

          }

        } else {

          level.push(levatt);

        }

      } else if (isType(a, 'attribute')) {

        length = length + data.token[a].length + 1;

        if (rules.markup.preserveAttribute === true) {

          level.push(-10);

        } else if (
          rules.markup.forceAttribute === true ||
          (rules.markup.forceAttribute as number) >= 1 ||
          attstart === true || (
            a < c - 1 &&
            isIndex(a + 1, 'attribute') > -1
          )
        ) {

          doAttributeForce(attcount);

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
      isIndex(a, 'liquid') < 0 &&
      isIndex(a, 'end') > -1 &&
      isIndex(a, 'attribute') > 0 &&
      isType(parent, 'singleton') === false &&
      level[a - 1] > 0 &&
      plural === true
    ) {

      level[a - 1] = level[a - 1] - 1;

    }

    if (level[a] !== -20) {

      if (
        jsx === true &&
        isIndex(parent, 'start') > -1 &&
        isType(a + 1, 'script_start')) {

        level[a] = levatt;

      } else {

        // We need to handle self closers if they get indentation
        // likely happening with JSX.
        //
        if (isToken(a, '/') && level[a - 1] !== 10) {
          level[a - 1] = -10;
        } else {
          level[a] = level[parent];
        }

        // console.log(data.token[a]);
      }
    }

    if (rules.markup.forceAttribute === true) {

      count = 0;
      level[parent] = levatt;

      if (attcount >= 2 && rules.markup.delimiterTerminus === 'force') {
        delim.set(parent, attcount);
      }

    } else if ((rules.markup.forceAttribute as number) >= 1) {

      if (attcount >= (rules.markup.forceAttribute as number)) {

        level[parent] = levatt;

        let fa = a - 1;

        do {

          if (isType(fa, 'liquid') && level[fa] === -10) {
            level[fa] = levatt;
          } else if (isType(fa, 'attribute') && level[fa] === -10) {
            level[fa] = levatt;
          }

          fa = fa - 1;

        } while (fa > parent);

        if (rules.markup.delimiterTerminus === 'force' && attcount >= 2) {
          delim.set(parent, attcount);
        } else if (rules.markup.delimiterTerminus === 'adapt' && attcount === Infinity) {
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
      rules.markup.preserveAttribute === true ||
      isToken(parent, '<%xml%>') ||
      isToken(parent, '<?xml?>')) {
      count = 0;
      return;
    }

    w = a;

    // Second, ensure tag contains more than one attribute
    if (w > parent + 1) {

      // finally, indent attributes if tag length exceeds the wrap limit
      if (rules.markup.selfCloseSpace === false) length = length - 1;

      if (length > rules.wrap && rules.wrap > 0 && rules.markup.forceAttribute === false) {

        level[parent] = levatt;
        count = data.token[a].length;
        w = w - 1;

        do {

          if (data.token[w].length > rules.wrap && ws(data.token[w])) onAttributeWrap(w);

          if (isIndex(w, 'liquid') > -1 && level[w] === -10) {
            level[w] = levatt;
          } else if (isType(w, 'attribute') && level[w] === -10) {
            level[w] = levatt;
          }

          w = w - 1;

        } while (w > parent);

      }

    } else if (
      rules.wrap > 0 &&
      isType(a, 'attribute') &&
      data.token[a].length > rules.wrap &&
      ws(data.token[a])
    ) {

      onAttributeWrap(a);

    }

    // console.log(data.token[a]);

  };

  /**
   * Get Levels
   *
   * Responsible for composing the indentations, newlines and spacing.
   * The `levels` constant holds reference to the returned value generated.
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

          onAttribute();

        } else if (isType(a, 'comment')) {

          if (comstart < 0) comstart = a;

          onComment();

        } else if (isType(a, 'comment') === false) {

          next = forward();

          //   if (isType(next, 'ignore')) onContent();

          if (
            isType(next, 'end') ||
            isType(next, 'liquid_case_end') || (
              isType(next, 'liquid_end') &&
              isType(a, 'liquid_else') === false
            )
          ) {

            // REMOVED DUE TO CONTENT AND LIQUID END DEFECT
            //
            if (indent > -1) indent = indent - 1;

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

          } else if (
            (
              rules.markup.forceIndent === false ||
              (rules.markup.forceIndent === true && isType(next, 'script_start'))
            ) && (
              isType(a, 'content') ||
              isType(a, 'singleton') ||
              isType(a, 'liquid')
            )
          ) {

            count = count + data.token[a].length;

            if (
              data.lines[next] > 0 &&
              isType(next, 'script_start')) {

              level.push(-10);

            } else if (
              rules.wrap > 0 &&
              isType(a, 'singleton') === false &&
              (
                isIndex(a, 'liquid') < 0 ||
                (
                  next < c &&
                  isIndex(a, 'liquid') > -1 &&
                  isIndex(next, 'liquid') < 0
                )
              )
            ) {

              onContent();

            } else if (
              next < c &&
              (
                isIndex(next, 'end') > -1 ||
                isIndex(next, 'start') > -1
              ) && (
                data.lines[next] > 0 ||
                isIndex(a, 'liquid_') > -1
              )
            ) {

              if (
                isType(next, 'liquid_case_end') &&
                dedent.has('case') === false) {
                indent = indent - 1;
              }

              level.push(indent);

            } else if (data.lines[next] === 0) {

              level.push(-20);

            } else if (data.lines[next] === 1) {

              level.push(-10);

            } else if (isType(next, 'liquid_when') && (
              isType(a, 'liquid') ||
              isType(a, 'content')
            )) {

              indent = indent - 1;
              level.push(indent);

            } else {

              level.push(indent);

            }

          } else if (
            isType(a, 'start') ||
            isType(a, 'liquid_start') ||
            isType(a, 'liquid_bad_start')) {

            // Indents the content from the left, for example:
            //
            // <div>
            //   ^here
            // </div>
            //
            indent = indent + 1;

            if (jsx === true && is(data.token[a + 1], cc.LCB)) {

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

            } else if (isType(a, 'start') && isType(next, 'end')) {

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
              // NOTE:
              //
              // We will not apply this logic to {% liquid %} type tokens
              //
              if (data.stack[a] === 'liquid') {

                level.push(indent);

              } else if (isIndex(next - 1, 'comment') > -1) {

                level.push(indent);

              } else {

                // PATCH LATEST on 10th JULY 2023
                level.push(-20);

              }

            } else if (isType(a, 'start') && isType(next, 'script_start')) {

              level.push(-10);

            } else if (data.lines[next] === 0 && (
              isType(next, 'content') ||
              isType(next, 'singleton') || (
                isType(a, 'start') &&
                isType(next, 'liquid') &&
                rules.markup.forceIndent === false
              )
            )) {

              level.push(-20);

            } else {

              level.push(indent);

            }

          } else if (
            rules.markup.forceIndent === false &&
            data.lines[next] === 0 && (
              isType(next, 'content') ||
              isType(next, 'singleton')
            )) {

            level.push(-20);

          } else if (isType(a + 2, 'script_end')) {

            level.push(-20);

          } else if (
            isType(a, 'liquid_else') &&
            isType(next, 'liquid_end')) {

            // LAST EMPTY LIQUID CONDITIONAL
            //
            // Handles empty conditionals, the structure looks like this
            //
            // {% if x %}
            //
            // {% else %}
            //             < EMPTY
            // {% endif %}
            //
            indent = indent - 1;
            level[a - 1] = indent;

            level.push(indent);

          } else if (
            isType(a, 'liquid_else') &&
            isType(next, 'liquid_else')) {

            // ELSE EMPTY LIQUID CONDITIONAL
            //
            // Handles repated empty conditionals, the structure looks like this
            //
            // {% if x %}
            //
            // {% elsif x %}
            //               < EMPTY
            // {% elsif y %}
            //               < EMPTY
            // {% else %}
            //              < EMPTY
            // {% endif %}
            //
            // We do not want to reset `indent` variable. If we were to reset the
            // indent variable then it will cause other indentations to defect.
            //

            level[a - 1] = indent - 1;
            level.push(indent - 1);

          } else if (
            isType(a, 'liquid_else') && (
              isType(next, 'content') ||
              isType(next, 'liquid')
            )) {

            level[a - 1] = indent - 1;
            level.push(indent);

          } else if (
            rules.markup.forceIndent === true && (
              (
                isType(a, 'content') && (
                  isType(next, 'liquid') ||
                  isType(next, 'content')
                )
              ) || (
                isType(a, 'liquid') && (
                  isType(next, 'content') ||
                  isType(next, 'liquid')
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

          } else if (isType(a, 'liquid_bad_start')) {

            indent = indent + 1;
            level.push(indent);

          } else if (isType(next, 'liquid_bad_end')) {

            indent = indent - 1;
            level.push(indent);

          } else if (
            isType(next, 'liquid_else') &&
            level[a - 1] === indent) {

            level.push(indent - 1);

          } else if (
            isType(a, 'liquid_else') &&
            level[a - 1] === indent &&
            rules.markup.forceIndent === false) {

            level[a - 1] = indent - 1;
            level.push(indent);

          } else if (
            isType(prev, 'liquid_start') &&
            isType(next, 'liquid_end') &&
            data.lines[next] === 0) {

            level[a - 1] = -20;

          } else if (isType(a, 'liquid_case_start')) {

            if (dedent.has('case') === false) indent = indent + 1;

            level.push(indent);

          } else if (
            isType(a, 'liquid_when') &&
            isType(next, 'liquid_when') === false) {

            if (
              isType(prev, 'attribute') &&
              rules.markup.forceIndent === false) {
              level[a - 1] = indent - 1;
            } else {
              indent = indent + 1;
            }

            level.push(indent);

          } else if (
            isType(next, 'liquid_when') &&
            isType(a, 'liquid_when') === false) {

            indent = indent - 1;
            level.push(indent);

          } else if (
            isType(next, 'liquid_case_end') &&
            dedent.has('case') === false) {

            indent = indent - 1;
            level.push(indent);

          } else {

            level.push(indent);

          }
        }

        if (
          isType(a, 'content') === false &&
          isType(a, 'singleton') === false &&
          isType(a, 'liquid') === false &&
          isType(a, 'liquid_when') === false &&
          isType(a, 'attribute') === false) count = 0;

      } else {
        count = 0;
        onEmbedded();
      }

      a = a + 1;

    } while (a < c);

    return level;

  }

  function onLiquidForce () {

    /**
     * Split the token for every newline
     */
    const lines = data.token[a].split(NWL);

    /**
     * The amount of lines assigned for better perf
     */
    const length = lines.length;

    /**
     * Iterator reference
     */
    let i: number = 0;

    /**
     * The indentation level
     */
    let indent: string = NWL;

    // DETERMINE STRUCTURE
    //
    // We quickly determine the structure of the token which will
    // indicate the delimiter placement imposed. We need to prevent
    // incorrect output when dealing with global level tokens which
    // are contained within any nodes and also catch the correct spaces.
    //
    if (a - 1 > 0) {

      indent += nl(levels[a - 1], false) + '  ';

    } else {

      // if (lines[0].length === 2 || lines[0].length === 3) {
      // indent += '  ';
      //  indent += nl(levels[a - 1], false) + '  ';

      // } else {
      indent += nl(levels[a - 1], false) + '  ';
      // }

    }

    do {

      if (i === 0) {

        if (i + 1 === length - 1 && (
          lines[i + 1].length === 2 ||
          lines[i + 1].length === 3)) {

          if (indent.length > 1) indent = indent.slice(0, -2);

          build.push(lines[i], indent, lines[i + 1]);

          break;

        } else {
          build.push(lines[i], indent);
        }

      } else if (i === length - 1) {

        build.push(lines[i]);

      } else {

        if (i + 1 === length - 1 && (
          lines[i + 1].length === 2 ||
          lines[i + 1].length === 3)) indent = indent.slice(0, -2);

        build.push(lines[i], indent);

      }

      i = i + 1;

    } while (i < length);

    // console.log(build);

  }

  /**
   * Ignored Indentations
   *
   * Applied to embedded code regions marked as ignored via the
   * `ignoreJS`, `ignoreCSS` or `ignoreJSON` makrup rules. These rules
   * still apply indentation to tokens but right side is excluded.
   *
   */
  function onIgnoreRule () {

    /**
     * Split ignore onto newlines, this allows us to apply indentation
     */
    const lines = data.token[a].split(parse.crlf);

    /**
     * Cache reference to the length
     */
    const length = lines.length;

    /**
     * Previous indentation reference, exclude newlines
     */
    const indent = nl(levels[a - 1], false);

    /**
     * Iterator reference
     */
    let i: number = 0;

    /**
     * Newline counter
     */
    let n: number = 0;

    do {

      if (lines[i] !== NIL) {

        if (!isNaN(n)) {
          build.push(n === 0 ? NWL : NWL.repeat(n));
          n = NaN;
        }

        if (!lines[i].startsWith(indent)) lines[i] = indent + lines[i];

      } else if (!isNaN(n)) {
        n = n + 1;
      }

      i = i + 1;
    } while (i < length);

    n = -1;

    do {
      i = i - 1;
      if (lines[i] !== NIL) break;
      n = n + 1;
    } while (i > -1);

    if (n === -1) {

      build.push(lines.join(parse.crlf).replace(rx.NewlineLead, NIL));
      build.push(nl(levels[a]));

    } else {

      const token = lines
        .join(parse.crlf)
        .replace(rx.NewlineLead, NIL)
        .replace(rx.SpaceEnd, NIL);

      if (n === 0) {
        build.push(token, nl(levels[a]));
      } else {
        build.push(token, NWL.repeat(n), nl(levels[a]));
      }

    }

  }

  /**
   * Beautify
   *
   * Constructs the generated output result. The
   * `build[]` array entries are joined after traversal
   * of the data~structure concludes.
   */
  function format () {

    /* -------------------------------------------- */
    /* MARKUP APPLY SCOPES                          */
    /* -------------------------------------------- */

    a = parse.start;
    p = rules.indentLevel;

    // Apply indentLevel into build as first entry to ensure
    // leading space is applied.
    //
    if (build.length === 0 && p > 0) build.push(nl(levels[a], false, true));

    do {

      if (data.lexer[a] === 'markup') {

        if (
          a < c - 1 &&
          (isType(a, 'start') || isType(a, 'singleton') || isType(a, 'xml')) &&
          isIndex(a, 'attribute') < 0 &&
          isUndefined(data.types[a + 1]) === false &&
          isIndex(a + 1, 'attribute') > -1) {

          onAttributeEnd();

        }

        if (
          isUndefined(data.token[a]) === false &&
          data.token[a].indexOf(parse.crlf) > 0 && (
            (isType(a, 'content') && rules.markup.preserveText === false) ||
            (isType(a, 'comment') && not(data.token[a].trimStart()[1], cc.BNG)) ||
            isType(a, 'attribute')
          )) {

          if (is(data.token[a].trimStart()[1], cc.PER) && rules.liquid.preserveComment === true) {

            build.push(data.token[a], nl(levels[a]));

          } else {

            ml();
          }

        } else if (isType(a, 'comment') && rules.markup.preserveComment === false && (
          (
            is(data.token[a][1], cc.PER) &&
            rules.liquid.commentNewline === true
          )
        ) && (
          rules.preserveLine === 0 || (
            build.length > 0 &&
            build[build.length - 1].lastIndexOf(NWL) + 1 < 2
          )
        )) {

          build.push(
            nl(levels[a]),
            build.pop(),
            data.token[a],
            nl(levels[a])
          );

          // When preserve line is zero, we will insert
          // the new line above the comment.
          //
          // build.push(nl(levels[a]), data.token[a], nl(levels[a]));

        } else if ((isType(a, 'comment') && is(data.token[a][1], cc.BNG))) {

          if (rx.Newline.test(data.token[a])) {

            if (levels[a] === 0) {
              build.push(data.token[a], nl(levels[a]));
            } else {

              const lines = data.token[a].split(NWL);

              let x: number = 0;

              do {

                if (lines[x] === NIL) {
                  build.push(NWL);
                } else {
                  build.push(lines[x], nl(levels[a - 1 > 0 ? a - 1 : 0], false, true));
                }

                x = x + 1;
              } while (x < lines.length);

              build.push(
                nl(levels[a])
              );
            }

          } else {

            build.push(data.token[a], nl(levels[a]));
          }

        } else if (isType(a, 'liquid_capture')) {

          build.push(data.token[a], nl(levels[a]));

        } else if (isType(a, 'ignore')) {

          if (
            isStack(a, 'script') ||
            isStack(a, 'style')) {

            onIgnoreRule();

          } else {

            build.push(data.token[a]);

            if (isType(a + 1, 'ignore') === false) {
              if (isType(a + 1, 'ignore_next')) {
                build.push(nl(levels[a], true, false));
              } else {
                build.push(nl(levels[a]));
              }
            } else {
              build.push(nl(levels[a], true, false));
            }
          }

        } else if (
          rules.markup.forceIndent === false &&
          isType(a, 'liquid') &&
          isType(a + 1, 'end') &&
          data.lines[a] === 0
        ) {

          build.push(data.token[a]);

        } else {

          p = levels[a];

          if (rules.markup.delimiterTerminus === 'force') {
            onDelimiterForce();
          }

          if (
            rx.Newline.test(data.token[a]) &&
            isIndex(a, 'liquid') > -1 &&
            isType(a, 'liquid_end') === false) {

            onLiquidForce();

          } else {

            build.push(data.token[a]);

          }

          if (levels[a] === -10 && a < c - 1) {

            build.push(WSP);

          } else if (levels[a] > -1) {

            if (
              isType(a, 'ignore') === false &&
              isType(a + 1, 'ignore_next') === true) {

              build.push(nl(levels[a], true, false));

            } else if (
              isType(a, 'ignore') === false &&
              isType(a, 'ignore_next') === false &&
              isType(a + 1, 'ignore') === true &&
              isStack(a + 1, 'script') === false &&
              isStack(a + 1, 'style') === false) {

              build.push(nl(levels[a], true, false));

            } else if (
              isType(a, 'ignore') &&
              isType(a + 1, 'ignore') === false &&
              isType(a + 1, 'ignore_next') === false) {

              build.push(nl(levels[a]));

            } else if (
              isType(a + 1, 'ignore') === false &&
              isType(a + 1, 'ignore_next') === false) {

              build.push(nl(levels[a]));

            }
          }

        }

      } else {

        parse.start = a;
        parse.ender = extidx[a];

        // Liquid External Code Region - Dedent indentation
        //
        if (p > 0 && rules.liquid.dedentTagList.includes(data.stack[a])) {
          build.splice(build.length - 1, 1, nl(levels[a] - 1));
          p = p - 1;
        }

        const external = parse.external(p);

        if ((
          rules.language === 'jsx' ||
          rules.language === 'tsx'
        ) && (
          data.types[a - 1] === 'template_string_end' ||
          data.types[a - 1] === 'jsx_attribute_start' ||
          data.types[a - 1] === 'script_start'
        )) {

          build.push(external);

        } else {

          build.push(external);

          if (rules.markup.forceIndent || (
            levels[parse.iterator] > -1 &&
            a in extidx &&
            extidx[a] > a)) {

            a = parse.iterator;
            build.push(nl(levels[a]));

          }

        }

        if (a !== parse.iterator) a = parse.iterator;

      }

      a = a + 1;

    } while (a < c);

    parse.iterator = c - 1;

    // if (rules.indentLevel === 0 && isIndex(0, 'ignore') < 0 && ws(build[0])) build[0] = NIL;

    return rules.endNewline === true
      ? build.join(NIL).replace(/\s*$/, parse.crlf)
      : build.join(NIL).trimEnd();

  };

  return format();

};
