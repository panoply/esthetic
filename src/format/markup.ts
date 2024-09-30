import type { Types } from 'types/index';
import { cc } from 'lexical/codes';
import { WSP, NIL, NWL, PER, RCB } from 'chars';
import { parse } from 'parse/parser';
import { object } from 'utils/native';
import * as rx from 'lexical/regex';
import * as u from 'utils/helpers';
import * as lq from 'lexical/liquid';
import { grammar } from 'parse/grammar';
import { LF, Lnbr } from 'lexical/enum';

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

  const { textNodes } = grammar.html;
  const { rules, data, ender, start, crlf } = parse;
  const { forceIndent, attributeLineBreak, delimiterTerminus, textBoundInline } = rules.markup;
  const {
    argumentFormat,
    delimiterTrims,
    delimiterPlacement,
    argumentLineBreak,
    filterLineBreak,
    lineBreakSeparator
  } = rules.liquid;

  /* -------------------------------------------- */
  /* LOCAL SCOPES                                 */
  /* -------------------------------------------- */

  /** Current record index in the data structure */
  let a: number = start;

  /** Previous record index in the data structure - **Does not hold reference to attribute types** */
  let p: number = 0;

  /** Next record index in the data structure - **Does not hold reference to attribute types** */
  let n: number = 0;

  /** Holds the last levels */
  let l: number;

  /** Column count reference, the amount of characters from each newline */
  let column: number = 0;

  /** Last word wrap limit reference */
  let wrap: number = 0;

  /** Text bound tag ender index reference */
  let bound: number = -1;

  /** The left side indentation limit imposed before character existence */
  let limit: number = rules.wrap > 0 ? rules.wrap : -1;

  /** Comment starting positions */
  let comms: number = -1;

  /** Indentation levels */
  let indent: number = isNaN(rules.indentLevel) ? 0 : rules.indentLevel;

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /** The length of the data structure parse table */
  const c: number = ender < 1 || ender > data.token.length ? data.token.length : ender + 1;

  /** Whether or not language mode is TSX / JSX */
  const jsxtsx: boolean = rules.language === 'jsx' || rules.language === 'tsx';

  /** External Lexer reference when dealing with markup elements that require external handling. */
  const lexers: { [index: number]: number } = object(null);

  /** The record ender index for text bound structures, e.g, `foo <div> bar </div>^` */
  const inline: Set<number> = new Set();

  /** The record indexs to apply delimiter forcing */
  const delims: Set<number> = new Set();

  /** Set of Liquid tags as per the {@link rules.liquid.dedentTagList} reference */
  const dedent: Set<string> = new Set(rules.liquid.dedentTagList);

  /** The newline / spacing store reference */
  const levels: number[] = parse.start > 0 ? Array(parse.start).fill(0, 0, parse.start) : [];

  /** Indentation level / character */
  const spaces: string = rules.indentChar.repeat(rules.indentSize);

  /** The formatted result to be generated and returned */
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
  function isType (index: number, name: Types, truthy: 0 | 1 = 1): Boolean {

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
  function isLike (index: number, name: Types, truthy: 0 | 1 = 1): boolean {

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
  function isStack (index: number, name: string, truthy: 0 | 1 = 1): boolean {

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
   * Newline
   *
   * Applies a new line character plus the correct amount of identation for the given line of code.
   * The {@link levels} Array is passed as first argument `tabs` with `newlines` and `whitespace`
   * being optional, accepting an _equality_ enum to determine.
   *
   * > - `1` Generate newlines only
   * > - `2` Generate newlines and whitespace (default)
   * > - `3` Generate whitespace only
   *
   * @param tabs The levels reference which contains the tab indentation
   * @param make? Indentation control (default: `2`)
   * @param total? When `make` is `LF.WS` optionally provide custom newline amount
   */

  function nl (tabs: number, make: LF = 2, total?: number): string {

    /** Newline + indentation string */
    let lines: string = NIL;

    if (make < 3) {

      /** The maximum number of newlines */
      const max = Math.min(data.lines[a + 1] - 1, rules.preserveLine + 1);

      lines = max <= 0 ? crlf : crlf.repeat(max);

    } else if (total) {

      lines = crlf.repeat(total);

    }

    if (tabs < 0) {

      tabs = 0;

    }

    // Only if `tabs` is more than 0 and `make` is more than 1
    // we generate indentation whitespace
    //
    if (tabs > 0 && make > 1) {

      /** Indentation whitespace */
      const ws: string = spaces.repeat(tabs);

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

  }

  /**
   * Next Index
   *
   * Advances the structure to the next index in the uniform.
   * Returns the value assigned to {@link n}
   */
  function next (): number {

    // update the previous token index reference
    //
    if (n > 0 && isLike(n - 1, 'attribute', 0)) p = n - 1;

    /** Represents the next record, this will be the return value and assigned to {@link n} */
    let x: number = a + 1;

    /** Incremental reference */
    let i: number = 0;

    if (u.isUndefined(data.types[x])) {

      x = x - 1;

    } else if ((a < c - 1 && isLike(x, 'attribute')) || isType(x, 'comment')) {

      do {

        if (isType(x, 'jsx_attribute_start')) {

          i = x;

          do if (data.begin[x] === i && isType(x, 'jsx_attribute_end')) break;
          while (++x < c);

        } else if (isType(x, 'comment', 0) && isLike(x, 'attribute', 0)) {

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
  function Comment () {

    if (comms < 0) comms = a;

    let x: number = a;
    let nwl = false;

    if (data.lines[x + 1] === 0 && forceIndent === false) {

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
          isType(a + 1, 'comment', 0) &&
          isType(a + 1, 'start', 0) &&
          isLike(a + 1, 'liquid', 0)
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

        } else if (isjsx === false && isLike(i, 'attribute', 0)) {

          break; // end of attribute/s in tag

        }

      } else if (isjsx === false && (data.begin[i] < a || isLike(i, 'attribute', 0))) {

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

  /**
   * Force Markup Delimiters
   *
   * Applies newline delimiter structures. Does some additional
   * processing to ensure special structures produce correct
   * output, like that we need to reason with when using `valueForce`
   * rule on attributes.
   */
  function TerminusForce () {

    const offset = NWL + nl(levels[a], LF.WS).slice(rules.indentSize);

    data.token[a] = data.token[a].replace(/(\/?>)$/, `${offset}$1`);

    delims.delete(data.begin[n]);
    output.push(data.token[a]);

  }

  // function AttributeValue () {

  //   const open: number = data.token[a].indexOf(EQL) + 2;

  //   if (open > 2) {

  //     const close = data.token[a].length - 1;
  //     const value = data.token[a].slice(open, close);

  //     if (rx.Newline.test(value)) {

  //       const split = value
  //         .replace(rx.NewlineLead, NIL)
  //         .replace(rx.NewlineEnd, NIL)
  //         .split(/(\n+)/g);

  //       /**
  //        * The attribute token we will build, assign the attribute name first
  //        */
  //       const token: string[] = [ data.token[a].slice(0, open) ];

  //       /**
  //        * The indentation offset to apply for each newline
  //        */
  //       let offset = nl(levels[a], 0);

  //       if (rules.markup.valueLineBreak === 'force-indent') {

  //         offset += spaces;

  //       }

  //       token.push(NWL);

  //       for (let i = 0, s = split.length; i < s; i++) {

  //         if (split[i] === NIL || (i + 1 === s && rx.WhitespaceOnly.test(split[i]))) continue;

  //         if (u.isLast(token, cc.NWL)) {

  //           const m = split[i].match(rx.WhitespaceLead);

  //           if (m !== null) {

  //             const ws = m[0].slice(offset.length);

  //             if (ws.length === 0) {

  //               token.push(offset + split[i].replace(rx.WhitespaceLead, ''));

  //             } else {

  //               token.push(split[i]);

  //             }

  //           } else {

  //             token.push(offset + split[i]);

  //           }

  //         } else {

  //           token.push(split[i]);
  //         }
  //       }

  //       token.push(NWL + offset);

  //       token.push(data.token[a].slice(close));

  //       output.push(token.join(NIL));

  //     } else {

  //       output.push(data.token[a]);

  //     }

  //   } else {

  //     output.push(data.token[a]);

  //   }

  // }

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
    const lines = data.token[a].split(crlf);

    /** Cache reference to the length */
    const length = lines.length;

    /** Indentation reference, exclude newlines */
    const indent = nl(levels[a - 1], LF.WS);

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

      output.push(lines.join(crlf).replace(rx.NewlineLead, NIL));
      output.push(nl(levels[a]));

    } else {

      const token = lines
        .join(crlf)
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
      const indent = nl(levels[a], LF.WS, 1);

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
   * Liquid Tokens
   *
   * Applies forcing on Liquid tokens. During the lexer operations, Liquid
   * tokens which apply delimiter forcing, relative to the define `delimiterPlacement`
   * Liquid formatting rule will contain a `\n` newline after the starting delimiter.
   *
   * This function is responsible for ensuring all the containing token content is
   * aligned and correctly formatted when forcing has been determined.
   */
  function Liquid () {

    /** Opening Delimiter, e.g: `{{` or `{%` */
    let OPEN: string;

    /** Closing Delimiter, e.g: `}}` or `%}` */
    let CLOSE: string;

    if (rx.Newline.test(data.token[a])) {

      output.push(LineBreaks());

    } else if (isType(a, 'liquid_end')) {

      output.push(lq.delimiters(data.token[a]));

    } else {

      output.push(Delimiters().join(WSP));

    }

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    /**
     * Line Breaks
     *
     * Determination for line break processing. Function will pass
     * token to appropriate handler for augmentation.
     */
    function LineBreaks () {

      /** Holds an ending delimiter token value */
      const token: string[] = [];

      if (isType(a, 'liquid_start') || isType(a, 'liquid_else')) {

        /** Tag name */
        const tname = u.getTagName(data.token[a]);

        if (
          tname === 'if' ||
          tname === 'unless' ||
          tname === 'elsif') {

          if (Logicals(token) === true) return;

        }

      } else {

        Arguments(token);

      }

      OPEN = token.shift();
      CLOSE = token.pop();

      if (delimiterPlacement !== 'newline-multiline') {

        token[0] = OPEN + token[0];
        token[token.length - 1] += CLOSE;

      } else {

        token.unshift(OPEN);
        token.push(CLOSE);

      }

      if (delimiterTrims === 'multiline') {

        return token
          .join(NIL)
          .trim()
          .replace(/^({[%{])(?!-)/, '$1-')
          .replace(/(?!-)([%}]})$/, '-$1');

      }

      return token.join(NIL).trim();

    }

    /**
     * Delimiters
     *
     * Applies delimiter trims and sets up delimiter placementsö
     */
    function Delimiters () {

      /** Extract delimiters, where `o` represents open and `c` represents close */
      const [ O, C ] = lq.delims(data.token[a]);

      /** Either percent character or LCB */
      const S = data.token[a][1];

      /** Either percent character or RCB */
      const E = u.is(S, cc.PER) ? PER : RCB;

      /** Items */
      const L = data.token[a].slice(O, C).trim().split(NWL);

      /* -------------------------------------------- */
      /* TRIMS                                        */
      /* -------------------------------------------- */

      if (delimiterTrims === 'never') {

        OPEN = '{' + S;
        CLOSE = E + '}';

      } else if (delimiterTrims === 'always' || (
        delimiterTrims === 'outputs' &&
        u.is(S, cc.LCB) &&
        u.is(E, cc.RCB)
      ) || (
        delimiterTrims === 'tags' &&
        u.is(S, cc.PER) &&
        u.is(E, cc.PER)
      )) {

        OPEN = '{' + S + '-';
        CLOSE = '-' + E + '}';

      } else if (delimiterTrims === 'preserve' || (
        delimiterTrims === 'tags' &&
        u.is(S, cc.LCB) &&
        u.is(E, cc.RCB)
      ) || (
        delimiterTrims === 'outputs' &&
        u.is(S, cc.PER) &&
        u.is(E, cc.PER)
      )) {

        OPEN = data.token[a].slice(0, O);
        CLOSE = data.token[a].slice(C);

      } else {

        OPEN = '{' + S;
        CLOSE = E + '}';

      }

      /* -------------------------------------------- */
      /* DELIMITER PLACEMENTS                         */
      /* -------------------------------------------- */

      if (delimiterPlacement === 'preserve') {

        if (u.is(data.token[a][O], cc.NWL)) {
          L.unshift(OPEN);
        } else {
          L[0] = OPEN + WSP + L[0];
        }

        if (u.is(data.token[a][C - 1], cc.NWL)) {
          L.push(CLOSE);
        } else {
          L[L.length - 1] = L[L.length - 1] + WSP + CLOSE;
        }

      } else if (delimiterPlacement === 'inline') {

        L[0] = OPEN + WSP + L[0];
        L[L.length - 1] = L[L.length - 1] + WSP + CLOSE;

      } else if (delimiterPlacement === 'consistent') {

        if (u.is(data.token[a][O], cc.NWL)) {

          L.unshift(OPEN);
          L.push(CLOSE);

        } else {

          L[0] = OPEN + WSP + L[0];
          L[L.length - 1] = L[L.length - 1] + WSP + CLOSE;

        }

      } else {

        L.unshift(OPEN);
        L.push(CLOSE);

      }

      return L;

    }

    /**
     * Logical Handling
     *
     * This function is responsible for formatting logical occurences within
     * conditional (control) type tags. When wrap is exceeded in the tag, we
     * will write each conditional on a newline.
     */
    function Logicals (token: string[]) {

      /** Whether or not token exceed wrap limit */
      const exceed = limit > -1 ? data.token[a].length > limit : false;

      /** Split the token for every newline */
      const lines = Delimiters();

      /** Newlines plus indentation */
      const offset = nl(levels[a - 1], LF.WS, 1) + spaces;

      /** Iterator reference */
      let i: number = 0;

      if (exceed) {

        /** The amount of lines assigned for better perf */
        const length = lines.length;

        do {

          if (i === 0) {

            token.push(lines[i], offset);

            // Ending delimiter, e.g: }} -}} %} -%}
            //
            if (i + 1 === length - 1 && (
              lines[i + 1].length === 2 ||
              lines[i + 1].length === 3)) {

              token.push(lines[i + 1]);
              break;

            }

          } else {

            token.push(lines[i], lines[i + 1] === CLOSE
              ? offset.slice(0, offset.length - spaces.length)
              : offset);

          }

        } while (++i < length);

      } else {

        OPEN = lines.shift();
        CLOSE = lines.pop();

        if (OPEN.length <= 3) {
          output.push(OPEN, offset, lines.join(WSP));
        } else {
          output.push(OPEN, WSP + lines.join(WSP));
        }

        if (CLOSE.length <= 3) {
          output.push(offset.slice(0, offset.length - spaces.length), CLOSE);
        } else {
          output.push(WSP + CLOSE);
        }

        return true;

      }

    }

    /**
     * Argument Handling
     *
     * This function is responsible for both Liquid filters and Liquid tag arguments.
     */
    function Arguments (token: string[]) {

      /** Whether or not token exceed wrap limit */
      const exceed = limit > -1 ? data.token[a].length > limit : false;

      /** Filter pipe and argument reference */
      const input: [ index: number, arguments?: string[] ][] = [];

      /** Split the token for every newline */
      const lines = Delimiters();

      /** The amount of lines assigned for better perf */
      const length = lines.length;

      /** Newlines plus indentation */
      let offset: string = WSP;

      /** Current wrap limit starting from left hand side */
      let width: number = 0;

      /** The type of line break reference */
      let lnbr: Lnbr = Lnbr.None;

      /** Iterator reference */
      let i: number = 0;

      /** Filter arguments previous reference */
      let x: [ index: number, arguments?: string[] ];

      /** The token type reference */
      let t: cc;




      do {

        if (u.is(lines[i], cc.PIP) && t !== cc.COM) {

          if (input.length === 0 && i > 1) for (let p = 1; p < i; p++) input.push([ p, [] ]);

          x = input[input.push([ i, [] ]) - 1];
          t = cc.PIP;

        } else if (u.is(lines[i], cc.COM) && t !== cc.PIP) {

          x = input[input.push([ i, [] ]) - 1];
          t = cc.COM;

        } else if (x) {

          x[1].push(lines[i]);

        }

      } while (++i < length);

      /** Determine the rule to reference */
      const lineBreak = t === cc.PIP ? filterLineBreak : argumentLineBreak;

      if ((
        u.isNumber(lineBreak) &&
         lineBreak > 0 &&
         input.length > 0 &&
         input.length >= lineBreak)) {

        lnbr = Lnbr.Limit;

      } else if (lineBreak === true) {

        lnbr = Lnbr.Preserve;

      } else if (exceed && lineBreak === 0) {

        lnbr = Lnbr.Wrap;

      }

      if (lnbr > Lnbr.None) {

        offset = nl(levels[a - 1], LF.WS, 1) + spaces;

      }


      x = undefined;
      i = 0;

      do {

        if (i === 0) {

          token.push(lines[i], offset);

          // Ending delimiter, e.g: }} -}} %} -%}
          //
          if (i + 1 === length - 1 && (
            lines[i + 1].length === 2 ||
            lines[i + 1].length === 3)) {

            token.push(lines[i + 1]);
            break;

          }

        } else if (lnbr > Lnbr.None) {

          // First argument will be a filter, logical keyword or argument
          //
          // structure:
          // [ [1, [ a,b,c ] ], [2, [ e,f,g ] ] ]
          //
          // x value:
          // [1, [ a,b,c ] ]
          //
          if (input.length > 0 && input[0][0] === i) {

            x = input.shift();

            // if no arguments we will insert offset
            //
            if ((x.length > 1 && x[1].length === 0)) {
              token.push(lines[i].trimEnd(), offset);
            } else {
              token.push(lines[i]);
            }



          } else if (x && x.length > 0) {

            // Determine if the argument count exceed an argument linebreak
            // defined limit in the ruleset
            //
            if (argumentLineBreak > 0 && x[1].length >= argumentLineBreak) {

              while (x[1].length > 0) {

                token.push(offset + spaces, x[1].shift());

              }

            } else {

              width = lines[x[0]].length;

              // Lets see if the arguments happen to exceed word wrap
              // We reference the line entry and combine the length with
              // the arguments length.
              //
              if (limit > -1 && width + x[1].join(WSP).length > limit) {

                token.push(WSP);

                width = argumentFormat === 'newline' ? -1 : width + 1;

                // Arguments have exceeded word wrap, we no incrementally
                // apply line breaks by checking the each argument until we
                // are within wrap bounds
                //
                do {

                  const ind = x[1][0] === CLOSE
                    ? offset.slice(0, offset.length - spaces.length)
                    : offset + spaces;

                  if (argumentFormat === 'preserve') {


                    token.push(ind + x[1].shift());

                  } else {

                    if (width > -1) width += x[1][0].length + 1;

                    if (width < limit) {

                      if (argumentFormat === 'inline-newline' || argumentFormat === 'inline') {

                        if (lineBreakSeparator === 'before' && u.isLast(token, cc.WSP)) token.pop();

                        token.push(x[1].shift());

                      } else if (argumentFormat === 'newline') {

                        token.push(ind, x[1].shift());

                        if (width > -1) width = 0;

                      }

                    } else {

                      if (argumentFormat === 'inline-newline') {

                        token.push(ind + x[1].shift());

                      } else if (argumentFormat === 'inline' || argumentFormat === 'newline') {

                        width = token[token.push(ind + x[1].shift()) - 1].length;

                      }
                    }
                  }

                  if (lineBreakSeparator === 'after') token.push(WSP);

                } while (x[1].length > 0);

              } else {

                while (x[1].length > 0) {

                  token.push(WSP, x[1].shift());

                }
              }

            }

            if (u.last(token).endsWith(CLOSE)) break;

            token.push(offset);

            continue;

          } else {

            // Structure is using lineBreakSeparator after
            //
            token.push(lines[i], offset);

          }

        } else {

          token.push(lines[i], offset);

        }

        if (u.last(token).endsWith(CLOSE)) break;

      } while (++i < length);

    }

  }

  /**
   * Embedded indentations
   *
   * Used when dealing with external lexed languages
   * like JSX, applies indentation levels accordingly.
   */
  function IndentEmbeds () {

    column = 0;

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
        isType(a + 1, 'start', 0) &&
        isType(a + 1, 'singleton', 0)) break;

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

    n = next();

    if (
      data.lexer[n] === 'markup' &&
      data.stack[a].indexOf('attribute') < 0 && (
        isType(n, 'end') ||
        isType(n, 'liquid_end'))) {

      indent = indent - 1;

    }

  };

  /**
   * Wrap Content
   *
   * Word wrap processing for text content, phrasing content elements and comments.
   * This function is responsible for enforcing wrap and respecting rules like
   * `forceTextNode` and
   */
  function Wrap () {

    wrap = 0;

    /** Whether or not word wrap applied */
    const doWrap = rules.wrap > 0;

    /** Newline indentation */
    const newline = nl(levels[a > 0 ? a - 1 : a], LF.WS, 1);

    /** Spacing indentation */
    let offset = newline.slice(crlf.length);

    let indent: string;

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
      if (isType(a, 'comment', 0) && isType(a, 'liquid_comment', 0)) {

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

          indent = nl(levels[a], LF.WS, 1);
          offset = indent.slice(crlf.length);

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
                output.push(input.trim(), newline);

                input = NIL;
                wrap = 0;

              } else {

                input += words[index];

              }

            } else {

              input += words[index];

              output.push(input.trim(), newline);

              input = NIL;
              wrap = 0;
            }
          } else {

            input += words[index];

          }
        }

      } while (++index < items);

      if (input.length > 0) {

        output.push(input);

      }
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

        if (inline.has(a + 1)) {

          output.push(newline);

          wrap = 0;

          return;

        } else {

          if (levels[a] === -10) {
            if (doWrap && wrap + 1 > limit) {
              output.push(newline);
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

          if (doWrap && wrap + data.token[a].length > limit) {
            output.push(newline);
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
              if (doWrap && wrap + token.length > limit) {

                do {

                  if (wrap + data.token[a].length > limit) {
                    output.push(newline);
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

              if (doWrap && wrap > limit) {
                output.push(newline);
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
          inline.has(next) ||
          isType(next, 'content') ||
          isType(next, 'singleton') ||
          isType(next, 'liquid')) {

          // When dealing with phrasing start/end type tokens the 'a' advancement
          // will be referencing the </tag> index but will not yet be measured.
          if (isType(a, 'end')) {

            wrap = wrap + data.token[a].length;

            if (doWrap && wrap > limit) {
              output.push(newline);
              wrap = 0;
            }

            // else if (levels[a - 1] === -10) {
            //   output.push(WSP);
            //   wrap = wrap + 1;
            // }

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
   * Attributes
   *
   * Used in the final beautification cycle to beautify
   * attributes and attribute values in accordance with
   * levels that were defined earlier.
   */
  function Attribute () {

    // The parent node - used to determine forced leading attribute
    // We re-align the previous index reference
    //
    p = a - 1;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /** References index position of `a` - we use a reference of `w` to infer "wrap" */
    let w: number = a;

    /** The start token length, e.g: `<div>` would be `5` and `<h1>` would be `4` */
    let length: number = data.token[p].length + 1;

    /** Plural - Unsure what this does, I assume it determines more than 1 attribute */
    let plural: boolean = false;

    /** The Liquid indentation level to be applied within liquid attributes */
    let liquidLevel: number = 0;

    /** Whether or not the attribute is a start type tag - This is `false` if singleton */
    let attrStart: boolean = false;

    /** Whether or not we should apply attribute forcing (i.e, newline breaks) */
    let attrForce: boolean = u.isBoolean(attributeLineBreak) ? attributeLineBreak as boolean : false;

    /** The amount of attributes allowed before line breaks are incurred */
    let attrLimit: number = attrForce ? 0 : u.isNumber(attributeLineBreak) ? attributeLineBreak : Infinity;

    /** The identation level to be applied to attributes */
    let attrLevel: number = Level();

    /** Whether or not attributes apply wrap forcing */
    let attrWrap: boolean = false;

    /** The number of attributes contained on the tag */
    const attrCount: number = Count();

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    if (isType(a, 'comment_attribute')) {

      // level must be indent unless the "next" type is end then its indent + 1
      //
      levels.push(indent);
      levels[p] = data.types[p] === 'singleton' ? indent + 1 : indent;

      return;

    }

    // Text Bounded tags
    //
    // Ensures attributes remain inline when content is surrounded by text
    //
    if (bound > -1 && data.lines[p] < 2) {

      if ((textBoundInline || textNodes.has(data.stack[a])) && (
        attrForce ||
        attrCount >= attrLimit
      )) {

        attrForce = false;
        attrLimit = Infinity;

      }
    }

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    /**
     * Counts the number attributes the tag contains. This includes
     * Liquid type attributes. The {@link attrCount} variable will
     * hold the return value.
     */
    function Count () {

      /** The number of attributes contained on the token */
      let attr: number = 0;

      do ++attr;
      while (isLike(a + attr, 'attribute'));

      return attr;

    }

    /**
     * Returns the indentation level for the contained attributes.
     * The {@link indent} variable is not augmented in this operation
     * but instead the the {@link attrLevel} will hold the return value.
     */
    function Level () {

      if (isLike(a, '_start')) {

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

      return (isType(p, 'singleton') || isType(p, 'liquid_markup_start')) ? indent + 1 : indent;

    }

    /**
     * Updates the {@link levels} array. This function is responsible for
     * applying indentation or line breaks. and is more so a utility function
     * that populates `levels[]` accordingly.
     */
    function Break () {

      if (attrForce === true || attrCount >= attrLimit) {

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

    function Wrap (index: number) {

      return;

      const item = data.token[index].split(rx.WhitespaceGlobGroup);
      const size = item.length;
      const offset = nl(levels[p], LF.WS);
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

    /**
     * Setup processing configuration for the next known tokens in
     * the data structure. This function will ensure rulesets align
     * and actions such as `delimiterTerminus` and if forced indent applies.
     */
    function Next () {

      // Applies delimiter terminus if rules determine it to be so
      // The delims Set will be populated with the start token index
      //
      if (delimiterTerminus === true || (
        u.isNumber(delimiterTerminus) &&
        attrCount >= delimiterTerminus)) {

        delims.add(p);

      }

      // Applies force indentation when attributeLineBreak applies
      // forcing. The inner content of the tag must apply forced
      // indentation in these situations.
      //
      if (forceIndent === false && bound < 0 && data.lines[a] < 2 && (
        isType(n, 'content', 0) ||
        isType(n, 'liquid')
      )) {

        levels[a] = indent;

        if (data.lines[data.ender[p]] < 2) {

          data.lines[data.ender[p]] = 2;

        }

      }

    }

    /**
     * Walks all the attribute on the tag and reasons about with them.
     * This is the main processing action, wherein we inspect and determin
     * how an attribute should be formatted.
     */
    function Walk () {

      /* -------------------------------------------- */
      /* BEGIN WALK                                   */
      /* -------------------------------------------- */

      if (attrLevel < 1) {

        attrLevel = 1;

      }

      // First, set attrs and determine if there are template attributes.
      // When we have template attributes we handle them in a similar manner
      // as HTML attributes, with only slight differences.
      //
      do {

        column = column + data.token[a].length + 1;

        if (isLike(a, '_attribute')) {

          if (isType(a, 'comment_attribute')) {

            levels.push(attrLevel);

          } else if (isLike(a, '_start') && isLike(a, 'liquid', 0)) {

            attrStart = true;

            // Typically this condition when true infers the last
            // attribute token in languages like JSX
            //
            if (a < c - 2 && isLike(a + 2, '_attribute')) {

              levels.push(-20);

              a = a + 1;

              lexers[a] = a;

            } else {

              if (p === a - 1 && plural === false) {

                // Prevent embedded expression content being indented onto newlines.
                //
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

              levels.push(liquidLevel > 0 ? attrLevel : attrLevel + liquidLevel);
              liquidLevel = liquidLevel + 1;

            } else if (isType(a, 'liquid_attribute_else')) {

              levels[a - 1] = attrLevel + liquidLevel - 1;

            } else if (isType(a, 'liquid_attribute_end')) {

              liquidLevel = liquidLevel - 1;
              levels[a - 1] = attrLevel + liquidLevel;

            } else {

              Break();

            }

          } else if (isLike(a, 'end') && isType(a, 'liquid_attribute_end', 0)) {

            if (levels[a - 1] !== -20) {

              levels[a - 1] = levels[data.begin[a]] - 1;

            }

            levels.push(data.lexer[a + 1] !== 'markup' ? -20 : attrLevel);

          } else if (isLike(a, 'liquid_attribute')) {

            length = length + data.token[a].length + 1;

            if (rules.markup.attributePreserve) {

              levels.push(-10);

            } else if (attrForce || attrLimit > 0 || attrStart || (a < c - 1 && isLike(a + 1, 'attribute'))) {

              Break();

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

          } else if (attrForce || attrLimit > 0 || attrStart || (a < c - 1 && isLike(a + 1, 'attribute'))) {

            Break();

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
        isLike(a, 'liquid', 0) &&
        isLike(a, 'liquid_attribute') &&
        isLike(a, 'end') &&
        isType(p, 'singleton', 0)) {

        levels[a - 1] = levels[a - 1] - 1;

      }

      if (levels[a] !== -20) {

        if (jsxtsx && isLike(p, 'start') && isType(a + 1, 'script_start')) {

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

        }
      }

      if (attrForce) {

        column = 0;
        levels[p] = attrLevel;

        Next();

      } else if (attrLimit >= 1) {

        if (attrCount >= attrLimit) {

          levels[p] = attrLevel;

          /** Force Attribute index reference */
          let i: number = a - 1;

          do {

            if (levels[i] === -10 && (isType(i, 'attribute') || isType(i, 'liquid'))) {

              levels[i] = attrLevel;

            }

          } while (--i > p);

          Next();

        } else {

          levels[p] = -10;

        }

      } else {

        //

        levels[p] = -10;

      }
    }

    Walk();

    if (rules.markup.attributePreserve || isToken(p, '<%xml%>') || isToken(p, '<?xml?>')) {

      column = 0;

      return; // Return Early for XML or Attribute Preserve

    }

    w = a;

    // Second, ensure tag contains more than one attribute
    if (w > p + 1) {

      // finally, indent attributes if tag length exceeds the wrap limit
      if (rules.markup.selfCloseSpace) {

        length = length - 1;

      }

      if (length > rules.wrap && rules.wrap > 0 && attrForce === false) {

        levels[p] = attrLevel;
        column = data.token[a].length;
        w = w - 1;

        do {

          if (data.token[w].length > rules.wrap && u.ws(data.token[w])) {

            if (!attrWrap) attrWrap = true;

            Wrap(w);

          }

          if (levels[w] === -10 && (isType(w, 'attribute') || isLike(w, 'liquid'))) {

            levels[w] = attrLevel;

          }

        } while (--w > p);

      }

    } else if (rules.wrap > 0 && data.token[a].length > rules.wrap && isType(a, 'attribute')) {

      // Removed: && u.ws(data.token[a]) in condition

      if (!attrWrap) {

        attrWrap = true;

      }

      Wrap(a);
      Next();

    }

  };

  /**
   * Indent Markup
   *
   * Applies markup indentation level control. References the markup
   * rule `forceIndent` and checks the next entry of `data.lines[n]`
   * in the parse table. Additional analysis will be performed here
   * to ensure structures adhere to intent.
   */
  function IndentMarkup (linebreak = rules.markup.forceIndent) {

    /**
     * Evaluates indentation to determine ending structure.
     * When `true` we will check the ender token `data.lines[x]` value.
     * It's important to note that when evaluation is `true` but the ender
     * token structure adhere to expectation no update will apply on the
     * data structure record.
     *
     * **Explanation**
     *
     * Evaluation only applies when `forceIndent` is `false` and we've
     * encountered a structure like the below example. The start token
     * `<div>` is proceeded by a newline break but the ender token `</div>`
     * exists inline. Such a structure signals for forced indentation to
     * apply on ending `</div>`:
     *
     * ```html
     * <!- BEFORE FORMATTING -->
     * <div>
     * foo</div>
     *
     * <!- AFTER FORMATTING -->
     * <div>
     *  foo
     * </div>
     * ```
     *
     * The same behaviour appropriates to inline structures. When the start
     * token (`<div>`) is expressed inline, but its ender `</div>` token
     * placement applies newline break, the ender will be inlined:
     *
     * ```html
     * <!- BEFORE FORMATTING -->
     * <div>foo
     * </div>
     *
     * <!- AFTER FORMATTING -->
     * <div>foo</div>
     * ```
     */
    const update = rules.markup.forceIndent === false && bound < 0 && isType(a, 'start');

    if (linebreak || data.lines[n] > 1 || isStack(n, 'script') || isStack(n, 'style')) {

      if (update && data.lines[data.ender[a]] < 2) data.lines[data.ender[a]] = 2;

      levels.push(indent);

    } else {

      if (update && data.lines[data.ender[a]] > 1) data.lines[data.ender[a]] = data.lines[n];

      levels.push(data.lines[n] === 1 ? -10 : -20);

    }
  }

  /**
   * Indent Liquid
   *
   * Helper function will applies markup indentation level control.
   * References the markup rule `forceIndent` and accepts a reverse
   * parameter to reset previous level entries.
   */
  function IndentLiquid (linebreak = rules.liquid.forceIndent) {

    if (linebreak || data.lines[n] > 1) {

      levels.push(indent);

    } else if (data.lines[n] === 1) {

      levels.push(-10);

    } else if (data.lines[n] === 0) {

      levels.push(-20);

    }

  }

  function IndentText () {

    if (isType(a, 'start')) {

      if (data.lines[n] < 2) {

        if (levels[a - 1] > -1 && data.lines[a] < 2) {
          if (data.lines[a] > 1) {

            levels[a - 1] = indent > 0 ? indent - 1 : indent;

          } else {

            levels[a - 1] = data.lines[a] === 1 ? -10 : -20;

          }
        }

        bound = forceIndent && data.lines[a] > 1 ? -1 : n;

      } else {

        bound = -1;

      }

    } else {

      if (bound > -1 && bound === a) {

        if (isType(n, 'start', 0) && data.lines[n] < 2) {

          bound = n;
          levels[a - 1] = data.lines[a] > 1 ? indent : data.lines[a] === 1 ? -10 : -20;

          IndentMarkup(false);

        } else {

          bound = -1;

          IndentMarkup();

        }

      } else {

        IndentMarkup();

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
    // levels[]   -> space after token
    //
    // p -> last token in data structure (excludes attributes)
    // a -> current token in data structure
    // n -> next token in data structure (exludes attributes)
    //
    do {

      if (data.lexer[a] !== 'markup') {

        IndentEmbeds();

      } else {

        if (isType(a, 'doctype')) levels[a - 1] = indent;

        if (isLike(a, 'attribute')) {

          Attribute();

        } else if (isType(a, 'comment')) {

          Comment();

        } else {

          n = next();

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
            levels.push(data.lines[n] > 1 ? indent : data.lines[n] > 0 ? -10 : -20);

          } else if (
            isType(a, 'content') ||
            isType(a, 'singleton') ||
            isType(a, 'liquid')) {

            column = column + data.token[a].length;

            if (isType(n, 'script_start')) {

              levels.push(-10);

            } else if (isType(a, 'liquid')) {

              if (isType(n, 'liquid_case_end') && dedent.has('case') === false) {

                indent = indent - 1;

              }

              IndentLiquid();

            } else if (textBoundInline && (isType(p, 'start') || isType(n, 'start'))) {

              // IndentText();
              IndentMarkup();

            } else {

              IndentMarkup();

            }

          } else if (isType(a, 'start')) {

            if (isType(n, 'end')) {

              indent = indent + 1;

              levels.push(-20);

            } else if (textBoundInline && (
              isType(p, 'content') ||
              isType(p, 'liquid'))) {

              // IndentText();

              IndentMarkup();

            } else {

              IndentMarkup();

            }

          } else if (isType(a, 'end')) {

            if (isType(n, 'liquid_case_end')) {

              indent = indent - 1;

            }

            if (bound === a) bound = -1;
            if (bound > -1 && textBoundInline && data.lines[n] < 2 && isType(n, 'content')) {

              bound = n;
              IndentMarkup(false);

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

            levels[a - 1] = isType(n, 'liquid_end') ? indent + 1 : indent - 1;

            IndentLiquid();

          } else if (isType(a, 'liquid_case_start')) {

            IndentLiquid();

            if (isType(n, 'liquid_when')) indent = indent + 1;

          } else if (isType(a, 'liquid_case_end')) {

            IndentLiquid();

          } else if (isType(a, 'liquid_when')) {

            indent = indent - 1;
            levels[a - 1] = indent - 1;

            IndentLiquid();

          } else if (isType(a, 'liquid_case_else')) {

            levels[a - 1] = indent - 1;

            IndentLiquid();

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
          isType(a, 'content', 0) &&
          isType(a, 'singleton', 0) &&
          isType(a, 'liquid', 0) &&
          isType(a, 'liquid_when', 0) &&
          isType(a, 'attribute', 0)) column = 0;

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
    if (output.length === 0 && l > 0) output.push(nl(levels[a], LF.WS));


    do {

      n = a + 1 < c ? a + 1 : a;

      if (data.lexer[a] === 'markup') {

        if (a < c - 1 && (
          isType(a, 'start') ||
          isType(a, 'liquid_markup_start') ||
          isType(a, 'singleton') ||
          isType(a, 'xml')
        ) && (
          isLike(a, 'attribute', 0) &&
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
                output.push(nl(levels[a], LF.NL));
              } else {
                output.push(nl(levels[a]));
              }
            } else {

              nl(levels[a], LF.NL);

            }
          }

        } else if (isLike(a, 'liquid_comment')) {

          if (rules.liquid.commentPreserve) {

            output.push(data.token[a]);

            if (levels[a] > -1) {
              if (isType(a, 'liquid_comment_start')) {
                output.push(nl(levels[a], LF.NL));
              } else {
                output.push(nl(levels[a]));
              }
            }

          } else if (isType(a, 'liquid_comment_start')) {

            Wrap();

          }

        } else if (isType(a, 'content')) {

          if (rules.markup.textPreserve === false) {

            if (rules.wrap > 0) {

              Wrap();

            } else {

              output.push(data.token[a]);

              if (levels[a] === -10) {

                output.push(WSP);

              } else if (levels[a] > -1) {

                output.push(nl(levels[a]));

              }

            }
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
            isLike(n, 'attribute', 0) &&
            u.isLast(data.token[a], cc.RAN) &&
            delims.has(data.begin[n])) {

            TerminusForce();

          } else if (isLike(a, 'liquid')) {

            Liquid();

          } else {

            output.push(data.token[a]);

          }

          if (
            isType(n, 'ignore') ||
            isType(n, 'ignore_next')) {

            if (!(
              isStack(n, 'script') ||
              isStack(n, 'style'))) {

              output.push(nl(levels[a], LF.NL));

            }

          } else if (
            isType(n, 'content') &&
            rules.markup.textPreserve) {

            output.push(nl(levels[a], LF.NL));

          } else if (levels[a] === -10 && a < c - 1) {

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

          if (forceIndent || (levels[parse.iterator] > -1 && a in lexers)) {

            if (lexers[a] > a) a = parse.iterator;

            output.push(nl(levels[a]));

          }

        }

        if (a !== parse.iterator) a = parse.iterator;

      }

    } while (++a < c);

    parse.iterator = c - 1;

    return rules.endNewline
      ? u.glue(output).replace(/\s*$/, crlf)
      : u.glue(output).trimEnd();

  };

  /* -------------------------------------------- */
  /* COMPLETE                                     */
  /* -------------------------------------------- */

  return Format();

};
