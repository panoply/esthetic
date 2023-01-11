import { Grammars, EmbeddedHTML, EmbeddedLiquid, LanguageName } from 'types/internal';
import { isArray } from '@utils/native';

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Liquid Grammar
 *
 * Builds the grammar module for Liquid (markup) languages.
 */
function LiquidGrammar (grammar: Grammars['liquid'] = {
  embedded: {
    schema: [
      {
        language: 'json'
      }
    ],
    style: [
      {
        language: 'css'
      }
    ],
    stylesheet: [
      {
        language: 'css'
      },
      {
        language: 'scss',
        argument: /['"]scss['"]/
      }
    ],
    javascript: [
      {
        language: 'javascript'
      }
    ]
  },
  tags: [
    'form',
    'paginate',
    'capture',
    'case',
    'comment',
    'for',
    'if',
    'raw',
    'tablerow',
    'unless',
    'schema',
    'style',
    'script',
    'stylesheet',
    'javascript'
  ],
  control: [
    'if',
    'unless',
    'case'
  ],
  else: [
    'else',
    'elsif'
  ],
  singletons: [
    'include',
    'layout',
    'section',
    'assign',
    'liquid',
    'break',
    'continue',
    'cycle',
    'decrement',
    'echo',
    'increment',
    'render',
    'when'
  ]
}) {

  const ELSE = new Set(grammar.else);
  const CONTROL = new Set(grammar.control);
  const TAGS = new Set(grammar.tags);
  const SINGLETON = new Set(grammar.singletons);
  const EMBEDDED: {
    [tag: string]: {
      tag: string;
      language: LanguageName;
      args: Map<Set<string | RegExp>, {
        tag: string,
        language: LanguageName
      }>
    }
  } = {};

  embed(grammar.embedded);

  return ({
    get grammar () {
      return grammar;
    },
    get tags () {
      return TAGS;
    },
    get control () {
      return CONTROL;
    },
    get else () {
      return ELSE;
    },
    get singleton () {
      return SINGLETON;
    },
    get embed () {
      return EMBEDDED;
    },
    extend (rules: Grammars['liquid']) {

      for (const rule in rules) {
        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === 'tags' && TAGS.has(tag) === false) {
              grammar.tags.push(tag);
              TAGS.add(tag);
            } else if (rule === 'else' && ELSE.has(tag) === false) {
              grammar.else.push(tag);
              ELSE.add(tag);
            } else if (rule === 'control' && CONTROL.has(tag)) {
              grammar.control.push(tag);
              CONTROL.add(tag);
            } else if (rule === 'singletons' && SINGLETON.has(tag) === false) {
              grammar.singletons.push(tag);
              SINGLETON.add(tag);
            }
          }
        } else if (rule === 'embed') {
          if (typeof rules[rule] === 'object') {
            embed(rules[rule]);
          }
        }
      }
    }
  });

  /**
   * Embedded Queries
   *
   * Generates embed query utility for determining
   * different Liquid embedded type tag blocks
   */
  function embed (rules: EmbeddedLiquid) {

    for (const tag in rules) {

      for (const { language, argument = null } of rules[tag]) {

        if (!(tag in EMBEDDED)) {
          EMBEDDED[tag] = {
            tag,
            language,
            args: new Map([ [ new Set(), { tag, language } ] ])
          };
        }

        if (argument) {

          for (const [ match ] of EMBEDDED[tag].args) {
            if (match === null) continue;
            if (isArray(argument)) {
              for (const arg of argument) if (!match.has(arg)) match.add(arg);
            } else {
              const exp = new RegExp(argument);
              if (match.size > 0) {
                for (const m of match) {
                  if (!(m instanceof RegExp)) continue;
                  if (m.source !== exp.source) match.add(exp);
                }
              } else {
                match.add(exp);
              }
            }
          }
        }
      }
    }

  }

}

/**
 * HTML Grammar
 *
 * Builds the grammar module for HTML (markup) languages.
 */
