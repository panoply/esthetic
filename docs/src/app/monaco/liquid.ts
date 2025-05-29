import type { languages } from 'monaco-editor';

const EMPTY_ELEMENTS: string[] = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

/**
 * Liquid Language Configuration
 *
 * Language configuration for Liquid
 */
export const configuration: languages.LanguageConfiguration = {
  colorizedBracketPairs: [],
  wordPattern: /(-?\d*\.\d\w*)|([^`~!@$^&*()=+[{\]}\\|;:'",.<>/\s]+)/g,
  brackets: [
    [ '<!--', '-->' ],
    [ '<', '>' ],
    [ '{{', '}}' ],
    [ '{{-', '-}}' ],
    [ '{%', '%}' ],
    [ '{%-', '-%}' ],
    [ '{', '}' ],
    [ '(', ')' ]
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '%', close: '%' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: '<', close: '>' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  onEnterRules: [
    {
      beforeText: new RegExp(
        `<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
        'i'
      ),
      afterText: /^<\/(\w[\w\d]*)\s*>$/i,
      action: {
        indentAction: 2
      }
    },
    {
      beforeText: new RegExp(
        `<(?!(?:${EMPTY_ELEMENTS.join('|')}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
        'i'
      ),
      action: { indentAction: 1 }
    }
  ]
};

/**
 * Liquid Monarch Language
 *
 * Grammar support for the Liquid Template Language.
 */
export const liquid: languages.IMonarchLanguage = {

  ignoreCase: true,
  brackets: [
    {
      open: '{%',
      close: '%}',
      token: 'delimiter.liquid'
    },
    {
      open: '{{',
      close: '}}',
      token: 'delimiter.liquid'
    }
  ],

  keywords: [
    // (opening) tags

    // LIQUID SINGLETONS
    'render',
    'layout',
    'include',
    'else',
    'elsif',
    'cycle',
    'liquid',

    // LIQUID BLOCK TAGS
    'if',
    'render',
    'assign',
    'capture',
    'case',
    'comment',
    'increment',
    'decrement',
    'for',
    'section',
    'block',
    'raw',
    'tablerow',
    'unless',

    // LIQUID EMBEDDED
    'schema',
    'stylesheet',
    'style',
    'javascript',

    // LIQUID END TAG
    'endif',
    'endcapture',
    'endcase',
    'endblock',
    'endcomment',
    'endfor',
    'endraw',
    'endtablerow',
    'endunless',

    // LIQUID END EMBEDDED
    'endschema',
    'endstylesheet',
    'endstyle',
    'endjavascript'
  ],

  tokenizer: {
    root: [

      // WHITESPACE
      [ /\s+/, '' ],

      [
        /^-{3}/,
        { token: 'delimiter.liquid', next: '@Frontmatter', nextEmbedded: 'yaml' }
      ],

      // LIQUID COMMENTS

      [ /{%-?\s*(?=\s*#)/, 'comment.line.liquid', '@LiquidLineComment' ],
      [ /{%-?\s*comment\s*-?%}/, 'comment.liquid', '@LiquidBlockComment' ],

      // LIQUID TAGS

      [
        /({%)(-?\s*)(style)(\s*-?)(%})/,
        [
          'delimiter.liquid',
          '',
          'tag.liquid',
          '',
          { token: 'delimiter.liquid', next: '@LiquidStyle', nextEmbedded: 'css' }
        ]
      ],

      [
        /({%)(-?\s*)(stylesheet)(\s*-?)(%})/,
        [
          'delimiter.liquid',
          '',
          'tag.liquid',
          '',
          { token: 'delimiter.liquid', next: '@LiquidStylesheet', nextEmbedded: 'css' }
        ]
      ],

      [
        /({%)(-?\s*)(schema)(\s*-?)(%})/,
        [
          'delimiter.liquid',
          '',
          'tag.liquid',
          '',
          {
            token: 'delimiter.liquid',
            next: '@LiquidSchema',
            nextEmbedded: 'json'
          }
        ]
      ],

      [
        /({%)(-?\s*)(javascript)(\s*-?)(%})/,
        [
          'delimiter.liquid',
          '',
          'tag.liquid',
          '',
          {
            token: 'delimiter.liquid',
            next: '@LiquidJavaScript',
            nextEmbedded: 'javascript'
          }
        ]
      ],

      [ /{%/, { token: '@rematch', next: '@LiquidTag' } ],
      [ /{{/, { token: '@rematch', next: '@LiquidOutput' } ],

      // HTML COMMENT

      [ /<!--/, 'comment.html', '@HTMLComment' ],

      // HTML TAGS

      [ /<!DOCTYPE/, 'metatag.html', '@HTMLDocType' ],
      [ /(<)((?:[\w-]+:)?[\w-]+)(\s*)(\/>)/, [ 'delimiter.html', 'tag.html', '', 'delimiter.html' ] ],

      // HTML EMBEDDED

      [ /(<)(script)/, [ 'delimiter.html', { token: 'tag.html', next: '@HTMLTagScript' } ] ],
      [ /(<)(style)/, [ 'delimiter.html', { token: 'tag.html', next: '@HTMLTagStyle' } ] ],

      // HTML STANDARD TAGS

      [ /(<)((?:[\w-]+:)?[\w-]+)/, [ 'delimiter.html', { token: 'tag.html', next: '@HTMLTag' } ] ],
      [ /(<\/)((?:[\w-]+:)?[\w-]+)/, [ 'delimiter.html', { token: 'tag.html', next: '@HTMLTag' } ] ],
      [ /</, 'delimiter.html' ],
      [ /[^<]+/, '' ]
    ],

    /**
     * Liquid Comment Blocks
     */
    LiquidBlockComment: [
      [ /{%-?\s*endcomment\s*-?%}/, 'comment.end.liquid', '@pop' ],
      [ /./, 'comment.content.liquid' ]
    ],

    /**
     * Liquid Comment Line
     */
    LiquidLineComment: [
      [ /%}/, 'comment.content.liquid', '@pop' ],
      [ /./, 'comment.content.liquid' ]
    ],

    Frontmatter: [

      // WHITESPACE
      [ /\s+/, '' ],

      [
        /^-{3}$/
        ,
        {
          token: 'delimiter.liquid',
          next: '@pop',
          nextEmbedded: '@pop'
        }

      ]
    ],

    LiquidJavaScript: [

      // WHITESPACE
      [ /\s+/, '' ],

      [ /%}/, 'delimiter.liquid', '@pop' ],
      [
        /{%-?\s*endjavascript\s*-?%}/
        ,
        {
          token: '@rematch',
          next: '@pop',
          nextEmbedded: '@pop'
        }

      ]
    ],

    LiquidSchema: [

      // WHITESPACE
      [ /\s+/, '' ],

      [ /%}/, 'delimiter.liquid', '@pop' ],
      [
        /{%-?\s*endschema\s*-?%}/
        ,
        {
          token: '@rematch',
          next: '@pop',
          nextEmbedded: '@pop'
        }
      ]
    ],

    LiquidStyle: [

      // WHITESPACE
      [ /\s+/, '' ],

      [ /%}/, 'delimiter.liquid', '@pop' ],
      [
        /{%-?\s*endstyle\s*-?%}/
        ,
        {
          token: '@rematch',
          next: '@pop',
          nextEmbedded: '@pop'
        }
      ]
    ],

    LiquidStylesheet: [

      // WHITESPACE
      [ /\s+/, '' ],

      [ /%}/, 'delimiter.liquid', '@pop' ],
      [
        /{%-?\s*endstylesheet\s*-?%}/
        ,
        {
          token: '@rematch',
          next: '@pop',
          nextEmbedded: '@pop'
        }
      ]
    ],

    LiquidTag: [
      [ /%}/, 'delimiter', '@pop' ],
      { include: 'expression' }
    ],

    LiquidTagAttr: [
      [ /%}/, 'delimiter.attr', '@pop' ],
      { include: 'expression' }

    ],

    /**
    * Variable Tag Handling
    */
    LiquidOutput: [
      [ /}}/, 'delimiter', '@pop' ],
      { include: 'expression' }

    ],

    LiquidOutputAttr: [
      [ /}}/, 'delimiter.attr', '@pop' ],
      { include: 'expression' }

    ],

    LiquidSingleQuoteString: [

      // closing double quoted string
      [ /'/, 'string.liquid', '@pop' ],

      // string part
      [ /[^'\\]*(?:(?:\\.|#(?!\{))[^'\\]*)*/, 'string.liquid' ]

    ],

    LiquidDoubleQuoteString: [

      // closing double quoted string
      [ /"/, 'string.liquid', '@pop' ],

      // string part
      [ /[^"\\]*(?:(?:\\.|#(?!\{))[^"\\]*)*/, 'string.liquid' ]

    ],

    /**
     * Expression Handling
     */
    expression: [

      // WHITESPACE

      // WHITESPACE
      [ /\s+/, '' ],

      // OBJECT NAME
      [ /([a-zA-Z_][a-zA-Z0-9_-]+)(\s*)(?=[[.])/, [ 'keyword.object.liquid', '' ] ],

      // FILTER PARARAMETERS
      [ /(\|)(\s*)(\w+)(:)/, [ 'operator.liquid', '', 'keyword.filter.liquid', 'operator.liquid' ] ],

      // ARGUMENT PARAMETERS
      [ /(\w+)(:)/, [ 'keyword.parameter.liquid', 'operator.liquid' ] ],

      // OPERATOR SYMBOLS
      [ /(\b(?:and|or|in|with|contains)\b)(\s+)/, [ 'operator.liquid', '' ] ],

      // OPERATOR LOGIC
      [ /(\b(?:true|false|nil)\b)/, 'boolean.liquid' ],

      // OPERATOR MATH
      [ /\+|-|\/{1,2}|\*{1,2}/, 'operator.liquid' ],

      // OPERATER COMPARISON
      [ /==|!=|<|>|>=|<=|=/, 'operator.liquid' ],

      // OPERATOR PUNCTUATION
      [ /\||:|\.{1,2}/, 'operator.liquid' ],

      // NUMBERS
      [ /\d+(\.\d+)?/, 'number.liquid' ],

      // PUNCTATION
      [ /\(|\)|\[|\]/, 'delimiter.liquid' ],

      // KEYWORD IDENTIFIERS
      [ /[^\W\d][\w]*/, {
        cases: {
          '@keywords': 'tag.liquid',
          '@default': ''
        }
      } ],

      // STRINGS
      [ /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'/, 'string.liquid' ],

      [ /'/, 'string.liquid', '@LiquidSingleQuoteString' ],

      [ /"/, 'string.liquid', '@LiquidDoubleQuoteString' ]
    ],

    LiquidAttributeString: [
      [ /\s*{{-?/, 'delimiter.attr', '@LiquidOutputAttr' ],
      [ /\s*{%-?/, 'delimiter.attr', '@LiquidTagAttr' ],
      [ /"/, 'attribute.value.html', '@pop' ],
      [ /./, 'attribute.value.html' ]
    ],

    /**
     * HTML
     */
    HTMLDocType: [
      [ /[^>]+/, 'metatag.content.html' ],
      [ />/, 'metatag.html', '@pop' ]
    ],

    // HTML Comments
    HTMLComment: [
      [ /-->/, 'comment.html', '@pop' ],
      [ /[^-]+/, 'comment.content.html' ],
      [ /./, 'comment.content.html' ]
    ],

    HTMLTag: [
      [ /\/?>/, 'delimiter.html', '@pop' ],
      [ /"/, 'attribute.value.html', '@LiquidAttributeString' ],
      [ /'([^']*)'/, 'attribute.value.html' ],
      [ /[\w-]+/, 'attribute.name.html' ],
      [ /=/, 'delimiter.equals.html' ],
      [ /[ \t\r\n]+/, '' ] // whitespace
    ],

    // After <script
    HTMLTagScript: [
      [ /type/, 'attribute.name.html', '@HTMLTagScriptType' ],
      [ /"([^"]*)"/, 'attribute.value.html' ],
      [ /'([^']*)'/, 'attribute.value.html' ],
      [ /[\w-]+/, 'attribute.name.html' ],
      [ /=/, 'delimiter.html' ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagScriptEmbedded',
          nextEmbedded: 'text/javascript'
        }
      ],

      // WHITESPACE
      [ /\s+/, '' ],
      // whitespace
      [
        /(<\/)(script\s*)(>)/,
        [ 'delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' } ]
      ]
    ],

    // After <script ... type
    HTMLTagScriptType: [
      [ /=/, 'delimiter.html', '@HTMLTagScriptTypeEquals' ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagScriptEmbedded',
          nextEmbedded: 'text/javascript'
        }
      ], // cover invalid e.g. <script type>

      // WHITESPACE
      [ /\s+/, '' ],
      // whitespace
      [ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    // After <script ... type =
    HTMLTagScriptTypeEquals: [
      [
        /"([^"]*)"/,
        {
          token: 'attribute.value.html',
          switchTo: '@HTMLTagScriptCustomType.$1'
        }
      ],
      [
        /'([^']*)'/,
        {
          token: 'attribute.value.html',
          switchTo: '@HTMLTagScriptCustomType.$1'
        }
      ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagScriptEmbedded',
          nextEmbedded: 'text/javascript'
        }
      ], // cover invalid e.g. <script type=>

      // WHITESPACE
      [ /\s+/, '' ],
      // whitespace
      [ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    // After <script ... type = $S2
    HTMLTagScriptCustomType: [
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagScriptEmbedded.$S2',
          nextEmbedded: '$S2'
        }
      ],
      [ /"([^"]*)"/, 'attribute.value.html' ],
      [ /'([^']*)'/, 'attribute.value.html' ],
      [ /[\w-]+/, 'attribute.name.html' ],
      [ /=/, 'delimiter.html' ],

      // WHITESPACE
      [ /\s+/, '' ],
      // whitespace
      [ /<\/script\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    // Embedded <script
    HTMLTagScriptEmbedded: [
      [ /<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ],
      [ /[^<]+/, '' ]
    ],

    // After <style
    HTMLTagStyle: [
      [ /type/, 'attribute.name.html', '@HTMLTagStyleType' ],
      [ /"([^"]*)"/, 'attribute.value.html' ],
      [ /'([^']*)'/, 'attribute.value.html' ],
      [ /[\w-]+/, 'attribute.name.html' ],
      [ /=/, 'delimiter.html' ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagStyleEmbedded',
          nextEmbedded: 'text/css'
        }
      ],

      // WHITESPACE
      [ /\s+/, '' ],
      // whitespace
      [
        /(<\/)(style\s*)(>)/,
        [ 'delimiter.html', 'tag.html', { token: 'delimiter.html', next: '@pop' } ]
      ]
    ],

    // After <style ... type
    HTMLTagStyleType: [
      [ /=/, 'delimiter.html', '@HTMLTagStyleTypeEquals' ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagStyleEmbedded',
          nextEmbedded: 'text/css'
        }
      ], // cover invalid e.g. <style type>
      [ /[ \t\r\n]+/, '' ], // whitespace
      [ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    // After <style ... type =
    HTMLTagStyleTypeEquals: [
      [
        /"([^"]*)"/,
        {
          token: 'attribute.value.html',
          switchTo: '@HTMLTagStyleCustomType.$1'
        }
      ],
      [
        /'([^']*)'/,
        {
          token: 'attribute.value.html',
          switchTo: '@HTMLTagStyleCustomType.$1'
        }
      ],
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagStyleEmbedded',
          nextEmbedded: 'text/css'
        }
      ], // cover invalid e.g. <style type=>
      [ /[ \t\r\n]+/, '' ], // whitespace
      [ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    // After <style ... type = $S2
    HTMLTagStyleCustomType: [
      [
        />/,
        {
          token: 'delimiter.html',
          next: '@HTMLTagStyleEmbedded.$S2',
          nextEmbedded: '$S2'
        }
      ],
      [ /"([^"]*)"/, 'attribute.value.html' ],
      [ /'([^']*)'/, 'attribute.value.html' ],
      [ /[\w-]+/, 'attribute.name.html' ],
      [ /=/, 'delimiter.html' ],
      [ /[ \t\r\n]+/, '' ], // whitespace
      [ /<\/style\s*>/, { token: '@rematch', next: '@pop' } ]
    ],

    HTMLTagStyleEmbedded: [
      [ /<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' } ],
      [ /[^<]+/, '' ]
    ]
  }
};
