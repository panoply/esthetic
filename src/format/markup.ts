import type { Types } from 'types/index';
import { cc } from 'lexical/codes';
import { WSP, NIL, NWL } from 'chars';
import { parse } from 'parse/parser';
import { object } from 'utils/native';
import { grammar } from 'parse/grammar';
import * as rx from 'lexical/regex';
import * as u from 'utils/helpers';

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

export function markup () {

  /* -------------------------------------------- */
  /* DESTRUCTED RULES                             */
  /* -------------------------------------------- */

  const { rules, data, ender, start } = parse;
  const { valueLineBreak } = rules.markup;
  const { phrasing } = grammar.html;

  /* -------------------------------------------- */
  /* LOCAL SCOPES                                 */
  /* -------------------------------------------- */

  /** Holds the current index position. */
  let a: number = start;

  /** Holds the last levels */
  let l: number;

  /** Prev token reference index */
  let p: number = 0;

  /** Next token reference index */
  let n: number = 0;

  /** Column Count reference, the amount of characters from each newline */
  let cols: number = 0;

  /** Last word wrap width reference */
  let wrap: number = 0;

  /** The left side indentation limit imposed before character existence */
  let width: number = 0;

  /** Comment starting positions */
  let comstart: number = -1;

  /** Indentation levels */
  let indent: number = isNaN(rules.indentLevel) ? 0 : rules.indentLevel;

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /** Source count. This holds reference to data tokenx length or the source length. */
  const c: number = ender < 1 || ender > data.token.length ? data.token.length : ender + 1;

  /** Whether or not language mode is TSX / JSX  */
  const jsx: boolean = rules.language === 'jsx' || rules.language === 'tsx';

  /** The number of newlines to be preserved as per global rules */
  const preserve: number = rules.preserveLine + 1;

  /** External Lexer reference when dealing with markup elements that require external handling. */
  const external: { [index: number]: number } = object(null);

  /** Phrasing content text node elements, keys are indices and values signal whether or not to force */
  const phrase: Map<number, boolean> = new Map();

  /** Delimiter forcing references */
  const delims: Map<number, number> = new Map();

  /** Dendentation tags based on Liquid rules */
  const dedent: Set<string> = new Set(rules.liquid.dedentTagList);

  /** The newline / spacing store reference */
  const levels: number[] = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];

  /** Indentation level / character */
  const spaces: string = rules.indentChar.repeat(rules.indentSize);

  /** The constructed output */
  const build: string[] = [];

  /* -------------------------------------------- */
  /* UTILITIES                                    */
  /* -------------------------------------------- */

  /**
   * Is Type
   *
   * Check whether the token type at specific index equals the provided name.
   *
   */
  function isType (index: number, name: Types, equality: boolean = true) {

    return equality ? data.types[index] === name : data.types[index] !== name;

  }

  /**
   * Is Text
   *
   * Sugar helper for checking the `phrase` Map storage
   */
  function isText (index: number) {

    return phrase.get(data.begin[a]);

  }

  /**
   * Is Stack
   *
   * Check whether the token type at specific index equals the provided `name`.
   */
  function isStack (index: number, name: string) {

    const stack = data.stack[index];

    return stack.indexOf(WSP) > -1 ? stack.startsWith(name) : data.stack[index] === name;

  }

  /**
   * Is Token
   *
   * Check whether the token equals the provided tag.
   */
  function isToken (index: number, tag: string) {

    return data.token[index] === tag;
  }

  /**
   * Is Index
   *
   * Returns `indexOf` from the `data.types` model of the provided `name`.
   */
  function isIndex (index: number, name: Types) {

    return index > -1 && (data.types[index] || NIL).indexOf(name);

  }

  /**
   * Is Like
   *
   * Returns a boolean indicating whether or not the `data.types[0]`
   * contains the `name` by doing `indexOf` check. Merely sugar around
   * `isIndex()` for less verbose lookups
   */
  function isLike (index: number, name: Types, equality: boolean = true) {

    return equality ? isIndex(index, name) > -1 : isIndex(index, name) < 0;

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
  function nl (tabs: number, newlines = true, whitespace = true) {

    /** The maximum number of newlines */
    const total = Math.min(data.lines[a + 1] - 1, preserve);

    /** Newline + indentation string */
    let lines: string = NIL;

    if (tabs < 0) tabs = 0;
    if (newlines) {
      lines = total <= 0 ? parse.crlf : parse.crlf.repeat(total);
    }

    if (tabs > 0 && whitespace) {

      const ws = spaces.repeat(tabs);

      lines += ws;

      if (rules.wrap > 0) {
        width = rules.wrap - ws.length;
      }

    } else {
      if (rules.wrap > 0 && width !== rules.wrap) {
        width = rules.wrap;
      }
    }

    return lines;

  };

  /**
   * Next Index
   *
   * Advances the structure to the next index in the uniform.
   */
  function forward () {

    // update the previous token index reference
    //
    if (n > 0) p = n - 1;

    if (isType(a - 1, 'content') && phrasing.has(data.token[a]) && (
      isType(a, 'start') ||
      isType(a, 'singleton'))) phrase.set(a, false);

    let x: number = a + 1;
    let y: number = 0;

    if (isType(x, undefined)) {

      x = x - 1;

    } else if (isType(x, 'comment') || (a < c - 1 && isIndex(x, 'attribute') > -1)) {

      do {

        if (isType(x, 'jsx_attribute_start')) {

          y = x;

          do {
            if (isType(x, 'jsx_attribute_end') && data.begin[x] === y) break;
          } while (++x < c);

        } else if (isType(x, 'comment') === false && isIndex(x, 'attribute') < 0) {

          break;

        }

      } while (++x < c);
    }

    // re-align next token index if end of walk
    if (n > c) n = a;

    return x;

  };

  /* -------------------------------------------- */
  /* STRUCTURE PROCESSING                         */
  /* -------------------------------------------- */

  /**
   * Attributes
   *
   * Used in the final beautification cycle to beautify
   * attributes and attribute values in accordance with
   * levels that were defined earlier.
   */
  function Attributes () {

    // The parent node - used to determine forced leading attribute
    // We re-align the previous index reference
    //
    p = a - 1;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /** References index position of `a` - we use a reference of `w` to infer "wrap" */
    let w: number = a;

    /** The token length */
    let length: number = data.token[p].length + 1;

    /** Plural - Unsure what this does, I assume it determines more than 1 attribute */
    let plural: boolean = false;

    /** Whether or not the attribute is a start type */
    let attrStart: boolean = false;

    /** Whether or not we should apply forcing */
    let attrForce: boolean = u.isBoolean(rules.markup.forceAttribute);

    /** The amount of attributes allowed before forcing */
    let attrLimit: number = attrForce ? 0 : rules.markup.forceAttribute as number;

    /** The number of attributes contained on the tag */
    let attrCount: number = isIndex(p + 1, 'end');

    /** The identation level to be applied to attributes */
    let attrLevel: number = AttributeLevel();

    /** The indentation level to applied within liquid attributes */
    let liquidLevel: number = 0;

    if (attrForce && rules.markup.forceAttribute === false) {
      attrForce = false;
    }

    if (phrase.has(p)) {
      if (u.isNumber(rules.markup.forceTextNode) && rules.markup.forceTextNode > 0) {
        attrLimit = rules.markup.forceTextNode;
        attrForce = false;
      } else if (rules.markup.forceTextNode === true) {
        phrase.set(p, true);
      }
    }

    if (isType(a, 'comment_attribute')) {

      // level must be indent unless the "next" type is end then its indent + 1
      //
      levels.push(indent);
      levels[p] = data.types[p] === 'singleton' ? indent + 1 : indent;
      return;
    }

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    function AttributeLevel () {

      if (isIndex(a, 'start') > 0) {

        let i: number = a;

        do {
          if (
            i < c - 1 &&
            data.begin[i] === a &&
            isType(i, 'end') &&
            isLike(i + 1, 'attribute')) {

            plural = true;
            break;
          }
        } while (++i < c);

      } else if (a < c - 1 && isLike(a + 1, 'attribute')) {

        plural = true;

      }

      if (
        isType(n, 'end') ||
        isType(n, 'liquid_end') ||
        isType(n, 'liquid_when')) {

        return indent + 1;

      }

      return isType(p, 'singleton') ? indent + 1 : indent;

    }

    function AttributeForce () {

      if (attrForce === false) {

        levels.push(-10);

      } else {

        if (attrForce === true || attrCount >= attrLimit) {

          if (phrase.has(p)) phrase.set(p, true);

          if (rules.liquid.indentAttribute) {
            if (isType(a - 1, 'liquid_attribute_start')) levels[a - 1] = attrLevel + liquidLevel;
            levels.push(attrLevel + liquidLevel);
          } else {
            levels.push(attrLevel);
          }

        } else {
          levels.push(-10);
        }

      }
    }

    /* -------------------------------------------- */
    /* BEGIN WALK                                   */
    /* -------------------------------------------- */

    if (attrLevel < 1) attrLevel = 1;

    attrCount = 0;

    do attrCount = attrCount + 1;
    while (isIndex(a + attrCount, 'attribute') > -1 && (
      isType(a + attrCount, 'end') === false ||
      isType(a + attrCount, 'liquid_when') === false ||
      isType(a + attrCount, 'singleton') === false ||
      isType(a + attrCount, 'start') === false ||
      isType(a + attrCount, 'comment') === false
    ));

    if ((
      valueLineBreak === 'align' ||
      valueLineBreak === 'indent' ||
      valueLineBreak === 'inline'
    ) && ((
      attrForce === false
    ) || (
      attrCount <= attrLimit
    ))) {

      attrCount = Infinity;

    }

    // First, set attrs and determine if there are template attributes.
    // When we have template attributes we handle them in a similar manner
    // as HTML attributes, with only slight differences.
    //
    do {

      cols = cols + data.token[a].length + 1;

      if (data.types[a].indexOf('attribute') > 0) {

        if (isType(a, 'comment_attribute')) {

          levels.push(attrLevel);

        } else if (isIndex(a, 'start') > 0 && isIndex(a, 'liquid') < 0) {

          attrStart = true;

          // Typically this condition when true infers the last attribute token
          // in languages like JSX
          if (a < c - 2 && data.types[a + 2].indexOf('attribute') > 0) {

            levels.push(-20);

            a = a + 1;

            external[a] = a;

          } else {

            if (p === a - 1 && plural === false) {

              // Prevent embedded expression content being indented
              // onto newlines.
              if (jsx) {
                levels.push(-20);
              } else {
                levels.push(attrLevel);
              }

            } else {

              // HOT PATCH
              // Prevent embedded expression content being indented onto newlines.
              //
              if (jsx) {
                levels.push(-20);
              } else {
                levels.push(attrLevel + 1);
              }

            }

            if (data.lexer[a + 1] !== 'markup') {
              a = a + 1;
              EmbeddedLanguage();
            }
          }

        } else if (rules.liquid.indentAttribute === true) {

          if (isType(a, 'liquid_attribute_start')) {

            if (liquidLevel > 0) {
              levels.push(attrLevel + liquidLevel);
            } else {
              levels.push(attrLevel);
            }

            liquidLevel = liquidLevel + 1;

          } else if (isType(a, 'liquid_attribute_else')) {

            levels[a - 1] = attrLevel + liquidLevel - 1;

          } else if (isType(a, 'liquid_attribute_end')) {

            liquidLevel = liquidLevel - 1;
            levels[a - 1] = attrLevel + liquidLevel;

          } else {

            AttributeForce();

          }

        } else if (isIndex(a, 'end') > 0 && isType(a, 'liquid_attribute_end') === false) {

          if (levels[a - 1] !== -20) levels[a - 1] = levels[data.begin[a]] - 1;

          if (data.lexer[a + 1] !== 'markup') {
            levels.push(-20);
          } else {
            levels.push(attrLevel);
          }

        } else if (isIndex(a, 'liquid_attribute') > -1) {

          length = length + data.token[a].length + 1;

          if (rules.markup.preserveAttribute === true) {

            levels.push(-10);

          } else if (attrForce || attrLimit >= 1 || attrStart === true || (
            a < c - 1 &&
            isIndex(a + 1, 'attribute') > -1)) {

            AttributeForce();

          } else {

            levels.push(-10);

          }

        } else {

          levels.push(attrLevel);

        }

      } else if (isType(a, 'attribute')) {

        length = length + data.token[a].length + 1;

        if (rules.markup.preserveAttribute) {

          levels.push(-10);

        } else if (attrForce || attrLimit >= 1 || attrStart === true || (
          a < c - 1 &&
          isLike(a + 1, 'attribute')
        )) {

          AttributeForce();

        } else {

          levels.push(-10);
        }

      } else if (data.begin[a] < p + 1) {

        break;

      }

    } while (++a < c);

    a = a - 1;

    if (
      plural &&
      levels[a - 1] > 0 &&
      isIndex(a, 'liquid') < 0 &&
      isIndex(a, 'end') > -1 &&
      isIndex(a, 'attribute') > 0 &&
      isType(p, 'singleton', false)) levels[a - 1] = levels[a - 1] - 1;

    if (levels[a] !== -20) {

      if (
        jsx === true &&
        isIndex(p, 'start') > -1 &&
        isType(a + 1, 'script_start')) {

        levels[a] = attrLevel;

      } else {

        // We need to handle self closers if they get indentation
        // likely happening with JSX.
        //
        if (isToken(a, '/') && levels[a - 1] !== 10) {
          levels[a - 1] = -10;
        } else {
          levels[a] = levels[p];
        }

        // console.log(data.token[a]);
      }
    }

    if (attrForce) {

      cols = 0;
      levels[p] = attrLevel;

      if (attrCount >= 2 && rules.markup.delimiterTerminus === 'force') {
        delims.set(p, attrCount);
      }

    } else if (attrLimit >= 1) {

      if (attrCount >= attrLimit) {

        levels[p] = attrLevel;

        /** Force Attribute index reference */
        let fa: number = a - 1;

        do {

          if (isType(fa, 'liquid') && levels[fa] === -10) {
            levels[fa] = attrLevel;
          } else if (isType(fa, 'attribute') && levels[fa] === -10) {
            levels[fa] = attrLevel;
          }

          fa = fa - 1;

        } while (fa > p);

        if (rules.markup.delimiterTerminus === 'force' && attrCount >= 2) {
          delims.set(p, attrCount);
        } else if (rules.markup.delimiterTerminus === 'adapt' && attrCount === Infinity) {
          delims.set(p, attrCount);
        }

        if (phrase.has(p)) phrase.set(p, true);

      } else {

        levels[p] = -10;

      }

    } else {

      //

      levels[p] = -10;

    }

    if (
      rules.markup.preserveAttribute === true ||
      isToken(p, '<%xml%>') ||
      isToken(p, '<?xml?>')) {
      cols = 0;
      return;
    }

    w = a;

    // Second, ensure tag contains more than one attribute
    if (w > p + 1) {

      // finally, indent attributes if tag length exceeds the wrap limit
      if (rules.markup.selfCloseSpace === false) length = length - 1;

      if (length > rules.wrap && rules.wrap > 0 && attrForce === false) {

        levels[p] = attrLevel;
        cols = data.token[a].length;
        w = w - 1;

        do {

          if (
            data.token[w].length > rules.wrap &&
            u.ws(data.token[w])) {

            WrapAttributes(w);

          }

          if (levels[w] === -10 && (
            isType(w, 'attribute') ||
            isLike(w, 'liquid'))) {

            levels[w] = attrLevel;

          }

        } while (--w > p);

      }

    } else if (
      rules.wrap > 0 &&
      data.token[a].length > rules.wrap &&
      isType(a, 'attribute') &&
      u.ws(data.token[a])) {

      WrapAttributes(a);

    }

    // console.log(data.token[a]);

  };

  /**
   * Attribute End
   *
   * The final process for attribute tokens. It's here were the cycle is concluded for tags
   * and we augment the token record in the data structure. The function will return the
   * last index of the next token after all attributes have been walked.
   *
   * For example, take the following token record:
   *
   * ```js
   * [
   *  {
   *   token: '<tag>'
   *  },
   *  {
   *   token: 'id="x"'
   *  }
   * ]
   * ```
   *
   * This function will augment the above to represent the correct tag references, wherein
   * the last known attribute token reference will contain the ending delimiter and the
   * starting token will have it omitted.
   *
   * ```js
  * [
  *  {
  *   token: '<tag' // notice how this token have ending delimiter omitted
  *  },
  *  {
  *   token: 'id="x">' // notice how this token now holds ending delimiter
  *  }
  * ]
  * ```
   */
  function AttributeEnd () {

    /** The start or singleton token reference */
    const parent = data.token[a];

    /** Return the ending delimiter reference */
    const closer = rx.HTMLAttributeEnd.exec(parent);

    // Do not proceed is no ending delimiter is detected.
    // This could mean that we have already processed the token
    //
    if (closer === null) return a;

    /** Advancement Reference - Moves through records in data structure */
    let i: number = a + 1;

    /** Whether or not token is JSX */
    let isjsx: boolean = false;

    /** Self closing/void tag ending delimiter */
    let space: string = rules.markup.selfCloseSpace && closer[0] === '/>' ? WSP : NIL;

    // First, we will remove the applied '>' or '/>' delimiter from the token
    // record contained within the data structure and reconnect it below.
    //
    data.token[a] = parent.replace(rx.HTMLAttributeEnd, NIL);

    do {

      if (isType(i, 'jsx_attribute_end') && data.begin[data.begin[i]] === a) {

        isjsx = false;

      } else if (data.begin[i] === a) {

        if (isType(i, 'jsx_attribute_start')) {

          isjsx = true;

        } else if (isjsx === false && isIndex(i, 'attribute') < 0) {

          break; // end of attribute/s in tag

        }

      } else if (isjsx === false && (data.begin[i] < a || isIndex(i, 'attribute') < 0)) {

        break; // end of attribute/s in tag

      }

    } while (++i < c);

    if (isType(i - 1, 'comment_attribute')) space = nl(levels[i - 2] - 1);

    // Re-connect the ending delimiter of the HTML tag, e.g: '>' or '/>'
    // The record in the data structure will now reflect correctly.
    // and the last attribute in will contain the ending delimiter
    //
    data.token[i - 1] = data.token[i - 1] + space + closer[0];

    return i;

  };

  /**
   * Force Markup Delimiters
   *
   * Applies newline delimiter structures. Does some additional
   * processing to ensure special structures produce correct
   * output, like that we need to reason with when using `valueForce`
   * rule on attributes.
   */
  function ForceMarkupDelimiters () {

    if (
      isType(a, 'end') === false &&
      u.isLast(data.token[a], cc.RAN) &&
      u.not(data.token[a], cc.LAN) &&
      delims.get(data.begin[a]) >= 2) {

      delims.delete(data.begin[a]);

      const newline: string = nl(levels[a - 1] - 1).replace(/\n+/, NWL);
      const replace = `${data.token[a].slice(0, -1)}${newline}>`;

      if (isType(data.begin[a], 'singleton')) {
        if (u.is(data.token[a][data.token[a].length - 2], cc.FWS)) {
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
   * Force Liquid Delimiters
   *
   * Applies forcing on Liquid tokens. During the lexer operations, Liquid
   * tokens which apply delimiter forcing, relative to the define `delimiterPlacement`
   * Liquid formatting rule will contain a `\n` newline after the starting delimiter.
   *
   * This function is responsible for ensuring all the containing token content is
   * aligned and correctly formatted when forcing has been determined.
   */
  function ForceLiquidDelimiters () {

    /** Split the token for every newline */
    const lines = data.token[a].split(NWL);

    /** Additional spacing characters */
    const space = rules.indentChar.repeat(rules.indentSize);

    /** The amount of lines assigned for better perf */
    const length = lines.length;

    /** Iterator reference */
    let i: number = 0;

    /** The indentation levels */
    let indent: string = NWL + nl(levels[a - 1], false) + space;

    // DETERMINE STRUCTURE
    //
    // We quickly determine the structure of the token which will
    // indicate the delimiter placement imposed. We need to rent
    // incorrect output when dealing with global levels tokens which
    // are contained within any nodes and also catch the correct spaces.
    //
    do {

      if (i === 0) {

        if (i + 1 === length - 1 && (lines[i + 1].length === 2 || lines[i + 1].length === 3)) {

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
          lines[i + 1].length === 3)) {

          indent = indent.slice(0, -2);

        }

        build.push(lines[i], indent);

      }

    } while (++i < length);

  }

  /**
   * Anchor List
   *
   * Tokens like `<a>` and `<li>` or link lists
   * handling - I am unsure of the exact use for this.
   */
  function Anchors () {

    const stop = data.begin[a];

    let i: number = a;

    // Verify list is only a link list
    // before making changes
    //
    do {

      --i;

      if (
        isToken(i, '</li>') &&
        isToken(i - 1, '</a>') &&
        data.begin[data.begin[i]] === stop &&
        data.begin[i - 1] === data.begin[i] + 1) {

        i = data.begin[i];

      } else return;

    } while (i > stop + 1);

    // Now make the changes
    i = a;

    do {

      --i;

      if (isType(i + 1, 'attribute')) {
        levels[i] = -10;
      } else if (isToken(i, '</li>') === false) {
        levels[i] = -20;
      }

    } while (i > stop + 1);

  };

  /**
   * Comments
   *
   * HTML / Liquid Comment Identation for markup and template tags.
   */
  function Comments () {

    if (comstart < 0) comstart = a;

    let x: number = a;
    let nwl = false;

    if (data.lines[x + 1] === 0 && rules.markup.forceIndent === false) {

      do {
        if (data.lines[x] > 0) {
          nwl = true;
          break;
        }
      } while (--x > comstart);

      x = a;

    } else {

      nwl = true;

    }

    // The first condition applies indentation
    // while the else block does not.
    //
    if (nwl === true) {
      // Ensure newline when template singleton tag is followed
      // by a comment tag, eg:
      //
      // {% section 'foo' %} {% comment %}
      //
      if (isType(data.begin[x] - 1, 'liquid')) {
        levels[data.begin[x] - 1] = indent;
      }
      // Patch fix 10/06/2023 - See the levels[a] = indent variable below
      // as it related
      //
      // const ind = (isType(next, 'end') || isType(next, 'liquid_end')) ? indent + 1 : indent;
      do {
        levels.push(indent);
        x = x - 1;
      } while (x > comstart);
      // Indent correction so that a following end tag
      // is not indented 1 too much, levels `a` is the end token, eg: </div>
      //
      // Patched logic applied here on the 10/06/2023 which fixed comment
      // indentation logic. The above `ind` variable was also excluded in the patch
      //
      // if (ind === indent + 1)
      //
      levels[a] = indent;
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
        // levels[a - 1] = indent - 2;
        // This will ensure comments are indented folowing a tag with attributes
        //
        levels[x] = indent + 1;

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
        levels[x] = indent - 1;

      } else if (isType(n, 'liquid')) {

        levels[p] = indent - 1;
        levels[a - 1] = indent;

      }

    } else {

      do {
        levels.push(-20);
        x = x - 1;
      } while (x > comstart);

      levels[x] = -20;

    }

    comstart = -1;

  };

  /**
   * External indentations
   *
   * Used when dealing with external lexed languages
   * like JSX, applies indentation levels accordingly.
   */
  function EmbeddedLanguage () {

    cols = 0;

    const skip = a;

    // HOT PATCH
    // Inline embedded JSX expressions
    if (data.types[skip - 1] === 'script_start' && u.is(data.token[skip - 1], cc.LCB)) {
      levels[skip - 1] = -20;
    }

    do {

      if (
        data.lexer[a + 1] === 'markup' &&
        data.begin[a + 1] < skip &&
        isType(a + 1, 'start') === false &&
        isType(a + 1, 'singleton') === false) break;

      levels.push(0);

      a = a + 1;

    } while (a < c);

    external[skip] = a;

    // HOT PATCH
    // Inline embedded JSX expressions
    if (data.types[a + 1] === 'script_end' && data.token[a + 1] === '}') {

      levels.push(-20);

    } else {

      if (data.types[a + 1] === 'liquid_end') {
        // console.log(data.types[a + 1]);
        levels.push(indent - 1);
      } else {
        levels.push(indent - 1);
      }
      // levels.push(indent - 1);
    }

    n = forward();

    if (
      data.lexer[n] === 'markup' &&
      data.stack[a].indexOf('attribute') < 0 && (
        isType(n, 'end') ||
        isType(n, 'liquid_end'))) {

      indent = indent - 1;

    }

  };

  /* -------------------------------------------- */
  /* WRAP LOGIC                                   */
  /* -------------------------------------------- */

  /**
   * Wrap Attributes
   *
   * This function is responsible for wrapping applied to attributes.
   */
  function WrapAttributes (index: number) {

    const item = data.token[index].replace(rx.SpacesGlob, WSP).split(WSP);
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
   * Wrap Content
   *
   * Word wrap processing for text content, phrasing content elements and comments.
   * This function is responsible for enforcing wrap and respecting rules like
   * `forceTextNode` and
   */
  function WrapContent () {

    wrap = 0;

    let offset = nl(levels[a > 0 ? a - 1 : a], false);
    let indent = NWL + offset;

    /* -------------------------------------------- */
    /* CONTENT WRAP                                 */
    /* -------------------------------------------- */

    // When wrap options recieves liquid_comment_start it signals
    // we have an inline comment block. This condition will check
    // wrap limit and if the comment exceeds the limit we force.
    //
    // If token type 'a' is not liquid comment block start we proceed
    // as normal and execute TextWordWrap wrapping.
    //
    if (isType(a, 'liquid_comment_start')) {

      LiquidComment();

    } else {

      TextWordWrap();

      // Only pass to the TextElement for phrasing content text node
      // handling when our current index is not a comment related token.
      //
      if (
        isType(a, 'comment', false) &&
        isType(a, 'liquid_comment', false)) {

        TextElement();

      }
    }

    /**
     * Liquid Comment
     *
     * Handles Liquid block comment tokens, which require some additional processing
     * in order to gracefully handle the inline > force cases.
     */
    function LiquidComment () {

      if (data.token[a].length + data.token[a + 1].length + data.token[a + 2].length > width) {

        // LIQUID COMMENT START
        //
        // Push the {% comment %} token into build stack and append indentation
        // We are dealing with a predictable structure, so we will manually move
        // through the recordsm as per next LIQUID_COMMENT applied advancement.
        //
        build.push(data.token[a]);

        if (levels[a] > -1) {

          build.push(nl(levels[a]));

          offset = nl(levels[a], false);
          indent = NWL + offset;

        } else if (rules.wrap > 0) {

          build.push(indent);

        } else if (levels[a] === -10) {

          build.push(WSP);

        }

        // LIQUID_COMMENT
        //
        // Move to the next token type in data~structure which will
        // be 'liquid_comment' and then pass to TextWordWrap function
        // for word wrapping.
        //
        a = a + 1;

        TextWordWrap();

        if (levels[a] > -1) {
          build.push(nl(levels[a]));
        } else if (levels[a] === -10) {
          build.push(WSP);
        }

        // LIQUID_COMMENT_END
        //
        // At this point, we have our Liquid block type start comment tag
        // and we also have applied word wrap to the comment contents. The
        // last thing we need to do is conclude by pushing the {% endcomment %}
        // and ensuring that it adhere to dedent logic.
        //
        a = a + 1; // move to the next token: liquid_comment_end

        build.push(data.token[a], nl(levels[a]));

      } else {

        // The comment can remain inline as it did not exceed wrap limit, we
        // push it into the build stack and using single whitespace indent.
        // The resulting output will reflect provided structure, e.g:
        //
        // {% comment %} Lorem Ipsum {% endcomment %}
        //
        build.push(
          data.token[a] //    {% comment %}
          , WSP
          , data.token[++a] //  Lorem Ipsum
          , WSP
          , data.token[++a] // {% endcomment %}
          , nl(levels[a])
        );

      }

    }

    /**
     * Text Word Wrap
     *
     * Handler for wrapping text `content` type tokens. Applies word-wrap
     * limit to the text and looks for occurances of phrasing content elements.
     */
    function TextWordWrap () {

      /** Array `string[]` list of words, whitespace and newlines */
      const words: string[] = data.token[a].split(rx.SpacesGroup);

      /** The cached length of the `words[]` array */
      const items = words.length;

      /** The generated per-line input of words respecting wrap */
      let input: string = NIL;

      /** The current iteration index */
      let index: number = 0;

      do {

        if (words[index].indexOf(NWL) > -1) {

          input += words[index].replace(rx.WhitespaceGlob, NIL);

          build.push(input, offset);

          input = NIL;
          wrap = 0;

        } else {

          wrap = wrap + words[index].length;

          if (rules.wrap > 0 && index + 1 < items && wrap + words[index + 1].length > width) {

            if (rx.Newline.test(words[index + 1])) {

              if (wrap > width) {

                input += words[index];
                build.push(input.trim(), indent);

                input = NIL;
                wrap = 0;

              } else {

                input += words[index];

              }

            } else {

              input += words[index];

              build.push(input.trim(), indent);

              input = NIL;
              wrap = 0;
            }
          } else {

            input += words[index];

          }
        }

      } while (++index < items);

      if (input.length > 0) build.push(input);

    }

    /**
     * Text Element
     *
     * Handler for processing phrasing content elements which are following
     * or contained within text content tokens.
     *
     */
    function TextElement () {

      if (phrase.has(a + 1)) {

        if (phrase.get(a + 1)) {

          build.push(indent);
          wrap = 0;

          return;

        } else {

          if (levels[a] === -10) {
            if (wrap + 1 > width) {
              build.push(indent);
              wrap = 0;
            } else {
              build.push(WSP);
              wrap = wrap + 1;
            }
          }

        }

        // Increment the advancement by 1
        a = a + 1;

        /** If we are dealing with a void type self closer */
        const isVoid = isType(a, 'singleton') || isType(a, 'liquid');

        /** The token ender index of the textNode */
        const ender = data.ender[a] > -1 ? data.ender[a] : a;

        do {

          if (wrap + data.token[a].length > width) {
            build.push(indent);
            wrap = 0;
          }

          if (isType(a, 'content')) {

            TextWordWrap();

          } else {

            // Check to see is we are dealing with phrasing content starting point
            // which contains an attribute sequence
            if ((isType(a, 'start') || isType(a, 'singleton')) && isLike(a + 1, 'attribute')) {

              const index = AttributeEnd();
              const token = data.token.slice(a, index).join(WSP);

              // We check if the token exceeds wrap limit. If token exceeds wrap,
              // we will walk over each attribute and newline entries where necessary,
              // while updating the wrap reference and also the 'a' advancement.
              //
              // TODO: Handle Liquid occurences
              //
              if (wrap + token.length > width) {

                do {

                  if (wrap + data.token[a].length > width) {
                    build.push(indent);
                    wrap = 0;
                  }

                  wrap = wrap + data.token[a].length + 1;

                  build.push(data.token[a]);

                  if (levels[a] === -10) {
                    build.push(WSP);
                    wrap = wrap + 1;
                  }

                } while (++a < index);

              } else {

                build.push(token);
                wrap = wrap + token.length;

              }

              // Decrement the advancement by 1 so we correctly
              // align to the next known token
              a = index - 1;

            } else {

              wrap = wrap + data.token[a].length;

              if (wrap > width) {
                build.push(indent);
                wrap = 0;
              }

              build.push(data.token[a]);

            }
          }

          if (levels[a] === -10 && a < ender) {
            build.push(WSP);
            wrap = wrap + 1;
          }

        } while (++a < ender);

        /** When dealing with an infused void type tag we are at next index */
        const next = isVoid ? a : a + 1;

        if (
          phrase.get(next) === true ||
          isType(next, 'content') ||
          isType(next, 'singleton') ||
          isType(next, 'liquid')) {

          // When dealing with phrasing start/end type tokens the 'a' advancement
          // will be referencing the </tag> index but will not yet be measured.
          if (isType(a, 'end')) {

            wrap = wrap + data.token[a].length;

            if (wrap > width) {
              build.push(indent);
              wrap = 0;
            } else if (levels[a] === -10) {
              build.push(WSP);
              wrap = wrap + 1;
            }

          } else {

            if (levels[a] === -10) {
              build.push(WSP);
              wrap = wrap + 1;
            }

          }

          TextWordWrap();
          TextElement();

          return;

        } else if (isType(a, 'end')) {

          build.push(data.token[a]);

        }

      }

      if (levels[a] === -10) {

        build.push(WSP);

      } else if (levels[a] > -1) {

        build.push(nl(levels[a]));

      }

    }

  }

  /* -------------------------------------------- */
  /* INDENTATION                                  */
  /* -------------------------------------------- */

  function IndentMarkup (reverse: number = 0) {

    // Only reverse adjust when levels is newline
    //
    if (reverse !== 0 && levels[a - 1] > -1) {
      if (reverse < 0) {
        levels[a - 1] = indent - 1;
      } else if (reverse > 0) {
        levels[a - 1] = indent + 1;
      }
    }

    if (rules.markup.forceIndent || isText(n) || data.lines[n] > 1) {

      levels.push(indent);

    } else if (data.lines[n] === 1) {

      levels.push(-10);

    } else if (data.lines[n] === 0) {

      levels.push(-20);

    }

  }

  function IndentLiquid (reverse: number = 0) {

    // Only reverse adjust when levels is newline
    //
    if (reverse !== 0 && levels[a - 1] > -1) {
      if (reverse < 0) {
        levels[a - 1] = indent - 1;
      } else if (reverse > 0) {
        levels[a - 1] = indent + 1;
      }
    }

    if (rules.liquid.forceIndent || data.lines[n] > 1) {

      levels.push(indent);

    } else if (data.lines[n] === 1) {

      levels.push(-10);

    } else if (data.lines[n] === 0) {

      levels.push(-20);

    }

  }

  /**
   * Get Levels
   *
   * Responsible for composing the indentations, newlines and spacing.
   * The `levels` constant holds reference to the returned value generated.
   */
  function Levels () {

    // Ensure correct spacing is applied
    //
    // References
    //
    // data.lines -> space before token
    // levels -> space after token
    //
    // p -> last token in data structure
    // a -> current token in data structure
    // n -> next token in data structure
    //
    do {

      if (data.lexer[a] !== 'markup') {

        EmbeddedLanguage();

      } else {

        if (isType(a, 'doctype')) levels[a - 1] = indent;

        if (isLike(a, 'attribute')) {

          Attributes();

        } else if (isType(a, 'comment')) {

          Comments();

        } else {

          n = forward();

          // Next Token is ender
          //
          // </tag>
          // {% endtag %}
          // {% endcase %}
          //
          if (
            isType(n, 'end') ||
            isType(n, 'liquid_end') ||
            isType(n, 'liquid_case_end')) {

            indent = indent - 1;

            // Anchor Tags - Special handling
            //
            //
            if (
              isToken(a, '</ol>') ||
              isToken(a, '</ul>') ||
              isToken(a, '</dl>')) Anchors();

          } else if (
            isType(a, 'start') ||
            isType(a, 'liquid_start') ||
            isType(a, 'liquid_case_start')) {

            indent = indent + 1;

          }

          if (
            isType(a, 'script_end') &&
            isType(n, 'end')
          ) {

            // HOT PATCH
            //
            // Added `indent` levels for lines more than 1 so
            // JSX embedded expressions appear on newlines
            //
            if (data.lines[n] < 1) {
              levels.push(-20);
            } else if (data.lines[n] > 1) {
              levels.push(indent);
            } else {
              levels.push(-10);
            }

          } else if (
            isType(a, 'content') ||
            isType(a, 'singleton') ||
            isType(a, 'liquid')) {

            cols = cols + data.token[a].length;

            if (isType(n, 'script_start')) {

              levels.push(-10);

            } else {

              if (
                isType(a, 'content') &&
                isLike(p, 'attribute') &&
                isText(data.begin[a])) {

                levels[a - 1] = indent + 1;

              } else if (isLike(a, 'liquid')) {

                if (
                  isStack(a, 'case') &&
                  isType(n, 'liquid_case_end') &&
                  !dedent.has('case')) {

                  indent = indent - 1;
                  IndentLiquid();

                } else {
                  IndentLiquid();
                }

              } else {

                IndentMarkup();

              }

            }

          } else if (isType(a, 'start')) {

            if (isType(n, 'end')) {

              indent = indent + 1;

              levels.push(-20);

            } else {

              IndentMarkup();

            }

          } else if (isType(a, 'end')) {

            IndentMarkup();

          } else if (
            isType(a, 'liquid_start') ||
            isType(a, 'liquid_case_start') ||
            isType(a, 'liquid_end') ||
            isType(a, 'liquid_case_end')) {

            // Empty Decedent
            //
            // Special handling is required for tags with an empty decedent
            // We need to reverse make 2 tokens to align indentation
            //
            // {% else %}  > p - 1 (indent)
            // {% elsif %} > p     (prev)
            // {% endif %} > a     (curr) OR (indent)
            //
            // {% else %}  > n     (next)
            //
            // {% endif %} > a     (curr)
            //
            if (
              isType(p, 'liquid_else') &&
              isType(a, 'liquid_end') &&
              levels[a - 2] > -1) {

              if (
                isType(n, 'liquid_else') &&
                isType(p - 1, 'liquid_else')) {

                levels[a - 2] = indent;

              } else if (isType(p - 1, 'liquid_end')) {

                levels[a - 2] = indent + 1;

              }

            } else if ((isType(a, 'liquid_case_start') && !dedent.has('case'))) {

              indent = indent + 1;

            } else if (isType(a, 'liquid_start') && isType(n, 'liquid_end')) {

              indent = indent + 1;

            }

            IndentLiquid();

          } else if (isType(a, 'liquid_else')) {

            if (isType(n, 'liquid_end')) {

              IndentLiquid(1);

            } else {

              IndentLiquid(-1);

            }

          } else if (isType(a, 'liquid_when')) {

            IndentLiquid(-1);

          } else if (isType(a, 'liquid_case_else')) {

            if (!dedent.has('case')) indent = indent - 1;

            IndentLiquid(-1);

          } else if (
            isType(a, 'liquid_comment_start') ||
            isType(a, 'liquid_comment') ||
            isType(a, 'liquid_comment_end')) {

            // Liquid {% else %} Tag alignment for when comments are proceeded
            // by an else token. This ensure the comment aligns
            //
            //
            // {% comment %} Lorem Ipsum {% endcomment %}
            // {% else %}
            //
            // Notice how the comment indent is equal to the else tag indent
            //
            if (
              a + 3 < c &&
              isType(a, 'liquid_comment_start') &&
              isType(a + 3, 'liquid_else')) {

              levels[a - 1] = indent - 1;
              indent = indent - 1;

            } else if (
              isType(a, 'liquid_comment_end') &&
              isType(n, 'liquid_else')) {

              indent = indent + 1;

            }

            if (rules.liquid.commentIndent) {
              if (isType(n, 'liquid_comment')) {
                indent = indent + 1;
              } else if (isType(n, 'liquid_comment_end')) {
                indent = indent - 1;
              }
            }

            IndentLiquid();

          } else {

            levels.push(indent);

          }
        }

        if (
          isType(a, 'content', false) &&
          isType(a, 'singleton', false) &&
          isType(a, 'liquid', false) &&
          isType(a, 'liquid_when', false) &&
          isType(a, 'attribute', false)) cols = 0;

      }

    } while (++a < c);

    return levels;

  }

  /**
   * Ignored Indentations
   *
   * Applied to embedded code regions marked as ignored via the
   * `ignoreJS`, `ignoreCSS` or `ignoreJSON` markup rules. These rules
   * still apply indentation to tokens but right side is excluded.
   *
   */
  function IgnoreEmbedded () {

    /** Split ignore onto newlines, this allows us to apply indentation */
    const lines = data.token[a].split(parse.crlf);

    /** Cache reference to the length */
    const length = lines.length;

    /** Indentation reference, exclude newlines */
    const indent = nl(levels[a - 1], false);

    /** Iterator reference */
    let i: number = 0;

    /** Newline counter */
    let nwl: number = 0;

    do {

      if (lines[i] !== NIL) {

        if (!isNaN(nwl)) {
          build.push(nwl === 0 ? NWL : NWL.repeat(nwl));
          nwl = NaN;
        }

        if (!lines[i].startsWith(indent)) {
          lines[i] = indent + lines[i];
        }

      } else if (!isNaN(nwl)) {

        ++nwl;

      }

    } while (++i < length);

    nwl = -1;

    do {
      --i;
      if (lines[i] !== NIL) break;
      ++nwl;
    } while (i > -1);

    if (nwl === -1) {

      build.push(lines.join(parse.crlf).replace(rx.NewlineLead, NIL));
      build.push(nl(levels[a]));

    } else {

      const token = lines
        .join(parse.crlf)
        .replace(rx.NewlineLead, NIL)
        .replace(rx.SpaceEnd, NIL);

      if (nwl === 0) {

        build.push(token, nl(levels[a]));

      } else {

        build.push(token, NWL.repeat(nwl), nl(levels[a]));

      }
    }
  }

  function MarkupComment () {

    if (rx.Newline.test(data.token[a])) {

      const lines = data.token[a].split(NWL);
      const length = lines.length;
      const indent = NWL + nl(levels[a], false, true);

      let i: number = 0;

      do {

        if (lines[i] === NIL) {
          if (i + 1 !== length && lines[i + 1] !== NIL) {
            build.push(indent);
          } else {
            build.push(NWL);
          }
        } else if (i + 1 === length) {
          build.push(lines[i], indent);
        } else {
          build.push(lines[i], indent);
        }

      } while (++i < length);

    } else {

      build.push(data.token[a], nl(levels[a]));

    }

  }

  /**
   * Format Markup
   *
   * Constructs the generated output result. The `build[]` array entries are joined
   * after traversal of the data~structure concludes.
   */
  function FormatMarkup () {

    /* -------------------------------------------- */
    /* RUNTIME                                      */
    /* -------------------------------------------- */

    Levels();

    /* -------------------------------------------- */
    /* MARKUP APPLY SCOPES                          */
    /* -------------------------------------------- */

    a = parse.start;
    l = rules.indentLevel;

    // Apply indentLevel into build as first entry to ensure
    // leading space is applied.
    //
    if (build.length === 0 && l > 0) {

      build.push(nl(levels[a], false));

    }

    do {

      n = a + 1 < c ? a + 1 : a;

      if (data.lexer[a] === 'markup') {

        if (a < c - 1 && (
          isType(a, 'start') ||
          isType(a, 'singleton') ||
          isType(a, 'xml')
        ) && (
          isLike(a, 'attribute', false) &&
          isLike(n, 'attribute'))) {

          AttributeEnd();

        }

        if (
          isType(a, 'ignore') ||
          isType(a, 'ignore_next')) {

          if (
            isStack(a, 'script') ||
            isStack(a, 'style')) {

            IgnoreEmbedded();

          } else {

            build.push(data.token[a]);

            if (isType(a + 1, 'ignore') === false) {
              if (isType(a + 1, 'ignore_next')) {
                build.push(nl(levels[a], true, false));
              } else {
                build.push(nl(levels[a]));
              }
            } else {

              nl(levels[a], true, false);

            }
          }

        } else if (isLike(a, 'liquid_comment')) {

          if (rules.liquid.preserveComment) {

            build.push(data.token[a]);

            if (levels[a] > -1) {
              if (isType(a, 'liquid_comment_start')) {
                build.push(nl(levels[a], true, false));
              } else {
                build.push(nl(levels[a]));
              }
            }

          } else if (isType(a, 'liquid_comment_start')) {

            WrapContent();

          }

        } else if (isType(a, 'content')) {

          if (rules.markup.preserveText === false) {
            WrapContent();
          } else {
            build.push(data.token[a], nl(levels[a]));
          }

        } else if (
          isLike(a, 'attribute') &&
          rx.Newline.test(data.token[a])
        ) {

          u.nline(data.token[a], token => build.push(token, nl(levels[a])));

        } else if (isType(a, 'comment')) {

          MarkupComment();

        } else if (isType(a, 'liquid_capture')) {

          build.push(data.token[a], nl(levels[a]));

        } else {

          if (rules.markup.delimiterTerminus === 'force') {
            ForceMarkupDelimiters();
          }

          if (
            isLike(a, 'liquid') &&
            isType(a, 'liquid_end', false) &&
            rx.Newline.test(data.token[a])) {

            ForceLiquidDelimiters();

          } else {

            build.push(data.token[a]);

          }

          if ((
            isType(n, 'ignore') ||
            isType(n, 'ignore_next')
          )) {

            if (!(
              isStack(n, 'script') ||
              isStack(n, 'style'))) {

              build.push(nl(levels[a], true, false));

            }

          } else if (isType(n, 'content') && rules.markup.preserveText) {

            build.push(nl(levels[a], true, false));

          } else if (levels[a] === -10 && a < c - 1) {

            build.push(WSP);

          } else if (levels[a] > -1) {

            l = levels[a];

            build.push(nl(levels[a]));

          }
        }

      } else {

        parse.start = a;
        parse.ender = external[a];

        // Liquid External Code Region - Dedent indentation
        //
        if (l > 0 && dedent.has(data.stack[a])) {
          build.splice(build.length - 1, 1, nl(levels[a] - 1));
          l = l - 1;
        }

        const embedded = parse.external(l);

        if ((
          rules.language === 'jsx' ||
          rules.language === 'tsx'
        ) && (
          isType(a - 1, 'template_string_end') ||
          isType(a - 1, 'jsx_attribute_start') ||
          isType(a - 1, 'script_start'))) {

          build.push(embedded);

        } else {

          build.push(embedded);

          if (rules.markup.forceIndent || (levels[parse.iterator] > -1 && a in external)) {

            if (external[a] > a) a = parse.iterator;

            build.push(nl(levels[a]));
          }

        }

        if (a !== parse.iterator) a = parse.iterator;

      }

    } while (++a < c);

    parse.iterator = c - 1;

    // if (rules.indentLevel === 0 && isIndex(0, 'ignore') < 0 && u.ws(build[0])) build[0] = NIL;

    return rules.endNewline
      ? build.join(NIL).replace(/\s*$/, parse.crlf)
      : build.join(NIL).trimEnd();

  };

  return FormatMarkup();

};