function HTMLGrammar (grammar: Grammars['html'] = {
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
  svg: [
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'script',
    'set',
    'stop',
    'style',
    'switch',
    'symbol',
    'text',
    'textPath',
    'title',
    'tref',
    'tspan',
    'use',
    'view',
    'vkern'
  ],
  voids: [
    'area',
    'base',
    'br',
    'col',
    'command',
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
  ],
  tags: [
    'a',
    'abbr',
    'acronym',
    'address',
    'applet',
    'article',
    'aside',
    'audio',
    'b',
    'basefont',
    'bdi',
    'bdo',
    'big',
    'blockquote',
    'body',
    'button',
    'canvas',
    'caption',
    'center',
    'cite',
    'code',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'dir',
    'div',
    'dl',
    'dt',
    'em',
    'fieldset',
    'figcaption',
    'figure',
    'figure',
    'font',
    'footer',
    'form',
    'frame',
    'frameset',
    'h1',
    'h6',
    'head',
    'header',
    'html',
    'i',
    'iframe',
    'ins',
    'isindex',
    'kbd',
    'label',
    'legend',
    'fieldset',
    'li',
    'main',
    'map',
    'mark',
    'marquee',
    'menu',
    'meter',
    'nav',
    'noframes',
    'frame',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'object',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'picture',
    'video',
    'audio',
    'span',
    'strike',
    'strong',
    'style',
    'sub',
    'summary',
    'details',
    'sup',
    'svg',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'audio',
    'video',
    'tt',
    'u',
    'ul',
    'var',
    'video'
  ]
}) {

  const SVG = new Set(grammar.svg);
  const TAGS = new Set(grammar.tags);
  const VOIDS = new Set(grammar.voids);
  const EMBEDDED: {
    [tag: string]: {
      tag: string;
      language?: LanguageName,
      attr: Map<LanguageName, {
        tag: string;
        language: LanguageName;
        attr: Map<string, {
          tag: string;
          language: LanguageName;
          attr: string;
          value: Set<string | RegExp>
        }>
      }>
    }
  } = {};

  embed(grammar.embedded);

  return ({
    get grammar () {
      return grammar;
    },
    get svg () {
      return SVG;
    },
    get tags () {
      return TAGS;
    },
    get voids () {
      return VOIDS;
    },
    get embed () {
      return EMBEDDED;
    },
    extend (rules: Grammars['html']) {

      for (const rule in rules) {

        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === 'tags' && TAGS.has(tag) === false) {
              grammar.tags.push(tag);
              TAGS.add(tag);
            } else if (rule === 'voids' && VOIDS.has(tag) === false) {
              grammar.voids.push(tag);
              VOIDS.add(tag);
            } else if (rule === 'svg' && SVG.has(tag) === false) {
              grammar.svg.push(tag);
              SVG.add(tag);
            }
          }
        } else if (rule === 'embedded') {
          if (typeof rules[rule] === 'object') {
            embed(rules[rule]);
          }
        }
      }
    }
  });

  /**
   * Embedded Queries
   *
   * Generates embed query utility for determining
   * different HTML embedded type tag blocks
   */
  function embed (rules: EmbeddedHTML) {

    for (const tag in rules) {

      if (!(tag in EMBEDDED)) EMBEDDED[tag] = { tag, attr: new Map() };

      for (const { language, attribute } of rules[tag]) {

        if (!('language' in EMBEDDED[tag])) EMBEDDED[tag].language = language;

        if (!EMBEDDED[tag].attr.has(language)) {
          EMBEDDED[tag].attr.set(language, { tag, language, attr: new Map() });
        }
        if (attribute) {

          const entry = EMBEDDED[tag].attr.get(language);

          for (const attr in attribute) {

            if (!entry.attr.has(attr)) {
              entry.attr.set(attr, {
                tag,
                language,
                attr,
                value: new Set()
              });
            };

            const curr = EMBEDDED[tag].attr.get(language).attr.get(attr);

            if (isArray(attribute[attr])) {
              for (const arg of attribute[attr] as string[]) if (!curr.value.has(arg)) curr.value.add(arg);
            } else {
              const exp = new RegExp(attribute[attr] as string);
              if (curr.value.size > 0) {
                for (const m of curr.value) {
                  if (!(m instanceof RegExp)) continue;
                  if (m.source !== exp.source) curr.value.add(exp);
                }
              } else {
                curr.value.add(exp);
              }
            }

          }
        }
      }
    }

  }

}

/**
 * CSS Grammar
 *
 * Builds the grammar module for CSS (style) languages.
 */
