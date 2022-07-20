import type { Record, Data, Types } from 'types/prettify';
import { prettify, grammar } from '@prettify/model';
import { parse } from '@parser/parse';
import { is, not, ws } from '@utils/helpers';
import { cc } from '@utils/enums';
import { create } from '@utils/native';

/* -------------------------------------------- */
/* LEXER                                        */
/* -------------------------------------------- */

/**
 * Markup Lexer
 *
 * Used to parse markup languages. This used to be used for multiple
 * template languages in options but has been refactored to solely
 * focus and support the following language only:
 *
 * - HTML
 * - XML
 * - JSX
 * - SGML
 * - Liquid.
 */
prettify.lexers.markup = function markup (source: string) {

  const { options } = prettify;

  /**
   * Parse data reference
   */
  const { data } = parse;

  /**
   * Attribute sorting list length
   */
  const asl = options.markup.attributeSortList.length;

  /**
   * Count reference to be assigned to the
   * generated tree.
   *
   * > We omit the prototype because we live in a society, we are not animals.
   */
  const count: { end: number; start: number; index: number } = create(null);
  count.end = 0;
  count.index = -1;
  count.start = 0;

  /**
   * The document source as an array list,
   * ie: source.split('')
   */
  const b = source.split('');

  /**
   * The length of the document source,
   * ie: number of characters
   */
  const c = b.length;

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Advancement reference
   */
  let a = 0;

  /**
   * Markdown flag
   */
  const sgmlflag = 0;

  /**
   * External Tag, eg: <script> or {% schema %} etc
   */
  let ext = false;

  /**
   * External Tags embedded language
   */
  let extlang = 'javascript';

  /**
   * HTML String
   */
  let html = 'html';

  /**
   * Whether or not we are currently within a Template Tag expression in an HTML attribute.
   */
  let ttexp = false;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  function getLiquidTagName (input: string) {

    const begin = input.indexOf('{');
    const token = is(input[begin + 2], cc.DSH)
      ? input.slice(begin + 3).trimStart()
      : input.slice(begin + 2).trimStart();

    return token.slice(0, token.search(/\s/));

  }

  function isLiquidOutput (input: string) {

    const begin = input.indexOf('{');

    return is(input[begin + 1], cc.LCB);

  }

  function isLiquidStart (input: string) {

    const begin = input.indexOf('{');

    if (is(input[begin + 1], cc.PER)) {

      let token = is(input[begin + 2], cc.DSH)
        ? input.slice(begin + 3).trimStart()
        : input.slice(begin + 2).trimStart();

      token = token.slice(0, token.search(/\s/));

      if (token.startsWith('end')) return false;

      return grammar.liquid.tags.has(token);

    }

    return false;
  }

  function isLiquidEnd (input: string | string[]) {

    let token = input as string;

    if (Array.isArray(input)) token = input.join('');

    const begin = token.indexOf('{');

    if (is(token[begin + 1], cc.PER)) {
      if (is(token[begin + 2], cc.DSH)) return token.slice(begin + 3).trimStart().startsWith('end');
      return token.slice(begin + 2).trimStart().startsWith('end');
    }

    return false;

  }

  /**
   * Checks where the provided string contains Liquid
   * delimiters. Optionally accepts a `where` parameter
   * which allows for checking start, end, both or containment.
   *
   * Where Parameter
   *
   * - `1` Check starting delimiters, eg: `{{`, `%}`
   * - `2` Check ending delimiters, eg: `}}`, `%}`
   * - `3` Check starting and ending delimiters
   * - `4` Check if input contains starting delimiters
   * - `5` Check if input contains starting and ending delimiters
   */
  function isLiquid (input: string, direction: 1 | 2 | 3 | 4 | 5): boolean {

    if (direction === 1) {

      return is(input[0], cc.LCB) && (
        is(input[1], cc.PER) ||
        is(input[1], cc.LCB)
      );

    } else if (direction === 2) {

      return is(input[input.length - 1], cc.RCB) && (
        is(input[input.length - 2], cc.PER) ||
        is(input[input.length - 2], cc.LCB)
      );

    } else if (direction === 3) {
      return (
        is(input[0], cc.LCB) && (
          is(input[1], cc.PER) ||
          is(input[1], cc.LCB)
        )
      ) && (
        is(input[input.length - 1], cc.RCB) && (
          is(input[input.length - 2], cc.PER) ||
          is(input[input.length - 2], cc.LCB)
        )
      );

    } else if (direction === 4) {

      return /{[{%}]/.test(input);

    } else if (direction === 5) {

      return (/{[{%]/.test(input) && /[%}]}/.test(input));

    }

  }

  /**
   * Pads template tag delimters with a space. This function
   * was updated to also support whitespace dashes:
   *
   * - `{{` or `{{-`
   * - `{%` or`{%-`
   * - `}}` or `-}}`
   * - `%}`or `-%}`
   *
   * ---
   *
   * Original: `lexer_markup_bracketSpace`
   */
  function bracketSpace (input: string) {

    if (options.language !== 'xml' && options.language !== 'jsx') {

      const spaceStart = (start: string) => start.replace(/\s*$/, ' ');
      const spaceEnd = (end: string) => end.replace(/^\s*/, ' ');

      if ((/(?:{[=#/]|%[>\]])|\}%[>\]]/).test(input)) return input;

      input = input.replace(/{[{%]-?\s*/g, spaceStart);
      input = input.replace(/\s*-?[%}]}/g, spaceEnd);

      return input;

    }

    return input;

  };

  /**
   * Pushes a record into the parse table
   *
   * ---
   * Original: lexer_markup_recordPush
   */
  function recordpush (target: Data, record: Record, structure: string) {

    if (target === data) {
      if (record.types.indexOf('end') > -1) {
        count.end = count.end + 1;
      } else if (record.types.indexOf('start') > -1) {
        count.start = count.start + 1;
      }
    }

    // console.log(target, record, structure);

    parse.push(target, record, structure);

  };

  /**
   * Find the lowercase tag name of the provided token.
   *
   * ---
   * Original: lexer_markup_tagName
   */
  function tagName (tag: string) {

    /**
     * The index of the whitespace character
     */
    let space = 0;

    /**
     * The actual tag name
     */
    let name = '';

    /**
     * Delimeter expression match
     *
     */
    const reg: RegExp = (/^(?:<|{%-?|{{-?)=?\s*/);

    if (typeof tag !== 'string') return '';

    space = tag.replace(reg, '%').replace(/\s+/, ' ').indexOf(' ');
    name = tag.replace(reg, ' ');
    name = (space < 0) ? name.slice(1, tag.length - 1) : name.slice(1, space);

    if (html === 'html') name = name.toLowerCase();

    name = name.replace(/-?[%}]}$/, '');

    if (name.indexOf('(') > 0) name = name.slice(0, name.indexOf('('));

    if (name === '?xml?') return 'xml';

    return name;

  };

  /**
   * Utility function fixer for HTML missing end tags
   *
   * ---
   * Original: lexer_markup_fixHtmlEnd
   */
  function fixHtmlEnd (element: string, end: boolean) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    /**
     * The tag name
     */
    const tname = tagName(element);

    /**
     * Parse record - This is generated as a drop-in as
     * this function is a fix utility that borders "linting"
     */
    const record: Record = create(null); // fuck the prototype

    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = 'markup';
    record.lines = data.lines[parse.count] > 0 ? 1 : 0;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
    record.types = 'end';

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    recordpush(data, record, '');

    if (grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) && (
      (end === true && parse.structure.length > 1) ||
      (end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname)
    )) {

      do {

        record.begin = parse.structure[parse.structure.length - 1][1];
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;

        recordpush(data, record, '');

      } while (grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) && (
        (end === true && parse.structure.length > 1) ||
        (end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname)
      ));
    }

  };

  /**
   * Parses tags, attributes, and template elements.
   * Markup is two smaller lexers that work together:
   *
   * 1. tag - evaluates markup (ie: HTML)
   * 2. template tags - (ie: Liquid)
   * 3. content - evaluates text content and code for external lexers
   *
   * Type Definitions:
   *
   * ```none
   * START       END     TYPE
   *
   * <![CDATA[   ]]>     cdata
   * <!--        -->     comment
   * <!--[if     -->     conditional
   * text       text     content
   * <\/          >      end
   * <pre      </pre>    ignore (html only)
   * text       text     script
   * <!          >       sgml
   * <          />       singleton
   * <           >       start
   * text       text     style
   * {{          }}      template
   * {%          %}      template
   * {{          }}      template_end
   * <?xml       ?>      xml
   *
   * ```
   */
  function tag (end: string) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    const record: Record = create(null); // fuck the prototype

    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = 'markup';
    record.lines = parse.linesSpace;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = '';
    record.types = '' as any;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    /**
     * Ignore count
     */
    let igcount = 0;

    /**
     * The element string reference
     */
    let element = '';

    /**
     * The last known character of a token
     */
    let lastchar = '';

    /**
     * Last Type, ie: `start`, `template` etc etc
     */
    let ltype: Types = '';

    /**
     * Tag Name
     */
    let tname = '';

    /**
     * Starting delimeter token, ie: `{{` or `<` etc etc.
     */
    let start = '';

    /**
     * Whether or not to pass to cheat functions.
     */
    let cheat = false;

    /**
     * Whether or not to exit eary from walk
     */
    let earlyexit = false;

    /**
     * Ignored reference to skip lexing certain sources
     */
    let ignoreme = false;

    /**
     * Whether or not JavaScript comment exists
     */
    let jscom = false;

    /**
     * Whether or not attribute sorting should be applied
     */
    let nosort = false;

    /**
     * Whether or not the contents of the toke should be preserved
     */
    let preserve = false;

    /**
     * Infers a simple lex to be applied, typically used on easy tags
     */
    let simple = false;

    /**
     * Whether or not the tag is a singleton type, eg: `<meta>`
     */
    const singleton = false; // TODO - Remove this it does nothing

    /**
     * Attribute store reference
     */
    let attstore: [string, number][] = [];

    /**
     * Comment related reference (unsure of its use)
     */
    let comm = [ '', 0 ];

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

    /**
     * Returns the markup attribute name reference and
     * its value reference. This is determined by an `=`
     * character and quotation character separator, the
     * return type is an array, where index `0` is attr
     * name and index `1` is attribute value.
     *
     * > When a _void_ attribute exists an empty string
     * is returned for index `1`.
     */
    function attrname (x: string) {

      const eq = x.indexOf('=');

      if (eq > 0 && (
        (eq < x.indexOf('"') && x.indexOf('"') > 0) ||
        (eq < x.indexOf("'") && x.indexOf("'") > 0)
      )) {
        return [
          x.slice(0, eq),
          x.slice(eq + 1)
        ];
      }

      return [ x, '' ];

    };

    // attribute parser
    // lexer_markup_tag_attributeRecord
    function attrecord () {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * The index of data record in the tree
       */
      const begin = parse.count;

      /**
       * The tag name, ie: `tname`
       */
      const stack = tname.replace(/(\/)$/, '');

      /**
       * Type of quotation character to convert
       */
      const qc = options.markup.quoteConvert;

      /* -------------------------------------------- */
      /* LOCAL SCOPES                                 */
      /* -------------------------------------------- */

      /**
       * The current index of the attribute
       */
      let idx = 0;

      /**
       * Equals `=` operator index in the token
       */
      let eq = 0;

      /**
       * Double quotation `"` index in the token
       */
      let dq = 0;

      /**
       * Single quotation `'` index in the token
       */
      // @ts-ignore
      let sq = 0;

      /**
       * The attribute name
       */
      let name = '';

      /**
       * The attribute value
       */
      let value = '';

      /**
       * Store reference (unsure what this is used for)
       */
      let store = [];

      /**
       * The amount of attributes in the store
       */
      let len = attstore.length;

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Converts quotation characters
       */
      function convertq () {

        if (
          ignoreme === true ||
          qc === 'none' ||
          record.types !== 'attribute' ||
          (qc === 'single' && record.token.indexOf('"') < 0) ||
          (qc === 'double' && record.token.indexOf("'") < 0)
        ) {

          recordpush(data, record, '');

        } else {

          let ee = 0;
          let inner = false;

          const chars = record.token.split('');
          const eq = record.token.indexOf('=');
          const len = chars.length - 1;

          if (
            not(chars[eq + 1], cc.DQO) &&
            not(chars[chars.length - 1], cc.DQO) &&
            qc === 'single'
          ) {

            recordpush(data, record, '');

          } else if (
            not(chars[eq + 1], cc.SQO) &&
            not(chars[chars.length - 1], cc.SQO) &&
            qc === 'double'
          ) {

            recordpush(data, record, '');

          } else {

            ee = eq + 2;

            if (qc === 'double') {
              if (record.token.slice(eq + 2, len).indexOf('"') > -1) inner = true;
              chars[eq + 1] = '"';
              chars[chars.length - 1] = '"';
            } else {
              if (record.token.slice(eq + 2, len).indexOf("'") > -1) inner = true;
              chars[eq + 1] = "'";
              chars[chars.length - 1] = "'";
            }

            if (inner === true) {
              do {

                if (chars[ee] === "'" && qc === 'single') {
                  chars[ee] = '"';
                } else if (chars[ee] === '"' && qc === 'double') {
                  chars[ee] = "'";
                }

                ee = ee + 1;

              } while (ee < len);
            }

            record.token = chars.join('');
            recordpush(data, record, '');

          }
        }
      };

      /**
       * Sample is attribute value
       * Token is the captured token
       */
      function liquidAttributes (sample: string, token: string) {

        if (isLiquidStart(token)) {

          const ttname = getLiquidTagName(token);

          if (grammar.liquid.tags.has(ttname)) {

            record.types = 'template_attribute_start';
            record.stack = ttname;
            parse.structure.push([ record.stack, parse.count ]);

          }

          record.token = token;

          convertq();
          return;

        } else if (isLiquidEnd(token)) {

          record.types = 'template_attribute_end';
          record.token = token;
          parse.structure.pop();

          convertq();
          return;

        } else if (isLiquid(sample, 1)) {

          record.types = 'template_attribute';

        } else if (is(sample[0], cc.LAN)) {

          record.types = 'template_attribute';

        }

        record.token = token;
        convertq();
        record.types = 'attribute';

      };

      /* -------------------------------------------- */
      /* BEGIN                                        */
      /* -------------------------------------------- */

      if (attstore.length < 1) return;

      // fix for singleton tags, since "/" at the end of the tag is not an attribute
      if (is(attstore[attstore.length - 1][0], cc.FWS)) {
        attstore.pop();
        element = element.replace(/>$/, '/>');
      }

      // reconnects attribute names to their respective values if separated on "="
      eq = attstore.length;
      dq = 1;

      if (dq < eq) {

        do {

          name = attstore[dq - 1][0];

          if (name.charAt(name.length - 1) === '=' && attstore[dq][0].indexOf('=') < 0) {
            attstore[dq - 1][0] = name + attstore[dq][0];
            attstore.splice(dq, 1);
            eq = eq - 1;
            dq = dq - 1;
          }

          dq = dq + 1;

        } while (dq < eq);
      }

      // sort the attributes
      if (
        (options.markup.attributeSort === true) &&
        options.language !== 'jsx' &&
        options.language !== 'tsx' &&
        jscom === false &&
        nosort === false
      ) {

        // if making use of the 'options.attributeSortList` option
        if (asl > 0) {

          const tempstore = [];

          dq = 0;
          eq = 0;
          len = attstore.length;

          // loop through the options.attributeSortList looking for attribute name matches
          do {

            // loop through the attstore
            eq = 0;

            do {

              name = attstore[eq][0].split('=')[0];

              if (options.markup.attributeSortList[dq] === name) {
                tempstore.push(attstore[eq]);
                attstore.splice(eq, 1);
                len = len - 1;
                break;
              }

              eq = eq + 1;
            } while (eq < len);

            dq = dq + 1;

          } while (dq < asl);

          attstore = parse.safeSort(attstore, '', false);
          attstore = tempstore.concat(attstore);
          len = attstore.length;

        } else {
          attstore = parse.safeSort(attstore, '', false);
        }
      }

      record.begin = begin;
      record.stack = stack;
      record.types = 'attribute';

      store = [];

      if (idx < len) {

        do {

          if (attstore[idx] === undefined) break;

          attstore[idx][0] = attstore[idx][0].replace(/\s+$/, '');

          record.lines = attstore[idx][1];

          eq = attstore[idx][0].indexOf('=');
          dq = attstore[idx][0].indexOf('"');

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          sq = attstore[idx][0].indexOf("'");

          if (/^\/(\/|\*)/.test(attstore[idx][0]) && options.language === 'jsx') {

            record.types = 'comment_attribute';
            record.token = attstore[idx][0];

            convertq();

          } else if (eq < 0) {

            // in most markup languages an attribute without an expressed value has its name
            // as its string value

            // Lets look for a template tag
            // The 2nd character should be a percentage %
            //

            if (isLiquid(attstore[idx][0], 5)) {

              if (is(attstore[idx][0][1], cc.LCB) || isLiquidOutput(attstore[idx][0])) {

                record.types = 'template_attribute';
                record.token = attstore[idx][0];
                //  record.stack = parse.structure[parse.structure.length - 1][0];
                // record.begin = parse.structure[parse.structure.length - 1][1];

                //  record.begin = parse.structure[parse.structure.length - 1][1];
                // record.stack = parse.structure[parse.structure.length - 1][0];

              } else {

                if (isLiquidEnd(attstore[idx][0])) {

                  record.token = attstore[idx][0];
                  record.types = 'template_attribute_end';
                  record.ender = record.begin;
                  //   record.begin = parse.structure[parse.structure.length - 1][1];
                  // record.stack = parse.structure[parse.structure.length - 1][0];

                  //  parse.structure.pop();

                } else {

                  const ttname = getLiquidTagName(attstore[idx][0]);

                  if (grammar.liquid.tags.has(ttname)) {
                    record.types = 'template_attribute_start';
                    // record.stack = ttname;
                    record.begin = parse.count;
                    record.token = attstore[idx][0];
                    // parse.structure.push([ record.stack, parse.count ]);

                  } else if (grammar.liquid.else.has(ttname)) {

                    record.types = 'template_attribute_else';
                    // record.begin = parse.structure[parse.structure.length - 1][1];
                    // record.stack = parse.structure[parse.structure.length - 1][0];
                    record.token = attstore[idx][0];

                    // console.log('begin', parse.structure[parse.structure.length - 1][0]);
                  }
                }
              }

              recordpush(data, record, '');

              // console.log(attstore);

              // recordpush(data, record, '');
              // console.log(record);

            } else {

              record.types = 'attribute';

              if (
                is(attstore[idx][0], cc.HSH) ||
                is(attstore[idx][0], cc.LSB) ||
                is(attstore[idx][0], cc.LCB) ||
                is(attstore[idx][0], cc.LPR) ||
                options.language === 'jsx' ||
                options.language === 'tsx'
              ) {
                record.token = attstore[idx][0];
              } else {
                record.token = attstore[idx][0].toLowerCase();
              }

              convertq();
            }

          } else {

            // separates out the attribute name from its value

            name = attstore[idx][0].slice(0, eq);
            value = attstore[idx][0].slice(eq + 1);

            if (
              options.markup.correct && (
                not(value[0], cc.LAN) ||
                not(value[0], cc.LCB) ||
                not(value[0], cc.EQS) ||
                not(value[0], cc.DQO) ||
                not(value[0], cc.SQO)
              )
            ) {
              value = '"' + value + '"';
            }

            if (options.language === 'jsx' && /^\s*\{/.test(value)) {

              record.token = name + '={';
              record.types = 'jsx_attribute_start';

              recordpush(data, record, 'jsx_attribute');

              prettify.lexers.script(value.slice(1, value.length - 1));
              record.begin = parse.count;

              if (/\s\}$/.test(value)) {

                value = value.slice(0, value.length - 1);
                value = /\s+$/.exec(value)[0];

                if (value.indexOf('\n') < 0) {
                  record.lines = 1;
                } else {
                  record.lines = value.split('\n').length;
                }

              } else {
                record.lines = 0;
              }

              record.begin = parse.structure[parse.structure.length - 1][1];
              record.stack = parse.structure[parse.structure.length - 1][0];
              record.token = '}';
              record.types = 'jsx_attribute_end';

              convertq();

              record.types = 'attribute';
              record.begin = begin;
              record.stack = stack;

            } else if (isLiquid(name, 5)) {

              name = name + '=' + value;

              liquidAttributes(
                value.replace(/^(["'])/, '').replace(/(["'])$/, ''),
                name.replace(/(\s+)$/, '')
              );

            } else {

              record.types = 'attribute';

              if (
                is(attstore[idx][0], cc.HSH) ||
                is(attstore[idx][0], cc.LSB) ||
                is(attstore[idx][0], cc.LCB) ||
                is(attstore[idx][0], cc.LPR) ||
                options.language === 'jsx' ||
                options.language === 'tsx'
              ) {
                record.token = attstore[idx][0];
              } else {
                record.token = attstore[idx][0].toLowerCase();
              }

              convertq();

            }
          }

          idx = idx + 1;

        } while (idx < len);

      }

      if (store.length > 0) {

        record.token = store.join(' ');
        convertq();
      }

    };

    ext = false;

    /* -------------------------------------------- */
    /* DELIMITER PARSE                              */
    /* -------------------------------------------- */

    /**
     * DELIMITERS
     *
     * This complex series of conditions determines an elements delimiters look to
     * the types being pushed to quickly reason about the logic no type is pushed
     * for start tags or singleton tags just yet some types set the `preserve` flag,
     * which means to preserveLine internal white space The `nopush` flag is set when
     * Data tags are to be ignored and forgotten
     *
     * ---
     * @prettify
     *
     * The vast majoirty of delimiter checks were purged, we only want those relative
     * to Prettify.
     */
    if (end === '---') {

      start = '---';
      ltype = 'comment';

    } else if (is(b[a], cc.LAN)) {

      if (b[a + 1] === '/') {

        end = '>';
        ltype = 'end';

      } else if (b[a + 1] === '!') {

        if ((
          b[a + 2] === 'd' || b[a + 2] === 'D'
        ) && (
          b[a + 3] === 'o' || b[a + 3] === 'O'
        ) && (
          b[a + 4] === 'c' || b[a + 4] === 'C'
        ) && (
          b[a + 5] === 't' || b[a + 5] === 'T'
        ) && (
          b[a + 6] === 'y' || b[a + 6] === 'Y'
        ) && (
          b[a + 7] === 'p' || b[a + 7] === 'P'
        ) && (
          b[a + 8] === 'e' || b[a + 8] === 'E'
        )) {

          end = '>';
          ltype = 'doctype';
          preserve = true;

        } else if (b[a + 2] === '-' && b[a + 3] === '-') {

          end = '-->';
          ltype = 'comment';
          start = '<!--';

        } else if (
          b[a + 2] === '[' &&
            b[a + 3] === 'C' &&
            b[a + 4] === 'D' &&
            b[a + 5] === 'A' &&
            b[a + 6] === 'T' &&
            b[a + 7] === 'A' &&
            b[a + 8] === '['
        ) {

          end = ']]>';
          ltype = 'cdata';
          preserve = true;

        }

      } else if (b[a + 1] === '?') {

        end = '?>';

        if (
          b[a + 2] === 'x' &&
            b[a + 3] === 'm' &&
            b[a + 4] === 'l'
        ) {
          ltype = 'xml';
          simple = true;
        } else {
          preserve = true;
          ltype = 'template';
        }

      } else if (is(b[a + 1], cc.PER)) {

        preserve = true;

      } else if ((
        b[a + 1] === 'p' || b[a + 1] === 'P'
      ) && (
        b[a + 2] === 'r' || b[a + 2] === 'R'
      ) && (
        b[a + 3] === 'e' || b[a + 3] === 'E'
      ) && (
        b[a + 4] === '>' || /\s/.test(b[a + 4])
      )) {

        end = '</pre>';
        ltype = 'ignore';
        preserve = true;

      } else {

        simple = true;
        end = '>';

      }
    } else if (is(b[a], cc.LCB)) {

      if (options.language === 'jsx') {
        ext = true;
        earlyexit = true;
        record.token = '{';
        record.types = 'script_start';
        parse.structure.push([ 'script', parse.count ]);
        recordpush(data, record, '');
        return;
      }

      if (is(b[a + 1], cc.LCB)) {
        preserve = true;
        end = '}}';
        ltype = 'template';

      } else if (is(b[a + 1], cc.PER)) {

        preserve = true; // Required for  lexer
        end = '%}';
        ltype = 'template';

        /**
         * `}` - The index of the next Right Curly brace
         */
        const rcb = b.indexOf('}', a + 2);

        /**
         * Liquid Comment
         *
         * Lets ensure that we have a closing delimiter
         * character before moving ahead, eg: `%}` and
         * then we will look for comment keywords.
         */
        if (b[rcb - 1].charCodeAt(0) === cc.PER) {

          let t = b.slice(a + 2, rcb - 1).join('');

          // Lets make sure we do not interfere with dash delimiters
          //
          if (t.charCodeAt(0) === cc.DSH) {
            start = '{%-';
            t = t.slice(1).trimStart();
          } else {
            start = '{%';
            t = t.trimStart();
          }

          // Same as above but for closing delimiters
          //
          if (t.charCodeAt(t.length - 1) === cc.DSH) {
            end = '-%}';
            t = t.slice(0, t.length - 1).trimEnd();
          } else {
            end = '%}';
            t = t.trimEnd();
          }

          // Lets look for the comment keyword before proceeding,
          // We are skipping ahead from the normal parse here.
          //
          if (t === 'comment') {

            /**
               * `{%` The index of the next known closing delimiter
               * starting from the last `rcb` index position.
               */
            const idx1 = source.indexOf('{%', rcb);

            //  Lets reference this index
            //
            let idx2 = idx1;

            // Lets make sure to consume and whitespace dash
            // characters that might be defined
            //
            if (b[idx1 + 1].charCodeAt(0) === cc.DSH) idx2 = idx1 + 1;

            // Lets now look the starting index of the `endcomment` keyword
            //
            idx2 = source.indexOf('endcomment', idx2);

            if (idx2 > 0) {

              idx2 = b.indexOf('}', idx2);

              if (idx2 > 0 && b[idx2 - 1].charCodeAt(0) === cc.PER) {

                ltype = 'comment';
                start = b.slice(a, rcb + 1).join('');
                end = b.slice(idx1, idx2 + 1).join('');

              }
            }
          }

        } else {
          preserve = true;
          end = '%}';
          ltype = 'template';

        }

      } else {
        preserve = true;
        end = b[a + 1] + '}';
        ltype = 'template';
      }
    }

    if (options.markup.preserveAttributes === true) preserve = true;
    if (earlyexit) return;

    // This is the real tag lexer.
    // Everything that follows is attribute handling and
    // edge cases
    lastchar = end.charAt(end.length - 1);

    // console.log(ltype, b[a] + b[a + 1] + b[a + 2] + b[a + 3]);

    // HTML / Liquid Prettify comment ignore
    //
    if (ltype === 'comment' && (is(b[a], cc.LAN) || (is(b[a], cc.LCB) && is(b[a + 1], cc.PER)))) {

      comm = parse.wrapCommentBlock({
        chars: b,
        end: c,
        lexer: 'markup',
        opening: start,
        start: a,
        terminator: end
      });

      element = comm[0] as string;
      a = comm[1] as number;

      // console.log(comm);

      if (element.replace(start, '').trimStart().indexOf('@prettify-ignore-start') === 0) {
        record.token = element;
        record.types = 'ignore';
        recordpush(data, record, '');
        return;
      }

    } else if (a < c) {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * Liquid attribute store
       */
      const liqattr = [];

      /**
       * Lexing store
       */
      const lex = [];

      /* -------------------------------------------- */
      /* REFERENCES                                   */
      /* -------------------------------------------- */

      let bcount = 0;
      let braccount = 0;
      let jsxcount = 0;
      let e = 0;
      let f = 0;

      /**
       * Parenthesis counts
       */
      let parncount = 0;

      /**
       * Line count - This is applied to the data structure
       */
      let lines = 0;

      /**
       * The quotation character store reference
       */
      let quote = '';

      /**
       * JSX quotataion character
       */
      let jsxquote = '';

      /**
       * Whether or not we should invoke a whitespace test
       */
      let stest = false;

      /**
       * Whether or not we should invoke a quotation test
       */
      let quotetest = false;

      /**
       * Whether or not we are within a Liquid template token
       */
      let inliq = false;

      /**
       * Attribute store
       */
      let attribute = [];

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Informs whether or not we are currently withina Liquid token. We
       * need to ensure we know when we are within template tags so as to prevent
       * parse failures from occuring when specific characters are detected in
       * tokens like the `<` or `>` characters which cause the lex to fail because
       * it assume that we hace ended the HTML tag.
       */
      function inliquid () {

        if (inliq === false && is(b[a - 1], cc.LCB) && (
          is(b[a], cc.LCB) ||
          is(b[a], cc.PER)
        )) {

          return true;

        } else if (inliq === true && is(b[a], cc.RCB) && (
          is(b[a - 1], cc.RCB) ||
          is(b[a - 1], cc.PER)
        )) {

          return false;

        }

        return inliq;

      }

      /**
       * Finds slash escape sequences
       *
       * ---
       * Original: lexer_markup_tag_escslash
       */
      function escslash () {

        let x = a;

        do { x = x - 1; } while (b[x] === '\\');

        x = a - x;

        return x % 2 === 1;

      };

      /**
       * Attribute Lexer
       * ---
       * Original: lexer_markup_tag_lexattr
       */
      function lexattr (quotes: boolean) {

        let name: string[];
        let attr = '';
        let aa = 0;
        let bb = 0;

        const ignoreattr = 'data-prettify-ignore';

        if (quotes === true) {

          attr = attribute.join('');
          name = attrname(attr);
          quote = '';

          // HOT PATCH
          //
          // Replaced the attribute ignore logic for 'data-parse-ignore' to
          // data-prettify-ignore and also removed 'data-prettydiff-ignore'
          if (name[0] === ignoreattr) ignoreme = true;

        } else {

          attr = attribute.join('');

          if (options.language !== 'jsx' || (options.language === 'jsx' && attr.charAt(attr.length - 1) !== '}')) {
            attr = attr.replace(/\s+/g, ' ');
          }

          name = attrname(attr);

          if (name[0] === ignoreattr) ignoreme = true;
          if (options.language === 'jsx' && attribute[0] === '{' && attribute[attribute.length - 1] === '}') {
            jsxcount = 0;
          }
        }

        if ((
          is(attr[0], cc.LCB) &&
          is(attr[1], cc.PER)
        )) nosort = true;

        if (ttexp === false && isLiquidStart(attr)) {
          ttexp = true;
        } else if (ttexp === true && isLiquidEnd(attr)) {
          ttexp = false;
        }

        attr = attr.replace(/^\u0020/, '').replace(/\u0020$/, '');
        attribute = attr.replace(/\r\n/g, '\n').split('\n');
        bb = attribute.length;

        if (aa < bb) {
          do {
            attribute[aa] = attribute[aa].replace(/(\s+)$/, '');
            aa = aa + 1;
          } while (aa < bb);
        }

        attr = attribute.join(options.crlf === true ? '\r\n' : '\n');
        attr = bracketSpace(attr);

        // PATCH
        // EXPRESSION LINES
        if (ttexp === true || (
          is(attr[0], cc.LCB) && (
            is(attr[1], cc.PER) ||
           is(attr[1], cc.LCB)
          )
        )) {

          // lines = ws(b[a + 1]) ? b[a + 1] === '\n' ? 2 : 1 : 0;
          // console.log(lines, attr, JSON.stringify(b[a + 1]));
          // lines = b[a + 1] === '\n' ? 2 : b[a + 1] === ' ' ? 1 : 0;

          // console.log('IN ATTR LEXER', attr, ttexp);
        }

        if (attr === '=') {

          attstore[attstore.length - 1][0] = `${attstore[attstore.length - 1][0]}=`;

        } else if (
          is(attr[0], cc.EQS) &&
          attstore.length > 0 &&
          attstore[attstore.length - 1][0].indexOf('=') < 0
        ) {

          // if an attribute starts with a `=` then adjoin it to the last attribute
          attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + attr;

        } else if (
          not(attr[0], cc.EQS) &&
          attstore.length > 0 &&
          attstore[attstore.length - 1][0].indexOf('=') === attstore[attstore.length - 1][0].length - 1
        ) {

          // if an attribute follows an attribute ending with `=` then adjoin it to the
          // last attribute
          attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + attr;

        } else if (attr !== '' && attr !== ' ') {

          attstore.push([ attr, lines ]);

        }

        if (attstore.length > 0) {

          const [ value ] = attstore[attstore.length - 1];

          if (value.indexOf('=\u201c') > 0) { // “
            parse.error = `Invalid quote character (\u201c, &#x201c) used on line number ${parse.lineNumber}`;
          } else if (value.indexOf('=\u201d') > 0) { // ”
            parse.error = `Invalid quote character (\u201d, &#x201d) used on line number ${parse.lineNumber}`;
          }

        }

        attribute = [];
        lines = b[a] === '\n' ? 2 : 1;

      };

      do {

        if (is(b[a], cc.NWL)) {
          lines = lines + 1;
          parse.lineNumber = parse.lineNumber + 1;
        }

        if (preserve === true || ((ws(b[a]) === false && not(quote, cc.RCB)) || is(quote, cc.RCB))) {

          inliq = inliquid();
          lex.push(b[a]);

          if (
            is(lex[0], cc.LAN) &&
            is(lex[1], cc.RAN) &&
            is(end, cc.RAN)
          ) {
            record.token = '<>';
            record.types = 'start';
            recordpush(data, record, '(empty)');
            return;
          }

          if (
            is(lex[0], cc.LAN) &&
            is(lex[1], cc.FWS) &&
            is(lex[2], cc.RAN) &&
            is(end, cc.RAN)
          ) {
            record.token = '</>';
            record.types = 'end';
            recordpush(data, record, '');
            return;
          }
        }

        if (
          ltype === 'cdata' &&
          is(b[a], cc.RAN) &&
          b[a - 1] === ']' &&
          b[a - 2] !== ']'
        ) {
          parse.error = `CDATA tag (${lex.join('')}) not properly terminated with "]]>"`;
          break;
        }

        if (ltype === 'comment') {

          quote = '';

          // comments must ignore fancy encapsulations and attribute parsing
          if (b[a] === lastchar && lex.length > end.length + 1) {

            // if current character matches the last character of the tag ending sequence
            f = lex.length;
            e = end.length - 1;

            if (e > -1) {
              do {
                f = f - 1;
                // console.log(lex[f], end.charAt(e));
                if (lex[f] !== end.charAt(e)) break;
                e = e - 1;
              } while (e > -1);
            }

            if (e < 0) break;

          }
        } else {

          if (quote === '') {

            if (
              is(lex[0], cc.LAN) &&
              is(lex[1], cc.BNG) &&
              ltype !== 'cdata'
            ) {

              // HOT PATCH
              // Fixes doctype handling
              if (ltype === 'doctype' && is(b[a], cc.RAN)) break;

              // console.log(lex[0] + lex[1] + lex[2] + lex[3] + lex[4] + lex[5])
              if (b[a] === '[') {

                if (is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }

                if (ws(b[a + 1])) {
                  do {
                    a = a + 1;
                    if (b[a] === '\n') {
                      lines = lines + 1;
                    }
                  } while (a < c - 1 && ws(b[a + 1]));
                }

                if (is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }
              }

            }

            if (options.language === 'jsx') {
              if (is(b[a], cc.LCB)) {
                jsxcount = jsxcount + 1;
              } else if (is(b[a], cc.RCB)) {
                jsxcount = jsxcount - 1;
              }
            }

            if (
              is(b[a], cc.LAN) &&
              preserve === false &&
              lex.length > 1 &&
              end !== '>>' &&
              end !== '>>>' &&
              simple === true
            ) {
              parse.error = `Parse error (line ${parse.lineNumber}) on: ${lex.join('')}`;
            }

            if (
              stest === true &&
              ws(b[a]) === false &&
              b[a] !== lastchar
            ) {

              // attribute start
              stest = false;
              quote = jsxquote;
              igcount = 0;

              lex.pop();

              if (a < c) {

                do {

                  if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

                  if (options.markup.preserveAttributes === true) {
                    lex.push(b[a]);
                  } else {
                    attribute.push(b[a]);
                  }

                  if (
                    (options.language !== 'jsx' || options.language !== 'tsx') && (
                      is(b[a], cc.LAN) ||
                      is(b[a], cc.RAN)
                    ) && (
                      quote === '' ||
                      quote === '>'
                    )
                  ) {

                    if (quote === '' && is(b[a], cc.RAN)) {
                      quote = '>';
                      braccount = 1;
                    } else if (is(quote, cc.RAN)) {
                      if (is(b[a], cc.LAN)) {
                        braccount = braccount + 1;
                      } else if (b[a] === '>') {
                        braccount = braccount - 1;
                      }
                    }

                  } else if (quote === '') {

                    if (b[a + 1] === lastchar) {

                      // if at end of tag
                      if (
                        is(attribute[attribute.length - 1], cc.FWS) ||
                        (is(attribute[attribute.length - 1], cc.QWS) && ltype === 'xml')
                      ) {
                        attribute.pop();
                        if (preserve === true) lex.pop();
                        a = a - 1;
                      }

                      if (attribute.length > 0) lexattr(false);
                      break;
                    }

                    if (preserve === false && /^=?['"]?({{|{%|\/|\^|<)/.test(b[a] + b[a + 1] + b[a + 2] + b[a + 3])) {

                      attribute.pop();

                      if (
                        attribute.length > 0 &&
                        not(b[a], cc.EQS) &&
                        not(b[a], cc.LCB) && (not(b[a + 1], cc.LCB) || not(b[a + 1], cc.PER))
                      ) {

                        lexattr(false);

                      }

                      quote = '';

                      do {

                        attribute.push(b[a]);
                        inliq = inliquid();

                        // console.log(b[a], liqattr[liqattr.length - 1], liqattr);

                        if (b[a] === liqattr[liqattr.length - 1]) {

                          liqattr.pop();

                          if (is(b[a], cc.RCB) && is(b[a + 1], cc.RCB)) {
                            attribute.push('}');
                            a = a + 1;
                          }

                          if (liqattr.length < 1) {

                            // Captures attribute expression like:
                            //
                            // data-{{  }}
                            // data{% if %}
                            //
                            if (ttexp === false && is(b[a], cc.RCB) && not(attribute[0], cc.LCB) && (
                              not(attribute[1], cc.PER) ||
                              not(attribute[1], cc.LCB)
                            )) {
                              lexattr(false);
                              inliq = !inliq;
                              //  b[a] = ' ';
                              break;
                            }

                            // Captures chained attributes on the ender tokens
                            //
                            // {% endif %}-attr
                            //
                            if (ttexp === true && isLiquidEnd(attribute)) {

                              if (ws(b[a + 1])) {
                                lexattr(false);
                                // b[a] = ' ';
                                break;

                              } else {
                                a = a + 1;
                                break;
                              }
                            }

                            lexattr(false);
                            b[a] = ' ';
                            break;

                          }

                        } else if ((
                          is(b[a], cc.DQO) ||
                          is(b[a], cc.SQO)
                        ) &&
                          not(liqattr[liqattr.length - 1], cc.DQO) &&
                          not(liqattr[liqattr.length - 1], cc.SQO)
                        ) {

                          liqattr.push(b[a]);

                        } else if (
                          not(liqattr[liqattr.length - 1], cc.RCB) &&
                          is(b[a], cc.LCB) && (
                            is(b[a + 1], cc.LCB) ||
                            is(b[a + 1], cc.PER)
                          )
                        ) {

                          liqattr.push('}');

                        } else if (
                          inliq === false &&
                          is(b[a], cc.LAN) &&
                          not(liqattr[liqattr.length - 1], cc.RAN)
                        ) {

                          liqattr.push('>');

                        }

                        a = a + 1;

                      } while (a < c);

                    } else if (
                      is(b[a], cc.LCB) &&
                      is(b[a - 1], cc.EQS) &&
                      options.language !== 'jsx'
                    ) {

                      quote = '}';

                    } else if (
                      is(b[a], cc.DQO) ||
                      is(b[a], cc.SQO)
                    ) {

                      quote = b[a];

                      if (is(b[a - 1], cc.EQS) && (
                        is(b[a + 1], cc.LAN) || (
                          is(b[a + 1], cc.LCB) &&
                          is(b[a + 2], cc.PER)
                        ) || (
                          ws(b[a + 1]) &&
                          not(b[a - 1], cc.EQS)
                        )
                      )) {

                        igcount = a;

                      }

                    } else if (is(b[a], cc.LPR)) {

                      quote = ')';
                      parncount = 1;

                    } else if (options.language === 'jsx') {

                      // jsx variable attribute
                      if ((is(b[a - 1], cc.EQS) || ws(b[a - 1])) && is(b[a], cc.LCB)) {

                        quote = '}';
                        bcount = 1;

                      } else if (is(b[a], cc.FWS)) {

                        // jsx comments
                        if (b[a + 1] === '*') {
                          quote = '\u002a/';
                        } else if (b[a + 1] === '/') {
                          quote = '\n';
                        }

                      }

                    } else if (
                      is(lex[0], cc.LCB) &&
                      is(b[a], cc.LCB) && (
                        is(b[a + 1], cc.LCB) ||
                        is(b[a + 1], cc.PER)
                      )
                    ) {

                      // opening embedded template expression
                      if (is(b[a + 1], cc.LCB)) {
                        quote = '}}';
                      } else {
                        quote = b[a + 1] + '}';
                      }
                    }

                    if (ws(b[a]) && quote === '') {

                      // Testing for a run of spaces between an attribute's = and a quoted value.
                      // Unquoted values separated by space are separate attributes
                      //
                      if (is(attribute[attribute.length - 2], cc.EQS)) {

                        e = a + 1;

                        if (e < c) {
                          do {

                            if (ws(b[e]) === false) {
                              if (is(b[e], cc.DQO) || is(b[e], cc.SQO)) {
                                a = e - 1;
                                quotetest = true;
                                attribute.pop();
                              }
                              break;
                            }

                            e = e + 1;
                          } while (e < c);
                        }
                      }

                      if (quotetest === true) {

                        quotetest = false;

                      } else if (jsxcount === 0 || (jsxcount === 1 && is(attribute[0], cc.LCB))) {

                        // If there is an unquoted space attribute is complete
                        //
                        attribute.pop();
                        lexattr(false);
                        stest = true;

                        break;
                      }
                    }
                  } else if (is(b[a], cc.LPR) && is(quote, cc.RPR)) {

                    parncount = parncount + 1;

                  } else if (is(b[a], cc.RPR) && is(quote, cc.RPR)) {

                    parncount = parncount - 1;

                    if (parncount === 0) {

                      quote = '';

                      if (b[a + 1] === end.charAt(0)) {
                        lexattr(false);
                        break;
                      }
                    }

                  } else if (
                    options.language === 'jsx' && (
                      is(quote, cc.RCB) || (
                        is(quote, cc.NWL) &&
                        is(b[a], cc.NWL)
                      ) || (
                        quote === '\u002a/' &&
                        is(b[a - 1], cc.ARS) &&
                        is(b[a], cc.FWS)
                      )
                    )
                  ) {

                    if (b[a] === '`') {

                      a = a + 1;

                      do {

                        attribute.push(b[a]);

                        if (b[a] === '`') break;

                        a = a + 1;

                      } while (a < b.length);

                      // jsxtemplate = true;
                    }

                    // jsx attributes
                    if (is(quote, cc.RCB)) {

                      if (is(b[a], cc.RCB) && b[a] !== quote) {

                        bcount = bcount + 1;

                      } else if (b[a] === quote) {

                        bcount = bcount - 1;

                        if (bcount === 0) {

                          jsxcount = 0;
                          quote = '';
                          element = attribute.join('');

                          if (options.markup.preserveAttributes === false) {
                            if (options.language === 'jsx' || options.language === 'tsx') {
                              if ((/^\s*$/).test(element) === false) attstore.push([ element, lines ]);
                            } else {
                              element = element.replace(/\s+/g, ' ');
                              if (element !== ' ') attstore.push([ element, lines ]);
                            }
                          }

                          attribute = [];
                          lines = 1;

                          break;
                        }
                      }

                    } else {

                      jsxquote = '';
                      jscom = true;
                      element = attribute.join('');

                      if (element !== ' ') attstore.push([ element, lines ]);

                      attribute = [];
                      lines = (quote === '\n') ? 2 : 1;
                      quote = '';

                      break;
                    }

                  } else if (
                    is(b[a], cc.LCB) &&
                    is(b[a + 1], cc.PER) &&
                    is(b[igcount - 1], cc.EQS) && (is(quote, cc.DQO) || is(quote, cc.SQO))
                  ) {

                    quote = quote + '{%';
                    igcount = 0;

                  } else if (
                    is(b[a - 1], cc.PER) &&
                    is(b[a], cc.RCB) && (quote === '"{%' || quote === "'{%")
                  ) {

                    quote = quote.charAt(0);
                    igcount = 0;

                  } else if (
                    is(b[a], cc.LAN) &&
                    is(end, cc.RAN) &&
                    is(b[igcount - 1], cc.EQS) && (is(quote, cc.DQO) || is(quote, cc.SQO))
                  ) {

                    quote = quote + '<';
                    igcount = 0;

                  } else if (
                    is(b[a], cc.RAN) && (
                      quote === '"<' ||
                      quote === "'<"
                    )
                  ) {

                    quote = quote.charAt(0);
                    igcount = 0;

                  } else if (
                    igcount === 0 &&
                    not(quote, cc.RAN) && (
                      quote.length < 2 || (
                        not(quote[0], cc.DQO) &&
                        not(quote[0], cc.SQO)
                      )
                    )
                  ) {

                    // terminate attribute at the conclusion of a quote pair
                    f = 0;

                    if (lex.length > 1) {
                      tname = lex[1] + lex[2];
                      tname = tname.toLowerCase();

                    }

                    e = quote.length - 1;

                    if (e > -1) {

                      do {

                        if (b[a - f].charCodeAt(0) !== quote.charCodeAt(e)) break;

                        f = f + 1;
                        e = e - 1;

                      } while (e > -1);

                    }

                    if (e < 0) {

                      lexattr(true);

                      if (b[a + 1] === lastchar) break;
                    }

                  } else if (
                    igcount > 0 &&
                    ws(b[a]) === false
                  ) {

                    igcount = 0;
                  }

                  a = a + 1;

                } while (a < c);
              }
            } else if (is(end, cc.NWL) === false && (is(b[a], cc.DQO) || is(b[a], cc.SQO))) {

              // opening quote
              quote = b[a];

            } else if (
              ltype !== 'comment' &&
              is(end, cc.NWL) === false &&
              is(b[a], cc.LAN) &&
              is(b[a + 1], cc.BNG) &&
              is(b[a + 2], cc.DSH) &&
              is(b[a + 3], cc.DSH) &&
              data.types[parse.count] !== 'conditional'
            ) {

              quote = '-->';

            } else if (
              is(b[a], cc.LCB) &&
              not(lex[0], cc.LCB) &&
              not(end, cc.NWL) && (is(b[a + 1], cc.LCB) || is(b[a + 1], cc.PER))
            ) {

              if (is(b[a + 1], cc.LCB)) {

                quote = '}}';

              } else {

                quote = b[a + 1] + '}';

                if (attribute.length < 1 && (attstore.length < 1 || ws(b[a - 1]))) {

                  lex.pop();

                  do {

                    if (is(b[a], cc.NWL)) lines = lines + 1;

                    attribute.push(b[a]);

                    a = a + 1;

                  } while (a < c && b[a - 1] + b[a] !== quote);

                  attribute.push('}');
                  attstore.push([ attribute.join(''), lines ]);

                  attribute = [];
                  lines = 1;
                  quote = '';
                }
              }

              if (quote === end) quote = '';

            } else if (
              (simple === true || ltype === 'sgml') &&
              not(end, cc.NWL) &&
              ws(b[a]) &&
              not(b[a - 1], cc.LAN)
            ) {

              // identify a space in a regular start or singleton tag
              if (ltype === 'sgml') {
                lex.push(' ');
              } else {
                stest = true;
              }

            } else if (
              simple === true &&
              options.language === 'jsx' &&
              is(b[a], cc.FWS) && (is(b[a + 1], cc.ARS) || is(b[a + 1], cc.FWS))
            ) {

              // jsx comment immediately following tag name
              stest = true;
              lex[lex.length - 1] = ' ';
              attribute.push(b[a]);

              if (is(b[a + 1], cc.ARS)) {
                jsxquote = '\u002a/';
              } else {
                jsxquote = '\n';
              }

            } else if (
              (
                b[a] === lastchar || (
                  is(end, cc.NWL) &&
                  is(b[a + 1], cc.LAN)
                )
              ) && (
                lex.length > end.length + 1 ||
                lex[0] === ']'
              ) && (
                options.language !== 'jsx' ||
                jsxcount === 0
              )
            ) {

              if (is(end, cc.NWL)) {
                if (ws(lex[lex.length - 1])) {
                  do {
                    lex.pop();
                    a = a - 1;
                  } while (ws(lex[lex.length - 1]));
                }

                break;
              }

              // if current character matches the last character of the tag ending sequence
              f = lex.length;
              e = end.length - 1;

              if (e > -1) {
                do {
                  f = f - 1;
                  if (lex[f] !== end.charAt(e)) break;
                  e = e - 1;
                } while (e > -1);
              }

              if (e < 0) break;

            }
          } else if (b[a].charCodeAt(0) === quote.charCodeAt(quote.length - 1) && (
            (
              options.language === 'jsx' &&
              is(end, cc.RCB) && (
                b[a - 1] !== '\\' ||
                escslash() === false
              )
            ) || options.language !== 'jsx' || not(end, cc.RCB))) {

            // find the closing quote or embedded template expression
            f = 0;

            if (lex.length > 1) {
              tname = lex[1] + lex[2];
              tname = tname.toLowerCase();
            }

            e = quote.length - 1;

            if (e > -1) {
              do {
                if (b[a - f] !== quote.charAt(e)) break;
                f = f + 1;
                e = e - 1;
              } while (e > -1);
            }

            if (e < 0) quote = '';

          }
        }

        a = a + 1;

      } while (a < c);

      // a correction to incomplete template tags that use multiple angle braceAllman
      if (options.markup.correct === true) {

        if (
          is(b[a + 1], cc.RAN) &&
          is(lex[0], cc.LAN) &&
          not(lex[0], cc.LAN)
        ) {

          do { a = a + 1; } while (is(b[a + 1], cc.RAN));

        } else if (
          is(lex[0], cc.LAN) &&
          is(lex[1], cc.LAN) &&
          not(b[a + 1], cc.RAN) &&
          not(lex[lex.length - 2], cc.RAN)
        ) {

          do { lex.splice(1, 1); } while (lex[1] === '<');
        }
      }

      igcount = 0;
      element = lex.join('');
      tname = tagName(element);
      element = bracketSpace(element);

      if (tname === 'xml') {
        html = 'xml';
      } else if (html === '' && tname === 'html') {
        html = 'html';
      } else if (html === 'liquid') {
        html = 'html';
      }
    }

    record.token = element;
    record.types = ltype as any;
    tname = tagName(element);

    if (preserve === false && options.language !== 'jsx') element = element.replace(/\s+/g, ' ');

    // a quick hack to inject records for a type of template comments
    if (tname === 'comment' && isLiquid(element, 2)) {

      const open = element.slice(0, element.indexOf('%}') + 2);
      const comm = element.slice(element.indexOf('%}') + 2, element.lastIndexOf('{%'));
      const end = element.slice(element.lastIndexOf('{%'));

      let linesStart: number = 0;
      let linesEnd: number = 0;

      function lineFindStart (spaces: string): string {
        linesStart = spaces === '' ? 0 : spaces.split('\n').length;
        return '';
      };

      function lineFindEnd (spaces: string): string {
        linesEnd = spaces === '' ? 0 : spaces.split('\n').length;
        return '';
      };

      /* COMMENT START ------------------------------ */

      record.begin = parse.structure[parse.structure.length - 1][1];
      record.ender = parse.count + 3;
      record.stack = parse.structure[parse.structure.length - 1][0];
      record.types = 'template_start';
      record.token = open;
      recordpush(data, record, 'comment');

      /* COMMENT CONTENT ---------------------------- */

      element = comm.replace(/^\s*/, lineFindStart);
      element = element.replace(/\s*$/, lineFindEnd);

      record.begin = parse.count;
      record.lines = linesStart;
      record.stack = 'comment';
      record.token = element;
      record.types = 'comment';
      recordpush(data, record, '');

      /* COMMENT END -------------------------------- */

      record.types = 'template_end';
      record.stack = 'comment';
      record.lines = linesEnd;
      record.token = end;
      recordpush(data, record, '');

      return;

    }

    // a type correction for template tags who have variable start tag names but a
    // consistent ending tag name
    record.types = ltype;

    // cheat identifies HTML singleton elements as singletons even if formatted as
    // start tags, such as <br> (which is really <br/>)
    cheat = (() => {

      const ender = (/(\/>)$/);

      function peertest (n: string, i: string) {

        if (!grammar.html.tags.has(n)) return false;

        if (n === i) return true;
        if (n === 'dd' && i === 'dt') return true;
        if (n === 'dt' && i === 'dd') return true;
        if (n === 'td' && i === 'th') return true;
        if (n === 'th' && i === 'td') return true;
        if (n === 'colgroup' && (i === 'tbody' || i === 'tfoot' || i === 'thead' || i === 'tr')) return true;
        if (n === 'tbody' && (i === 'colgroup' || i === 'tfoot' || i === 'thead')) return true;
        if (n === 'tfoot' && (i === 'colgroup' || i === 'tbody' || i === 'thead')) return true;
        if (n === 'thead' && (i === 'colgroup' || i === 'tbody' || i === 'tfoot')) return true;
        if (n === 'tr' && i === 'colgroup') return true;

        return false;
      };

      function addHtmlEnd (count: number) {

        record.lines = (data.lines[parse.count] > 0) ? 1 : 0;
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
        record.types = 'end';

        recordpush(data, record, '');

        if (count > 0) {
          do {
            record.begin = parse.structure[parse.structure.length - 1][1];
            record.stack = parse.structure[parse.structure.length - 1][0];
            record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
            recordpush(data, record, '');
            count = count - 1;
          } while (count > 0);
        }

        record.begin = parse.structure[parse.structure.length - 1][1];
        record.lines = parse.linesSpace;
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.token = element;
        record.types = 'end';
        data.lines[parse.count - 1] = 0;

      };

      // determine if the current end tag is actually part of an HTML singleton
      if (ltype === 'end') {

        const lastToken = data.token[parse.count];

        if (
          data.types[parse.count - 1] === 'singleton' &&
          lastToken.charCodeAt(lastToken.length - 2) !== cc.FWS &&
          '/' + tagName(lastToken) === tname
        ) {

          data.types[parse.count - 1] = 'start';
        }
      }

      if (html === 'html') {

        // html gets tag names in lowercase, if you want to preserveLine case sensitivity
        // beautify as XML
        if (
          is(element[0], cc.LAN) &&
          not(element[1], cc.BNG) &&
          not(element[1], cc.QWS) && (
            parse.count < 0 ||
            data.types[parse.count].indexOf('template') < 0
          )
        ) {
          element = element.toLowerCase();
        }

        if (grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) && peertest(
          tname.slice(1),
          parse.structure[parse.structure.length - 2][0]
        )) {

          // looks for HTML tags missing an ending pair when encountering an ending tag for a parent node
          addHtmlEnd(0);
        } else if (
          parse.structure.length > 3 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 2][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 3][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 4][0]) === true
        ) {

          // looks for consecutive missing end tags
          addHtmlEnd(3);

        } else if (
          parse.structure.length > 2 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 2][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 3][0]) === true
        ) {

          // looks for consecutive missing end tags
          addHtmlEnd(2);

        } else if (
          parse.structure.length > 1 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 2][0]) === true
        ) {

          // looks for consecutive missing end tags
          addHtmlEnd(1);

        } else if (peertest(tname, parse.structure[parse.structure.length - 1][0]) === true) {

          // certain tags cannot contain other certain tags if such tags are peers
          addHtmlEnd(0);
        } else if (
          is(tname[0], cc.FWS) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          parse.structure[parse.structure.length - 1][0] !== tname.slice(1)
        ) {

          // looks for consecutive missing end tags if the current element is an end tag
          fixHtmlEnd(element, false);

          record.begin = parse.structure[parse.structure.length - 1][1];
          record.lines = parse.linesSpace;
          record.stack = parse.structure[parse.structure.length - 1][0];
          record.token = element;
          record.types = 'end';

          data.lines[parse.count - 1] = 0;

        }

        // inserts a trailing slash into singleton tags if they do not already have it
        if (grammar.html.voids.has(tname)) {

          if (options.markup.correct === true && ender.test(element) === false) {
            element = element.slice(0, element.length - 1) + ' />';
          }

          return true;
        }

      }

      return false;

    })();

    // This escape flag is set in the cheat function
    if (singleton) {
      attrecord();
      return;
    }

    // determine if the markup tag potentially contains code interpreted by a
    // different lexer
    if ((
      (/\bscript|style\b/.test(tname) && element.slice(element.length - 2) !== '/>') ||
      (/\bschema|style|stylesheet|javascript\b/.test(tname) && element.slice(element.length - 2) === '%}')
    )) {

      const liquid = isLiquid(element, 3);

      // get the attribute value for "type"
      let len = attstore.length - 1;
      let attValue = '';
      let attrName = [];

      if (len > -1) {
        do {

          attrName = attrname(attstore[len][0]);

          if (attrName[0] === 'type') {

            attValue = attrName[1];
            if (attValue.charCodeAt(0) === cc.DQO || attValue.charCodeAt(0) === cc.SQO) {
              attValue = attValue.slice(1, attValue.length - 1);
            }

            break;
          }

          len = len - 1;
        } while (len > -1);
      }

      // ext is flag to send information between the tag lexer and the content lexer
      //
      // HOTFIX
      // Lets also capture JSON types which are defined
      // via application/json or application/ld+json
      if (liquid === false && tname === 'script') {

        ext = true;

        if (
          attValue === '' ||
          attValue === 'text/javascript' ||
          attValue === 'babel' ||
          attValue === 'module' ||
          attValue === 'application/javascript' ||
          attValue === 'application/x-javascript' ||
          attValue === 'text/ecmascript' ||
          attValue === 'application/ecmascript' ||
          attValue === 'text/cjs'
        ) {
          extlang = 'javascript';
        } else if (attValue === 'text/jsx' || attValue === 'application/jsx') {
          extlang = 'jsx';
        } else if (attValue === 'application/json' || attValue === 'application/ld+json') {
          extlang = 'json';
        }

      } else if (
        liquid === false &&
        tname === 'style' &&
        options.language !== 'jsx' && (attValue === '' || attValue === 'text/css')
      ) {

        ext = true;
        extlang = 'css';

      } else if (liquid === true) {

        ext = true;

        if (tname === 'javascript') {
          extlang = 'javascript';
        } else if (tname === 'style' || tname === 'stylesheet') {
          extlang = 'css';
        } else if (tname === 'schema') {
          extlang = 'json';
        }

      }

      if (ext === true) {

        len = a + 1;

        if (len < c) {

          do {

            if (ws(b[len]) === false) {

              if (is(b[len], cc.LAN)) {

                if (b.slice(len + 1, len + 4).join('') === '!--') {

                  len = len + 4;

                  if (len < c) {

                    do {

                      if (ws(b[len]) === false) {
                        ext = false;
                        break;
                      }

                      if (b[len] === '\n' || b[len] === '\r') break;

                      len = len + 1;
                    } while (len < c);
                  }

                } else {
                  ext = false;
                }

              }
              break;
            }

            len = len + 1;

          } while (len < c);
        }
      }
    }

    // am I a singleton or a start type?
    if (simple && ignoreme === false && ltype !== 'xml') {

      if (cheat === true || element.slice(element.length - 2) === '/>') {
        ltype = 'singleton';
      } else {
        ltype = 'start';
      }

      record.types = ltype as Types;
    }

    // additional logic is required to find the end of a tag with the attribute
    // data-parse-ignore
    if (simple && preserve === false && ignoreme && is(end, cc.RAN) && element.slice(element.length - 2) !== '/>') {

      const tags = [];
      const atstring = [];

      if (cheat === true) {

        ltype = 'singleton';

      } else {

        attstore.forEach((value) => atstring.push(value[0]));

        preserve = true;
        ltype = 'ignore';

        a = a + 1;

        if (a < c) {

          let delim = '';
          let ee = 0;
          let ff = 0;
          let endtag = false;

          do {

            if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

            tags.push(b[a]);

            if (delim === '') {

              if (is(b[a], cc.DQO)) {

                delim = '"';

              } else if (is(b[a], cc.SQO)) {

                delim = "'";

              } else if (
                not(tags[0], cc.LCB) &&
                is(b[a], cc.LCB) && (is(b[a + 1], cc.LCB) || is(b[a + 1], cc.PER))
              ) {

                if (is(b[a + 1], cc.LCB)) {

                  delim = '}}';

                } else {

                  delim = b[a + 1] + '}';

                }

              } else if (is(b[a], cc.LAN) && simple === true) {

                if (is(b[a + 1], cc.FWS)) {
                  endtag = true;
                } else {
                  endtag = false;
                }

              } else if (b[a] === lastchar && not(b[a - 1], cc.FWS)) {

                if (endtag === true) {
                  igcount = igcount - 1;
                  if (igcount < 0) break;
                } else {
                  igcount = igcount + 1;
                }
              }

            } else if (is(b[a], delim.charCodeAt(delim.length - 1))) {

              ff = 0;
              ee = delim.length - 1;

              if (ee > -1) {
                do {
                  if (not(b[a - ff], delim.charCodeAt(ee))) break;
                  ff = ff + 1;
                  ee = ee - 1;
                } while (ee > -1);
              }

              if (ee < 0) delim = '';

            }

            a = a + 1;

          } while (a < c);
        }
      }

      element = element + tags.join('');
      element = element.replace('>', ` ${atstring.join(' ')}>`);

      record.token = element;
      record.types = 'content-ignore' as any;
      attstore = [];

    }

    // some template tags can be evaluated as a
    // block start/end based on syntax alone
    if (record.types.indexOf('template') > -1) {

      if (is(element[0], cc.LCB) && is(element[1], cc.PER)) {

        if (
          (tname === 'case' || tname === 'default') && (
            parse.structure[parse.structure.length - 1][0] === 'switch' ||
            parse.structure[parse.structure.length - 1][0] === 'case'
          )
        ) {

          record.types = 'template_else';

        } else if (tname === 'else' || tname === 'when' || tname === 'elsif') {

          record.types = 'template_else';

        } else {

          if (grammar.liquid.tags.has(tname)) {
            record.types = 'template_start';
          } else if (tname[0] === 'e' && tname[1] === 'n' && tname[2] === 'd' && grammar.liquid.tags.has(tname.slice(3))) {
            record.types = 'template_end';
          } else if (tname[0] === 'e' && tname[1] === 'n' && tname[2] === 'd') {

            record.types = 'template_end';
            record.stack = tname.slice(3);

            let idx = 0;

            do {
              if (data.types[idx] === 'template' && data.stack[idx] === record.stack) {
                data.types[idx] = 'template_start';
                count.start = count.start + 1;
                break;
              } else {
                idx = data.stack.indexOf(record.stack, idx + 1);
              }
            } while (idx > -1);

          } else {

            record.stack = tname;
          }
        }

      } else if (record.types === 'template') {
        if (element.indexOf('else') > 2) record.types = 'template_else';
      }

      if (record.types === 'template_start' || record.types === 'template_else') {
        if (tname === '' || tname === '%') {
          tname = tname + element.slice(1).replace(tname, '').replace(/^\s+/, '');
          tname = tname.slice(0, tname.indexOf('(')).replace(/\s+/, '');
        }
      }
    }

    // identify script and style hidden within a CDATA escape
    if (ltype === 'cdata' && (record.stack === 'script' || record.stack === 'style')) {

      let counta = parse.count;
      let countb = parse.count;

      const stack = record.stack;

      if (data.types[countb] === 'attribute') {
        do {
          counta = counta - 1;
          countb = countb - 1;
        } while (data.types[countb] === 'attribute' && countb > -1);
      }

      record.begin = counta;
      record.token = '<![CDATA[';
      record.types = 'cdata_start';

      element = element.replace(/^(\s*<!\[cdata\[)/i, '').replace(/(\]\]>\s*)$/, '');

      recordpush(data, record, '');

      parse.structure.push([ 'cdata', parse.count ]);

      if (stack === 'script') {
        prettify.lexers.script(element);
      } else {
        prettify.lexers.style(element);
      }

      record.begin = parse.structure[parse.structure.length - 1][1];
      record.token = ']]>';
      record.types = 'cdata_end';

      recordpush(data, record, '');

      parse.structure.pop();

    } else {

      // Liquid Tags and other items are pushed here
      recordpush(data, record, tname);

    }

    attrecord();

    // inserts a script space in anticipation of word wrap since JSX has unique white space rules
    if (options.wrap > 0 && options.language === 'jsx') {

      let current_length = 0;
      let bb = parse.count;
      let cc = 0;

      if (data.types[bb].indexOf('attribute') > -1) {

        do {
          current_length = current_length + data.token[bb].length + 1;
          bb = bb - 1;
        } while (data.lexer[bb] !== 'markup' || data.types[bb].indexOf('attribute') > -1);

        if (data.lines[bb] === 1) current_length = current_length + data.token[bb].length + 1;

      } else if (data.lines[bb] === 1) {

        current_length = data.token[bb].length + 1;
      }

      cc = bb - 1;

      if (current_length > 0 && data.types[cc] !== 'script_end') {

        if (data.types[cc].indexOf('attribute') > -1) {

          do {
            current_length = current_length + data.token[cc].length + 1;
            cc = cc - 1;
          } while (data.lexer[cc] !== 'markup' || data.types[cc].indexOf('attribute') > -1);

          if (data.lines[cc] === 1) current_length = current_length + data.token[cc].length + 1;

        } else if (data.lines[cc] === 1) {

          current_length = data.token[cc].length + 1;
        }

        /* if (current_length > options.wrap && data.lines[bb] === 1) {

           record.begin = data.begin[bb];
           record.ender = bb + 2;
           record.lexer = data.lexer[bb];
           record.lines = 1;
           record.stack = data.stack[bb];
           record.token = '{';
           record.types = 'script_start';

           parse.splice({
             data,
             howmany: 0,
             index: bb,
             record
           });

           record.begin = bb;
           record.lexer = 'script';
           record.lines = 0;
           record.stack = 'script';

           if (options.markup.quoteConvert === 'single') {
             record.token = "'";
           } else {
             record.token = '"';
           }

           record.types = 'string';

           parse.splice({
             data,
             howmany: 0,
             index: bb + 1,
             record
           });

           record.lexer = 'markup';
           record.token = '}';
           record.types = 'script_end';

           parse.splice({
             data,
             howmany: 0,
             index: bb + 2,
             record
           });

           data.ender[bb + 3] = data.ender[bb + 3] + 3;

           bb = bb + 4;

           do {
             data.begin[bb] = data.begin[bb] + 3;
             data.ender[bb] = data.ender[bb] + 3;
             bb = bb + 1;
           } while (bb < parse.count);
         } */
      }
    }

    parse.linesSpace = 0;
  }

  // parses everything other than markup tags
  function content () {

    let ltoke = '';
    let liner = parse.linesSpace;
    let name: string = '';

    const lex = [];
    const jsxbrace = (data.token[parse.count] === '{');
    const now = a;

    if (ext === true) {
      if (jsxbrace === true) {
        name = 'script';
      } else if (parse.structure[parse.structure.length - 1][1] > -1) {
        name = tagName(data.token[parse.structure[parse.structure.length - 1][1]].toLowerCase());
      } else if (data.begin[parse.count] > 1) {
        name = tagName(data.token[data.begin[parse.count]].toLowerCase());
      } else {
        name = tagName(data.token[data.begin[parse.count]].toLowerCase());
      }
    }

    const square = (
      data.types[parse.count] === 'template_start' &&
      data.token[parse.count].indexOf('<!') === 0 &&
      data.token[parse.count].indexOf('<![') < 0 &&
      data.token[parse.count].charAt(data.token[parse.count].length - 1) === '['
    );

    const record: Record = create(null);

    record.begin = parse.structure[parse.structure.length - 1][1];
    record.ender = -1;
    record.lexer = 'markup';
    record.lines = liner;
    record.stack = parse.structure[parse.structure.length - 1][0];
    record.token = '';
    record.types = 'content';

    function esctest () {

      let aa = a - 1;
      let bb = 0;

      if (b[a - 1] !== '\\') return false;

      if (aa > -1) {
        do {

          if (b[aa] !== '\\') break;

          bb = bb + 1;
          aa = aa - 1;

        } while (aa > -1);
      }

      return bb % 2 === 1;

    };

    if (a < c) {

      let end = '';
      let quote = '';
      let quotes = 0;

      do {

        if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

        // external code requires additional parsing to look for the appropriate end
        // tag, but that end tag cannot be quoted or commented
        if (ext === true) {

          if (quote === '') {

            if (b[a] === '/') {

              if (b[a + 1] === '*') {
                quote = '*';
              } else if (b[a + 1] === '/') {
                quote = '/';
              } else if (name === 'script' && '([{!=,;.?:&<>'.indexOf(b[a - 1]) > -1) {
                if (options.language !== 'jsx' || b[a - 1] !== '<') quote = 'reg';
              }

            } else if ((b[a] === '"' || b[a] === "'" || b[a] === '`') && esctest() === false) {

              quote = b[a];

            } else if (b[a] === '{' && jsxbrace === true) {

              quotes = quotes + 1;

            } else if (b[a] === '}' && jsxbrace === true) {

              if (quotes === 0) {

                // console.log(lex.join('').replace(/^(\s+)/, '').replace(/(\s+)$/, ''));
                prettify.lexers.script(lex.join('').replace(/^(\s+)/, '').replace(/(\s+)$/, ''));

                // Originally was:
                // Added incremental
                parse.structure[parse.structure.length - 1][1] += 1;

                if (data.types[parse.count] === 'end' && data.lexer[data.begin[parse.count] - 1] === 'script') {

                  record.lexer = 'script';
                  record.token = (options.markup.correct === true) ? ';' : 'x;';
                  record.types = 'separator';
                  recordpush(data, record, '');
                  record.lexer = 'markup';

                }

                record.token = '}';
                record.types = 'script_end';
                recordpush(data, record, '');
                parse.structure.pop();
                break;
              }

              quotes = quotes - 1;
            }

            if (isLiquid(data.token[parse.count], 3) === false) {

              end = b.slice(a, a + 10).join('').toLowerCase();

              // script requires use of the script lexer
              if (name === 'script') {

                end = a === c - 9
                  ? end.slice(0, end.length - 1)
                  : end.slice(0, end.length - 2);

                if (end === '</script') {

                  let outside = lex.join('').replace(/^(\s+)/, '').replace(/(\s+)$/, '');

                  a = a - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && (/--+>$/).test(outside)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, '');

                    outside = outside.replace(/^<!--+/, '').replace(/--+>$/, '');

                    prettify.lexers.script(outside);
                    record.token = '-->';

                    recordpush(data, record, '');

                  } else {

                    const curlang = prettify.options.language;

                    prettify.options.language = extlang;
                    prettify.lexers.script(outside);

                    if ((
                      extlang === 'json' &&
                      options[extlang].objectSort === true
                    ) || (
                      extlang !== 'json' &&
                      options.script.objectSort === true
                    )) {
                      parse.sortCorrection(0, parse.count + 1);
                    }

                    prettify.options.language = curlang;

                    //   prettify.options.language = 'html';
                  }

                  break;
                }
              }

              // style requires use of the style lexer
              if (name === 'style') {

                if (a === c - 8) {
                  end = end.slice(0, end.length - 1);
                } else if (a === c - 9) {
                  end = end.slice(0, end.length - 2);
                } else {
                  end = end.slice(0, end.length - 3);
                }

                if (end === '</style') {

                  let outside = lex
                    .join('')
                    .replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');

                  console.log(b[a], end);

                  a = a - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && (/--+>$/).test(outside)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, '');

                    outside = outside.replace(/^<!--+/, '').replace(/--+>$/, '');

                    prettify.lexers.style(outside);
                    record.token = '-->';

                    recordpush(data, record, '');

                  } else {

                    const curlang = prettify.options.language;

                    prettify.options.language = extlang;
                    prettify.lexers.style(outside);

                    if (options.style.sortProperties === true) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = curlang;

                  }

                  break;
                }
              }

            } else {

              if (name === 'schema') {

                end = b.slice(a).join('').toLowerCase();

                if (/^{%-?\s*endschema/.test(end)) {

                  end = end.slice(0, end.indexOf('%}') + 2);

                  let outside = lex
                    .join('')
                    .replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');

                  a = a + end.length - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && /--+>$/.test(outside)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, '');

                    outside = outside.replace(/^<!--+/, '').replace(/--+>$/, '');

                    prettify.lexers.script(outside);
                    record.token = '-->';

                    recordpush(data, record, '');

                  } else {

                    prettify.options.language = 'json';

                    prettify.lexers.script(outside);

                    if (options.json.objectSort === true) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = 'liquid';

                    record.token = end;
                    record.types = 'template_end';

                    recordpush(data, record, '');

                  }

                  break;
                }

              } else if (name === 'style') {

                end = b.slice(a).join('').toLowerCase();

                if (/^{%-?\s*endstyle/.test(end)) {

                  end = end.slice(0, end.indexOf('%}') + 2);

                  let outside = lex
                    .join('')
                    .replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');

                  a = a + end.length - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && /--+>$/.test(outside)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, '');

                    outside = outside.replace(/^<!--+/, '').replace(/--+>$/, '');

                    prettify.lexers.style(outside);
                    record.token = '-->';

                    recordpush(data, record, '');

                  } else {

                    prettify.options.language = extlang;
                    prettify.options.lexer = 'style';
                    prettify.lexers.style(outside);


                    if (options.style.sortProperties === true) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = 'liquid';
                    prettify.options.lexer = 'markup';

                    record.token = end;
                    record.types = 'template_end';

                    recordpush(data, record, '');

                  }

                  break;
                }
              } else if (name === 'javascript') {

                end = b.slice(a).join('').toLowerCase();

                if (/^{%-?\s*endjavascript/.test(end)) {

                  end = end.slice(0, end.indexOf('%}') + 2);

                  let outside = lex
                    .join('')
                    .replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');

                  a = a + end.length - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && /--+>$/.test(outside)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, '');

                    outside = outside.replace(/^<!--+/, '').replace(/--+>$/, '');

                    prettify.lexers.script(outside);
                    record.token = '-->';

                    recordpush(data, record, '');

                  } else {

                    // prettify.options.language = 'javascript';
                    prettify.lexers.script(outside);

                    if (options.script.objectSort === true) {
                      parse.sortCorrection(0, parse.count + 1);
                    }

                    // prettify.options.language = 'html';

                    record.token = end;
                    record.types = 'template_end';

                    recordpush(data, record, '');

                  }

                  break;
                }
              }
            }

          } else if (quote === b[a] && (
            quote === '"' ||
            quote === "'" ||
            quote === '`' ||
            (quote === '*' && b[a + 1] === '/')) && esctest() === false
          ) {
            quote = '';
          } else if (quote === '`' && b[a] === '$' && b[a + 1] === '{' && esctest() === false) {
            quote = '}';
          } else if (quote === '}' && b[a] === '}' && esctest() === false) {
            quote = '`';
          } else if (quote === '/' && (b[a] === '\n' || b[a] === '\r')) {
            quote = '';
          } else if (quote === 'reg' && b[a] === '/' && esctest() === false) {
            quote = '';
          } else if (quote === '/' && b[a] === '>' && b[a - 1] === '-' && b[a - 2] === '-') {

            end = b.slice(a + 1, a + 11).join('').toLowerCase();
            end = end.slice(0, end.length - 2);

            if (name === 'script' && end === '</script') quote = '';

            end = end.slice(0, end.length - 1);

            if (name === 'style' && end === '</style') quote = '';

          }
        }

        // typically this logic is for artifacts nested within an SGML tag
        if (square === true && b[a] === ']') {

          a = a - 1;
          ltoke = lex.join('');
          ltoke = ltoke.replace(/\s+$/, '');

          liner = 0;
          record.token = ltoke;
          recordpush(data, record, '');
          break;
        }

        // general content processing
        if (ext === false &&
          lex.length > 0 && (
          (b[a] === '<' && b[a + 1] !== '=' && !(/\s|\d/).test(b[a + 1])) ||
            (b[a] === '[' && b[a + 1] === '%') ||
            (b[a] === '{' && (options.language === 'jsx' || b[a + 1] === '{' || b[a + 1] === '%'))
        )) {

          // regular content
          a = a - 1;

          if (parse.structure[parse.structure.length - 1][0] === 'comment') {
            ltoke = lex.join('');
          } else {
            ltoke = lex.join('').replace(/\s+$/, '');
          }

          ltoke = bracketSpace(ltoke);
          liner = 0;
          record.token = ltoke;

          if (options.wrap > 0 && options.markup.preserveText !== true) {

            let aa = options.wrap;
            let len = ltoke.length;
            const startSpace = '';
            const endSpace = '';

            const wrap = options.wrap;
            const store = [];

            function wrapper () {

              if (ltoke.charAt(aa) === ' ') {
                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;
                return;
              }

              do { aa = aa - 1; } while (aa > 0 && ltoke.charAt(aa) !== ' ');

              if (aa > 0) {

                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;

              } else {

                aa = wrap;

                do { aa = aa + 1; } while (aa < len && ltoke.charAt(aa) !== ' ');

                store.push(ltoke.slice(0, aa));

                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;

              }
            };

            // HTML anchor lists do not get wrapping unless the content itself exceeds the wrapping limit
            if (
              data.token[data.begin[parse.count]] === '<a>' &&
              data.token[data.begin[data.begin[parse.count]]] === '<li>' &&
              data.lines[data.begin[parse.count]] === 0 &&
              parse.linesSpace === 0 &&
              ltoke.length < options.wrap
            ) {

              recordpush(data, record, '');
              break;
            }

            if (len < wrap) {
              recordpush(data, record, '');
              break;
            }

            if (parse.linesSpace < 1) {

              let bb = parse.count;

              do {

                aa = aa - data.token[bb].length;

                if (data.types[bb].indexOf('attribute') > -1) aa = aa - 1;
                if (data.lines[bb] > 0 && data.types[bb].indexOf('attribute') < 0) break;

                bb = bb - 1;

              } while (bb > 0 && aa > 0);

              if (aa < 1) aa = ltoke.indexOf(' ');

            }

            ltoke = lex.join('');
            ltoke = ltoke
              .replace(/^\s+/, '')
              .replace(/\s+$/, '')
              .replace(/\s+/g, ' ');

            do { wrapper(); } while (aa < len);

            if (ltoke !== '' && ltoke !== ' ') store.push(ltoke);

            ltoke = options.crlf === true ? store.join('\r\n') : store.join('\n');
            ltoke = startSpace + ltoke + endSpace;
          }

          liner = 0;
          record.token = ltoke;
          recordpush(data, record, '');
          break;
        }

        lex.push(b[a]);

        a = a + 1;

      } while (a < c);
    }

    if (a > now && a < c) {

      if (ws(b[a])) {

        let x = a;
        parse.linesSpace = 1;

        do {

          if (b[x] === '\n') parse.linesSpace = parse.linesSpace + 1;
          x = x - 1;

        } while (x > now && ws(b[x]));

      } else {

        parse.linesSpace = 0;
      }

    } else if (a !== now || (a === now && ext === false)) {

      // regular content at the end of the supplied source
      ltoke = lex
        .join('')
        .replace(/\s+$/, '');

      liner = 0;

      // this condition prevents adding content that was just added in the loop above
      if (record.token !== ltoke) {
        record.token = ltoke;
        recordpush(data, record, '');
        parse.linesSpace = 0;
      }
    }

    ext = false;
  };

  // trim the options.attributeSortList values
  if (asl > 0) {

    do {

      options.markup.attributeSortList[a] = options.markup.attributeSortList[a].replace(/^\s+/, '').replace(/\s+$/, '');
      a = a + 1;

    } while (a < asl);

    a = 0;

  }

  if (options.language === 'html' || options.language === 'liquid') html = 'html';

  do {

    if (ws(b[a])) {

      if ((
        data.types[parse.count] === 'template_start' &&
        parse.structure[parse.structure.length - 1][0] === 'comment'
      )) {

        content();

      } else {

        a = parse.spacer({ array: b, end: c, index: a });

      }

    } else if (ext) {

      content();

    } else if (b[a] === '<') {

      tag('');

    } else if (b[a] === '[' && b[a + 1] === '%') {

      tag('%]');

    } else if (
      b[a] === '{' && (
        options.language === 'jsx' ||
        b[a + 1] === '{' ||
        b[a + 1] === '%'
      )
    ) {

      tag('');

    } else if (b[a] === ']' && sgmlflag > 0) {

      tag(']>');

    } else if (
      b[a] === '-' &&
      b[a + 1] === '-' &&
      b[a + 2] === '-'
    ) {

      tag('---');

    } else {
      content();
    }

    a = a + 1;

  } while (a < c);

  if (
    data.token[parse.count].charAt(0) !== '/' &&
    grammar.html.tags.has(parse.structure[parse.structure.length - 1][0])
  ) {
    fixHtmlEnd(data.token[parse.count], true);
  }

  if (count.end !== count.start && parse.error === '') {
    if (count.end > count.start) {
      const x = count.end - count.start;
      const plural = (x === 1) ? '' : 's';
      parse.error = '✖ Prettify Parse Error:\n\n'
        + `  ${x} more end type${plural} than start types.\n\n`;
    } else {
      const x = count.start - count.end;
      const plural = (x === 1) ? '' : 's';
      parse.error = ' ✖ Prettify Parse Error:\n\n'
        + `  ${x} more start type${plural} than end types.\n\n`;

    }
  }

  return data;

};
