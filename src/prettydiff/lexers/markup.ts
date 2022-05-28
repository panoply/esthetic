
import { sparser } from '../parser/parse';
import { IRecord, Parsed, HTMLBlocks, HTMLVoids, Types } from '../../types/sparser';
import { cc } from '../shared/enums';
import { isLiquidOutputTag } from '../shared/utils';

export default (() => {

  /* -------------------------------------------- */
  /* STATICS                                      */
  /* -------------------------------------------- */

  /**
   * HTML Block reference map
   *
   * > We omit the prototype because we live in a society, we are not animals.
   */
  const blocks: { [K in HTMLBlocks]: 'block' } = Object.create(null); // eslint-disable-line

  blocks.body = 'block';
  blocks.colgroup = 'block';
  blocks.dd = 'block';
  blocks.dt = 'block';
  blocks.head = 'block';
  blocks.html = 'block';
  blocks.li = 'block';
  blocks.option = 'block';
  blocks.p = 'block';
  blocks.tbody = 'block';
  blocks.td = 'block';
  blocks.tfoot = 'block';
  blocks.th = 'block';
  blocks.thead = 'block';
  blocks.tr = 'block';

  /**
   * HTML Void reference map
   *
   * > We omit the prototype because we live in a society, we are not animals.
   */
  const voids: { [K in HTMLVoids]: 'singleton' } = Object.create(null); // eslint-disable-line

  voids.area = 'singleton';
  voids.base = 'singleton';
  voids.basefont = 'singleton';
  voids.br = 'singleton';
  voids.col = 'singleton';
  voids.embed = 'singleton';
  voids.eventsource = 'singleton';
  voids.frame = 'singleton';
  voids.hr = 'singleton';
  voids.image = 'singleton';
  voids.img = 'singleton';
  voids.input = 'singleton';
  voids.isindex = 'singleton';
  voids.keygen = 'singleton';
  voids.link = 'singleton';
  voids.meta = 'singleton';
  voids.param = 'singleton';
  voids.progress = 'singleton';
  voids.source = 'singleton';
  voids.wbr = 'singleton';

  /* -------------------------------------------- */
  /* LEXER                                        */
  /* -------------------------------------------- */

  /**
   * Markup Lexer
   *
   * Used to parse markup languages. This used to be used for multiple
   * template languages in Sparser but has been refactored to solely
   * focus and support the following language only:
   *
   * - HTML
   * - XML
   * - JSX
   * - SGML
   * - Liquid.
   */
  sparser.lexers.markup = function markup (source: string) {

    /**
     * Deconstructed options from sparser
     */
    const { parse, options } = sparser;

    /**
     * Lexer Options
     */
    const { lexerOptions } = options;

    /**
     * Parse data reference
     */
    const { data } = parse;

    /**
     * Deconstruct some preset options
     */
    const { attributeSortList } = lexerOptions.markup;

    /**
     * Attribute sorting list length
     */
    const asl = attributeSortList.length;

    /**
     * Count reference to be assigned to the
     * generated tree.
     *
     * > We omit the prototype because we live in a society, we are not animals.
     */
    const count: { end: number; start: number; index: number } = Object.create(null);
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
    let sgmlflag = 0;

    /**
     * Extension
     */
    let ext = false;

    /**
     * HTML String
     */
    let html = '';

    /* -------------------------------------------- */
    /* FUNCTIONS                                    */
    /* -------------------------------------------- */

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
        return input.charCodeAt(0) === cc.LCB && (
          input.charCodeAt(1) === cc.PER ||
          input.charCodeAt(1) === cc.LCB
        );
      } else if (direction === 2) {
        return (
          input.charCodeAt(input.length - 1) === cc.RCB && (
            input.charCodeAt(input.length - 2) === cc.PER ||
            input.charCodeAt(input.length - 2) === cc.RCB
          )
        );

      } else if (direction === 3) {
        return (
          input.charCodeAt(0) === cc.LCB && (
            input.charCodeAt(1) === cc.PER ||
            input.charCodeAt(1) === cc.LCB
          )
        ) && (
          input.charCodeAt(input.length - 1) === cc.RCB && (
            input.charCodeAt(input.length - 2) === cc.PER ||
            input.charCodeAt(input.length - 2) === cc.RCB
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
    function recordPush (target: Parsed, record: IRecord, structure: string) {

      // console.log(target);
      if (target === data) {
        if (record.types.indexOf('end') > -1) {
          count.end = count.end + 1;
        } else if (record.types.indexOf('start') > -1) {
          count.start = count.start + 1;
        }
      }

      if (lexerOptions.markup.parseSpace === true) record.lines = 0;

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
       * ----
       *
       * @prettify
       *
       * We eliminate the possibility of Ruby ERB to be matched or
       * other delimeter template languages. Instead we only want Liquid
       * delimiters.
       */
      const regex = /^({[{%]-?\s*)/;

      if (typeof tag !== 'string') return '';

      space = tag.replace(regex, '%').replace(/\s+/, ' ').indexOf(' ');
      name = tag.replace(regex, ' ');
      name = space < 0 ? name.slice(1, tag.length - 1) : name.slice(1, space);

      if (html === 'html') name = name.toLowerCase();

      /**
       * @pettify
       *
       * PRETTIFY PATCH
       *
       * Liquid delimiters that did not contain a space were failing
       * to have their name matched and instead ignore by the beautificiation
       * process, for example:
       *
       * {{tag}} would match
       * {{tag-}} would not match
       * {% endtag%} would not match
       * {%else%} would not match
       */
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
      const record: IRecord = Object.create(null); // fuck the prototype

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

      recordPush(data, record, '');

      if (blocks[parse.structure[parse.structure.length - 1][0]] === 'block' && (
        (end === true && parse.structure.length > 1) ||
        (end === false && `/${parse.structure[parse.structure.length - 1][0]}` !== tname)
      )) {

        do {

          record.begin = parse.structure[parse.structure.length - 1][1];
          record.stack = parse.structure[parse.structure.length - 1][0];
          record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;

          recordPush(data, record, '');

        } while (blocks[parse.structure[parse.structure.length - 1][0]] === 'block' && (
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

      const record: IRecord = Object.create(null); // fuck the prototype
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
       * Lexer Type, ie: `start`, `template` etc etc
       */
      let ltype: Types = '' as Types;

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
       * Infers a simple lex to be applied, typically used on easy taga
       */
      let simple = false;

      /**
       * Whether or not the tag is a singleton type, eg: `<meta>`
       */
      let singleton = false;

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
      function attributeName (x: string) {

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
      function attributeRecord () {

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
        const stack = tname.replace(/\/$/, '');

        /**
         * Type of quotation character to convert
         */
        const qc = lexerOptions.markup.quoteConvert;

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

            // console.log(record);

            recordPush(data, record, '');

          } else {

            let ee = 0;
            let inner = false;

            const chars = record.token.split('');
            const eq = record.token.indexOf('=');
            const len = chars.length - 1;

            if (
              chars[eq + 1] !== '"'
              && chars[chars.length - 1] !== '"'
              && qc === 'single'
            ) {

              recordPush(data, record, '');

            } else if (
              chars[eq + 1].charCodeAt(0) !== cc.SQO
              && chars[chars.length - 1].charCodeAt(0) !== cc.SQO
              && qc === 'double'
            ) {

              recordPush(data, record, '');

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
              recordPush(data, record, '');
            }
          }
        };

        function templateattrs (sample: string, token: string) {

          if (sample.charAt(0) === '{' && '{%'.indexOf(sample.charAt(1)) > -1) {
            record.types = 'template_attribute';
          } else if (sample.charAt(0) === '<') {
            record.types = 'template_attribute';
          } else {

            record.token = token;
            convertq();
            return;
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
        if (attstore[attstore.length - 1][0] === '/') {
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
          (lexerOptions.markup.attributeSort === true)
          && options.language !== 'jsx'
          && jscom === false
          && nosort === false
        ) {

          // if making use of the 'attributeSortList` option
          if (asl > 0) {

            const tempstore = [];

            dq = 0;
            eq = 0;
            len = attstore.length;

            // loop through the attributeSortList looking for attribute name matches
            do {

              // loop through the attstore
              eq = 0;

              do {

                name = attstore[eq][0].split('=')[0];

                if (attributeSortList[dq] === name) {
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
              if (isLiquid(attstore[idx][0], 3) || isLiquid(attstore[idx][0], 5)) {

                record.types = 'template_attribute';
                record.token = attstore[idx][0];

                // console.log('ATTR', attstore[idx][0]);
                convertq();

              } else {

                record.types = 'attribute';
                record.token = '#[{('.indexOf(attstore[idx][0].charAt(0)) < 0
                  ? attstore[idx][0].toLowerCase()
                  : record.token = attstore[idx][0];

                convertq();
              }

            } else {

              // separates out the attribute name from its value
              name = attstore[idx][0].slice(0, eq);
              value = attstore[idx][0].slice(eq + 1);

              if (options.attemptCorrection) {
                if ('<{"\'='.indexOf(value.charAt(0)) < 0) value = '"' + value + '"';
              }

              if (options.language === 'jsx' && /^\s*\{/.test(value)) {

                record.token = name + '={';
                record.types = 'jsx_attribute_start';

                recordPush(data, record, 'jsx_attribute');

                sparser.lexers.script(value.slice(1, value.length - 1));
                record.begin = parse.count;

                if (/\s\}$/.test(value)) {

                  value = value.slice(0, value.length - 1);
                  value = /\s+$/.exec(value)[0];

                  if (value.indexOf('\n') < 0) record.lines = 1;
                  else record.lines = value.split('\n').length;

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

                templateattrs(
                  value.replace(/^(["'])/, '').slice(0, 2),
                  name.replace(/(\s+)$/, '')
                );

              } else {

                record.types = 'attribute';
                record.token = '#[{('.indexOf(attstore[idx][0].charAt(0)) < 0
                  ? attstore[idx][0].toLowerCase()
                  : record.token = attstore[idx][0];

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
       * parsed tags are to be ignored and forgotten
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

      } else if (b[a] === '<') {

        if (b[a + 1] === '/') {

          end = '>';
          ltype = 'end';

        } else if (b[a + 1] === '!') {

          if (b[a + 2] === '-' && b[a + 3] === '-') {

            end = '-->';
            ltype = 'comment';
            start = '<!--';

          } else if (
            b[a + 2] === '['
            && b[a + 3] === 'C'
            && b[a + 4] === 'D'
            && b[a + 5] === 'A'
            && b[a + 6] === 'T'
            && b[a + 7] === 'A'
            && b[a + 8] === '['
          ) {

            end = ']]>';
            ltype = 'cdata';
            preserve = true;

          }

        } else if (b[a + 1] === '?') {

          end = '?>';

          if (
            b[a + 2] === 'x'
            && b[a + 3] === 'm'
            && b[a + 4] === 'l'
          ) {
            ltype = 'xml';
            simple = true;
          } else {
            preserve = true;
            ltype = 'template';
          }

        } else if (b[a + 1] === '%') {

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
      } else if (b[a] === '{') {

        if (options.language === 'jsx') {
          ext = true;
          earlyexit = true;
          record.token = '{';
          record.types = 'script_start';
          parse.structure.push([ 'script', parse.count ]);
          recordPush(data, record, '');
          return;
        }

        if (b[a + 1] === '{') {
          preserve = true;
          end = '}}';
          ltype = 'template';

        } else if (b[a + 1] === '%') {

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

      if (options.lexerOptions.markup.preserveAttributes === true) preserve = true;

      if (earlyexit === true) return;

      // This is the real tag lexer.
      // Everything that follows is attribute handling and
      // edge cases
      lastchar = end.charAt(end.length - 1);

      // console.log(ltype, b[a] + b[a + 1] + b[a + 2] + b[a + 3]);

      // HTML / Liquid Prettify comment ignore
      //
      if (ltype === 'comment' && (b[a] === '<' || (b[a] === '{' && b[a + 1] === '%'))) {

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

      } else if (a < c) {

        let bcount = 0;
        let braccount = 0;
        let jsxcount = 0;
        let e = 0;
        let f = 0;
        let parncount = 0;
        let lines = 1;
        let quote = '';
        let jsxquote = '';
        let stest = false;
        let quotetest = false;
        let attribute = [];

        const dustatt = [];
        const lex = [];

        /**
         * Finds slash escape sequences
         *
         * ---
         * Original: lexer_markup_tag_slashy
         */
        function slashy () {
          let x = a;

          do { x = x - 1; } while (b[x] === '\\');
          x = a - x;
          return x % 2 === 1;
        };

        /**
         * Attribute Lexer
         * ---
         * Original: lexer_markup_tag_attributeLexer
         */
        function attributeLexer (quotes: boolean) {

          let name: string[];
          let atty = '';
          let aa = 0;
          let bb = 0;

          const ignoreattr = 'data-prettify-ignore';

          if (quotes === true) {

            atty = attribute.join('');
            name = attributeName(atty);
            quote = '';

            // HOT PATCH
            //
            // Replaced the attribute ignore logic for 'data-parse-ignore' to
            // data-prettify-ignore and also removed 'data-prettydiff-ignore'
            if (name[0] === ignoreattr) ignoreme = true;

          } else {

            atty = attribute.join('');

            if (options.language !== 'jsx' || (
              options.language === 'jsx'
              && atty.charAt(atty.length - 1) !== '}'
            )) {
              atty = atty.replace(/\s+/g, ' ');
            }

            name = attributeName(atty);

            if (name[0] === ignoreattr) ignoreme = true;

            if (
              options.language === 'jsx'
              && attribute[0] === '{'
              && attribute[attribute.length - 1] === '}'
            ) {
              jsxcount = 0;
            }
          }

          if (atty.slice(0, 2) === '{%') nosort = true;

          atty = atty.replace(/^\u0020/, '').replace(/\u0020$/, '');
          attribute = atty.replace(/\r\n/g, '\n').split('\n');
          bb = attribute.length;

          if (aa < bb) {
            do {
              attribute[aa] = attribute[aa].replace(/(\s+)$/, '');
              aa = aa + 1;
            } while (aa < bb);
          }

          atty = attribute.join(options.crlf === true ? '\r\n' : '\n');
          atty = bracketSpace(atty);

          if (atty === '=') {

            attstore[attstore.length - 1][0] = `${attstore[attstore.length - 1][0]}=`;

          } else if (
            atty.charAt(0) === '='
            && attstore.length > 0
            && attstore[attstore.length - 1][0].indexOf('=') < 0
          ) {

            // if an attribute starts with a `=` then adjoin it to the last attribute
            attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + atty;

          } else if (
            atty.charAt(0) !== '='
            && attstore.length > 0
            && attstore[attstore.length - 1][0].indexOf('=') === attstore[attstore.length - 1][0].length - 1
          ) {

            // if an attribute follows an attribute ending with `=` then adjoin it to the
            // last attribute
            attstore[attstore.length - 1][0] = attstore[attstore.length - 1][0] + atty;

          } else if (atty !== '' && atty !== ' ') {

            attstore.push([ atty, lines ]);

          }

          if (
            attstore.length > 0
            && attstore[attstore.length - 1][0].indexOf('=\u201c') > 0
          ) {
            sparser.parseError = `Quote looking character (\u201c, &#x201c) used instead of actual quotes on line number ${parse.lineNumber}`;
          } else if (
            attstore.length > 0
            && attstore[attstore.length - 1][0].indexOf('=\u201d') > 0
          ) {
            sparser.parseError = `Quote looking character (\u201d, &#x201d) used instead of actual quotes on line number ${parse.lineNumber}`;
          }

          attribute = [];
          lines = b[a] === '\n' ? 2 : 1;

        };

        do {

          if (b[a] === '\n') {
            lines = lines + 1;
            parse.lineNumber = parse.lineNumber + 1;
          }

          if (preserve === true || ((
            /\s/.test(b[a]) === false && quote !== '}'
          ) ||
            quote === '}'
          )) {

            lex.push(b[a]);

            if (lex[0] === '<' && lex[1] === '>' && end === '>') {
              record.token = '<>';
              record.types = 'start';
              recordPush(data, record, '(empty)');
              return;
            }

            if (lex[0] === '<' && lex[1] === '/' && lex[2] === '>' && end === '>') {
              record.token = '</>';
              record.types = 'end';
              recordPush(data, record, '');
              return;
            }
          }

          if (ltype === 'cdata' && b[a] === '>' && b[a - 1] === ']' && b[a - 2] !== ']') {
            sparser.parseError = `CDATA tag ${lex.join('')} not properly terminated with ]]>`;
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

              if ((lex[0] + lex[1]) === '<!' && ltype !== 'cdata') {

                if (b[a] === '[') {

                  if (b[a + 1] === '<') {
                    ltype = 'start';
                    break;
                  }

                  if ((/\s/).test(b[a + 1]) === true) {
                    do {
                      a = a + 1;
                      if (b[a] === '\n') {
                        lines = lines + 1;
                      }
                    } while (a < c - 1 && (/\s/).test(b[a + 1]) === true);
                  }

                  if (b[a + 1] === '<') {
                    ltype = 'start';
                    break;
                  }
                }

              }

              if (options.language === 'jsx') {
                if (b[a] === '{') {
                  jsxcount = jsxcount + 1;
                } else if (b[a] === '}') {
                  jsxcount = jsxcount - 1;
                }
              }

              if (
                b[a] === '<'
                && preserve === false
                && lex.length > 1
                && end !== '>>'
                && end !== '>>>'
                && simple === true
              ) {
                sparser.parseError = `Parse error (line ${parse.lineNumber}) on: ${lex.join('')}`;
              }

              if (
                stest === true
                && /\s/.test(b[a]) === false
                && b[a] !== lastchar
              ) {

                // attribute start
                stest = false;
                quote = jsxquote;
                igcount = 0;
                lex.pop();

                if (a < c) {
                  do {
                    if (b[a] === '\n') {
                      parse.lineNumber = parse.lineNumber + 1;
                    }
                    if (options.lexerOptions.markup.preserveAttributes === true) {
                      lex.push(b[a]);
                    } else {
                      attribute.push(b[a]);
                    }

                    if (options.language !== 'jsx' && (
                      b[a] === '<' ||
                      b[a] === '>'
                    ) && (
                      quote === '' ||
                      quote === '>'
                    )) {

                      if (quote === '' && b[a] === '<') {
                        quote = '>';
                        braccount = 1;
                      } else if (quote === '>') {

                        if (b[a] === '<') {
                          braccount = braccount + 1;
                        } else if (b[a] === '>') {
                          braccount = braccount - 1;
                        }
                      }
                    } else if (quote === '') {

                      if (b[a + 1] === lastchar) {

                        // if at end of tag
                        if (
                          attribute[attribute.length - 1] === '/' ||
                          (attribute[attribute.length - 1] === '?' && ltype === 'xml')
                        ) {

                          attribute.pop();
                          if (preserve === true) lex.pop();
                          a = a - 1;
                        }

                        if (attribute.length > 0) attributeLexer(false);

                        break;
                      }

                      // HOTFIX
                      //
                      // When options is unformatter=true liquid attributes
                      // were being replaced in an incorrect manner, essentially,
                      // wreaking total fucking havoc. If preserveLine is set to false,
                      // then this control condition can pass, this code base can sometimes
                      // be a beautiful chaos, so I have little clue what this condition does,
                      // but it seems to fix this issue and actually preserveLine attributes.

                      if (
                        preserve === false
                        && /^=?["']?({[{%])/.test(b[a] + b[a + 1] + b[a + 2] + b[a + 3])
                      ) {

                        attribute.pop();

                        if (b[a] !== '=' && attribute.length > 0) attributeLexer(false);

                        quote = '';

                        do {

                          attribute.push(b[a]);

                          if (b[a] === dustatt[dustatt.length - 1]) {

                            dustatt.pop();

                            if (b[a] === '}' && b[a + 1] === '}') {

                              attribute.push('}');
                              a = a + 1;

                              if (b[a + 1] === '}') {
                                attribute.push('}');
                                a = a + 1;
                              }
                            }
                            if (dustatt.length < 1) {
                              attributeLexer(false);
                              b[a] = ' ';
                              break;
                            }
                          } else if ((b[a] === '"' || b[a] === "'")
                              && dustatt[dustatt.length - 1] !== '"'
                              && dustatt[dustatt.length - 1] !== "'") {
                            dustatt.push(b[a]);
                          } else if (b[a] === '{' && '{%#@:/?^<+~='
                            .indexOf(b[a + 1]) && dustatt[dustatt.length -
                                1] !== '}') {
                            dustatt.push('}');
                          } else if (b[a] === '<' && dustatt[dustatt
                            .length - 1] !== '>') {
                            dustatt.push('>');
                          } else if (b[a] === '[' && b[a + 1] === ':'
                              && dustatt[dustatt.length - 1] !== ']') {
                            dustatt.push(']');
                          }

                          a = a + 1;

                        } while (a < c);

                      } else if (b[a] === '{' && b[a - 1] === '=' && options.language !== 'jsx') {

                        quote = '}';

                      } else if (b[a] === '"' || b[a] === "'") {

                        quote = b[a];

                        if (b[a - 1] === '=' && (
                          b[a + 1] === '<' ||
                          (b[a + 1] === '{' && b[a + 2] === '%') ||
                          ((/\s/).test(b[a + 1]) === true && b[a - 1] !== '=')
                        )) {

                          igcount = a;
                        }

                      } else if (b[a] === '(') {

                        quote = ')';
                        parncount = 1;

                      } else if (options.language === 'jsx') {

                        // jsx variable attribute
                        if ((b[a - 1] === '=' || (/\s/).test(b[a - 1]) === true) && b[a] === '{') {

                          quote = '}';
                          bcount = 1;

                        } else if (b[a] === '/') {

                          // jsx comments
                          if (b[a + 1] === '*') {
                            quote = '\u002a/';
                          } else if (b[a + 1] === '/') {
                            quote = '\n';
                          }

                        }
                      } else if (
                        lex[0] !== '{'
                        && b[a] === '{'
                        && (b[a + 1] === '{' || b[a + 1] === '%')
                      ) {

                        // opening embedded template expression
                        if (b[a + 1] === '{') {
                          quote = '}}';
                        } else {
                          quote = b[a + 1] + '}';
                        }
                      }
                      if ((/\s/).test(b[a]) === true && quote === '') {

                        // Testing for a run of spaces between an attribute's = and a quoted value.
                        // Unquoted values separated by space are separate attributes
                        //
                        if (attribute[attribute.length - 2] === '=') {

                          e = a + 1;

                          if (e < c) {
                            do {
                              if ((/\s/).test(b[e]) === false) {
                                if (b[e] === '"' || b[e] === "'") {
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
                        } else if (jsxcount === 0 || (jsxcount === 1 && attribute[0] === '{')) {

                          // If there is an unquoted space attribute is complete
                          //
                          attribute.pop();
                          attributeLexer(false);
                          stest = true;
                          break;
                        }
                      }
                    } else if (b[a] === '(' && quote === ')') {

                      parncount = parncount + 1;

                    } else if (b[a] === ')' && quote === ')') {

                      parncount = parncount - 1;

                      if (parncount === 0) {
                        quote = '';
                        if (b[a + 1] === end.charAt(0)) {
                          attributeLexer(false);
                          break;
                        }
                      }

                    } else if (
                      options.language === 'jsx'
                      && (
                        quote === '}' ||
                        (quote === '\n' && b[a] === '\n') ||
                        (quote === '\u002a/'
                          && b[a - 1] === '*'
                          && b[a] === '/'
                        )
                      )
                    ) {

                      // jsx attributes
                      if (quote === '}') {

                        if (b[a] === '{') {

                          bcount = bcount + 1;

                        } else if (b[a] === quote) {

                          bcount = bcount - 1;

                          if (bcount === 0) {

                            jsxcount = 0;
                            quote = '';
                            element = attribute.join('');

                            if (options.lexerOptions.markup.preserveAttributes === false) {

                              if (options.language === 'jsx') {

                                if ((/^(\s*)$/).test(element) === false) {
                                  attstore.push([ element, lines ]);
                                }
                              } else {

                                element = element.replace(/\s+/g, ' ');
                                if (element !== ' ') {
                                  attstore.push([ element, lines ]);
                                }
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
                      b[a] === '{'
                      && b[a + 1] === '%'
                      && b[igcount - 1] === '='
                      && (quote === '"' || quote === "'")
                    ) {

                      quote = quote + '{%';
                      igcount = 0;

                    } else if (
                      b[a - 1] === '%'
                      && b[a] === '}'
                      && (quote === '"{%' || quote === "'{%")
                    ) {

                      quote = quote.charAt(0);
                      igcount = 0;

                    } else if (
                      b[a] === '<'
                      && end === '>'
                      && b[igcount - 1] === '='
                      && (quote === '"' || quote === "'")
                    ) {

                      quote = quote + '<';
                      igcount = 0;

                    } else if (
                      b[a] === '>'
                      && (quote === '"<' || quote === "'<")
                    ) {

                      quote = quote.charAt(0);
                      igcount = 0;

                    } else if (
                      igcount === 0
                      && quote !== '>'
                      && (quote.length < 2 || (quote.charAt(0) !== '"' && quote.charAt(0) !== "'"))
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

                          if (b[a - f] !== quote.charAt(e)) break;

                          f = f + 1;
                          e = e - 1;

                        } while (e > -1);

                      }

                      if (e < 0) {
                        attributeLexer(true);
                        if (b[a + 1] === lastchar) break;
                      }

                    } else if (igcount > 0 && (/\s/).test(b[a]) === false) {
                      igcount = 0;
                    }

                    a = a + 1;

                  } while (a < c);
                }
              } else if (end !== '\n' && (b[a] === '"' || b[a] === "'")) {

                // opening quote
                quote = b[a];

              } else if (
                ltype !== 'comment'
                  && end !== '\n'
                  && b[a] === '<'
                  && b[a + 1] === '!'
                  && b[a + 2] === '-'
                  && b[a + 3] === '-'
                  && b[a + 4] !== '#'
                  && data.types[parse.count] !== 'conditional'
              ) {

                quote = '-->';

              } else if (
                b[a] === '{'
                && lex[0] !== '{'
                && end !== '\n'
                && (b[a + 1] === '{' || b[a + 1] === '%')
              ) {

                if (b[a + 1] === '{') {
                  if (b[a + 2] === '{') {
                    quote = '}}}';
                  } else {
                    quote = '}}';
                  }
                } else if (options.language === 'dustjs') {
                  if (attribute.length < 1 && (attstore.length < 1 || (/\s/).test(b[a - 1]) === true)) {
                    lex.pop();
                    do {
                      if (b[a] === '\n') {
                        lines = lines + 1;
                      }
                      attribute.push(b[a]);
                      a = a + 1;
                    } while (a < c && b[a] !== '}');
                    attribute.push('}');
                    attstore.push([ attribute.join(''), lines ]);
                    attribute = [];
                    lines = 1;
                  } else {
                    quote = '}';
                  }
                } else {

                  quote = b[a + 1] + '}';
                  if (attribute.length < 1 && (attstore.length < 1 || (/\s/).test(b[a - 1]) === true)) {

                    lex.pop();
                    do {
                      if (b[a] === '\n') {
                        lines = lines + 1;
                      }
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
                if (quote === end) {
                  quote = '';
                }

              } else if (
                (simple === true || ltype === 'sgml')
                && end !== '\n'
                && (/\s/).test(b[a]) === true
                && b[a - 1] !== '<'
              ) {

                // identify a space in a regular start or singleton tag
                if (ltype === 'sgml') {
                  lex.push(' ');
                } else {
                  stest = true;
                }

              } else if (
                simple === true
                && options.language === 'jsx'
                && b[a] === '/'
                && (b[a + 1] === '*' || b[a + 1] === '/')
              ) {

                // jsx comment immediately following tag name
                stest = true;
                lex[lex.length - 1] = ' ';
                attribute.push(b[a]);

                if (b[a + 1] === '*') {
                  jsxquote = '\u002a/';
                } else {
                  jsxquote = '\n';
                }

              } else if (
                (b[a] === lastchar || (end === '\n' && b[a + 1] === '<'))
                && (lex.length > end.length + 1 || lex[0] === ']')
                && (options.language !== 'jsx' || jsxcount === 0)
              ) {

                if (end === '\n') {
                  if ((/\s/).test(lex[lex.length - 1]) === true) {
                    do {
                      lex.pop();
                      a = a - 1;
                    } while ((/\s/).test(lex[lex.length - 1]) === true);
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
            } else if (b[a] === quote.charAt(quote.length - 1) && ((
              options.language === 'jsx'
              && end === '}'
              && (b[a - 1] !== '\\' || slashy() === false)) ||
              options.language !== 'jsx' ||
              end !== '}'
            )) {

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
        if (options.attemptCorrection === true) {

          if (b[a + 1] === '>' && lex[0] === '<' && lex[1] !== '<') {

            do { a = a + 1; } while (b[a + 1] === '>');

          } else if (
            lex[0] === '<'
            && lex[1] === '<'
            && b[a + 1] !== '>'
            && lex[lex.length - 2] !== '>'
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
        } else if (
          html === ''
          && tname === '!DOCTYPE'
          && element.toLowerCase().indexOf('xhtml') > 0
        ) {
          html = 'xml';
        } else if (html === '' && tname === 'html') {
          html = 'html';
        }

        if (
          element.replace(start, '')
            .replace(/^\s+/, '')
            .indexOf('parse-ignore-start') === 0
        ) {

          a = a + 1;

          do {

            lex.push(b[a]);

            if (b[a] === 'd' && lex.slice(lex.length - 16).join('') === 'parse-ignore-end') {
              break;
            }

            a = a + 1;

          } while (a < c);

          do {
            lex.push(b[a]);
            if (
              b[a] === end.charAt(end.length - 1)
                && b.slice(a - (end.length - 1), a + 1).join('') === end
            ) {
              break;
            }

            a = a + 1;

          } while (a < c);

          record.token = lex.join('');
          record.types = 'ignore';
          recordPush(data, record, '');

          return;
        }
      }

      record.token = element;
      record.types = ltype as any;
      tname = tagName(element);

      if (preserve === false && options.language !== 'jsx') {
        element = element.replace(/\s+/g, ' ');
      }

      // a quick hack to inject records for a type of template comments
      if (tname === 'comment' && isLiquid(element, 2)) {

        let linesStart:number = 0;
        let linesEnd: number = 0;

        const lineFindStart = function lexer_markup_tag_lineFindStart (spaces:string):string {
          if (spaces === '') {
            linesStart = 0;
          } else {
            linesStart = spaces.split('\n').length;
          }
          return '';
        };
        const lineFindEnd = function lexer_markup_tag_lineFindEnd (spaces:string):string {
          if (spaces === '') {
            linesEnd = 0;
          } else {
            linesEnd = spaces.split('\n').length;
          }
          return '';
        };

        const open = element.slice(0, element.indexOf('%}') + 2);
        const comm = element.slice(element.indexOf('%}') + 2, element.lastIndexOf('{%'));
        const end = element.slice(element.lastIndexOf('{%'));

        record.begin = parse.structure[parse.structure.length - 1][1];
        record.ender = parse.count + 3;
        record.stack = parse.structure[parse.structure.length - 1][0];
        record.types = 'template_start';
        record.token = open;
        recordPush(data, record, 'comment');

        record.begin = parse.count;

        element = comm.replace(/^\s*/, lineFindStart);
        element = element.replace(/\s*$/, lineFindEnd);

        record.lines = linesStart;
        record.stack = 'comment';
        record.token = element;
        record.types = 'comment';

        recordPush(data, record, '');

        record.types = 'template_end';
        record.stack = 'comment';
        record.lines = linesEnd;
        record.token = end;
        recordPush(data, record, '');

        return;

      }

      // a type correction for template tags who have variable start tag names but a
      // consistent ending tag name
      if (element.indexOf('{{') === 0 && element.slice(element.length - 2) === '}}') {

        if (tname === 'end') {
          ltype = 'template_end';
        } else if (tname === 'else') {
          ltype = 'template_else';
        }
      }

      record.types = ltype;
      // update a flag for subatomic parsing in SGML tags
      if (end !== ']>' && sgmlflag > 0 && element.charAt(element.length -
            1) !== '[' && (element.slice(element
        .length - 2) === ']>' || (/^(<!((doctype)|(notation))\s)/i)
        .test(element) === true)) {
        sgmlflag = sgmlflag - 1;
      }
      // cheat identifies HTML singleton elements as singletons even if formatted as
      // start tags, such as <br> (which is really <br/>)
      cheat = (function lexer_markup_tag_cheat () {

        const ender = (/(\/>)$/);

        const peertest = function lexer_markup_tag_cheat_peertest (name, item) {

          if (blocks[name] === undefined) return false;
          if (name === item) return true;
          if (name === 'dd' && item === 'dt') return true;
          if (name === 'dt' && item === 'dd') return true;
          if (name === 'td' && item === 'th') return true;
          if (name === 'th' && item === 'td') return true;

          if (name === 'colgroup' && (
            item === 'tbody' ||
            item === 'tfoot' ||
            item === 'thead' ||
            item === 'tr'
          )) return true;

          if (name === 'tbody' && (
            item === 'colgroup' ||
            item === 'tfoot' ||
            item === 'thead'
          )) return true;

          if (name === 'tfoot' && (
            item === 'colgroup' ||
            item === 'tbody' ||
            item === 'thead'
          )) return true;

          if (name === 'thead' && (
            item === 'colgroup' ||
            item === 'tbody' ||
            item === 'tfoot'
          )) return true;

          if (name === 'tr' && item === 'colgroup') return true;

          return false;
        };

        const addHtmlEnd = function (count) {

          record.lines = (data.lines[parse.count] > 0) ? 1 : 0;
          record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
          record.types = 'end';

          recordPush(data, record, '');

          if (count > 0) {
            do {
              record.begin = parse.structure[parse.structure.length - 1][1];
              record.stack = parse.structure[parse.structure.length - 1][0];
              record.token = `</${parse.structure[parse.structure.length - 1][0]}>`;
              recordPush(data, record, '');
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
            data.types[parse.count - 1] === 'singleton'
            && lastToken.charAt(lastToken.length - 2) !== '/'
            && '/' + tagName(lastToken) === tname
          ) {
            data.types[parse.count - 1] = 'start';
          } else if (
            tname !== '/span'
            && tname !== '/div'
            && tname !== '/script'
            && options.lexerOptions.markup.tagMerge === true
            && (html !== 'html' || (html === 'html' && tname !== '/li'))
          ) {

            if (
              (tname === '/' + tagName(data.token[parse.count]))
              && data.types[parse.count] === 'start'
            ) {

              parse.structure.pop();
              data.token[parse.count] = data.token[parse.count].replace(/>$/, '/>');
              data.types[parse.count] = 'singleton';

              singleton = true;

              count.start = count.start - 1;

              return false;
            }

            if (
              tname === '/' + tagName(data.token[data.begin[parse.count]])
              && data.types[parse.count].indexOf('attribute') > -1
              && data.types[data.begin[parse.count]] === 'start'
            ) {

              const idx = data.begin[parse.count];

              parse.structure.pop();
              data.token[idx] = data.token[idx].replace(/>$/, '/>');
              data.types[data.begin[parse.count]] = 'singleton';

              singleton = true;

              count.start = count.start - 1;

              return false;
            }
          }
        }

        if (html === 'html') {

          // html gets tag names in lowercase, if you want to preserveLine case sensitivity
          // beautify as XML
          if (
            element.charAt(0) === '<'
              && element.charAt(1) !== '!'
              && element.charAt(1) !== '?' && (
              parse.count < 0 ||
              data.types[parse.count].indexOf('template') < 0
            )
          ) {

            element = element.toLowerCase();
          }

          if (
            blocks[parse.structure[parse.structure.length - 1][0]] === 'block'
            && peertest(
              tname.slice(1),
              parse.structure[parse.structure.length - 2][0]
            ) === true
          ) {

            // looks for HTML tags missing an ending pair when encountering an ending tag for a parent node
            addHtmlEnd(0);
          } else if (parse.structure.length > 3
              && blocks[parse.structure[parse.structure.length - 1][
                0
              ]] === 'block'
              && blocks[parse.structure[parse.structure.length - 2][
                0
              ]] === 'block'
              && blocks[parse.structure[parse.structure.length - 3][
                0
              ]] === 'block'
              && peertest(tname, parse.structure[parse.structure.length -
                4][0]) === true) {
            // looks for consecutive missing end tags
            addHtmlEnd(3);
          } else if (parse.structure.length > 2
              && blocks[parse.structure[parse.structure.length - 1][
                0
              ]] === 'block'
              && blocks[parse.structure[parse.structure.length - 2][
                0
              ]] === 'block'
              && peertest(tname, parse.structure[parse.structure.length -
                3][0]) === true) {
            // looks for consecutive missing end tags
            addHtmlEnd(2);
          } else if (
            parse.structure.length > 1
            && blocks[parse.structure[parse.structure.length - 1][0]] === 'block'
            && peertest(tname, parse.structure[parse.structure.length - 2][0]) === true
          ) {

            // looks for consecutive missing end tags
            addHtmlEnd(1);

          } else if (peertest(tname, parse.structure[parse.structure
            .length - 1][0]) === true) {
            // certain tags cannot contain other certain tags if such tags are peers
            addHtmlEnd(0);
          } else if (tname.charAt(0) === '/' && blocks[parse
            .structure[parse.structure.length - 1][0]] ===
              'block' && parse.structure[parse.structure.length - 1][
            0
          ] !== tname.slice(1)) {

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
          if (voids[tname] === 'singleton') {
            if (options.attemptCorrection === true && ender.test(element) === false) {
              element = element.slice(0, element.length - 1) + ' />';
            }
            return true;
          }
        }

        return false;

      }());

      // This escape flag is set in the cheat function
      if (singleton === true) {
        attributeRecord();
        return;
      }
      // determine if the markup tag potentially contains code interpreted by a
      // different lexer
      if (/\bscript|style\b/.test(tname) && element.slice(element.length - 2) !== '/>') {

        // get the attribute value for "type"
        let len = attstore.length - 1;
        let attValue = '';
        let attr = [];

        if (len > -1) {
          do {
            attr = attributeName(attstore[len][0]);
            if (attr[0] === 'type') {
              attValue = attr[1];
              if (attValue.charAt(0) === '"' || attValue.charAt(0) ===
                  "'") {
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
        if (
          tname === 'script' && (
            attValue === '' ||
            attValue === 'text/javascript' ||
            attValue === 'babel' ||
            attValue === 'module' ||
            attValue === 'application/javascript' ||
            attValue === 'application/x-javascript' ||
            attValue === 'text/ecmascript' ||
            attValue === 'application/ecmascript' ||
            attValue === 'text/jsx' ||
            attValue === 'application/jsx' ||
            attValue === 'text/cjs' ||
            attValue === 'application/json' ||
            attValue === 'application/ld+json'
          )
        ) {

          ext = true;

        } else if (
          tname === 'style'
            && options.language !== 'jsx' && (
            attValue === '' ||
              attValue === 'text/css'
          )
        ) {

          ext = true;
        }

        if (ext === true) {
          len = a + 1;
          if (len < c) {
            do {
              if ((/\s/).test(b[len]) === false) {
                if (b[len] === '<') {
                  if (b.slice(len + 1, len + 4).join('') === '!--') {
                    len = len + 4;
                    if (len < c) {
                      do {
                        if ((/\s/).test(b[len]) === false) {
                          ext = false;
                          break;
                        }
                        if (b[len] === '\n' || b[len] === '\r') {
                          break;
                        }
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
      if (
        simple === true
          && ignoreme === false
          && ltype !== 'xml'
          && ltype !== 'sgml'
      ) {
        if (cheat === true || element.slice(element.length - 2) === '/>') {
          ltype = 'singleton';
        } else {
          ltype = 'start';
        }
        record.types = ltype as Types;
      }
      // additional logic is required to find the end of a tag with the attribute
      // data-parse-ignore
      if (
        simple === true
          && preserve === false
          && ignoreme
          && end === '>'
          && element.slice(element.length - 2) !== '/>'
      ) {

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

              if (b[a] === '\n') parse.lineNumber = parse.lineNumber + 1;

              tags.push(b[a]);

              if (delim === '') {

                if (b[a] === '"') {

                  delim = '"';
                } else if (b[a] === "'") {

                  delim = "'";

                } else if (
                  tags[0] !== '{'
                    && b[a] === '{' && (
                    b[a + 1] === '{' ||
                    b[a + 1] === '%'
                  )
                ) {

                  if (b[a + 1] === '{') {

                    delim = '}}';

                  } else {

                    delim = b[a + 1] + '}';

                  }

                } else if (b[a] === '<' && simple === true) {

                  if (b[a + 1] === '/') {
                    endtag = true;
                  } else {
                    endtag = false;
                  }

                } else if (b[a] === lastchar && b[a - 1] !== '/') {

                  if (endtag === true) {
                    igcount = igcount - 1;
                    if (igcount < 0) {
                      break;
                    }
                  } else {
                    igcount = igcount + 1;
                  }
                }

              } else if (b[a] === delim.charAt(delim.length - 1)) {
                ff = 0;
                ee = delim.length - 1;
                if (ee > -1) {
                  do {
                    if (b[a - ff] !== delim.charAt(ee)) {
                      break;
                    }
                    ff = ff + 1;
                    ee = ee - 1;
                  } while (ee > -1);
                }
                if (ee < 0) {
                  delim = '';
                }
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

        if (element.slice(0, 2) === '{%') {

          const names = [
            'autoescape'
            , 'case'
            , 'capture'
            , 'comment'
            , 'embed'
            , 'filter'
            , 'for'
            , 'form'
            , 'if'
            , 'macro'
            , 'paginate'
            , 'raw'
            , 'sandbox'
            , 'spaceless'
            , 'switch'
            , 'tablerow'
            , 'unless'
            , 'verbatim'
          ];

          if (
            (tname === 'case' || tname === 'default') && (
              parse.structure[parse.structure.length - 1][0] === 'switch' ||
              parse.structure[parse.structure.length - 1][0] === 'case'
            )
          ) {
            record.types = 'template_else';
          } else if (
            tname === 'else' ||
            tname === 'when' ||
            tname === 'elsif'
          ) {
            record.types = 'template_else';
          } else {

            let namelen = names.length - 1;

            do {
              if (tname === names[namelen]) {
                record.types = 'template_start';
                break;
              }

              if (tname === 'end' + names[namelen]) {
                record.types = 'template_end';
                break;
              }

              namelen = namelen - 1;

            } while (namelen > -1);

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

        recordPush(data, record, '');

        parse.structure.push([ 'cdata', parse.count ]);

        if (stack === 'script') {
          sparser.lexers.script(element);
        } else {
          sparser.lexers.style(element);
        }

        record.begin = parse.structure[parse.structure.length - 1][1];
        record.token = ']]>';
        record.types = 'cdata_end';

        recordPush(data, record, '');

        parse.structure.pop();

      } else {

        recordPush(data, record, tname);
      }

      attributeRecord();

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

          if (current_length > options.wrap && data.lines[bb] === 1) {

            record.begin = data.begin[bb];
            record.ender = bb + 2;
            record.lexer = data.lexer[bb];
            record.lines = 1;
            record.stack = data.stack[bb];
            record.token = '{';
            record.types = 'script_start';

            parse.splice({
              data: data
              , howmany: 0
              , index: bb
              , record: record
            });

            record.begin = bb;
            record.lexer = 'script';
            record.lines = 0;
            record.stack = 'script';

            if (options.quoteConvert === 'single') {
              record.token = "' '";
            } else {
              record.token = '" "';
            }

            record.types = 'string';

            parse.splice({
              data: data
              , howmany: 0
              , index: bb + 1
              , record: record
            });

            record.lexer = 'markup';
            record.token = '}';
            record.types = 'script_end';

            parse.splice({
              data: data
              , howmany: 0
              , index: bb + 2
              , record: record
            });

            data.ender[bb + 3] = data.ender[bb + 3] + 3;

            bb = bb + 4;

            do {
              data.begin[bb] = data.begin[bb] + 3;
              data.ender[bb] = data.ender[bb] + 3;
              bb = bb + 1;
            } while (bb < parse.count);
          }
        }
      }
      // sorts child elements
      if (
        options.lexerOptions.markup.tagSort === true
          && data.types[parse.count] === 'end'
          && data.types[parse.count - 1] !== 'start'
          && tname !== '/script'
          && tname !== '/style'
      ) {

        let bb = 0;
        let d = 0;
        let startStore = 0;
        let jsxatt = false;

        const children = [];
        const store = Object.create(null);

        store.begin = [];
        store.ender = [];
        store.lexer = [];
        store.lines = [];
        store.stack = [];
        store.token = [];
        store.types = [];

        function storeRecord (index: number) {

          const output = Object.create(null);

          output.begin = data.begin[index];
          output.ender = data.ender[index];
          output.lexer = data.lexer[index];
          output.lines = data.lines[index];
          output.stack = data.stack[index];
          output.token = data.token[index];
          output.types = data.types[index];

          return output;
        };

        function childsort (a: number, b: number) {

          return (data.token[a[0]] > data.token[b[0]])
            ? -1
            : 1;
        }

        bb = parse.count - 1;

        if (bb > -1) {

          let endStore = 0;

          do {
            if (data.types[bb] === 'start') {
              d = d - 1;

              if (d < 0) {

                startStore = bb + 1;

                if (data.types[startStore] === 'attribute' || data.types[startStore] === 'jsx_attribute_start') {

                  jsxatt = false;

                  do {

                    startStore = startStore + 1;

                    if (jsxatt === false && data.types[startStore] !== 'attribute') break;
                    if (data.types[startStore] === 'jsx_attribute_start') {
                      jsxatt = true;
                    } else if (data.types[startStore] === 'jsx_attribute_end') {
                      jsxatt = false;
                    }

                  } while (startStore < c);
                }

                break;
              }
            } else if (data.types[bb] === 'end') {
              d = d + 1;
              if (d === 1) endStore = bb;
            }

            if (d === 0) {
              if (data.types[bb] === 'start') {

                children.push([ bb, endStore ]);

              } else {
                if (data.types[bb] === 'singleton' && (
                  data.types[bb + 1] === 'attribute' ||
                  data.types[bb + 1] === 'jsx_attribute_start')
                ) {

                  let cc = bb + 1;
                  jsxatt = false;

                  do {

                    if (data.types[cc] === 'jsx_attribute_start') {
                      jsxatt = true;
                    } else if (data.types[cc] === 'jsx_attribute_end') {
                      jsxatt = false;
                    }

                    if (jsxatt === false
                      && data.types[cc + 1] !== 'attribute'
                      && data.types[cc + 1] !== 'jsx_attribute_start') break;

                    cc = cc + 1;

                  } while (cc < parse.count);

                  children.push([ bb, cc ]);

                } else if (data.types[bb] !== 'attribute' && data.types[bb] !== 'jsx_attribute_start') {

                  children.push([ bb, bb ]);
                }
              }
            }

            bb = bb - 1;

          } while (bb > -1);
        }

        if (children.length < 2) return;

        children.sort(childsort);

        bb = children.length - 1;

        if (bb > -1) {
          do {

            recordPush(store, storeRecord(children[bb][0]), '');

            if (children[bb][0] !== children[bb][1]) {

              d = children[bb][0] + 1;

              if (d < children[bb][1]) {
                do {
                  recordPush(store, storeRecord(d), '');
                  d = d + 1;
                } while (d < children[bb][1]);
              }

              recordPush(store, storeRecord(children[bb][1]), '');
            }

            bb = bb - 1;

          } while (bb > -1);
        }

        const endData = Object.create(null);

        endData.begin = data.begin.pop();
        endData.ender = data.ender.pop();
        endData.lexer = data.lexer.pop();
        endData.lines = data.lines.pop();
        endData.stack = data.stack.pop();
        endData.token = data.token.pop();
        endData.types = data.types.pop();

        // lexer_markup_tagSorttag_slice_datanames
        for (const value of parse.datanames) data[value] = data[value].slice(0, startStore);

        parse.concat(data, store);
        count.end = count.end - 1;

        recordPush(data, endData, '');
      }

      parse.linesSpace = 0;
    }

    // parses everything other than markup tags
    function content () {

      let ltoke = '';
      let liner = parse.linesSpace;

      const lex = [];
      const jsxbrace = (data.token[parse.count] === '{');
      const now = a;

      const name = (ext === true) ? (jsxbrace === true)
        ? 'script'
        : (parse.structure[parse.structure.length - 1][1] > -1)
          ? tagName(data.token[parse.structure[parse.structure.length - 1][1]].toLowerCase())
          : tagName(data.token[data.begin[parse.count]].toLowerCase())
        : '';

      const square = (
        data.types[parse.count] === 'template_start'
        && data.token[parse.count].indexOf('<!') === 0
        && data.token[parse.count].indexOf('<![') < 0
        && data.token[parse.count].charAt(data.token[parse.count].length - 1) === '['
      );

      const record: IRecord = Object.create(null);

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

          if (b[a] === '\n') parse.lineNumber = parse.lineNumber + 1;

          // external code requires additional parsing to look for the appropriate end
          // tag, but that end tag cannot be quoted or commented
          if (ext === true) {

            if (quote === '') {

              if (b[a] === '/') {

                if (b[a + 1] === '*') {
                  quote = '*';
                } else if (b[a + 1] === '/') {
                  quote = '/';
                } else if (name === 'script' && '([{!=,;.?:&<>'.indexOf(b[
                  a - 1]) > -1) {
                  if (options.language !== 'jsx' || b[a - 1] !== '<') {
                    quote = 'reg';
                  }
                }

              } else if ((b[a] === '"' || b[a] === "'" || b[a] === '`') && esctest() === false) {
                quote = b[a];
              } else if (b[a] === '{' && jsxbrace === true) {
                quotes = quotes + 1;
              } else if (b[a] === '}' && jsxbrace === true) {

                if (quotes === 0) {

                  sparser.lexers.script(lex.join('').replace(/^(\s+)/, '').replace(/(\s+)$/, ''));

                  // Originally was:
                  // parse.structure[parse.structure.length - 1][1] + 1
                  // Added incremental
                  parse.structure[parse.structure.length - 1][1] += 1;

                  if (
                    data.types[parse.count] === 'end'
                    && data.lexer[data.begin[parse.count] - 1] === 'script'
                  ) {

                    record.lexer = 'script';
                    record.token = (options.attemptCorrection === true) ? ';' : 'x;';
                    record.types = 'separator';
                    recordPush(data, record, '');
                    record.lexer = 'markup';

                  }

                  record.token = '}';
                  record.types = 'script_end';
                  recordPush(data, record, '');
                  parse.structure.pop();
                  break;
                }
                quotes = quotes - 1;
              }

              end = b.slice(a, a + 10).join('').toLowerCase();

              // script requires use of the script lexer
              if (name === 'script') {

                if (a === c - 9) {
                  end = end.slice(0, end.length - 1);
                } else {
                  end = end.slice(0, end.length - 2);
                }

                if (end === '</script') {
                  let outside = lex.join('').replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');
                  a = a - 1;
                  if (lex.length < 1) {
                    break;
                  }
                  if ((/^(<!--+)/).test(outside) === true && (/(--+>)$/)
                    .test(outside) === true) {
                    record.token = '<!--';
                    record.types = 'comment';
                    recordPush(data, record, '');
                    outside = outside.replace(/^(<!--+)/, '').replace(
                      /(--+>)$/, ''
                    );
                    sparser.lexers.script(outside);
                    record.token = '-->';
                    recordPush(data, record, '');
                  } else {
                    sparser.lexers.script(outside);
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
                  let outside = lex.join('').replace(/^(\s+)/, '')
                    .replace(/(\s+)$/, '');
                  a = a - 1;
                  if (lex.length < 1) {
                    break;
                  }
                  if ((/^(<!--+)/).test(outside) === true && (/(--+>)$/)
                    .test(outside) === true) {
                    record.token = '<!--';
                    record.types = 'comment';
                    recordPush(data, record, '');
                    outside = outside.replace(/^(<!--+)/, '').replace(/(--+>)$/, '');
                    sparser.lexers.style(outside);
                    record.token = '-->';
                    recordPush(data, record, '');
                  } else {
                    sparser.lexers.style(outside);
                  }
                  break;
                }
              }
            } else if (quote === b[a] && (quote === '"' || quote ===
                  "'" || quote === '`' || (quote === '*' && b[
              a + 1] === '/')) && esctest() === false) {
              quote = '';
            } else if (quote === '`' && b[a] === '$' && b[a + 1] ===
                '{' && esctest() === false) {
              quote = '}';
            } else if (quote === '}' && b[a] === '}' && esctest() ===
                false) {
              quote = '`';
            } else if (quote === '/' && (b[a] === '\n' || b[a] ===
                  '\r')) {
              quote = '';
            } else if (quote === 'reg' && b[a] === '/' && esctest() ===
                false) {
              quote = '';
            } else if (quote === '/' && b[a] === '>' && b[a - 1] ===
                '-' && b[a - 2] === '-') {
              end = b
                .slice(a + 1, a + 11)
                .join('')
                .toLowerCase();
              end = end.slice(0, end.length - 2);
              if (name === 'script' && end === '</script') {
                quote = '';
              }
              end = end.slice(0, end.length - 1);
              if (name === 'style' && end === '</style') {
                quote = '';
              }
            }
          }
          // typically this logic is for artifacts nested within an SGML tag
          if (square === true && b[a] === ']') {

            a = a - 1;
            ltoke = lex.join('');

            if (options.lexerOptions.markup.parseSpace === false) ltoke = ltoke.replace(/\s+$/, '');

            liner = 0;
            record.token = ltoke;
            recordPush(data, record, '');
            break;
          }
          // general content processing
          if (
            ext === false
              && lex.length > 0 && (
              (
                b[a] === '<'
                  && b[a + 1] !== '='
                  && !(/\s|\d/).test(b[a + 1])
              ) || (
                b[a] === '['
                  && b[a + 1] === '%'
              ) || (
                b[a] === '{' && (
                  options.language === 'jsx' ||
                    b[a + 1] === '{' ||
                    b[a + 1] === '%'
                )
              )
            )
          ) {

            // regular content
            a = a - 1;

            if (
              options.lexerOptions.markup.parseSpace === true ||
                parse.structure[parse.structure.length - 1][0] === 'comment'
            ) {
              ltoke = lex.join('');
            } else {
              ltoke = lex.join('').replace(/\s+$/, '');
            }

            ltoke = bracketSpace(ltoke);
            liner = 0;
            record.token = ltoke;

            if (
              options.wrap > 0
                && options.lexerOptions.markup.preserveText !== true
            ) {

              let aa = options.wrap;
              let len = ltoke.length;
              let startSpace = '';
              let endSpace = '';

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
                data.token[data.begin[parse.count]] === '<a>'
                  && data.token[data.begin[data.begin[parse.count]]] === '<li>'
                  && data.lines[data.begin[parse.count]] === 0
                  && parse.linesSpace === 0
                  && ltoke.length < options.wrap
              ) {

                recordPush(data, record, '');
                break;
              }

              if (len < wrap) {
                recordPush(data, record, '');
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

              if (options.lexerOptions.markup.parseSpace === true) {
                startSpace = ((/\s/).test(ltoke.charAt(0)) === true) ? (/\s+/).exec(ltoke)[0] : '';
                endSpace = ((/\s/).test(ltoke.charAt(ltoke.length - 1))) ? (/\s+$/).exec(ltoke)[0] : '';
              }

              ltoke = ltoke.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\s+/g, ' ');

              do { wrapper(); } while (aa < len);

              if (ltoke !== '' && ltoke !== ' ') store.push(ltoke);

              ltoke = options.crlf === true ? store.join('\r\n') : store.join('\n');
              ltoke = startSpace + ltoke + endSpace;
            }

            liner = 0;
            record.token = ltoke;
            recordPush(data, record, '');
            break;
          }

          lex.push(b[a]);

          a = a + 1;

        } while (a < c);
      }

      if (options.lexerOptions.markup.parseSpace === false) {

        if (a > now && a < c) {

          if ((/\s/).test(b[a]) === true) {

            let x = a;
            parse.linesSpace = 1;

            do {

              if (b[x] === '\n') parse.linesSpace = parse.linesSpace + 1;
              x = x - 1;

            } while (x > now && (/\s/).test(b[x]) === true);

          } else {

            parse.linesSpace = 0;
          }
        } else if (a !== now || (a === now && ext === false)) {

          // regular content at the end of the supplied source

          ltoke = lex.join('').replace(/\s+$/, '');
          liner = 0;

          // this condition prevents adding content that was just added in the loop above
          if (record.token !== ltoke) {
            record.token = ltoke;
            recordPush(data, record, '');
            parse.linesSpace = 0;
          }
        }
      }

      ext = false;
    };

    // trim the attributeSortList values
    if (asl > 0) {

      do {

        attributeSortList[a] = attributeSortList[a].replace(/^\s+/, '').replace(/\s+$/, '');
        a = a + 1;

      } while (a < asl);

      a = 0;

    }

    if (options.language === 'html') html = 'html';

    do {

      if ((/\s/).test(b[a])) {

        if (
          options.lexerOptions.markup.parseSpace === true || (
            data.types[parse.count] === 'template_start'
            && parse.structure[parse.structure.length - 1][0] === 'comment'
          )
        ) {

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
        b[a] === '-'
        && b[a + 1] === '-'
        && b[a + 2] === '-'
      ) {

        tag('---');

      } else {
        content();
      }

      a = a + 1;

    } while (a < c);

    if (
      data.token[parse.count].charAt(0) !== '/'
      && blocks[parse.structure[parse.structure.length - 1][0]] === 'block'
    ) {

      fixHtmlEnd(data.token[parse.count], true);
    }

    if (count.end !== count.start && sparser.parseError === '') {
      if (count.end > count.start) {
        const x = count.end - count.start;
        const plural = (x === 1) ? '' : 's';
        sparser.parseError = `${x} more end type${plural} than start types.`;
      } else {
        const x = count.start - count.end;
        const plural = (x === 1) ? '' : 's';
        sparser.parseError = `${x} more start type${plural} than end types.`;
      }
    }

    return data;

  };

})();