function CSSGrammar (grammar: Grammars['css'] = {
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
    '@charset',
    '@color-profile',
    '@counter-style',
    '@font-face',
    '@font-feature-values',
    '@font-palette-values',
    '@import',
    '@keyframes',
    '@layer',
    '@media',
    '@namespace',
    '@page',
    '@supports'
  ],
  webkit: {
    classes: [
      'webkit-any',
      'webkit-any-link*',
      'webkit-autofill'
    ],
    elements: [
      'webkit-file-upload-button',
      'webkit-inner-spin-button',
      'webkit-input-placeholder',
      'webkit-meter-bar',
      'webkit-meter-even-less-good-value',
      'webkit-meter-inner-element',
      'webkit-meter-optimum-value',
      'webkit-meter-suboptimum-value',
      'webkit-outer-spin-button',
      'webkit-progress-bar',
      'webkit-progress-inner-element',
      'webkit-progress-value',
      'webkit-search-cancel-button',
      'webkit-search-results-button',
      'webkit-slider-runnable-track',
      'webkit-slider-thumb'
    ]
  },
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
}) {

  const UNITS = new Set(grammar.units);
  const ATRULES = new Set(grammar.atrules);
  const PSEUDO_CLASSES = new Set(grammar.pseudo.classes);
  const PSEUDO_ELEMENTS = new Set(grammar.pseudo.elements);
  const PSEUDO_FUNCTIONS = new Set(grammar.pseudo.functions);
  const WEBKIT_ELEMENTS = new Set(grammar.webkit.elements);
  const WEBKIT_CLASSES = new Set(grammar.webkit.classes);

  return {
    get grammar () {
      return grammar;
    },
    get units () {
      return UNITS;
    },
    get atrules () {
      return ATRULES;
    },
    get pseudoClasses () {
      return PSEUDO_CLASSES;
    },
    get pseudoElements () {
      return PSEUDO_ELEMENTS;
    },
    get pseudoFunctions () {
      return PSEUDO_FUNCTIONS;
    },
    get webkitElements () {
      return WEBKIT_ELEMENTS;
    },
    get webkitClasses () {
      return WEBKIT_CLASSES;
    },
    extend (rules: Grammars['css']) {

      for (const rule in rules) {

        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === 'units' && !UNITS.has(tag)) {
              grammar[rule].push(tag);
              UNITS.add(tag);
            } else if (rule === 'atrules' && !ATRULES.has(tag)) {
              grammar[rule].push(tag);
              ATRULES.add(tag);
            }
          }
        }

        if (typeof rules[rule] === 'object') {
          for (const prop in rules[rule]) {
            if (isArray(rules[rule][prop])) {
              for (const tag of rules[rule][prop]) {
                if (rule === 'webkit') {

                  if (prop === 'elements') {
                    grammar[rule][prop].push(tag);
                    WEBKIT_ELEMENTS.add(tag);
                  } else if (prop === 'classes') {
                    grammar[rule][prop].push(tag);
                    WEBKIT_CLASSES.add(tag);
                  }

                } else if (rule === 'pseudo') {

                  if (prop === 'elements') {
                    grammar[rule][prop].push(tag);
                    PSEUDO_ELEMENTS.add(tag);
                  } else if (prop === 'classes') {
                    grammar[rule][prop].push(tag);
                    PSEUDO_CLASSES.add(tag);
                  } else if (prop === 'functions') {
                    grammar[rule][prop].push(tag);
                    PSEUDO_FUNCTIONS.add(tag);
                  }

                }
              }
            }
          }
        }
      }
    }
  };

}

/**
 * JavaScript Grammar
 *
 * Builds the grammar module for JavaScript (script) languages.
 */
function JavaScriptGrammar (grammar: Grammars['js'] = {
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
}) {

  const KEYWORDS = new Set(grammar.keywords);

  return {
    get grammar () {
      return grammar;
    },
    get keywords () {
      return KEYWORDS;
    },
    extend (rules: Grammars['js']) {

      for (const rule in rules) {

        if (isArray(rules[rule])) {
          for (const tag of rules[rule]) {
            if (rule === 'keywords' && !KEYWORDS.has(tag)) {
              grammar[rule].push(tag);
              KEYWORDS.add(tag);
            }
          }
        }

      }
    }
  };
}

/* -------------------------------------------- */
/* CLASS EXPORT                                 */
/* -------------------------------------------- */

/**
 * Language Grammars
 */
export const grammar = (function () {

  /**
   * CSS Grammars
   */
  const css = CSSGrammar();

  /**
   * Liquid Grammars
   */
  const liquid = LiquidGrammar();

  /**
   * JavaScript Grammars
   */
  const js = JavaScriptGrammar();

  /**
   * HTML Grammars
   */
  const html = HTMLGrammar();

  return {
    html,
    liquid,
    js,
    css,
    /**
     * Extend Grammars
     */
    extend (options?: Grammars) {

      if (typeof options === 'object') {
        for (const language in options) {
          if (language === 'liquid') {
            liquid.extend(options.liquid);
          } else if (language === 'html') {
            html.extend(options.html);
          } else if (language === 'css') {
            css.extend(options.css);
          } else if (language === 'js') {
            js.extend(options.js);
          }
        }
      }

      return {
        get html () { return html.grammar; },
        get liquid () { return liquid.grammar; },
        get js () { return js.grammar; },
        get css () { return css.grammar; }
      };
    }
  };
})();
