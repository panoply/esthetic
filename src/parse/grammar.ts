import type { EmbeddedHTML, EmbeddedLiquid, Grammars, LanguageName } from 'types';

import { isArray, isObject, isRegex } from 'utils/helpers';
import { object, set } from 'utils/native';

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
      'doc',
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
    iterator: [
      'for',
      'tablerow'
    ],
    control: [
      'if',
      'unless',
      'case',
      'elsif',
      'when'
    ],
    else: [
      'else',
      'elsif',
      'when'
    ],
    void: [
      'echo',
      'else',
      'break',
      'continue',
      'increment',
      'decrement'
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

  public iterator = set(this.grammar.iterator);
  public void = set(this.grammar.void);
  public else = set(this.grammar.else);
  public control = set(this.grammar.control);
  public tags = set(this.grammar.tags);
  public singleton = set(this.grammar.singletons);
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
          } else if (rule === 'void' && this.void.has(tag) === false) {
            this.grammar.void.push(tag);
            this.void.add(tag);
          } else if (rule === 'iterator' && this.iterator.has(tag) === false) {
            this.grammar.iterator.push(tag);
            this.iterator.add(tag);
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

  public tags = set(this.grammar.tags);

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
    table: [
      'td',
      'th',
      'tr',
      'colgroup',
      'tbody',
      'thead',
      'tfoot'
    ],
    textNodes: [
      'a',
      'abbr',
      'b',
      'bdi',
      'bdo',
      'cite',
      'code',
      'data',
      'del',
      'dfn',
      'em',
      'ins',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'kbd',
      'li',
      'mark',
      'rb',
      'rp',
      'rt',
      'rtc',
      'ruby',
      's',
      'samp',
      'small',
      'span',
      'strong',
      'sub',
      'sup',
      'time',
      'u',
      'i',
      'q',
      'dd',
      'dt',
      'td',
      'th',
      'var'
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
      'font',
      'footer',
      'form',
      'frame',
      'frameset',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hgroup',
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

  public textNodes: Set<string> = set(this.grammar.textNodes);
  public tags = set(this.grammar.tags);
  public voids = set(this.grammar.voids);
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

  constructor () { this.queries(this.grammar.embedded); }

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

/* -------------------------------------------- */
/* CLASS EXPORT                                 */
/* -------------------------------------------- */

/**
 * Language Grammars
 */
class Grammar {

  /**
   * Liquid Grammars
   */
  public liquid = new Liquid();

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

    if (isObject(options)) {
      for (const language in options) {
        if (language === 'liquid') {
          this.liquid.extend(options.liquid);
        } else if (language === 'html') {
          this.html.extend(options.html);
        } else if (language === 'svg') {
          this.svg.extend(options.svg);
        }
      }
    }

    return Object.defineProperties(object(null), {
      html: { get: () => this.html.grammar },
      liquid: { get: () => this.liquid.grammar },
      svg: { get: () => this.svg.grammar }
    });

  }

};

export const grammar = new Grammar();
