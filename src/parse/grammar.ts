import type { Grammars, EmbeddedHTML, EmbeddedLiquid, LanguageName } from 'types';
import { isArray, isObject, isRegex } from 'utils/helpers';

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Liquid Grammar
 *
 * Builds the grammar module for Liquid (markup) languages.
 */
class Liquid {

  public grammar: Grammars['liquid'] = {
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
      'elsif',
      'when'
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
      'render'
    ]
  };

  public else = new Set(this.grammar.else);
  public control = new Set(this.grammar.control);
  public tags = new Set(this.grammar.tags);
  public singleton = new Set(this.grammar.singletons);
  public embed: {
    [tag: string]: {
      tag: string;
      language: LanguageName;
      args: Map<Set<string | RegExp>, {
        tag: string,
        language: LanguageName
      }>
    }
  } = {};

  constructor () {

    this.queries(this.grammar.embedded);

  }

  extend (rules: Grammars['liquid']) {

    for (const rule in rules) {
      if (isArray(rules[rule])) {
        for (const tag of rules[rule]) {
          if (rule === 'tags' && this.tags.has(tag) === false) {
            this.grammar.tags.push(tag);
            this.tags.add(tag);
          } else if (rule === 'else' && this.else.has(tag) === false) {
            this.grammar.else.push(tag);
            this.else.add(tag);
          } else if (rule === 'control' && this.control.has(tag)) {
            this.grammar.control.push(tag);
            this.control.add(tag);
          } else if (rule === 'singletons' && this.singleton.has(tag) === false) {
            this.grammar.singletons.push(tag);
            this.singleton.add(tag);
          }
        }
      } else if (rule === 'embedded') {
        if (isObject(rules[rule])) {
          this.queries(rules[rule]);
        }
      }
    }
  }

  /**
   * Embedded Queries
   *
   * Generates embed query utility for determining
   * different Liquid embedded type tag blocks
   */
  private queries (rules: EmbeddedLiquid) {

    for (const tag in rules) {

      for (const { language, argument = null } of rules[tag]) {

        if (!(tag in this.embed)) {
          this.embed[tag] = {
            tag,
            language,
            args: new Map([ [ new Set(), { tag, language } ] ])
          };
        }

        if (argument) {

          for (const [ match ] of this.embed[tag].args) {
            if (match === null) continue;
            if (isArray(argument)) {
              for (const arg of argument) if (!match.has(arg)) match.add(arg);
            } else {
              const exp = new RegExp(argument);
              if (match.size > 0) {
                for (const m of match) {
                  if (isRegex(m) === false) continue;
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
 * SVG Grammar
 *
 * Builds the grammar module for SVG (markup) containing tokens.
 */
class SVG {

  public grammar = {
    tags: [
      // 'a',
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
      // 'script',
      'set',
      'stop',
      //  'style',
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
    ]
  };

  public tags = new Set(this.grammar.tags);

  extend (rules: Grammars['svg']) {

    for (const rule in rules) {
      if (isArray(rules[rule])) {
        for (const tag of rules[rule]) {
          if (rule === 'tags' && this.tags.has(tag) === false) {
            this.grammar.tags.push(tag);
            this.tags.add(tag);
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

class HTML {

  public grammar = {
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
  };

  public tags = new Set(this.grammar.tags);
  public voids = new Set(this.grammar.voids);
  public embed: {
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

  constructor () {

    this.queries(this.grammar.embedded);

  }

  extend (rules: Grammars['html']) {

    for (const rule in rules) {

      if (isArray(rules[rule])) {
        for (const tag of rules[rule]) {
          if (rule === 'tags' && this.tags.has(tag) === false) {
            this.grammar.tags.push(tag);
            this.tags.add(tag);
          } else if (rule === 'voids' && this.voids.has(tag) === false) {
            this.grammar.voids.push(tag);
            this.voids.add(tag);
          }
        }
      } else if (rule === 'embedded') {
        if (isObject(rules[rule])) {
          this.queries(rules[rule]);
        }
      }
    }
  }

  /**
  * Embedded Queries
  *
  * Generates embed query utility for determining
  * different HTML embedded type tag blocks
  */
  private queries (rules: EmbeddedHTML) {

    for (const tag in rules) {

      if (!(tag in this.embed)) this.embed[tag] = { tag, attr: new Map() };

      for (const { language, attribute } of rules[tag]) {

        if (!('language' in this.embed[tag])) this.embed[tag].language = language;

        if (!this.embed[tag].attr.has(language)) {
          this.embed[tag].attr.set(language, { tag, language, attr: new Map() });
        }
        if (attribute) {

          const entry = this.embed[tag].attr.get(language);

          for (const attr in attribute) {

            if (!entry.attr.has(attr)) {
              entry.attr.set(attr, {
                tag,
                language,
                attr,
                value: new Set()
              });
            };

            const curr = this.embed[tag].attr.get(language).attr.get(attr);

            if (isArray(attribute[attr])) {
              for (const arg of attribute[attr] as string[]) {
                if (!curr.value.has(arg)) curr.value.add(arg);
              }
            } else {
              const exp = new RegExp(attribute[attr] as string);
              if (curr.value.size > 0) {
                for (const m of curr.value) {
                  if (isRegex(m) === false) continue;
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

class CSS {

  public grammar = {
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
  };

  public units = new Set(this.grammar.units);
  public atRules = new Set(this.grammar.atrules);
  public pseudoClasses = new Set(this.grammar.pseudo.classes);
  public pseudoElements = new Set(this.grammar.pseudo.elements);
  public pseudoFunctions = new Set(this.grammar.pseudo.functions);
  public webkitElements = new Set(this.grammar.webkit.elements);
  public webkitClasses = new Set(this.grammar.webkit.classes);

  atrules (token: string) {

    return this.atRules.has(token.slice(0, token.indexOf('(')).trim());

  }

  extend (rules: Grammars['css']) {

    for (const rule in rules) {

      if (isArray(rules[rule])) {
        for (const tag of rules[rule]) {
          if (rule === 'units' && !this.units.has(tag)) {
            this.grammar[rule].push(tag);
            this.units.add(tag);
          } else if (rule === 'atrules' && !this.atRules.has(tag)) {
            this.grammar[rule].push(tag);
            this.atRules.add(tag);
          }
        }
      }

      if (typeof rules[rule] === 'object') {
        for (const prop in rules[rule]) {
          if (isArray(rules[rule][prop])) {
            for (const tag of rules[rule][prop]) {
              if (rule === 'webkit') {

                if (prop === 'elements') {
                  this.grammar[rule][prop].push(tag);
                  this.webkitElements.add(tag);
                } else if (prop === 'classes') {
                  this.grammar[rule][prop].push(tag);
                  this.webkitClasses.add(tag);
                }

              } else if (rule === 'pseudo') {

                if (prop === 'elements') {
                  this.grammar[rule][prop].push(tag);
                  this.pseudoElements.add(tag);
                } else if (prop === 'classes') {
                  this.grammar[rule][prop].push(tag);
                  this.pseudoClasses.add(tag);
                } else if (prop === 'functions') {
                  this.grammar[rule][prop].push(tag);
                  this.pseudoFunctions.add(tag);
                }

              }
            }
          }
        }
      }
    }
  }

}

/**
 * JavaScript Grammar
 *
 * Builds the grammar module for JavaScript (script) languages.
 */
class JavaScript {

  public grammar = {
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
  };

  public keywords = new Set(this.grammar.keywords);

  extend (rules: Grammars['js']) {

    for (const rule in rules) {
      if (isArray(rules[rule])) {
        for (const tag of rules[rule]) {
          if (rule === 'keywords' && !this.keywords.has(tag)) {
            this.grammar[rule].push(tag);
            this.keywords.add(tag);
          }
        }
      }
    }
  }

}

/* -------------------------------------------- */
/* CLASS EXPORT                                 */
/* -------------------------------------------- */

/**
 * Language Grammars
 */
class Grammar {

  /**
   * CSS Grammars
   */
  public css = new CSS();

  /**
   * Liquid Grammars
   */
  public liquid = new Liquid();

  /**
   * JavaScript Grammars
   */
  public js = new JavaScript();

  /**
   * HTML Grammars
   */
  public html = new HTML();

  /**
   * SVG Grammars
   */
  public svg = new SVG();

  /**
     * Extend Grammars
     */
  extend (options?: Grammars) {

    const {
      liquid,
      html,
      css,
      js,
      svg
    } = this;

    if (isObject(options)) {
      for (const language in options) {
        if (language === 'liquid') {
          liquid.extend(options.liquid);
        } else if (language === 'html') {
          html.extend(options.html);
        } else if (language === 'css') {
          css.extend(options.css);
        } else if (language === 'js') {
          js.extend(options.js);
        } else if (language === 'svg') {
          svg.extend(options.svg);
        }
      }
    }

    return {
      get html () {
        return html.grammar;
      },
      get liquid () {
        return liquid.grammar;
      },
      get js () {
        return js.grammar;
      },
      get css () {
        return css.grammar;
      },
      get svg () {
        return svg.grammar;
      }
    };

  }

};

export const grammar = new Grammar();
