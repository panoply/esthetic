# Grammar

Prettify exposes a low level grammar method which can be used to help refine lexing. The global `grammar` rule option accepts token name specificities that Prettify will use when generating the data structures. The method is helpful in cases where you are using custom tags and want Prettify to reason with them a certain way.

_This API method is **Experimental** and may not make it to the official release._

### Defaults

Under the hood, Prettify has pre-defined grammars for usage in different lexers. Below are the defaults:

```ts
{
  grammar: {

  /* -------------------------------------------- */
  /* HTML                                         */
  /* -------------------------------------------- */

  html: {
    embedded: {
      script: [
        {
          language: 'javascript'
        },
        {
          language: 'json',
          attribute: {
            type: [
              'application/json',
              'application/ld+json'
            ]
          }
        },
        {
          language: 'jsx',
          attribute: {
            type: [
              'text/jsx',
              'application/jsx'
            ]
          }
        }
      ],
      style: [
        {
          language: 'css'
        }
      ]
    },
    voids: [
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
      'path',
      'circle',
      'source',
      'track',
      'wbr'
    ],
    tags: [
      'html',
      'head',
      'title',
      'style',
      'body',
      'article',
      'section',
      'nav',
      'aside',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'header',
      'footer',
      'address',
      'p',
      'pre',
      'blockquote',
      'ol',
      'ul',
      'li',
      'dl',
      'dt',
      'dd',
      'figure',
      'figcaption',
      'main',
      'div',
      'a',
      'em',
      'strong',
      'small',
      's',
      'cite',
      'q',
      'dfn',
      'abbr',
      'ruby',
      'rb',
      'rt',
      'rp',
      'time',
      'code',
      'var',
      'samp',
      'kbd',
      'sub',
      'sup',
      'i',
      'b',
      'u',
      'mark',
      'bdi',
      'bdo',
      'span',
      'ins',
      'del',
      'picture',
      'iframe',
      'object',
      'video',
      'audio',
      'map',
      'table',
      'caption',
      'colgroup',
      'tbody',
      'thead',
      'tfoot',
      'tr',
      'td',
      'th',
      'form',
      'label',
      'button',
      'select',
      'datalist',
      'optgroup',
      'option',
      'textarea',
      'output',
      'progress',
      'meter',
      'fieldset',
      'legend',
      'details',
      'summary',
      'dialog',
      'script',
      'noscript',
      'template',
      'canvas'
    ]
  },

  /* -------------------------------------------- */
  /* LIQUID                                       */
  /* -------------------------------------------- */

  liquid: {
    embedded: {
      schema: [{ language: 'json' }],
      style: [{ language: 'css' }],
      stylesheet: [{ language: 'css' }, { language: 'scss', argument: /\s*['"]scss['"]/ }],
      javascript: [{ language: 'javascript' }]
    },
    tags: [
      'form',
      'paginate',
      'capture',
      'case',
      'comment',
      'for',
      'if',
      'liquid',
      'raw',
      'schema',
      'style',
      'stylesheet',
      'javascript',
      'tablerow',
      'unless'
    ],
    else: [
      'else',
      'elsif',
      'when'
    ],
    singletons: [
      'include',
      'layout',
      'section',
      'assign',
      'break',
      'continue',
      'cycle',
      'decrement',
      'echo',
      'increment',
      'render'
    ]
  },

  style: {
    units: [
      '%',
      'cap',
      'ch',
      'cm',
      'deg',
      'dpcm',
      'dpi',
      'dppx',
      'em',
      'ex',
      'fr',
      'grad',
      'Hz',
      'ic',
      'in',
      'kHz',
      'lh',
      'mm',
      'ms',
      'mS',
      'pc',
      'pt',
      'px',
      'Q',
      'rad',
      'rem',
      'rlh',
      's',
      'turn',
      'vb',
      'vh',
      'vi',
      'vmax',
      'vmin',
      'vw'
    ],
    atrules: [
      'charset',
      'color-profile',
      'counter-style',
      'font-face',
      'font-feature-values',
      'import',
      'keyframes',
      'layer',
      'media',
      'namespace',
      'page',
      'supports'
    ],
    pseudo: {
      classes: [
        'active',
        'any-link',
        'checked',
        'default',
        'defined',
        'disabled',
        'empty',
        'enabled',
        'first',
        'first-child',
        'first-of-type',
        'fullscreen',
        'focus',
        'focus-visible',
        'focus-within',
        'host',
        'hover',
        'indeterminate',
        'in-range',
        'invalid',
        'is',
        'lang',
        'last-child',
        'last-of-type',
        'left',
        'link',
        'modal',
        'not',
        'nth-child',
        'nth-col',
        'nth-last-child',
        'nth-last-of-type',
        'nth-of-type',
        'only-child',
        'only-of-type',
        'optional',
        'out-of-range',
        'picture-in-picture',
        'placeholder-shown',
        'paused',
        'playing',
        'read-only',
        'read-write',
        'required',
        'right',
        'root',
        'scope',
        'target',
        'valid',
        'visited',
        'where'
      ],
      elements: [
        'after',
        'backdrop',
        'before',
        'cue',
        'cue-region',
        'first-letter',
        'first-line',
        'file-selector-button',
        'marker',
        'part',
        'placeholder',
        'selection',
        'slotted'
      ],
      functions: [
        'after',
        'before',
        'first-letter',
        'first-line',
        'host',
        'host-context',
        'part',
        'slotted',
        'lang',
        'not',
        'nth-child',
        'nth-col',
        'nth-last-child',
        'nth-last-of-type',
        'nth-of-type',
        'where'
      ]
    }
  },


  /* -------------------------------------------- */
  /* SCRIPTS                                      */
  /* -------------------------------------------- */

    script: {
      keywords: [
        'ActiveXObject',
        'ArrayBuffer',
        'AudioContext',
        'Canvas',
        'CustomAnimation',
        'DOMParser',
        'DataView',
        'Date',
        'Error',
        'EvalError',
        'FadeAnimation',
        'FileReader',
        'Flash',
        'Float32Array',
        'Float64Array',
        'FormField',
        'Frame',
        'Generator',
        'HotKey',
        'Image',
        'Iterator',
        'Intl',
        'Int16Array',
        'Int32Array',
        'Int8Array',
        'InternalError',
        'Loader',
        'Map',
        'MenuItem',
        'MoveAnimation',
        'Notification',
        'ParallelArray',
        'Point',
        'Promise',
        'Proxy',
        'RangeError',
        'Rectangle',
        'ReferenceError',
        'Reflect',
        'RegExp',
        'ResizeAnimation',
        'RotateAnimation',
        'Set',
        'SQLite',
        'ScrollBar',
        'Set',
        'Shadow',
        'StopIteration',
        'Symbol',
        'SyntaxError',
        'Text',
        'TextArea',
        'Timer',
        'TypeError',
        'URL',
        'Uint16Array',
        'Uint32Array',
        'Uint8Array',
        'Uint8ClampedArray',
        'URIError',
        'WeakMap',
        'WeakSet',
        'Web',
        'Window',
        'XMLHttpRequest'
      ]
    }
  }
}
```

# Extending Grammars

You can extend these grammars and provide Prettify context of the input you are passing.
