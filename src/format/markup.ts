import type { Types } from 'types/index';
import { cc } from 'lexical/codes';
import { WSP, NIL, NWL, EQL } from 'chars';
import { parse } from 'parse/parser';
import { object } from 'utils/native';
import { grammar } from 'parse/grammar';
import * as rx from 'lexical/regex';
import * as u from 'utils/helpers';
import { Eq } from 'lexical/enum';

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
  const { textNodes } = grammar.html;

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

  /** Last word wrap limit reference */
  let wrap: number = 0;

  /** The left side indentation limit imposed before character existence */
  let limit: number = 0;

  /** Comment starting positions */
  let comms: number = -1;

  /** Indentation levels */
  let indent: number = isNaN(rules.indentLevel) ? 0 : rules.indentLevel;

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /** Source count. This holds reference to data tokenx length or the source length. */
  const c: number = ender < 1 || ender > data.token.length ? data.token.length : ender + 1;

  /** Whether or not language mode is TSX / JSX  */
  const jsxtsx: boolean = rules.language === 'jsx' || rules.language === 'tsx';

  /** External Lexer reference when dealing with markup elements that require external handling. */
  const lexers: { [index: number]: number } = object(null);

  /** Phrasing content text node elements, keys are indices and values signal whether or not to force */
  const inline: Map<number, boolean> = new Map();

  /** Delimiter forcing references */
  const delims: Set<number> = new Set();

  /** Dendentation tags based on Liquid rules */
  const dedent: Set<string> = new Set(rules.liquid.dedentTagList);

  /** The newline / spacing store reference */
  const levels: number[] = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];

  /** Indentation level / character */
  const spaces: string = rules.indentChar.repeat(rules.indentSize);

  /** The constructed output */
  const output: string[] = [];

  /* -------------------------------------------- */
  /* UTILITIES                                    */
  /* -------------------------------------------- */

  /**
   * Is Type
   *
   * Check whether the token type at specific index equals the provided name.
   * Accepts 3 arguments:
   *
   * @param index The index within the data~structure
   * @param name The name of token type
   * @param truthy? Pass value of `0` for false truthy
   */
  function isType (index: number, name: Types, truthy: Eq = Eq.Truth): Boolean {

    return truthy
      ? data.types[index] === name
      : data.types[index] !== name;

  }

  /**
   * Is Like
   *
   * Returns a boolean indicating whether or not the `data.types[0]`
   * contains the `name` by doing `indexOf` check.
   *
   * @param index The index within the data~structure
   * @param name The name of token type
   * @param truthy? Pass value of `0` for false truthy
   */
  function isLike (index: number, name: Types, truthy: Eq = Eq.Truth): boolean {

    if (index < 0 || !data.types[index]) return false;

    return truthy
      ? data.types[index].indexOf(name) >= 0
      : data.types[index].indexOf(name) < 0;

  }

  /**
   * Is Stack
   *
   * Check whether the token type at specific index equals the provided `name`.
   *
   * @param index The index within the data~structure
   * @param name The name of token type
   * @param truthy? Pass value of `0` for false truthy
   */
  function isStack (index: number, name: string, truthy: Eq = Eq.Truth): boolean {

    return truthy
      ? data.stack[index] === name
      : data.stack[index] !== name;

  }

  /**
   * Is Token
   *
   * Check whether the token equals the provided tag.
   */
  function isToken (index: number, tag: string): boolean {

    return data.token[index] === tag;

  }

  /**
   * Is Text
   *
   * Sugar helper for checking the `phrase` Map storage
   */
  function isText (index: number) {

    return inline.get(data.begin[a]);

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
   * Newline
   *
   * Applies a new line character plus the correct amount of identation for the given line of code.
   * The {@link levels} Array is passed as first argument `tabs` with `newlines` and `whitespace`
   * being optional, accepting an _equality_ enum to determine.
   *
   * @param tabs — The levels entry
   * @param newlines — ? Pass value of 1 to omit newlines
   * @param whitespace — ? Pass value of 1 to omit whitespace indent
   */
  function nl (tabs: number, newlines: Eq = Eq.Truth, whitespace: Eq = Eq.Truth) {

    /** The maximum number of newlines */
    const total = Math.min(data.lines[a + 1] - 1, rules.preserveLine + 1);

    /** Newline + indentation string */
    let lines: string = NIL;

    if (tabs < 0) tabs = 0;
    if (newlines) lines = total <= 0 ? parse.crlf : parse.crlf.repeat(total);

    const ws = spaces.repeat(tabs);

    if (tabs > 0 && whitespace) {
      lines += ws;
      if (rules.wrap > 0) {
        limit = rules.wrap - ws.length;
      }
    } else {
      if (rules.wrap > 0 && limit !== rules.wrap) {
        limit = rules.wrap;
      }
    }

    return lines;

  };

  /**
   * Next Index
   *
   * Advances the structure to the next index in the uniform.
   */
  function nx () {

    // update the previous token index reference
    //
    if (n > 0) p = n - 1;

    if (isType(a - 1, 'content') && textNodes.has(data.token[a]) && (
      isType(a, 'start') ||
      isType(a, 'singleton'))) {

      inline.set(a, false);

    }

    let x: number = a + 1;
    let y: number = 0;

    if (u.isUndefined(data.types[x])) {

      x = x - 1;

    } else if ((a < c - 1 && isLike(x, 'attribute')) || isType(x, 'comment')) {

      do {

        if (isType(x, 'jsx_attribute_start')) {

          y = x;

          do {
            if (data.begin[x] === y && isType(x, 'jsx_attribute_end')) break;
          } while (++x < c);

        } else if (isType(x, 'comment', Eq.False) && isLike(x, 'attribute', Eq.False)) {

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

    /** The indentation level to applied within liquid attributes */
    let liquidLevel: number = 0;

    /** Whether or not the attribute is a start type */
    let attrStart: boolean = false;

    /** Whether or not we should apply forcing */
    let attrForce: boolean = u.isBoolean(rules.markup.attributeLineBreak);

    /** The amount of attributes allowed before forcing */
    let attrLimit: number = attrForce ? 0 : rules.markup.attributeLineBreak as number;

    /** The identation level to be applied to attributes */
    let attrLevel: number = AttributeLevel();

    /** Whether or not attributes apply wrap forcing */
    let attrWrap: boolean = false;

    /** The number of attributes contained on the tag */
    const attrCount: number = AttributeCount();

    if (
      attrForce &&
      rules.markup.attributeLineBreak === false) {

      attrForce = false;

    }

    if (inline.has(p)) {
      if (u.isNumber(rules.markup.forceInline) && rules.markup.forceInline > 0) {
        attrLimit = rules.markup.forceInline;
        attrForce = false;
      } else if (rules.markup.forceInline === true) {
        inline.set(p, true);
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

    function AttributeCount () {

      if (attrForce === false) return Infinity;

      let attr: number = 0;

      do ++attr;
      while (isLike(a + attr, 'attribute'));

      if (attr <= attrLimit) return Infinity;

      return attr;

    }

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

        return (indent === 0 || levels[p] === indent) && (
          isType(p, 'singleton') ||
          isType(p, 'liquid_markup_start')) ? indent + 2 : indent + 1;

      }

      return (
        isType(p, 'singleton') ||
        isType(p, 'liquid_markup_start')
      ) ? indent + 1 : indent;

    }

    function AttributeForce () {

      if (attrForce === true || attrCount >= attrLimit) {

        if (inline.has(p)) inline.set(p, true);

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

    function AttributeWrap (index: number) {

      return;

      const item = data.token[index].split(rx.WhitespaceGlobGroup);
      const size = item.length;
      const offset = nl(levels[p], Eq.False);
      const build: string[] = [];

      let bb = 1;
      let acount = item[0].length;

      do {

        if (acount + item[bb].length > rules.wrap) {

          acount = item[bb].length;
          item[bb] = parse.crlf + item[bb];

        } else {

          item[bb] = ` ${item[bb]}`;
          acount = acount + item[bb].length;

        }

      } while (++bb < size);

      data.token[index] = item.join(NIL);

    };

    /* -------------------------------------------- */
    /* BEGIN WALK                                   */
    /* -------------------------------------------- */

    if (attrLevel < 1) attrLevel = 1;

    // First, set attrs and determine if there are template attributes.
    // When we have template attributes we handle them in a similar manner
    // as HTML attributes, with only slight differences.
    //
    do {

      cols = cols + data.token[a].length + 1;

      if (isIndex(a, 'attribute') > 0) {

        if (isType(a, 'comment_attribute')) {

          levels.push(attrLevel);

        } else if (isIndex(a, 'start') > 0 && isIndex(a, 'liquid') < 0) {

          attrStart = true;

          // Typically this condition when true infers the last attribute token
          // in languages like JSX
          if (a < c - 2 && isIndex(a + 2, 'attribute') > 0) {

            levels.push(-20);

            a = a + 1;

            lexers[a] = a;

          } else {

            if (p === a - 1 && plural === false) {

              // Prevent embedded expression content being indented
              // onto newlines.
              if (jsxtsx) {
                levels.push(-20);
              } else {
                levels.push(attrLevel);
              }

            } else {

              // HOT PATCH
              // Prevent embedded expression content being indented onto newlines.
              //
              if (jsxtsx) {
                levels.push(-20);
              } else {
                levels.push(attrLevel + 1);
              }

            }

            if (data.lexer[a + 1] !== 'markup') {
              a = a + 1;
              IndentEmbeds();
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

          if (levels[a - 1] !== -20) {

            levels[a - 1] = levels[data.begin[a]] - 1;

          }

          if (data.lexer[a + 1] !== 'markup') {
            levels.push(-20);
          } else {
            levels.push(attrLevel);
          }

        } else if (isIndex(a, 'liquid_attribute') > -1) {

          length = length + data.token[a].length + 1;

          if (rules.markup.attributePreserve === true) {

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

        if (rules.markup.attributePreserve) {

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
      isLike(a, 'liquid', Eq.False) &&
      isLike(a, 'end') &&
      isIndex(a, 'attribute') > 0 &&
      isType(p, 'singleton', Eq.False)) {

      levels[a - 1] = levels[a - 1] - 1;

    }

    if (levels[a] !== -20) {

      if (
        jsxtsx === true &&
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

      if (rules.markup.delimiterTerminus === 'force') {

        delims.add(p);

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

        } while (--fa > p);

        if (rules.markup.delimiterTerminus === 'force' || (
          attrCount >= 2 &&
          rules.markup.delimiterTerminus === 'adapt')) {

          delims.add(p);

        }

        if (inline.has(p)) {

          inline.set(p, true);

        }

      } else {

        levels[p] = -10;

      }

    } else {

      //

      levels[p] = -10;

    }

    if (
      rules.markup.attributePreserve === true ||
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

      if (
        length > rules.wrap &&
        rules.wrap > 0 &&
        attrForce === false) {

        levels[p] = attrLevel;
        cols = data.token[a].length;
        w = w - 1;

        do {

          if (data.token[w].length > rules.wrap && u.ws(data.token[w])) {

            if (!attrWrap) attrWrap = true;

            AttributeWrap(w);

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

      if (!attrWrap) attrWrap = true;

      AttributeWrap(a);

    }

    if (attrWrap && rules.markup.delimiterTerminus === 'adapt') {

      delims.add(p);

    }

  };

  /**
   * Anchor List
   *
   * Tokens like `<a>` and `<li>` or link lists handling - I am unsure of the exact use for this.
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

    if (comms < 0) comms = a;

    let x: number = a;
    let nwl = false;

    if (data.lines[x + 1] === 0 && rules.markup.forceIndent === false) {

      do {
        if (data.lines[x] > 0) {
          nwl = true;
          break;
        }
      } while (--x > comms);

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
      } while (x > comms);
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
          isType(a + 1, 'comment', Eq.False) &&
          isType(a + 1, 'start', Eq.False) &&
          isLike(a + 1, 'liquid', Eq.False)
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
      } while (x > comms);

      levels[x] = -20;

    }

    comms = -1;

  };

  /**
   * Attribute Terminus
   *
   * The final process for attribute tokens. It's here were the cycle is concluded for tags
   * and we augment the token record in the data structure. The function will return the
   * last index of the next token after all attributes have been walked.
   *
   * For example, take the following token record:
   *
   * ```js
   * [
   *  { token: '<tag>' },
   *  { token: 'id="x"' }
   * ]
   * ```
   *
   * This function will augment the above to represent the correct tag references, wherein
   * the last known attribute token reference will contain the ending delimiter and the
   * starting token will have it omitted.
   *
   * ```js
   *  [
   *   { token: '<tag' },   // notice how this token have ending delimiter omitted
   *   { token: 'id="x">' } // notice how this token now holds ending delimiter
   *  ]
   *  ```
   *
   * **delimiterTerminus**
   *
   * In cases where `delimiterTerminus` is set to `force` or `force-multiline` the last known
   * attribute token will be `\n>` wherein, for example:
   *
   * ```js
   *  [
   *   { token: '<tag' },     // notice how this token have ending delimiter omitted
   *   { token: 'id="x"\n>' } // notice how this token contains a newline before delimiter
   *  ]
   *  ```
   *
   * We will handle the level indentation of `>` within {@link Format} by determining previous
   * token type encountered and then applying level indentation.
   */
  function Terminus () {

    const index: number = a;

    /** The start or singleton token reference */
    const parent = data.token[index];

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

        } else if (isjsx === false && isLike(i, 'attribute', Eq.False)) {

          break; // end of attribute/s in tag

        }

      } else if (isjsx === false && (data.begin[i] < a || isLike(i, 'attribute', Eq.False))) {

        break; // end of attribute/s in tag

      }

    } while (++i < c);

    if (isType(i - 1, 'comment_attribute')) {

      space = nl(levels[i - 2] - 1);

    }

    // Re-connect the ending delimiter of the HTML tag, e.g: '>' or '/>'
    // The record in the data structure will now reflect correctly.
    // and the last attribute in will contain the ending delimiter
    //
    data.token[i - 1] = data.token[i - 1] + space + closer[0].trimStart();

    return i;

  };

  function TerminusForce () {

    if (delims.has(data.begin[n]) && u.isLast(data.token[a], cc.RAN)) {

      const offset = NWL + nl(levels[a], Eq.False).slice(rules.indentSize);

      data.token[a] = data.token[a].replace(/(\/?>)$/, `${offset}$1`);

      delims.delete(data.begin[n]);

    }

    output.push(data.token[a]);

  }

  function AttributeValue () {

    const open: number = data.token[a].indexOf(EQL) + 2;

    if (open > 2) {

      const close = data.token[a].length - 1;
      const value = data.token[a].slice(open, close);

      if (rx.Newline.test(value)) {

        const split = value
          .replace(rx.NewlineLead, NIL)
          .replace(rx.NewlineEnd, NIL)
          .split(/(\n+)/g);

        /**
         * The attribute token we will build, assign the attribute name first
         */
        const token: string[] = [ data.token[a].slice(0, open) ];

        /**
         * The indentation offset to apply for each newline
         */
        let offset = nl(levels[a], Eq.False);

        if (rules.markup.valueLineBreak === 'force-indent') {

          offset += spaces;

        }

        token.push(NWL);

        for (let i = 0, s = split.length; i < s; i++) {

          if (split[i] === NIL || (i + 1 === s && rx.WhitespaceOnly.test(split[i]))) continue;

          if (u.isLast(token, cc.NWL)) {

            const m = split[i].match(rx.WhitespaceLead);

            if (m !== null) {

              const ws = m[0].slice(offset.length);

              if (ws.length === 0) {

                token.push(offset + split[i]);

              } else {

                token.push(split[i]);

              }

            } else {

              token.push(offset + split[i]);

            }

          } else {

            token.push(split[i]);
          }
        }

        if (rules.markup.valueLineBreak === 'force-indent') {

          if (rx.WhitespaceOnly.test(token[token.length - 1])) {
            token.push(NWL + offset.slice(spaces.length));
          } else {
            token.push(offset.slice(spaces.length));
          }

        } else {
          token.push(NWL + offset);
        }

        token.push(data.token[a].slice(close));

        output.push(token.join(NIL));

      } else {

        output.push(data.token[a]);

      }

    } else {

      output.push(data.token[a]);

    }

  }
  /**
   * Ignored Embedded
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
    const indent = nl(levels[a - 1], Eq.False);

    /** Iterator reference */
    let i: number = 0;

    /** Newline counter */
    let nwl: number = 0;

    do {

      if (lines[i] !== NIL) {

        if (!isNaN(nwl)) {
          output.push(nwl === 0 ? NWL : NWL.repeat(nwl));
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

      output.push(lines.join(parse.crlf).replace(rx.NewlineLead, NIL));
      output.push(nl(levels[a]));

    } else {

      const token = lines
        .join(parse.crlf)
        .replace(rx.NewlineLead, NIL)
        .replace(rx.SpaceEnd, NIL);

      if (nwl === 0) {

        output.push(token, nl(levels[a]));

      } else {

        output.push(token, NWL.repeat(nwl), nl(levels[a]));

      }
    }
  }

  function MarkupComment () {

    if (rx.Newline.test(data.token[a])) {

      const lines = data.token[a].split(NWL);
      const length = lines.length;
      const indent = NWL + nl(levels[a], Eq.False);

      let i: number = 0;

      do {

        if (lines[i] === NIL) {
          if (i + 1 !== length && lines[i + 1] !== NIL) {
            output.push(indent);
          } else {
            output.push(NWL);
          }
        } else if (i + 1 === length) {
          output.push(lines[i], indent);
        } else {
          output.push(lines[i], indent);
        }

      } while (++i < length);

    } else {

      output.push(data.token[a], nl(levels[a]));

    }

  }

  /**
   * Force Markup Delimiters
   *
   * Applies newline delimiter structures. Does some additional
   * processing to ensure special structures produce correct
   * output, like that we need to reason with when using `valueForce`
   * rule on attributes.
   */
  function MarkupDelimiters () {

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
  function LiquidDelimiters () {

    /** Split the token for every newline */
    const lines = data.token[a].split(NWL);

    /** Additional spacing characters */
    const space = rules.indentChar.repeat(rules.indentSize);

    /** The amount of lines assigned for better perf */
    const length = lines.length;

    /** Iterator reference */
    let i: number = 0;

    /** The indentation levels */
    let indent: string = NWL + nl(levels[a - 1], Eq.False) + space;

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
          output.push(lines[i], indent, lines[i + 1]);
          break;

        } else {

          output.push(lines[i], indent);

        }

      } else if (i === length - 1) {

        output.push(lines[i]);

      } else {

        if (i + 1 === length - 1 && (
          lines[i + 1].length === 2 ||
          lines[i + 1].length === 3)) {

          indent = indent.slice(0, -2);

        }

        output.push(lines[i], indent);

      }

    } while (++i < length);

  }

  /**
   * Embedded indentations
   *
   * Used when dealing with external lexed languages
   * like JSX, applies indentation levels accordingly.
   */
  function IndentEmbeds () {

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
        isType(a + 1, 'start', Eq.False) &&
        isType(a + 1, 'singleton', Eq.False)) break;

      levels.push(0);

      a = a + 1;

    } while (a < c);

    lexers[skip] = a;

    // HOT PATCH
    // Inline embedded JSX expressions
    if (isType(a + 1, 'script_end') && data.token[a + 1] === '}') {

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

    n = nx();

    if (
      data.lexer[n] === 'markup' &&
      data.stack[a].indexOf('attribute') < 0 && (
        isType(n, 'end') ||
        isType(n, 'liquid_end'))) {

      indent = indent - 1;

    }

  };

  /**
   * Indent Markup
   *
   * Helper function will applies markup indentation level control.
   * References the markup rule `forceIndent` and accepts a reverse
   * parameter to reset previous level entries.
   */
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

    if (
      rules.markup.forceIndent ||
      data.lines[n] > 1 ||
      isText(n) ||
      isStack(n, 'script') ||
      isStack(n, 'style')) {

      levels.push(indent);

    } else if (data.lines[n] === 1) {

      levels.push(-10);

    } else if (data.lines[n] === 0) {

      levels.push(-20);

    }

  }

  /**
   * Indent Liquid
   *
   * Helper function will applies markup indentation level control.
   * References the markup rule `forceIndent` and accepts a reverse
   * parameter to reset previous level entries.
   */
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
   * Wrap Content
   *
   * Word wrap processing for text content, phrasing content elements and comments.
   * This function is responsible for enforcing wrap and respecting rules like
   * `forceTextNode` and
   */
  function Wrap () {

    wrap = 0;

    let offset = nl(levels[a > 0 ? a - 1 : a], Eq.False);
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
        isType(a, 'comment', Eq.False) &&
        isType(a, 'liquid_comment', Eq.False)) {

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

      if (data.token[a].length + data.token[a + 1].length + data.token[a + 2].length > limit) {

        // LIQUID COMMENT START
        //
        // Push the {% comment %} token into build stack and append indentation
        // We are dealing with a predictable structure, so we will manually move
        // through the recordsm as per next LIQUID_COMMENT applied advancement.
        //
        output.push(data.token[a]);

        if (levels[a] > -1) {

          output.push(nl(levels[a]));

          offset = nl(levels[a], Eq.False);
          indent = NWL + offset;

        } else if (rules.wrap > 0) {

          output.push(indent);

        } else if (levels[a] === -10) {

          output.push(WSP);

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
          output.push(nl(levels[a]));
        } else if (levels[a] === -10) {
          output.push(WSP);
        }

        // LIQUID_COMMENT_END
        //
        // At this point, we have our Liquid block type start comment tag
        // and we also have applied word wrap to the comment contents. The
        // last thing we need to do is conclude by pushing the {% endcomment %}
        // and ensuring that it adhere to dedent logic.
        //
        a = a + 1; // move to the next token: liquid_comment_end

        output.push(data.token[a], nl(levels[a]));

      } else {

        // The comment can remain inline as it did not exceed wrap limit, we
        // push it into the build stack and using single whitespace indent.
        // The resulting output will reflect provided structure, e.g:
        //
        // {% comment %} Lorem Ipsum {% endcomment %}
        //
        output.push(
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

          output.push(input, offset);

          input = NIL;
          wrap = 0;

        } else {

          wrap = wrap + words[index].length;

          if (rules.wrap > 0 && index + 1 < items && wrap + words[index + 1].length > limit) {

            if (rx.Newline.test(words[index + 1])) {

              if (wrap > limit) {

                input += words[index];
                output.push(input.trim(), indent);

                input = NIL;
                wrap = 0;

              } else {

                input += words[index];

              }

            } else {

              input += words[index];

              output.push(input.trim(), indent);

              input = NIL;
              wrap = 0;
            }
          } else {

            input += words[index];

          }
        }

      } while (++index < items);

      if (input.length > 0) output.push(input);

    }

    /**
     * Text Element
     *
     * Handler for processing phrasing content elements which are following
     * or contained within text content tokens.
     *
     */
    function TextElement () {

      if (inline.has(a + 1)) {

        if (inline.get(a + 1)) {

          output.push(indent);
          wrap = 0;

          return;

        } else {

          if (levels[a] === -10) {
            if (wrap + 1 > limit) {
              output.push(indent);
              wrap = 0;
            } else {
              output.push(WSP);
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

          if (wrap + data.token[a].length > limit) {
            output.push(indent);
            wrap = 0;
          }

          if (isType(a, 'content')) {

            TextWordWrap();

          } else {

            // Check to see is we are dealing with phrasing content starting point
            // which contains an attribute sequence
            if ((isType(a, 'start') || isType(a, 'singleton')) && isLike(a + 1, 'attribute')) {

              const index = Terminus();
              const token = data.token.slice(a, index).join(WSP);

              // We check if the token exceeds wrap limit. If token exceeds wrap,
              // we will walk over each attribute and newline entries where necessary,
              // while updating the wrap reference and also the 'a' advancement.
              //
              // TODO: Handle Liquid occurences
              //
              if (wrap + token.length > limit) {

                do {

                  if (wrap + data.token[a].length > limit) {
                    output.push(indent);
                    wrap = 0;
                  }

                  wrap = wrap + data.token[a].length + 1;

                  output.push(data.token[a]);

                  if (levels[a] === -10) {
                    output.push(WSP);
                    wrap = wrap + 1;
                  }

                } while (++a < index);

              } else {

                output.push(token);
                wrap = wrap + token.length;

              }

              // Decrement the advancement by 1 so we correctly
              // align to the next known token
              a = index - 1;

            } else {

              wrap = wrap + data.token[a].length;

              if (wrap > limit) {
                output.push(indent);
                wrap = 0;
              }

              output.push(data.token[a]);

            }
          }

          if (levels[a] === -10 && a < ender) {
            output.push(WSP);
            wrap = wrap + 1;
          }

        } while (++a < ender);

        /** When dealing with an infused void type tag we are at next index */
        const next = isVoid ? a : a + 1;

        if (
          inline.get(next) === true ||
          isType(next, 'content') ||
          isType(next, 'singleton') ||
          isType(next, 'liquid')) {

          // When dealing with phrasing start/end type tokens the 'a' advancement
          // will be referencing the </tag> index but will not yet be measured.
          if (isType(a, 'end')) {

            wrap = wrap + data.token[a].length;

            if (wrap > limit) {
              output.push(indent);
              wrap = 0;
            } else if (levels[a] === -10) {
              output.push(WSP);
              wrap = wrap + 1;
            }

          } else {

            if (levels[a] === -10) {
              output.push(WSP);
              wrap = wrap + 1;
            }

          }

          TextWordWrap();
          TextElement();

          return;

        } else if (isType(a, 'end')) {

          output.push(data.token[a]);

        }

      }

      if (levels[a] === -10) {

        output.push(WSP);

      } else if (levels[a] > -1) {

        output.push(nl(levels[a]));

      }

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

        IndentEmbeds();

      } else {

        if (isType(a, 'doctype')) levels[a - 1] = indent;

        if (isLike(a, 'attribute')) {

          Attributes();

        } else if (isType(a, 'comment')) {

          Comments();

        } else {

          n = nx();

          // Next Token is ender
          //
          // </tag>
          // {% endtag %}
          // {% endcase %}
          //
          if (
            isType(n, 'end') ||
            isType(n, 'liquid_case_end') ||
            isType(n, 'liquid_end')) {

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
            isType(a, 'liquid_case_start') ||
            isType(a, 'liquid_when') ||
            isType(a, 'liquid_markup_start')) {

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

              } else if (isType(a, 'liquid')) {

                if (isType(n, 'liquid_case_end') && dedent.has('case') === false) {

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

            if (isType(n, 'liquid_case_end')) {

              indent = indent - 1;
              IndentMarkup();

            } else {

              IndentMarkup();

            }

          } else if (
            isType(a, 'liquid_start') ||
            isType(a, 'liquid_end')) {

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

              } else if (
                isType(p - 1, 'liquid_end')) {

                levels[a - 2] = indent + 1;

              }

            } else if ((
              isType(a, 'liquid_start') &&
              isType(n, 'liquid_end')
            )) {

              indent = indent + 1;

            }

            IndentLiquid();

          } else if (isType(a, 'liquid_else')) {

            if (isType(n, 'liquid_end')) {

              IndentLiquid(1);

            } else {

              IndentLiquid(-1);

            }

          } else if (isType(a, 'liquid_case_start')) {

            IndentLiquid();

            if (isType(n, 'liquid_when')) indent = indent + 1;

          } else if (isType(a, 'liquid_case_end')) {

            IndentLiquid();

          } else if (isType(a, 'liquid_when')) {

            indent = indent - 1;

            IndentLiquid(-1);

          } else if (isType(a, 'liquid_case_else')) {

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
          isType(a, 'content', Eq.False) &&
          isType(a, 'singleton', Eq.False) &&
          isType(a, 'liquid', Eq.False) &&
          isType(a, 'liquid_when', Eq.False) &&
          isType(a, 'attribute', Eq.False)) cols = 0;

      }

    } while (++a < c);

    return levels;

  }

  /**
   * Format Markup
   *
   * Constructs the generated output result. The `output[]` array entries are joined
   * after traversal of the data~structure concludes.
   */
  function Format () {

    /* -------------------------------------------- */
    /* RUNTIME                                      */
    /* -------------------------------------------- */

    Levels();

    /* -------------------------------------------- */
    /* MARKUP APPLY SCOPES                          */
    /* -------------------------------------------- */

    a = parse.start;
    l = rules.indentLevel;

    // Apply indentLevel into build as first entry to ensure leading space is applied.
    //
    if (output.length === 0 && l > 0) {

      output.push(nl(levels[a], Eq.False));

    }

    do {

      n = a + 1 < c ? a + 1 : a;

      if (data.lexer[a] === 'markup') {

        if (a < c - 1 && (
          isType(a, 'start') ||
          isType(a, 'liquid_markup_start') ||
          isType(a, 'singleton') ||
          isType(a, 'xml')
        ) && (
          isLike(a, 'attribute', Eq.False) &&
          isLike(n, 'attribute'))) {

          Terminus();

        }

        if (
          isType(a, 'ignore') ||
          isType(a, 'ignore_next') ||
          isType(a, 'script_preserve') ||
          isType(a, 'style_preserve')) {

          if (
            isStack(a, 'script') ||
            isStack(a, 'style')) {

            IgnoreEmbedded();

          } else {

            output.push(data.token[a]);

            if (isType(a + 1, 'ignore') === false) {
              if (isType(a + 1, 'ignore_next')) {
                output.push(nl(levels[a], Eq.Truth, Eq.False));
              } else {
                output.push(nl(levels[a]));
              }
            } else {

              nl(levels[a], Eq.Truth, Eq.False);

            }
          }

        } else if (isLike(a, 'liquid_comment')) {

          if (rules.liquid.commentPreserve) {

            output.push(data.token[a]);

            if (levels[a] > -1) {
              if (isType(a, 'liquid_comment_start')) {
                output.push(nl(levels[a], Eq.Truth, Eq.False));
              } else {
                output.push(nl(levels[a]));
              }
            }

          } else if (isType(a, 'liquid_comment_start')) {

            Wrap();

          }

        } else if (isType(a, 'content')) {

          if (rules.markup.preserveText === false) {
            Wrap();
          } else {
            output.push(data.token[a], nl(levels[a]));
          }

        } else if (isType(a, 'comment')) {

          MarkupComment();

        } else if (isType(a, 'liquid_capture')) {

          output.push(data.token[a], nl(levels[a]));

        } else {

          if (
            isLike(a, 'attribute') &&
            isLike(n, 'attribute', Eq.False)) {

            TerminusForce();

          } else if (isLike(a, 'attribute')) {

            AttributeValue(a);

          } else if (
            isLike(a, 'liquid') &&
            isType(a, 'liquid_end', Eq.False) &&
            rx.Newline.test(data.token[a])) {

            LiquidDelimiters();

          } else {

            output.push(data.token[a]);

          }

          if (
            isType(n, 'ignore') ||
            isType(n, 'ignore_next')) {

            if (!(
              isStack(n, 'script') ||
              isStack(n, 'style'))) {

              output.push(nl(levels[a], Eq.Truth, Eq.False));

            }

          } else if (
            isType(n, 'content') &&
            rules.markup.preserveText) {

            output.push(nl(levels[a], Eq.Truth, Eq.False));

          } else if (
            levels[a] === -10 &&
            a < c - 1) {

            output.push(WSP);

          } else if (levels[a] > -1) {

            l = levels[a];

            output.push(nl(levels[a]));

          }
        }

      } else {

        parse.start = a;
        parse.ender = lexers[a];

        // Liquid External Code Region - Dedent indentation
        //
        if (l > 0 && dedent.has(data.stack[a])) {
          output.splice(output.length - 1, 1, nl(levels[a] - 1));
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

          output.push(embedded);

        } else {

          output.push(embedded);

          if (rules.markup.forceIndent || (levels[parse.iterator] > -1 && a in lexers)) {

            if (lexers[a] > a) a = parse.iterator;

            output.push(nl(levels[a]));
          }

        }

        if (a !== parse.iterator) a = parse.iterator;

      }

    } while (++a < c);

    parse.iterator = c - 1;

    // if (rules.indentLevel === 0 && isIndex(0, 'ignore') < 0 && u.ws(build[0])) build[0] = NIL;

    return rules.endNewline
      ? output.join(NIL).replace(/\s*$/, parse.crlf)
      : output.join(NIL).trimEnd();

  };

  /* -------------------------------------------- */
  /* COMPLETE                                     */
  /* -------------------------------------------- */

  return Format();

};
