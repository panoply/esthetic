import type { Types } from 'types/index';

import { NIL, NWL, WSP } from 'chars';
import { cc } from 'lexical/codes';
import { LF } from 'lexical/enum';
import * as lq from 'lexical/liquid';
import * as rx from 'lexical/regex';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import * as u from 'utils/helpers';
import { object } from 'utils/native';

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
  let limit: number = rules.wordWrap > 0 ? rules.wordWrap : -1;

  /** Comment starting positions */
  let comms: number = -1;

  /** Indentation levels */
  let indent: number = isNaN(rules.indentLevel) ? 0 : rules.indentLevel;

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /** The length of the data structure parse table */
  const c: number = ender < 1 || ender > data.token.length ? data.token.length : ender + 1;

  /** External Lexer reference when dealing with markup elements that require external handling. */
  const lexers: { [index: number]: number } = object(null);

  /** The record ender index for text bound structures, e.g, `foo <div> bar </div>^` */
  const inline: Set<number> = new Set();

  /** The record indexs to apply delimiter forcing */
  const delims: Set<number> = new Set();

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
      ? data.types[index].includes(name)
      : data.types[index].includes(name) === false;

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

      if (rules.wordWrap > 0) {
        limit = rules.wordWrap - ws.length;
      }
    } else {
      if (rules.wordWrap > 0 && limit !== rules.wordWrap) {
        limit = rules.wordWrap;
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

    if (data.lines[x + 1] === 0 && rules.forceIndent === false) {

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

    /** Self closing/void tag ending delimiter */
    let space: string = rules.selfCloseSpace && closer[0] === '/>' ? WSP : NIL;

    // First, we will remove the applied '>' or '/>' delimiter from the token
    // record contained within the data structure and reconnect it below.
    //
    data.token[a] = parent.replace(rx.HTMLAttributeEnd, NIL);

    do {

      if (data.begin[i] === a) {

        if (isLike(i, 'attribute', 0)) {

          break; // end of attribute/s in tag

        }

      } else if ((data.begin[i] < a || isLike(i, 'attribute', 0))) {

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

    // Ensure that the tag is not empty
    // if next type is end, then we need to reference that last
    // level reference otherwise the ">" will be -20
    //
    const offset = NWL + nl(isType(n, 'end') ? levels[a - 1] : levels[a], LF.WS).slice(rules.indentSize);

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

  //       if (rules.valueLineBreak === 'force-indent') {

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
      const indent = nl(levels[a - 1], LF.WS, 1);

      let i: number = 0;

      do {

        if (lines[i] === NIL) {
          lines[i + 1] !== NIL ? output.push(indent) : output.push(NWL);
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

    /** Current wrap limit starting from left hand side */
    const width: number = data.token[a].length;

    if (isType(a, 'liquid_tag_start')) {

      do {

        if (rules.delimiterPlacement === 'newline-multiline') {

          if (isType(a, 'liquid_tag_start')) {

            const o = u.is(data.token[a][2], cc.DSH) ? 3 : 2;
            const open = data.token[a].slice(0, o) + nl(levels[a - 1], LF.WS, 1) + spaces;
            output.push(open + data.token[a].slice(o).trim());

          } else {

            output.push(data.token[a]);

          }

        } else {

          if (isType(a, 'liquid_tag_start')) {
            data.token[a].split(NWL).forEach(input => output.push(input, nl(levels[a])));
          } else {
            output.push(data.token[a]);
            if (isType(a, 'liquid_tag_end')) break;
            output.push(nl(levels[a]));
          }

        }

      } while (++a < c);

    } else {

      const token = lq.token(data.token[a], nl(levels[a - 1], LF.WS), spaces);

      if (isType(a, 'liquid_end')) {

        output.push(Singleline(token.lines));

      } else if (token.lines.length >= 1 || data.token[a].length > limit) {

        if (isType(a, 'liquid_comment_line')) {

          output.push(Comments());

        } else if (grammar.liquid.control.has(u.getTagName(data.token[a]))) {

          output.push(Logicals());

        } else {

          output.push(Arguments());

        }

      } else if (isType(a, 'liquid_comment_line')) {

        output.push(Commline());

      }

      /* -------------------------------------------- */
      /* BEGIN                                        */
      /* -------------------------------------------- */

      function Multiline (lines: string[], offset = nl(levels[a - 1], LF.WS, 1) + spaces) {

        return rules.delimiterPlacement === 'newline-multiline'
          ? rules.delimiterTrims === 'multiline'
            ? (token.open.trims + token.open.multi + lines.join(offset) + token.close.multi + token.close.trims)
            : (token.open.delim + token.open.multi + lines.join(offset) + token.close.multi + token.close.delim)
          : rules.delimiterTrims === 'multiline'
            ? (token.open.trims + token.open.space + lines.join(offset) + token.close.space + token.close.trims)
            : (token.open.delim + token.open.space + lines.join(offset) + token.close.space + token.close.delim);

      }

      function Singleline (lines: string[]) {

        return token.open.delim + token.open.space + lines.join(WSP) + token.close.space + token.close.delim;

      }

      function Commline () {

        return u.is(token.open.space, cc.NWL)
          ? token.open.delim + token.open.multi + token.lines.join(WSP).trim() + token.close.multi + token.close.delim
          : token.open.trims + token.open.space + token.lines.join(WSP).trim() + token.close.space + token.close.trims;

      }

      function Logicals () {

        /** Whether or not token exceed wrap limit */

        return limit > -1 && width > limit ? Multiline(token.lines) : Singleline(token.lines);

      }

      function Arguments () {

        /** Determine the rule to reference */
        const lineBreak = token.lines.some(x => u.is(x, cc.PIP)) ? rules.filterLineBreak : rules.argumentLineBreak;

        if (u.isBoolean(lineBreak)) {

          // filterLineBreak is true or false
          // true = multiline when number of lines exceed 1 inside tag (preservational)
          // false = number of lines is 1 or inline formatting is enforced (i.e, filterLineBreak: false)

          return lineBreak
            ? token.lines.length > 1
              ? Multiline(token.lines.map((x, i) => i > 0 && u.not(x, cc.PIP) ? spaces + x : x))
              : Singleline(token.lines)
            : Singleline(token.lines);

        } else if (u.isNumber(lineBreak)) {

          // filterLineBreak is number or argumentLineBreak is number
          // Whatever the rule definition here we are performing limit based line breaks

          return (
            (lineBreak === 0 && limit > -1 && width > limit) ||
            (lineBreak > 0 && token.lines.length > lineBreak))
            ? Multiline(token.lines.map((x, i) => i > 0 && u.not(x, cc.PIP) ? spaces + x : x))
            : Singleline(token.lines);

        }

        // Use wrap determination

        return limit > -1 && width > limit ? Multiline(token.lines) : Singleline(token.lines);

      }

      function Comments () {

        const lines: string[] = [];

        /** Newlines plus indentation */
        const offset = nl(levels[a - 1], LF.WS) + spaces + '#' + WSP;

        /** Wrap limit */
        const exceed = limit - nl(levels[a], LF.WS).length;

        /** Group lines into paragraphs */
        const paragraphs = [];

        /** Current paragraph */
        let current: string[] = [];

        for (let i = 0; i < token.lines.length; i++) {
          if (token.lines[i] === NIL) {
            if (current.length > 0) {
              paragraphs.push(current);
              current = [];
            }
            paragraphs.push([ NIL ]); // Preserve empty line
          } else {
            current.push(token.lines[i]);
          }
        }

        if (current.length > 0) {
          paragraphs.push(current);
        }

        for (let i = 0; i < paragraphs.length; i++) {

          const paragraph = paragraphs[i];

          // Handle empty line
          if (paragraph.length === 1 && paragraph[0] === NIL) {
            lines.push(NIL);
            continue;
          }

          // Merge paragraph content
          let merged = NIL;

          for (const line of paragraph) {
            const isComment = line.trim().startsWith('#');
            const cleanLine = isComment ? line.slice(1).trimStart() : line;
            merged += (merged ? WSP : NIL) + cleanLine;
          }

          // Split into words and wrap
          const words = merged.split(WSP);

          let ln = NIL;
          const wrapped = [];

          for (const word of words) {
            if ((ln + word).length <= exceed) {
              ln += (ln ? ' ' : '') + word;
            } else {
              if (ln) wrapped.push((wrapped.length === 0 ? '# ' : offset) + ln);
              ln = word;
            }
          }

          if (ln) {
            wrapped.push(offset + ln);
          }

          lines.push(...wrapped);

        }

        return lines.length > 1
          ? Multiline(lines, NWL)
          : (token.open.delim + token.open.space + lines.join(WSP).trim() + token.close.space + token.close.delim);

      }

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
    const doWrap = rules.wordWrap > 0;

    /** Newline indentation */
    const newline = isType(a, 'liquid_comment')
      ? nl(levels[a], LF.WS, 1)
      : nl(levels[a > 0 ? a - 1 : a], LF.WS, 1);

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
    // If token type 'a' is not liquid_comment_start we proceed
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

        } else if (rules.wordWrap > 0) {

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

          if (rules.wordWrap > 0 && index + 1 < items && wrap + words[index + 1].length > limit) {

            if (rx.Newline.test(words[index + 1])) {

              if (wrap > limit) {

                input += words[index];
                output.push(input.trim() + newline);

                input = NIL;
                wrap = 0;

              } else {

                input += words[index];

              }

            } else {

              input += words[index];

              output.push(input.trim() + newline);

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
    let attrForce: boolean = u.isBoolean(rules.attributeLineBreak) ? rules.attributeLineBreak as boolean : false;

    /** The amount of attributes allowed before line breaks are incurred */
    let attrLimit: number = attrForce ? 0 : u.isNumber(rules.attributeLineBreak) ? rules.attributeLineBreak : Infinity;

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

      if ((rules.textBoundInline || textNodes.has(data.stack[a])) && (
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
        isType(n, 'liquid_markup_end') ||
        isType(n, 'liquid_when')) return indent + 1;

      return (
        isType(p, 'singleton') ||
        isType(p, 'liquid_markup_start')) ? indent + 1 : indent;

    }

    /**
     * Updates the {@link levels} array. This function is responsible for
     * applying indentation or line breaks. and is more so a utility function
     * that populates `levels[]` accordingly.
     */
    function Break () {

      if (attrForce === true || attrCount >= attrLimit) {

        if (rules.indentAttribute) {
          if (isType(a - 1, 'liquid_attribute_start')) levels[a - 1] = attrLevel + liquidLevel;
          levels.push(attrLevel + liquidLevel);
        } else {
          levels.push(attrLevel);
        }

      } else {

        levels.push(-10);

      }

    }

    // function Wrap (index: number) {

    //   return;

    //   const item = data.token[index].split(rx.WhitespaceGlobGroup);
    //   const size = item.length;
    //   const offset = nl(levels[p], LF.WS);
    //   const build: string[] = [];

    //   let bb = 1;
    //   let acount = item[0].length;

    //   do {

    //     if (acount + item[bb].length > rules.wordWrap) {

    //       acount = item[bb].length;
    //       item[bb] = parse.crlf + item[bb];

    //     } else {

    //       item[bb] = ` ${item[bb]}`;
    //       acount = acount + item[bb].length;

    //     }

    //   } while (++bb < size);

    //   data.token[index] = item.join(NIL);

    // };

    /**
     * Setup processing configuration for the next known tokens in
     * the data structure. This function will ensure rulesets align
     * and actions such as `delimiterTerminus` and if forced indent applies.
     */
    function Next () {

      // Applies delimiter terminus if rules determine it to be so
      // The delims Set will be populated with the start token index
      //
      if (rules.terminusBracket === true || (
        u.isNumber(rules.terminusBracket) &&
        attrCount >= rules.terminusBracket)) {

        delims.add(p);

      }

      // Applies force indentation when attributeLineBreak applies
      // forcing. The inner content of the tag must apply forced
      // indentation in these situations.
      //
      if (rules.forceIndent === false && bound < 0 && data.lines[a] < 2 && (
        isType(n, 'content', 0) ||
        isType(n, 'liquid')
      )) {

        if (!(isType(a, 'attribute') && isType(a + 1, 'end'))) {

          levels[a] = indent;

          if (data.lines[data.ender[p]] < 2) {

            data.lines[data.ender[p]] = 2;

          }

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

            if (p === a - 1 && plural === false) {

              levels.push(attrLevel);

            } else {

              levels.push(attrLevel + 1);

            }

            if (data.lexer[a + 1] !== 'markup') {
              a = a + 1;
              IndentEmbeds();
            }

          } else if (rules.indentAttribute === true) {

            if (isType(a, 'liquid_attribute_start')) {

              levels.push(liquidLevel > 0 ? attrLevel : attrLevel + liquidLevel);
              levels[a - 1] = attrLevel + liquidLevel;
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

            if (rules.attributePreserve !== false) {

              levels.push(-10);

            } else if (attrForce || attrLimit > 0 || attrStart || (a < c - 1 && isLike(a + 1, 'attribute'))) {

              Break();

            } else {

              // levels.push(-10);

            }

          } else {

            levels.push(attrLevel);

          }

        } else if (isType(a, 'attribute')) {

          length = length + data.token[a].length + 1;

          if (rules.attributePreserve) {

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

        // We need to handle self closers if they get indentation
        // likely happening with JSX.
        //
        if (isToken(a, '/') && levels[a - 1] !== 10) {
          levels[a - 1] = -10;
        } else {
          levels[a] = levels[p];
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
          let i: number = a;

          do {

            if ((levels[i] === -10) && (isType(i, 'attribute') || isType(i, 'liquid'))) {

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

    if (rules.attributePreserve || isToken(p, '<%xml%>') || isToken(p, '<?xml?>')) {

      column = 0;

      return; // Return Early for XML or Attribute Preserve

    }

    w = a;

    // Second, ensure tag contains more than one attribute
    if (w > p + 1) {

      // finally, indent attributes if tag length exceeds the wrap limit
      if (rules.selfCloseSpace) {

        length = length - 1;

      }

      if (length > rules.wordWrap && rules.wordWrap > 0 && attrForce === false) {

        levels[p] = attrLevel;
        column = data.token[a].length;
        w = w - 1;

        do {

          if (data.token[w].length > rules.wordWrap && u.ws(data.token[w])) {

            if (!attrWrap) attrWrap = true;

            // Wrap(w);

          }

          if (levels[w] === -10 && (isType(w, 'attribute') || isLike(w, 'liquid'))) {

            levels[w] = attrLevel;

          }

        } while (--w > p);

      }

    } else if (rules.wordWrap > 0 && data.token[a].length > rules.wordWrap && isType(a, 'attribute')) {

      // Removed: && u.ws(data.token[a]) in condition

      if (!attrWrap) {

        attrWrap = true;

      }

      // Wrap(a);
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
  function IndentMarkup (linebreak = rules.forceIndent) {

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
    const update = rules.forceIndent === false && bound < 0 && isType(a, 'start');

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
  function IndentLiquid (linebreak = rules.forceIndent) {

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

        bound = rules.forceIndent && data.lines[a] > 1 ? -1 : n;

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

          if (isType(a - 1, 'liquid_markup_start')) {

            indent = indent + 1;
            Attribute();
            indent = indent - 1;

          } else {

            Attribute();
          }
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
          if ((
            isType(n, 'end') ||
            isType(n, 'liquid_case_end') ||
            isType(n, 'liquid_tag_end') ||
            isType(n, 'liquid_end'))) {

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
            isType(a, 'liquid_markup_start') ||
            isType(a, 'liquid_tag_start')) {

            indent = indent + 1;

          }

          if (
            isType(a, 'content') ||
            isType(a, 'singleton') ||
            isType(a, 'liquid')) {

            column = column + data.token[a].length;

            if (isType(a, 'liquid') || isType(a, 'content')) {

              if (isType(n, 'liquid_case_end')) {

                if (levels[a - 1] === indent) {

                  levels[a - 1] = indent - 1;

                } else {

                  levels[a - 1] = indent;
                  indent = indent - 1;

                }

                isType(a, 'content') ? IndentMarkup() : IndentLiquid();

              } else if (isType(a, 'liquid')) {

                IndentLiquid();

              } else {

                IndentMarkup();

              }

            } else if (rules.textBoundInline && (isType(p, 'start') || isType(n, 'start'))) {

              // IndentText();
              IndentMarkup();

            } else {

              IndentMarkup();

            }

          } else if (isType(a, 'start')) {

            if (isType(n, 'end')) {

              indent = indent + 1;

              levels.push(-20);

            } else if (rules.textBoundInline && (isType(p, 'content') || isType(p, 'liquid'))) {

              // IndentText();

              IndentMarkup();

            } else {

              IndentMarkup();

            }

          } else if (isType(a, 'end')) {

            if (bound === a) bound = -1;
            if (bound > -1 && rules.textBoundInline && data.lines[n] < 2 && isType(n, 'content')) {
              bound = n;
              IndentMarkup(false);
            } else {
              IndentMarkup();
            }

          } else if (
            isType(p, 'liquid_markup_start') &&
            isType(a - 1, 'attribute') &&
            isType(a, 'liquid_end')) {

            levels[a - 1] = indent;
            IndentLiquid();

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

            if (isType(n, 'liquid_when')) {

              indent = indent + 1;

            }

          } else if (isType(a, 'liquid_case_end')) {

            IndentLiquid();

          } else if (isType(a, 'liquid_when')) {

            indent = indent - 1;
            levels[a - 1] = indent - 1;

            IndentLiquid();

          } else if (isType(a, 'liquid_case_else')) {

            levels[a - 1] = indent - 2;

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

            if (rules.commentIndent) {
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

              // nl(levels[a], LF.NL);

            }
          }

        } else if (isType(a, 'liquid_comment_start')) {

          if (rules.commentPreserve) {

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

          if (rules.textPreserve === false) {

            if (rules.wordWrap > 0) {

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

          } else if (
            isLike(a, 'liquid') &&
            isLike(a, 'liquid_attribute', 0) &&
            isLike(a, 'liquid_markup', 0)) {

            Liquid();

          } else {

            output.push(data.token[a]);

          }

          if (isType(n, 'ignore') || isType(n, 'ignore_next')) {
            if (!(isStack(n, 'script') || isStack(n, 'style'))) {

              output.push(nl(levels[a], LF.NL));

            }

          } else if (isType(n, 'content') && rules.textPreserve) {

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

        output.push(parse.external(l));

        if (rules.forceIndent || (levels[parse.iterator] > -1 && a in lexers)) {

          if (lexers[a] > a) a = parse.iterator;

          output.push(nl(levels[a]));

        }

        if (a !== parse.iterator) a = parse.iterator;

      }

    } while (++a < c);

    parse.iterator = c - 1;

    return rules.endNewline
      ? u.glue(output).replace(rx.SpacesLast, crlf)
      : u.glue(output).trimEnd();

  };

  /* -------------------------------------------- */
  /* COMPLETE                                     */
  /* -------------------------------------------- */

  return Format();

};
