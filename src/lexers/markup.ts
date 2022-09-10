import type { Record, Data, Types } from 'types/prettify';
import { prettify } from '@prettify/model';
import { grammar } from '@options/grammar';
import { parse } from '@parser/parse';
import { lexmap } from '@parser/language';
import { cc, NIL } from '@utils/chars';
import {
  is,
  not,
  ws,
  isLiquid,
  isLiquidEnd,
  isLiquidStart,
  getLiquidTagName,
  object
} from '@utils/helpers';

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

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * Prettify Options
   */
  const { options } = prettify;

  /**
   * Parse data reference
   */
  const { data } = parse;

  /**
   * Whether or not language mode is TSX / JSX
   */
  const jsx = options.language === 'jsx' || options.language === 'tsx';

  /**
   * Whether or not language mode is HTML or Liquid
   */
  const markup = options.language === 'html' || options.language === 'liquid';

  /**
   * Cached option markup beautification rules
   */
  const rules = options.markup;

  /**
   * Attribute sorting list length
   */
  const asl = rules.attributeSortList.length;

  /**
   * Count reference to be assigned to the
   * generated tree.
   */
  const count: {
    end: number;
    start: number;
    index: number,
    line: number;
  } = {
    end: 0,
    index: -1,
    start: 0,
    line: 1
  };

  /**
   * The document source as an array list,
   * ie: source.split(NIL)
   */
  const b = source.split(NIL);

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
  let html = markup ? options.language : 'html';

  /**
   * Stack nesting reference for Liquid tokens, increments by 1
   * for each opener and decrements for each ender.
   */
  let ttexp = 0;

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

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

    if (markup === true && jsx === false) {

      if ((/(?:{[=#/]|%[>\]])|\}%[>\]]/).test(input)) return input;

      if (rules.delimiterSpacing === true) {
        input = input.replace(/{[{%]-?\s*/g, (start: string) => start.replace(/\s*$/, ' '));
        input = input.replace(/\s*-?[%}]}/g, (end: string) => end.replace(/^\s*/, ' '));
      }

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

    count.index = parse.count;
    count.line = parse.lineNumber;

    // console.log(record);

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
    let name = NIL as string;

    /**
     * Delimeter expression match
     *
     */
    const reg: RegExp = (/^(?:<|{%-?|{{-?)=?\s*/);

    if (typeof tag !== 'string') return NIL;

    space = tag.replace(reg, '%').replace(/\s+/, ' ').indexOf(' ');
    name = tag.replace(reg, ' ');
    name = (space < 0) ? name.slice(1, tag.length - 1) : name.slice(1, space);

    if (html === 'html') name = name.toLowerCase();

    name = name.replace(/-?[%}]}$/, NIL);

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
  function fixhtmlend (element: string, end: boolean) {

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
    const record = object<Record>({
      begin: parse.structure[parse.structure.length - 1][1],
      ender: -1,
      lexer: 'markup',
      lines: data.lines[parse.count] > 0 ? 1 : 0,
      stack: parse.structure[parse.structure.length - 1][0],
      token: `</${parse.structure[parse.structure.length - 1][0]}>`,
      types: 'end'
    });

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    recordpush(data, record, NIL);

    if (grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) && (
      (end === true && parse.structure.length > 1) ||
      (end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname)
    )) {

      do {

        record.begin = parse.structure[parse.structure.length - 1][1];
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;

        recordpush(data, record, NIL);

      } while (
        grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) && ((
          end === true &&
          parse.structure.length > 1
        ) || (
          end === false &&
          `/${parse.structure[parse.structure.length - 1][0]}` !== tname
        ))
      );
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

    const record: Record = {
      begin: parse.structure[parse.structure.length - 1][1],
      ender: -1,
      lexer: 'markup',
      lines: parse.linesSpace,
      stack: parse.structure[parse.structure.length - 1][0],
      token: NIL,
      types: NIL
    };

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
    let element = NIL;

    /**
     * The last known character of a token
     */
    let lastchar = NIL;

    /**
     * Last Type, ie: `start`, `template` etc etc
     */
    let ltype: Types = NIL;

    /**
     * Tag Name
     */
    let tname = NIL;

    /**
     * Starting delimeter token, ie: `{{` or `<` etc etc.
     */
    let start = NIL;

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
    let attrstore: [string, number][] = [];

    /**
     * Comment related reference (unsure of its use)
     */
    let comm = [ NIL, 0 ];

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

      return [ x, NIL ];

    };

    /**
     * Liquid Attribute Casing
     *
     * Walks over Liquid attributes and applies lowercasing
     * ammendments to contained attribute names. For example:
     *
     * ```html
     * <div {% if x %}DATA-ATTR-{{ xx }}{% else %}ID="foo"{% endif %}></div>
     * ```
     *
     * Where the `DATA-ATTR-` and `ID` will be converted to lowercase.
     * This function is only called when certain rule conditions are passed
     * and when Liquid attributes are contained.
     */
    function liqattrcase (attr: string) {

      const len = attr.length;

      let i: number = 0; // index
      let t: number = -1; // token

      do {

        t = attr.indexOf('{', i);

        if (t < 0) t = len;
        if (t > 0 && i > 0) attr = attr.slice(0, i) + attr.slice(i, t).toLowerCase() + attr.slice(t);
        if (t > -1 && is(attr[t + 1], cc.PER)) t = attr.indexOf('%}', t + 2) + 2;
        if (t > -1 && is(attr[t + 1], cc.LCB)) t = attr.indexOf('}}', t + 2) + 2;

        i = t === -1 ? len : t;

      } while (i < len);

      return attr;

    }

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
      const stack = tname.replace(/(\/)$/, NIL);

      /**
       * Type of quotation character to convert
       */
      const qc = rules.quoteConvert;

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
      let name = NIL;

      /**
       * The attribute value
       */
      let value = NIL;

      /**
       * Store reference (unsure what this is used for)
       */
      let store = [];

      /**
       * The amount of attributes in the store
       */
      let len = attrstore.length;

      /* -------------------------------------------- */
      /* FUNCTIONS                                    */
      /* -------------------------------------------- */

      /**
       * Converts quotation characters
       */
      function convertq () {

        let lq = isLiquid(record.token, 5);

        if (ignoreme === true || qc === 'none' || record.types.indexOf('attribute') < 0 ||
          (lq === false && qc === 'single' && record.token.indexOf('"') < 0) ||
          (lq === false && qc === 'double' && record.token.indexOf("'") < 0)
        ) {

          recordpush(data, record, NIL);

        } else {

          let ee = 0;
          let inner = false;

          const ch = record.token.split(NIL);
          const eq = record.token.indexOf('=');
          const ln = ch.length - 1;

          if (
            not(ch[eq + 1], cc.DQO) &&
            not(ch[ch.length - 1], cc.DQO) &&
            qc === 'single' &&
            lq === false
          ) {

            recordpush(data, record, NIL);

          } else if (
            not(ch[eq + 1], cc.SQO) &&
            not(ch[ch.length - 1], cc.SQO) &&
            qc === 'double' &&
            lq === false
          ) {

            recordpush(data, record, NIL);

          } else {

            ee = eq + 2;

            if (qc === 'double') {
              if (record.token.slice(eq + 2, ln).indexOf('"') > -1) inner = true;
              ch[eq + 1] = '"';
              ch[ch.length - 1] = '"';
            } else if (qc === 'single') {
              if (record.token.slice(eq + 2, ln).indexOf("'") > -1) inner = true;
              ch[eq + 1] = "'";
              ch[ch.length - 1] = "'";
            }

            if (inner === true || lq === true) {

              lq = false;

              do {

                if (is(ch[ee - 1], cc.LCB) && (
                  is(ch[ee], cc.PER) ||
                  is(ch[ee], cc.LCB)
                )) {
                  lq = true;
                } else if (is(ch[ee], cc.RCB) && (
                  is(ch[ee - 1], cc.PER) ||
                  is(ch[ee - 1], cc.RCB)
                )) {
                  lq = false;
                }

                if (lq === true) {

                  if (is(ch[ee], cc.DQO) && qc === 'double') {
                    ch[ee] = "'";
                  } else if (is(ch[ee], cc.SQO) && qc === 'single') {
                    ch[ee] = '"';
                  }
                } else {
                  if (is(ch[ee], cc.SQO) && qc === 'double') {
                    ch[ee] = '"';
                  } else if (is(ch[ee], cc.DQO) && qc === 'single') {
                    ch[ee] = "'";
                  }
                }

                ee = ee + 1;

              } while (ee < ln);
            }

            record.token = ch.join(NIL);
            recordpush(data, record, NIL);

          }
        }
      };

      /* -------------------------------------------- */
      /* BEGIN                                        */
      /* -------------------------------------------- */

      if (attrstore.length < 1) return;

      // fix for singleton tags, since "/" at the end of the tag is not an attribute
      if (is(attrstore[attrstore.length - 1][0], cc.FWS)) {
        attrstore.pop();
        element = element.replace(/>$/, '/>');
      }

      // reconnects attribute names to their respective values if separated on "="
      eq = attrstore.length;
      dq = 1;

      if (dq < eq) {

        do {

          name = attrstore[dq - 1][0];

          if (name.charCodeAt(name.length - 1) === cc.EQS && attrstore[dq][0].indexOf('=') < 0) {
            attrstore[dq - 1][0] = name + attrstore[dq][0];
            attrstore.splice(dq, 1);
            eq = eq - 1;
            dq = dq - 1;
          }

          dq = dq + 1;

        } while (dq < eq);
      }

      // sort the attributes
      if (
        rules.attributeSort === true &&
        jsx === false &&
        jscom === false &&
        nosort === false
      ) {

        // if making use of the 'options.attributeSortList` option
        if (asl > 0) {

          const tempstore = [];

          dq = 0;
          eq = 0;
          len = attrstore.length;

          // loop through the options.attributeSortList looking for attribute name matches
          do {

            // loop through the attrstore
            eq = 0;

            do {

              name = attrstore[eq][0].split('=')[0];

              if (rules.attributeSortList[dq] === name) {
                tempstore.push(attrstore[eq]);
                attrstore.splice(eq, 1);
                len = len - 1;
                break;
              }

              eq = eq + 1;
            } while (eq < len);

            dq = dq + 1;

          } while (dq < asl);

          attrstore = parse.safeSort(attrstore, NIL, false);
          attrstore = tempstore.concat(attrstore);
          len = attrstore.length;

        } else {
          attrstore = parse.safeSort(attrstore, NIL, false);
        }
      }

      record.begin = begin;
      record.stack = stack;
      record.types = 'attribute';

      store = [];

      if (idx < len) {

        do {

          if (attrstore[idx] === undefined) break;

          record.lines = attrstore[idx][1];

          attrstore[idx][0] = attrstore[idx][0].replace(/\s+$/, NIL);

          if (jsx === true && /^\/(\/|\*)/.test(attrstore[idx][0])) {

            record.types = 'comment_attribute';
            record.token = attrstore[idx][0];

            convertq();

            idx = idx + 1;
            continue;

          }

          // First, let's determine if the attribute either starts or ends with
          // Liquid delimiters tag block. We check the beginning and ending characters
          // in order to detect such structures.
          //
          // For example:
          //
          // {% if %}data-attr
          // {% endif %}-attr
          //
          if ((
            is(attrstore[idx][0][0], cc.LCB) &&
            is(attrstore[idx][0][1], cc.PER)
          ) || (
            is(attrstore[idx][0][attrstore[idx][0].length - 1], cc.RCB) &&
            is(attrstore[idx][0][attrstore[idx][0].length - 2], cc.PER)
          )) {

            if (isLiquidEnd(attrstore[idx][0])) {
              record.token = attrstore[idx][0];
              record.types = 'template_attribute_end';
              record.ender = record.begin;
            } else {

              const tag = getLiquidTagName(attrstore[idx][0]);

              if (grammar.liquid.tags.has(tag)) {

                record.types = 'template_attribute_start';
                record.begin = parse.count;
                record.token = attrstore[idx][0];

              } else if (grammar.liquid.else.has(tag)) {

                record.types = 'template_attribute_else';
                record.token = attrstore[idx][0];

              } else {

                record.types = 'template_attribute';
                record.token = attrstore[idx][0];

              }
            }

            convertq();

            idx = idx + 1;
            continue;

          }

          // Second, let's determine if the attribute either starts or ends with
          // Liquid delimiters output. In some cases our attribute might be chaining
          // tokens and in such a situation we will validate before asserting.
          //
          // For example:
          //
          // {{ foo }}=
          // data{% if x %}-foo{% else %}-bar{% endif %}={{ x }}
          //
          if ((
            is(attrstore[idx][0][0], cc.LCB) &&
            is(attrstore[idx][0][1], cc.LCB)
          ) || (
            is(attrstore[idx][0][attrstore[idx][0].length - 1], cc.RCB) &&
            is(attrstore[idx][0][attrstore[idx][0].length - 2], cc.RCB)
          )) {

            if (isLiquidEnd(attrstore[idx][0])) {

              record.token = attrstore[idx][0];
              record.types = 'template_attribute_end';
              record.ender = record.begin;

            } else {

              const name = getLiquidTagName(attrstore[idx][0]);

              if (grammar.liquid.tags.has(name)) {
                record.types = 'template_attribute_start';
                record.begin = parse.count;
                record.token = attrstore[idx][0];
              } else if (grammar.liquid.else.has(name)) {
                record.types = 'template_attribute_else';
                record.token = attrstore[idx][0];
              } else {

                record.types = 'template_attribute';
                record.token = attrstore[idx][0];

                // HOT PATCH
                //
                // Fixes situations where the next Liquid attribute token starts with dash -
                // and current token ends with closing delimiter. For example:
                //
                // <div data-{{ current_attr }}-{% if x %}{{ foo }}{% else %}{{ bar }}="xxx"></div>
                //
                // Where the "-" following `{{ current_attr }}` would be contained in attrstore
                // as a separate token. We will look ahead here and instead connect it.
                //
                /* if ((len > idx + 1) && is(attrstore[idx + 1][0][0], cc.DSH)) {
                  record.token = attrstore[idx][0] + attrstore[idx + 1][0][0];
                  record.types = grammar.liquid.tags.has(getLiquidTagName(attrstore[idx + 1][0]))
                    ? 'template_attribute_start'
                    : 'template_attribute';

                  record.token = attrstore[idx][0];

                } else {
                  record.types = 'template_attribute';
                  record.token = attrstore[idx][0];
                } */
              }
            }

            convertq();

            idx = idx + 1;
            continue;
          }

          eq = attrstore[idx][0].indexOf('=');
          dq = attrstore[idx][0].indexOf('"');
          sq = attrstore[idx][0].indexOf("'"); // eslint-disable-line @typescript-eslint/no-unused-vars

          if (eq < 0) {

            record.types = 'attribute';

            if (
              is(attrstore[idx][0], cc.HSH) ||
              is(attrstore[idx][0], cc.LSB) ||
              is(attrstore[idx][0], cc.LCB) ||
              is(attrstore[idx][0], cc.LPR) ||
              jsx === true
            ) {
              record.token = attrstore[idx][0];
            } else {

              if (rules.attributeCasing === 'preserve') {
                record.token = attrstore[idx][0];
              } else {
                record.token = attrstore[idx][0].toLowerCase();
              }
            }

            convertq();

          } else {

            // separates out the attribute name from its value

            name = attrstore[idx][0].slice(0, eq);
            value = attrstore[idx][0].slice(eq + 1);

            if (rules.correct && (
              not(value[0], cc.LAN) ||
              not(value[0], cc.LCB) ||
              not(value[0], cc.EQS) ||
              not(value[0], cc.DQO) ||
              not(value[0], cc.SQO)
            )) {

              value = '"' + value + '"';

            }

            if (jsx === true && /^\s*{/.test(value)) {

              record.token = name + '={';
              record.types = 'jsx_attribute_start';

              recordpush(data, record, 'jsx_attribute');

              prettify.lexers.script(value.slice(1, value.length - 1));
              record.begin = parse.count;

              // console.log(data);
              if (/\s\}$/.test(value)) {

                value = value.slice(0, value.length - 1);
                value = /\s+$/.exec(value)[0];

                record.lines = value.indexOf('\n') < 0 ? 1 : value.split('\n').length;
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

            } else {

              if (isLiquidEnd(name) || ((not(value, cc.SQO) || not(value, cc.DQO)) && isLiquidEnd(value))) {

                record.token = attrstore[idx][0];
                record.types = 'template_attribute_end';
                record.ender = record.begin;

              } else if (isLiquid(name, 5) && (not(value, cc.SQO) || not(value, cc.DQO)) && isLiquid(name, 5)) {

                const tag = getLiquidTagName(attrstore[idx][0]);

                if (grammar.liquid.tags.has(tag)) {

                  record.types = 'template_attribute_start';
                  record.begin = parse.count;
                  record.token = attrstore[idx][0];

                } else if (grammar.liquid.else.has(tag)) {

                  record.types = 'template_attribute_else';
                  record.token = attrstore[idx][0];

                } else {

                  record.types = 'template_attribute';
                  record.token = attrstore[idx][0];

                }
              } else {

                record.types = 'attribute';

                if (
                  is(attrstore[idx][0], cc.HSH) ||
                  is(attrstore[idx][0], cc.LSB) ||
                  is(attrstore[idx][0], cc.LCB) ||
                  is(attrstore[idx][0], cc.LPR) ||
                  jsx === true
                ) {

                  record.token = attrstore[idx][0];

                } else {

                  record.token = attrstore[idx][0];
                }
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

      if (is(b[a + 1], cc.FWS)) {

        end = '>';
        ltype = 'end';

      } else if (is(b[a + 1], cc.BNG)) {

        if ((
          b[a + 2].charCodeAt(0) === 100 ||
          b[a + 2].charCodeAt(0) === 68 // d D
        ) && (
          b[a + 3].charCodeAt(0) === 111 ||
          b[a + 3].charCodeAt(0) === 79 // o O
        ) && (
          b[a + 4].charCodeAt(0) === 99 ||
          b[a + 4].charCodeAt(0) === 67 // c C
        ) && (
          b[a + 5].charCodeAt(0) === 116 ||
          b[a + 5].charCodeAt(0) === 84 // t T
        ) && (
          b[a + 6].charCodeAt(0) === 121 ||
          b[a + 6].charCodeAt(0) === 89 // y Y
        ) && (
          b[a + 7].charCodeAt(0) === 112 ||
          b[a + 7].charCodeAt(0) === 80 // p P
        ) && (
          b[a + 8].charCodeAt(0) === 101 ||
          b[a + 8].charCodeAt(0) === 69 // e E
        )) {

          end = '>';
          ltype = 'doctype';
          preserve = true;

        } else if (is(b[a + 2], cc.DSH) && is(b[a + 3], cc.DSH)) {

          end = '-->';
          ltype = 'comment';
          start = '<!--';

        } else if (
          is(b[a + 2], cc.LSB) &&
          b[a + 3].charCodeAt(0) === 67 && // C
          b[a + 4].charCodeAt(0) === 68 && // D
          b[a + 5].charCodeAt(0) === 65 && // A
          b[a + 6].charCodeAt(0) === 84 && // T
          b[a + 7].charCodeAt(0) === 65 && // A
          is(b[a + 8], cc.LSB)
        ) {

          end = ']]>';
          ltype = 'cdata';
          preserve = true;

        }

      } else if (b[a + 1] === '?') {

        end = '?>';

        if (
          b[a + 2].charCodeAt(0) === 120 && // x
          b[a + 3].charCodeAt(0) === 109 && // m
          b[a + 4].charCodeAt(0) === 109 // l
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
        b[a + 1].charCodeAt(0) === 112 ||
        b[a + 1].charCodeAt(0) === 80 // p P
      ) && (
        b[a + 2].charCodeAt(0) === 114 ||
        b[a + 2].charCodeAt(0) === 82 // r R
      ) && (
        b[a + 3].charCodeAt(0) === 101 ||
        b[a + 3].charCodeAt(0) === 69 // e E
      ) && (
        is(b[a + 4], cc.RAN) ||
        ws(b[a + 4])
      )) {

        end = '</pre>';
        ltype = 'ignore';
        preserve = true;

      } else {

        simple = true;
        end = '>';

      }

    } else if (is(b[a], cc.LCB)) {

      if (jsx) {
        ext = true;
        earlyexit = true;
        record.token = '{';
        record.types = 'script_start';
        parse.structure.push([ 'script', parse.count ]);
        recordpush(data, record, NIL);
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

          let t = b.slice(a + 2, rcb - 1).join(NIL);

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
                start = b.slice(a, rcb + 1).join(NIL);
                end = b.slice(idx1, idx2 + 1).join(NIL);

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

    if (rules.preserveAttributes === true) preserve = true;
    if (earlyexit) return;

    // This is the real tag lexer.
    // Everything that follows is attribute handling and edge cases
    lastchar = end.charAt(end.length - 1);

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

      if (element.replace(start, NIL).trimStart().startsWith('@prettify-ignore-start')) {
        record.token = element;
        record.types = 'ignore';
        recordpush(data, record, NIL);
        return;
      }

    } else if (a < c) {

      /* -------------------------------------------- */
      /* CONSTANTS                                    */
      /* -------------------------------------------- */

      /**
       * Lexing store - Character in the lex will reside here
       */
      const lex = [];

      /* -------------------------------------------- */
      /* REFERENCES                                   */
      /* -------------------------------------------- */

      /**
       * An advancement index reference
       */
      let e = 0;

      /**
       * An advancement index reference
       */
      let f = 0;

      /**
       * Angle bracket count, ie: `<` and `>`
       */
      let acount = 0;

      /**
       * Brace count, ie: `{` and ``
       */
      let bcount = 0;

      /**
       * Parenthesis count, ie: `(` and `)`
       */
      let pcount = 0;

      /**
       * Line count - This is applied to the data structure
       */
      let lines = 0;

      /**
       * The quotation character store reference
       */
      let quote = NIL;

      /**
       * JSX/TSX quotataion character
       */
      let jsxquote = NIL;

      /**
       * JSX/TSX parenthesis counts, ie: `{` and `}`
       */
      let jsxcount = 0;

      /**
       * Whether or not we are within a Liquid template token
       */
      let liquid = false;

      /**
       * Whether or not we should invoke a whitespace test
       */
      let stest = false;

      /**
       * Whether or not we are at a starting attribute value quote.
       * This reference will always us to consume nested quotations
       * like those we'd encounter in Liquid tokens.
       */
      let qattr = false;

      /**
       * Whether or not we should invoke a quotation test
       */
      let qtest = false;

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

        if (liquid === false && is(b[a - 1], cc.LCB) && (
          is(b[a], cc.LCB) ||
          is(b[a], cc.PER)
        )) {

          return true;

        } else if (liquid === true && is(b[a], cc.RCB) && (
          is(b[a - 1], cc.RCB) ||
          is(b[a - 1], cc.PER)
        )) {

          return false;

        }

        return liquid;

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
       *
       * ---
       * Original: lexer_markup_tag_lexattr
       */
      function lexattr (quotes: boolean) {

        let name: string[];
        let attr = NIL;
        let aa = 0;
        let bb = 0;

        const ignoreattr = 'data-prettify-ignore';

        if (quotes === true) {

          attr = attribute.join(NIL);
          name = attrname(attr);

          quote = NIL;

          // HOT PATCH
          //
          // Replaced the attribute ignore logic for 'data-parse-ignore' to
          // data-prettify-ignore and also removed 'data-prettydiff-ignore'
          if (name[0] === ignoreattr) ignoreme = true;

        } else {

          attr = attribute.join(NIL);

          if (jsx === false || (jsx && not(attr[attr.length - 1], cc.RCB))) {
            attr = attr.replace(/\s+/g, ' ');
          }

          name = attrname(attr);

          if (name[0] === ignoreattr) ignoreme = true;
          if (jsx && is(attribute[0], cc.LCB) && is(attribute[attribute.length - 1], cc.RCB)) jsxcount = 0;

        }

        if (is(attr[0], cc.LCB) && is(attr[1], cc.PER)) nosort = true;

        if (quotes === false) {
          if (isLiquidStart(attr)) {
            ttexp = ttexp + 1;
          } else if (isLiquidEnd(attr)) {
            ttexp = ttexp - 1;
          }
        }

        attr = attr
          .replace(/^\u0020/, NIL)
          .replace(/\u0020$/, NIL);

        attribute = attr
          .replace(/\r\n/g, '\n')
          .split('\n');

        bb = attribute.length;

        if (aa < bb) {
          do {
            attribute[aa] = attribute[aa].replace(/(\s+)$/, NIL);
            aa = aa + 1;
          } while (aa < bb);
        }

        attr = attribute.join(options.crlf === true ? '\r\n' : '\n');
        attr = bracketSpace(attr);

        if (ttexp >= 1 || isLiquid(attr, 1)) {
          if (isLiquid(attr, 5) === false) {
            lines = is(b[a + 1], cc.NWL) || is(b[a], cc.NWL)
              ? 2
              : is(b[a], cc.WSP) && not(b[a + 1], cc.WSP) ? 1 : 0;
          } else {
            lines = is(b[a + 1], cc.NWL) ? 2 : not(b[a + 1], cc.WSP) ? 0 : lines;
          }
        }

        if (attr === '=') {

          attrstore[attrstore.length - 1][0] = `${attrstore[attrstore.length - 1][0]}=`;

        } else if (
          is(attr[0], cc.EQS) &&
          attrstore.length > 0 &&
          attrstore[attrstore.length - 1][0].indexOf('=') < 0
        ) {

          // If an attribute starts with a `=` then adjoin it to the last attribute
          attrstore[attrstore.length - 1][0] = attrstore[attrstore.length - 1][0] + attr;

          // HOT PATCH
          //
          // Ensure that if Liquid attribute is contained that
          // we apply the line level indentations
          if (ttexp >= 1 || isLiquid(attr, 5)) attrstore[attrstore.length - 1][1] = lines;

        } else if (
          not(attr[0], cc.EQS) &&
          attrstore.length > 0 &&
          attrstore[attrstore.length - 1][0].indexOf('=') === attrstore[attrstore.length - 1][0].length - 1
        ) {

          // If an attribute follows an attribute ending with `=` then adjoin it to the last attribute
          attrstore[attrstore.length - 1][0] = attrstore[attrstore.length - 1][0] + attr;

        } else if (attr !== NIL && attr !== ' ') {

          attrstore.push([ attr, lines ]);

        }

        if (attrstore.length > 0) {

          const [ value ] = attrstore[attrstore.length - 1];

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

          liquid = inliquid();
          lex.push(b[a]);

          if (is(lex[0], cc.LAN) && is(lex[1], cc.RAN) && is(end, cc.RAN)) {
            record.token = '<>';
            record.types = 'start';
            recordpush(data, record, '(empty)');
            return;
          }

          if (is(lex[0], cc.LAN) && is(lex[1], cc.FWS) && is(lex[2], cc.RAN) && is(end, cc.RAN)) {
            record.token = '</>';
            record.types = 'end';
            recordpush(data, record, NIL);
            return;
          }
        }

        if (ltype === 'cdata' && is(b[a], cc.RAN) && is(b[a - 1], cc.RSB) && not(b[a - 2], cc.RSB)) {
          parse.error = `CDATA tag (${lex.join(NIL)}) not properly terminated with "]]>"`;
          break;
        }

        if (ltype === 'comment') {

          quote = NIL;

          // Comments must ignore fancy encapsulations and attribute parsing
          if (b[a] === lastchar && lex.length > end.length + 1) {

            // If current character matches the last character of the tag ending sequence
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
        } else {

          if (quote === NIL) {

            if (is(lex[0], cc.LAN) && is(lex[1], cc.BNG) && ltype !== 'cdata') {

              if (ltype === 'doctype' && is(b[a], cc.RAN)) break;

              if (is(b[a], cc.LSB)) {

                if (is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }

                if (ws(b[a + 1])) {
                  do {
                    a = a + 1;
                    if (is(b[a], cc.NWL)) lines = lines + 1;
                  } while (a < c - 1 && ws(b[a + 1]));
                }

                if (is(b[a + 1], cc.LAN)) {
                  ltype = 'start';
                  break;
                }
              }
            }

            if (jsx) {
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
              />{2,3}/.test(end) === false &&
              simple
            ) {
              parse.error = `Parse error (line ${parse.lineNumber}) on: ${lex.join(NIL)}`;
            }

            if (stest === true && ws(b[a]) === false && b[a] !== lastchar) {

              // Attribute start
              stest = false;
              igcount = 0;
              quote = jsxquote;

              lex.pop();

              if (a < c) {

                do {

                  if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

                  if (rules.preserveAttributes === true) {
                    lex.push(b[a]);
                  } else {
                    attribute.push(b[a]);
                  }

                  if (not(quote, cc.DQO) || not(quote, cc.SQO)) {
                    if (is(b[a - 1], cc.LCB) && (is(b[a], cc.PER) || is(b[a], cc.LCB))) {
                      liquid = true;
                    } else if ((is(b[a - 1], cc.RCB) || is(b[a - 1], cc.PER)) && is(b[a], cc.RCB)) {
                      liquid = false;
                    }
                  }

                  if (jsx === false && qattr === false && liquid === true && rules.preserveAttributes === false) {

                    const isval = is(attribute[0], cc.EQS);

                    do {

                      a = a + 1;

                      if (is(b[a], cc.NWL)) {

                        parse.lineNumber = parse.lineNumber + 1;

                        if (isval) {
                          liquid = false;
                          quote = NIL;
                          lexattr(false);
                          break;
                        }
                      }

                      attribute.push(b[a]);

                      if (isval && is(b[a + 1], cc.RAN)) {
                        liquid = false;
                        quote = NIL;
                        attrstore[attrstore.length - 1][0] += attribute.join(NIL);
                        attribute = [];
                        break;
                      }

                      if (isval === false && (is(b[a - 1], cc.RCB) || is(b[a - 1], cc.PER)) && is(b[a], cc.RCB)) {
                        liquid = false;
                        quote = NIL;
                        lexattr(false);
                        break;
                      }

                    } while (a < c);

                  }

                  if (jsx === false && (
                    is(b[a], cc.LAN) ||
                    is(b[a], cc.RAN)
                  ) && (
                    quote === NIL ||
                    is(quote, cc.RAN)
                  )) {

                    if (quote === NIL && is(b[a], cc.LAN)) {

                      quote = '>';
                      acount = 1;

                    } else if (is(quote, cc.RAN)) {

                      if (is(b[a], cc.LAN)) {

                        acount = acount + 1;

                      } else if (is(b[a], cc.RAN)) {

                        acount = acount - 1;

                        if (acount === 0) {
                          quote = NIL;
                          igcount = 0;
                          lexattr(false);
                          break;
                        }
                      }
                    }

                  } else if (quote === NIL) {

                    if (b[a + 1] === lastchar) {

                      // If at end of tag
                      if (is(attribute[attribute.length - 1], cc.FWS) || (
                        is(attribute[attribute.length - 1], cc.QWS) &&
                        ltype === 'xml'
                      )) {
                        attribute.pop();
                        if (preserve === true) lex.pop();
                        a = a - 1;
                      }

                      if (attribute.length > 0) lexattr(false);

                      break;
                    }

                    if (jsx === false && is(b[a], cc.LCB) && is(b[a - 1], cc.EQS)) {

                      quote = '}';

                    } else if (is(b[a], cc.DQO) || is(b[a], cc.SQO)) {

                      quote = b[a];

                      if (qattr === false && liquid === false) qattr = true;

                      if (is(b[a - 1], cc.EQS) && (is(b[a + 1], cc.LAN) || (
                        is(b[a + 1], cc.LCB) &&
                        is(b[a + 2], cc.PER)
                      ) || (
                        ws(b[a + 1]) &&
                        not(b[a - 1], cc.EQS)
                      ))) {

                        igcount = a;

                      }

                    } else if (is(b[a], cc.LPR)) {

                      quote = ')';
                      pcount = 1;

                    } else if (jsx) {

                      // JSX Variable attribute
                      if ((is(b[a - 1], cc.EQS) || ws(b[a - 1])) && is(b[a], cc.LCB)) {

                        quote = '}';
                        bcount = 1;

                      } else if (is(b[a], cc.FWS)) {

                        // JSX Comments
                        if (is(b[a + 1], cc.ARS)) {
                          quote = '\u002a/';
                        } else if (b[a + 1] === '/') {
                          quote = '\n';
                        }

                      }

                    } else if (is(lex[0], cc.LCB) && is(b[a], cc.LCB) && (
                      is(b[a + 1], cc.LCB) ||
                      is(b[a + 1], cc.PER)
                    )) {

                      // Opening embedded template expression
                      quote = is(b[a + 1], cc.LCB) ? '}}' : b[a + 1] + '}';

                    }

                    if (ws(b[a]) && quote === NIL) {

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
                                qtest = true;
                                attribute.pop();
                              }

                              break;
                            }

                            e = e + 1;
                          } while (e < c);
                        }
                      }

                      if (qtest === true) {

                        qtest = false;

                      } else if (jsxcount === 0 || (jsxcount === 1 && is(attribute[0], cc.LCB))) {

                        // If there is an unquoted space attribute is complete
                        //
                        attribute.pop();

                        if (attribute.length > 0) lexattr(false);

                        stest = true;

                        break;

                      }
                    }
                  } else if (is(b[a], cc.LPR) && is(quote, cc.RPR)) {

                    pcount = pcount + 1;

                  } else if (is(b[a], cc.RPR) && is(quote, cc.RPR)) {

                    pcount = pcount - 1;

                    if (pcount === 0) {

                      quote = NIL;

                      if (b[a + 1] === end.charAt(0)) {
                        lexattr(false);
                        break;
                      }
                    }

                  } else if (jsx && (
                    is(quote, cc.RCB) || (
                      is(quote, cc.NWL) &&
                      is(b[a], cc.NWL)
                    ) || (
                      quote === '\u002a/' &&
                      is(b[a - 1], cc.ARS) &&
                      is(b[a], cc.FWS)
                    )
                  )) {

                    if (is(b[a], cc.TQO)) {

                      a = a + 1;

                      do {
                        attribute.push(b[a]);
                        if (is(b[a], cc.TQO)) break;
                        a = a + 1;
                      } while (a < b.length);
                    }

                    // JSX Attributes
                    if (is(quote, cc.RCB)) {
                      if (is(b[a], cc.RCB) && b[a] !== quote) {

                        bcount = bcount + 1;

                      } else if (b[a] === quote) {

                        bcount = bcount - 1;

                        if (bcount === 0) {

                          jsxcount = 0;
                          quote = NIL;
                          element = attribute.join(NIL);

                          if (rules.preserveAttributes === false) {
                            if (jsx) {
                              if (!/^\s*$/.test(element)) attrstore.push([ element, lines ]);
                            } else {
                              element = element.replace(/\s+/g, ' ');
                              if (element !== ' ') attrstore.push([ element, lines ]);
                            }
                          }

                          attribute = [];
                          lines = 1;
                          break;
                        }
                      }

                    } else {

                      jsxquote = NIL;
                      jscom = true;
                      element = attribute.join(NIL);

                      if (element !== ' ') attrstore.push([ element, lines ]);

                      attribute = [];
                      lines = is(quote, cc.NWL) ? 2 : 1;
                      quote = NIL;

                      break;
                    }

                  } else if (is(b[a], cc.LCB) && is(b[a + 1], cc.PER) && is(b[igcount - 1], cc.EQS) && (
                    is(quote, cc.DQO) ||
                    is(quote, cc.SQO)
                  )) {

                    quote = quote + '{%';
                    igcount = 0;

                  } else if (is(b[a - 1], cc.PER) && is(b[a], cc.RCB) && (
                    quote === '"{%' ||
                    quote === "'{%"
                  )) {

                    quote = quote.charAt(0);
                    igcount = 0;

                  } else if (is(b[a], cc.LAN) && is(end, cc.RAN) && is(b[igcount - 1], cc.EQS) && (
                    is(quote, cc.DQO) ||
                    is(quote, cc.SQO)
                  )) {

                    quote = quote + '<';
                    igcount = 0;

                  } else if (is(b[a], cc.RAN) && (
                    quote === '"<' ||
                    quote === "'<"
                  )) {

                    quote = quote.charAt(0);
                    igcount = 0;

                  } else if (igcount === 0 && not(quote, cc.RAN) && (quote.length < 2 || (
                    not(quote, cc.DQO) &&
                    not(quote, cc.SQO)
                  ))) {

                    // Terminate attribute at the conclusion of a quote pair
                    f = 0;
                    e = quote.length - 1;

                    if (e > -1) {

                      do {

                        if (b[a - f].charCodeAt(0) !== quote.charCodeAt(e)) break;

                        f = f + 1;
                        e = e - 1;

                      } while (e > -1);
                    }

                    if (e < 0 && liquid === false && qattr === true) {
                      qattr = false;
                      lexattr(true);
                      if (b[a + 1] === lastchar) break;
                    }

                  } else if (igcount > 0 && ws(b[a]) === false) {

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
              not(end, cc.NWL) &&
              is(b[a], cc.LAN) &&
              is(b[a + 1], cc.BNG) &&
              is(b[a + 2], cc.DSH) &&
              is(b[a + 3], cc.DSH) &&
              data.types[parse.count] !== 'conditional'
            ) {

              quote = '-->';

            } else if (is(b[a], cc.LCB) && not(lex[0], cc.LCB) && not(end, cc.NWL) && (
              is(b[a + 1], cc.LCB) ||
              is(b[a + 1], cc.PER)
            )) {

              if (is(b[a + 1], cc.LCB)) {

                quote = '}}';

              } else {

                quote = b[a + 1] + '}';

                if (attribute.length < 1 && (attrstore.length < 1 || ws(b[a - 1]))) {

                  lex.pop();

                  do {
                    if (is(b[a], cc.NWL)) lines = lines + 1;
                    attribute.push(b[a]);
                    a = a + 1;
                  } while (a < c && b[a - 1] + b[a] !== quote);

                  attribute.push('}');
                  attrstore.push([ attribute.join(NIL), lines ]);

                  attribute = [];
                  lines = 1;
                  quote = NIL;
                }
              }

              if (quote === end) quote = NIL;

            } else if (simple && not(end, cc.NWL) && ws(b[a]) && not(b[a - 1], cc.LAN)) {

              // Identify a space in a regular start or singleton tag
              stest = true;

            } else if (simple && jsx && is(b[a], cc.FWS) && (is(b[a + 1], cc.ARS) || is(b[a + 1], cc.FWS))) {

              // JSX Comment immediately following tag name
              stest = true;
              lex[lex.length - 1] = ' ';
              jsxquote = is(b[a + 1], cc.ARS) ? '\u002a/' : '\n';

              attribute.push(b[a]);

            } else if (liquid === false && (
              b[a] === lastchar || (is(end, cc.NWL) && is(b[a + 1], cc.LAN))
            ) && (
              lex.length > end.length + 1 || is(lex[0], cc.RSB)
            ) && (
              jsx === false || jsxcount === 0
            )) {

              if (is(end, cc.NWL)) {

                if (ws(lex[lex.length - 1])) {
                  do {
                    lex.pop();
                    a = a - 1;
                  } while (ws(lex[lex.length - 1]));
                }

                break;
              }

              // If current character matches the last character of the tag ending sequence
              f = lex.length;
              e = end.length - 1;

              if (e > -1) {
                do {
                  f = f - 1;
                  if (lex[f] !== end.charAt(e)) break;
                  e = e - 1;
                } while (e > -1);
              }

              if (e < 0) {

                // HOT PATCH
                //
                // This condition will fix incorrect line spaces applied
                // on template attributes that are contained in the attribute store
                //
                if (is(lex[f], cc.RAN) && is(b[a], cc.RAN) && attrstore.length > 0) {
                  if (attrstore[attrstore.length - 1][1] === 0 && is(b[a - 1], cc.RCB) && ws(b[a + 1])) {
                    attrstore[attrstore.length - 1][1] = is(b[a + 1], cc.WSP) ? 1 : 2;
                  }
                }

                break;

              }
            }
          } else if (
            b[a].charCodeAt(0) === quote.charCodeAt(quote.length - 1) && ((
              jsx && is(end, cc.RCB) && (b[a - 1] !== '\\' || escslash() === false)
            ) || (
              jsx === false || not(end, cc.RCB)
            ))
          ) {

            // Find the closing quote or embedded template expression
            f = 0;
            e = quote.length - 1;

            if (e > -1) {
              do {
                if (b[a - f] !== quote.charAt(e)) break;
                f = f + 1;
                e = e - 1;
              } while (e > -1);
            }

            if (e < 0) quote = NIL;

          }
        }

        a = a + 1;

      } while (a < c);

      // Correction to incomplete template tags that use multiple angle braceAllman
      if (rules.correct === true) {

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

          do { lex.splice(1, 1); } while (is(lex[1], cc.LAN));
        }
      }

      igcount = 0;
      element = lex.join(NIL);
      tname = tagName(element);
      element = bracketSpace(element);

      if (tname === 'xml') {
        html = 'xml';
      } else if (html === NIL && tname === 'html') {
        html = 'html';
      }
    }

    record.token = element;
    record.types = ltype as any;
    tname = tagName(element);

    if (preserve === false && jsx === false) element = element.replace(/\s+/g, ' ');

    // a quick hack to inject records for a type of template comments
    if (tname === 'comment' && isLiquid(element, 2)) {

      const open = element.slice(0, element.indexOf('%}') + 2);
      const comm = element.slice(element.indexOf('%}') + 2, element.lastIndexOf('{%'));
      const end = element.slice(element.lastIndexOf('{%'));

      let lstart: number = 0;
      let lend: number = 0;

      const lineFindStart = (spaces: string): string => {
        lstart = spaces === NIL ? 0 : spaces.split('\n').length;
        return NIL;
      };

      const lineFindEnd = (spaces: string): string => {
        lend = spaces === NIL ? 0 : spaces.split('\n').length;
        return NIL;
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
      record.lines = lstart;
      record.stack = 'comment';
      record.token = element;
      record.types = 'comment';

      recordpush(data, record, NIL);

      /* COMMENT END -------------------------------- */

      record.types = 'template_end';
      record.stack = 'comment';
      record.lines = lend;
      record.token = end;

      recordpush(data, record, NIL);

      return;

    }

    // a type correction for template tags who have variable start tag names but a
    // consistent ending tag name
    record.types = ltype;

    // cheat identifies HTML singleton elements as singletons even if formatted as
    // start tags, such as <br> (which is really <br/>)
    cheat = (() => {

      const ender = (/(\/>)$/);

      const peertest = (n: string, i: string) => {

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

      const htmlend = (count: number) => {

        record.lines = (data.lines[parse.count] > 0) ? 1 : 0;
        record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
        record.types = 'end';

        recordpush(data, record, NIL);

        if (count > 0) {
          do {
            record.begin = parse.structure[parse.structure.length - 1][1];
            record.stack = parse.structure[parse.structure.length - 1][0];
            record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
            recordpush(data, record, NIL);
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
          `/${tagName(lastToken)}` === tname
        ) {

          data.types[parse.count - 1] = 'start';
        }
      }

      if (html === 'html') {

        // HTML gets tag names in lowercase, if you want to
        // preserveLine case sensitivity beautify as XML
        if (
          is(element[0], cc.LAN) && not(element[1], cc.BNG) && not(element[1], cc.QWS) && (
            parse.count < 0 ||
            data.types[parse.count].indexOf('template') < 0
          )
        ) element = element.toLowerCase();

        if (
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          peertest(tname.slice(1), parse.structure[parse.structure.length - 2][0])
        ) {

          // Looks for HTML tags missing an ending pair when encountering an ending tag for a parent node
          htmlend(0);

        } else if (
          parse.structure.length > 3 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 2][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 3][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 4][0])
        ) {

          // Looks for consecutive missing end tags
          htmlend(3);

        } else if (
          parse.structure.length > 2 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 2][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 3][0])
        ) {

          // Looks for consecutive missing end tags
          htmlend(2);

        } else if (
          parse.structure.length > 1 &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          peertest(tname, parse.structure[parse.structure.length - 2][0])
        ) {

          // Looks for consecutive missing end tags
          htmlend(1);

        } else if (peertest(tname, parse.structure[parse.structure.length - 1][0])) {

          // Certain tags cannot contain other certain tags if such tags are peers
          htmlend(0);

        } else if (
          is(tname[0], cc.FWS) &&
          grammar.html.tags.has(parse.structure[parse.structure.length - 1][0]) &&
          parse.structure[parse.structure.length - 1][0] !== tname.slice(1)
        ) {

          // Looks for consecutive missing end tags if the current element is an end tag
          fixhtmlend(element, false);

          record.begin = parse.structure[parse.structure.length - 1][1];
          record.lines = parse.linesSpace;
          record.stack = parse.structure[parse.structure.length - 1][0];
          record.token = element;
          record.types = 'end';

          data.lines[parse.count - 1] = 0;

        }

        // Inserts a trailing slash into singleton tags if they do not already have it
        if (jsx === false && grammar.html.voids.has(tname)) {

          if (
            rules.correct === true &&
            ender.test(element) === false) element = element.slice(0, element.length - 1) + ' />';

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

    // console.log(tname);

    // determine if the markup tag potentially contains code interpreted by a
    // different lexer
    if ((
      grammar.embed('html', tname) &&
      element.slice(element.length - 2) !== '/>'
    ) || (
      grammar.embed('liquid', tname) &&
      element.slice(element.length - 2) === '%}'
    )) {

      const liquid = isLiquid(element, 3);

      // get the attribute value for "type"
      let len = attrstore.length - 1;
      let attValue = NIL;
      let attrName = [];

      if (len > -1) {
        do {

          attrName = attrname(attrstore[len][0]);

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

      // console.log(liquid);

      // ext is flag to send information between the tag lexer and the content lexer
      //
      // HOTFIX
      //
      // Lets also capture JSON types which are defined
      // via application/json or application/ld+json
      //
      if (liquid === false && grammar.embed('html', tname)) {

        ext = true;

        if (attValue === NIL) {
          extlang = grammar.html.embed[tname].language;
        } else if (grammar.html.embed[tname].value(attValue)) {
          extlang = grammar.html.embed[tname].language;
        }

      } else if (liquid === true && grammar.embed('liquid', tname)) {

        ext = true;

        if (attValue === NIL) {
          extlang = grammar.liquid.embed[tname].language;
        } else {
          extlang = grammar.liquid.embed[tname].language;
        }
      }

      if (ext === true) {

        len = a + 1;

        if (len < c) {

          do {

            if (ws(b[len]) === false) {

              if (is(b[len], cc.LAN)) {

                if (b.slice(len + 1, len + 4).join(NIL) === '!--') {

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

        attrstore.forEach((value) => atstring.push(value[0]));

        preserve = true;
        ltype = 'ignore';

        a = a + 1;

        if (a < c) {

          let delim = NIL;
          let ee = 0;
          let ff = 0;
          let endtag = false;

          do {

            if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

            tags.push(b[a]);

            if (delim === NIL) {

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

              if (ee < 0) delim = NIL;

            }

            a = a + 1;

          } while (a < c);
        }
      }

      element = element + tags.join(NIL);
      element = element.replace('>', ` ${atstring.join(' ')}>`);

      record.token = element;
      record.types = 'content-ignore' as any;
      attrstore = [];

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

        } else if (grammar.liquid.else.has(tname)) {

          record.types = 'template_else';

        } else {

          if (grammar.liquid.tags.has(tname)) {
            record.types = 'template_start';
          } else if (
            tname.charCodeAt(0) === 101 && // e
            tname.charCodeAt(1) === 110 && // n
            tname.charCodeAt(2) === 100 && // d
            grammar.liquid.tags.has(tname.slice(3))
          ) {

            record.types = 'template_end';

          } else if (
            tname.charCodeAt(0) === 101 && // e
            tname.charCodeAt(1) === 110 && // n
            tname.charCodeAt(2) === 100 // d
          ) {

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
        if (tname === NIL || is(tname, cc.PER)) {

          tname = tname + element
            .slice(1)
            .replace(tname, NIL)
            .replace(/^\s+/, NIL);

          tname = tname
            .slice(0, tname.indexOf('('))
            .replace(/\s+/, NIL);
        }
      }

      if (rules.quoteConvert === 'double') {
        record.token = record.token.replace(/'/g, '"');
      } else if (rules.quoteConvert === 'single') {
        record.token = record.token.replace(/"/g, "'");
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

      element = element.replace(/^(\s*<!\[cdata\[)/i, NIL).replace(/(\]\]>\s*)$/, NIL);

      recordpush(data, record, NIL);

      parse.structure.push([ 'cdata', parse.count ]);

      if (stack === 'script') {
        prettify.lexers.script(element);
      } else {
        prettify.lexers.style(element);
      }

      record.begin = parse.structure[parse.structure.length - 1][1];
      record.token = ']]>';
      record.types = 'cdata_end';

      recordpush(data, record, NIL);

      parse.structure.pop();

    } else {

      // Liquid Tags and other items are pushed here
      recordpush(data, record, tname);

      // console.log(data);

    }

    attrecord();

    // Inserts a script space in anticipation of word wrap since
    // JSX has unique white space rules
    if (options.wrap > 0 && jsx === true) {

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

      }
    }

    parse.linesSpace = 0;
  }

  // parses everything other than markup tags
  function content () {

    const lex = [];
    const now = a;
    const jsxbrace = is(data.token[parse.count], cc.LCB) && jsx === true;

    let ltoke = NIL;
    let liner = parse.linesSpace;
    let name: string = NIL;

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
      data.token[parse.count].charCodeAt(data.token[parse.count].length - 1) === cc.LSB
    );

    const record: Record = {
      begin: parse.structure[parse.structure.length - 1][1],
      ender: -1,
      lexer: 'markup',
      lines: liner,
      stack: parse.structure[parse.structure.length - 1][0],
      token: NIL,
      types: 'content'
    };

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

      let end = NIL;
      let quote = NIL;
      let output = NIL;
      let quotes = 0;

      do {

        if (is(b[a], cc.NWL)) parse.lineNumber = parse.lineNumber + 1;

        // external code requires additional parsing to look for the appropriate end
        // tag, but that end tag cannot be quoted or commented
        if (ext === true) {
          if (quote === NIL) {

            if (is(b[a], cc.FWS)) {

              if (is(b[a + 1], cc.ARS)) {
                quote = '*';
              } else if (is(b[a + 1], cc.FWS)) {
                quote = '/';
              } else if (name === 'script' && '([{!=,;.?:&<>'.indexOf(b[a - 1]) > -1) {
                if (jsx === false || not(b[a - 1], cc.LAN)) quote = 'reg';
              }

            } else if ((is(b[a], cc.DQO) || is(b[a], cc.SQO) || is(b[a], cc.TQO)) && esctest() === false) {

              quote = b[a];

            } else if (is(b[a], cc.LCB) && jsxbrace === true) {

              quotes = quotes + 1;

            } else if (is(b[a], cc.RCB) && jsxbrace === true) {

              if (quotes === 0) {

                output = lex
                  .join(NIL)
                  .replace(/^\s+/, NIL)
                  .replace(/\s+$/, NIL);

                prettify.lexers.script(output);
                parse.structure[parse.structure.length - 1][1] += 1; // Added incremental

                if (data.types[parse.count] === 'end' && data.lexer[data.begin[parse.count] - 1] === 'script') {
                  record.lexer = 'script';
                  record.token = rules.correct === true ? ';' : 'x;';
                  record.types = 'separator';
                  recordpush(data, record, NIL);
                  record.lexer = 'markup';
                }

                record.token = '}';
                record.types = 'script_end';

                recordpush(data, record, NIL);

                parse.structure.pop();

                break;
              }

              quotes = quotes - 1;
            }

            if (isLiquid(data.token[parse.count], 3) === false) {

              end = b
                .slice(a, a + 10)
                .join(NIL)
                .toLowerCase();

              // script requires use of the script lexer
              if (name === 'script') {

                // console.log(data.types[parse.count]);

                end = a === c - 9
                  ? end.slice(0, end.length - 1)
                  : end.slice(0, end.length - 2);

                if (end === '</script') {

                  output = lex
                    .join(NIL)
                    .replace(/^\s+/, NIL)
                    .replace(/\s+$/, NIL);

                  a = a - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(output) && (/--+>$/).test(output)) {
                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, NIL);

                    output = output
                      .replace(/^<!--+/, NIL)
                      .replace(/--+>$/, NIL);

                    prettify.lexers.script(output);
                    record.token = '-->';

                    recordpush(data, record, NIL);

                  } else {

                    prettify.options.language = extlang;
                    prettify.lexers.script(output);

                    if (
                      (
                        extlang === 'json' && options.json.objectSort === true
                      ) || (
                        extlang !== 'json' && options.script.objectSort === true
                      )
                    ) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = 'html';

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
                    .join(NIL)
                    .replace(/^\s+/, NIL)
                    .replace(/\s+$/, NIL);

                  a = a - 1;

                  if (lex.length < 1) break;

                  if ((/^<!--+/).test(outside) && (/--+>$/).test(outside)) {
                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, NIL);

                    outside = outside
                      .replace(/^<!--+/, NIL)
                      .replace(/--+>$/, NIL);

                    prettify.lexers.style(outside);
                    record.token = '-->';

                    recordpush(data, record, NIL);

                  } else {

                    prettify.options.language = extlang;
                    prettify.lexers.style(outside);

                    if (options.style.sortProperties === true) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = 'html';

                  }

                  break;
                }
              }

            } else {

              if (grammar.embed('liquid', name)) {

                end = b
                  .slice(a)
                  .join(NIL)
                  .toLowerCase();

                if (grammar.liquid.embed[name].end(end)) {

                  end = end.slice(0, end.indexOf('%}') + 2);

                  output = lex
                    .join(NIL)
                    .replace(/^\s+/, NIL)
                    .replace(/\s+$/, NIL);

                  a = a + end.length - 1;

                  if (lex.length < 1) break;

                  const mode = lexmap[grammar.liquid.embed[name].language];

                  if ((/^<!--+/).test(output) && /--+>$/.test(output)) {

                    record.token = '<!--';
                    record.types = 'comment';

                    recordpush(data, record, NIL);

                    output = output
                      .replace(/^<!--+/, NIL)
                      .replace(/--+>$/, NIL);

                    prettify.lexers[mode](output);
                    record.token = '-->';

                    recordpush(data, record, NIL);

                  } else {

                    prettify.options.language = grammar.liquid.embed[name].language;
                    prettify.lexers[mode](output);

                    if (
                      (
                        (extlang === 'json') && options.json.objectSort === true
                      ) || (
                        (extlang === 'javascript') && options.script.objectSort === true
                      ) || (
                        (extlang === 'css' || extlang === 'scss') && options.style.sortProperties === true
                      )
                    ) parse.sortCorrection(0, parse.count + 1);

                    prettify.options.language = 'liquid';

                    record.token = end;
                    record.types = 'template_end';

                    recordpush(data, record, NIL);

                  }

                  break;

                }

              }

            }

          } else if (quote === b[a] && (
            is(quote, cc.DQO) ||
            is(quote, cc.SQO) ||
            is(quote, cc.TQO) || (is(quote, cc.ARS) && is(b[a + 1], cc.FWS))
          ) && esctest() === false) {
            quote = NIL;
          } else if (is(quote, cc.TQO) && b[a] === '$' && is(b[a + 1], cc.LCB) && esctest() === false) {
            quote = '}';
          } else if (is(quote, cc.RCB) && is(b[a], cc.RCB) && esctest() === false) {
            quote = '`';
          } else if (is(quote, cc.FWS) && (is(b[a], cc.NWL) || b[a] === '\r')) {
            quote = NIL;
          } else if (quote === 'reg' && is(b[a], cc.FWS) && esctest() === false) {
            quote = NIL;
          } else if (is(quote, cc.FWS) && is(b[a], cc.LAN) && is(b[a - 1], cc.DSH) && is(b[a - 2], cc.DSH)) {

            end = b
              .slice(a + 1, a + 11)
              .join(NIL)
              .toLowerCase();

            end = end.slice(0, end.length - 2);

            if (name === 'script' && end === '</script') quote = NIL;

            end = end.slice(0, end.length - 1);

            if (name === 'style' && end === '</style') quote = NIL;

          }
        }

        // typically this logic is for artifacts nested within an SGML tag
        if (square === true && is(b[a], cc.RSB)) {

          a = a - 1;

          liner = 0;
          ltoke = lex.join(NIL);
          ltoke = ltoke.replace(/\s+$/, NIL);

          record.token = ltoke;
          recordpush(data, record, NIL);

          break;
        }

        // general content processing
        if (ext === false && lex.length > 0 && (
          (
            is(b[a], cc.LAN) &&
            not(b[a + 1], cc.EQS) && !(/\s|\d/).test(b[a + 1])) ||
            (is(b[a], cc.LSB) && is(b[a + 1], cc.PER)) ||
            (is(b[a], cc.LCB) && (jsx === true || is(b[a + 1], cc.LCB) || is(b[a + 1], cc.PER)))
        )) {

          // Regular content
          a = a - 1;

          if (parse.structure[parse.structure.length - 1][0] === 'comment') {
            ltoke = lex.join(NIL);
          } else {
            ltoke = lex.join(NIL).replace(/\s+$/, NIL);
          }

          ltoke = bracketSpace(ltoke);
          liner = 0;
          record.token = ltoke;

          if (options.wrap > 0 && rules.preserveText === false) {

            /* -------------------------------------------- */
            /* CONSTANTS                                    */
            /* -------------------------------------------- */

            const { wrap } = options;
            const startSpace = NIL;
            const endSpace = NIL;
            const store = [];

            /* -------------------------------------------- */
            /* LEXICALS                                     */
            /* -------------------------------------------- */

            let aa = wrap;
            let len = ltoke.length;

            const wrapper = () => {

              if (ltoke.charCodeAt(aa) === cc.WSP) {
                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;
                return;
              }

              do { aa = aa - 1; } while (aa > 0 && ltoke.charCodeAt(aa) !== cc.WSP);

              if (aa > 0) {

                store.push(ltoke.slice(0, aa));
                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;

              } else {

                aa = wrap;

                do { aa = aa + 1; } while (aa < len && ltoke.charCodeAt(aa) !== cc.WSP);

                store.push(ltoke.slice(0, aa));

                ltoke = ltoke.slice(aa + 1);
                len = ltoke.length;
                aa = wrap;

              }
            };

            // HTML anchor lists do not get wrapping unless the content itself exceeds
            // the wrapping limit defined in globals
            if (
              data.token[data.begin[parse.count]] === '<a>' &&
              data.token[data.begin[data.begin[parse.count]]] === '<li>' &&
              data.lines[data.begin[parse.count]] === 0 &&
              parse.linesSpace === 0 &&
              ltoke.length < options.wrap
            ) {
              recordpush(data, record, NIL);
              break;
            }

            if (len < wrap) {
              recordpush(data, record, NIL);
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

            ltoke = lex.join(NIL);
            ltoke = ltoke
              .replace(/^\s+/, NIL)
              .replace(/\s+$/, NIL)
              .replace(/\s+/g, ' ');

            do { wrapper(); } while (aa < len);

            if (ltoke !== NIL && not(ltoke, cc.WSP)) store.push(ltoke);

            ltoke = options.crlf === true ? store.join('\r\n') : store.join('\n');
            ltoke = startSpace + ltoke + endSpace;

          }

          liner = 0;
          record.token = ltoke;
          recordpush(data, record, NIL);
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
        .join(NIL)
        .replace(/\s+$/, NIL);

      liner = 0;

      // this condition prevents adding content that was just added in the loop above
      if (record.token !== ltoke) {
        record.token = ltoke;
        recordpush(data, record, NIL);
        parse.linesSpace = 0;
      }
    }

    ext = false;
  };

  // trim the options.attributeSortList values
  if (asl > 0) {

    do {

      rules.attributeSortList[a] = rules.attributeSortList[a]
        .replace(/^\s+/, NIL)
        .replace(/\s+$/, NIL);

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

    } else if (is(b[a], cc.LAN)) {

      tag(NIL);

    } else if (is(b[a], cc.LSB) && is(b[a + 1], cc.PER)) {

      tag('%]');

    } else if (is(b[a], cc.LCB) && (jsx || is(b[a + 1], cc.LCB) || is(b[a + 1], cc.PER))) {

      tag(NIL);

    } else if (is(b[a], cc.DSH) && is(b[a + 1], cc.DSH) && is(b[a + 2], cc.DSH)) {

      tag('---');

    } else {
      content();
    }

    a = a + 1;

  } while (a < c);

  if (
    not(data.token[parse.count][0], cc.FWS) &&
    grammar.html.tags.has(parse.structure[parse.structure.length - 1][0])
  ) fixhtmlend(data.token[parse.count], true);

  // console.log(data);

  if (count.end !== count.start && parse.error === NIL) {

    if (count.end > count.start) {
      const x = count.end - count.start;
      const plural = (x === 1) ? NIL : 's';
      // const token = data.types.lastIndexOf('end');
      parse.error = [
        'Prettify Error:',
        // '',
        // `${count.line - 1} |`,
        //  `${count.line - 0} | ${data.token[token]}`,
        // `${count.line + 1} | ^`,
        '',
      `${x} more end type${plural} than start types`
      ].join('\n');

    } else {
      const x = count.start - count.end;

      const plural = (x === 1) ? NIL : 's';
      // const token = data.types.lastIndexOf('start');
      parse.error = [
        'Prettify Error:',
        // '',
        // `${count.line - 1} | ${data.token[count.index]}`,
        // `${count.line - 0} | ${data.token[token]}`,
        // `${count.line + 1} | ^`,
        '',
      `${x} more start type${plural} than end types`
      ].join('\n');

    }

  }

  return data;

};
