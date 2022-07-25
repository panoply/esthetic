import { Grammars, Options, LanguageProperName } from 'types/prettify';
import { create } from '@utils/native';

export const grammar = new class Grammar {

  static defaults: Grammars = {
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
      ]
    },
    html: {
      embedded: {
        script: [
          { language: 'javascript' },
          { language: 'json', attribute: { type: [ 'application/json', 'application/ld+json' ] } },
          { language: 'jsx', attribute: { type: [ 'text/jsx', 'application/jsx' ] } }
        ],
        style: [
          { language: 'css' }
        ]
      },
      voids: [
        'area',
        'base',
        'basefont',
        'br',
        'col',
        'embed',
        'eventsource',
        'frame',
        'hr',
        'image',
        'img',
        'input',
        'isindex',
        'keygen',
        'link',
        'meta',
        'path',
        'param',
        'progress',
        'source',
        'wbr',
        'use'
      ],
      tags: [
        'body',
        'colgroup',
        'dd',
        'dt',
        'head',
        'html',
        'li',
        'option',
        'p',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'tr'
      ]
    },
    liquid: {
      embedded: {
        schema: [
          { language: 'json' }
        ],
        style: [
          { language: 'css' }
        ],
        stylesheet: [
          { language: 'css' },
          { language: 'scss', argument: /\s*['"]scss['"]/ }
        ],
        javascript: [
          { language: 'javascript' }
        ]
      },
      tags: [
        'case',
        'capture',
        'comment',
        'embed',
        'filter',
        'for',
        'form',
        'if',
        'macro',
        'paginate',
        'raw',
        'switch',
        'tablerow',
        'unless',
        'verbatim',
        'schema',
        'style',
        'javascript',
        'highlight',
        'stylesheet'
      ],
      else: [
        'default',
        'else',
        'when',
        'elsif'
      ],
      singletons: [
        'assign',
        'increment',
        'decrement',
        'render',
        'include'
      ]
    }
  };

  html: {
    tags: Set<string>;
    voids: Set<string>;
    embed: {
      [tagName: string]: {
        language: LanguageProperName;
        attribute?: string;
        value?(token: string):boolean
      }
    }
  } = create(null);

  liquid: {
    tags: Set<string>;
    singletons: Set<string>;
    else: Set<string>;
    embed: {
      [tagName: string]: {
        language: LanguageProperName;
        attribute?(token: string): boolean
        end(token: string): boolean
      }
    }
  } = create(null);

  script: {
    keywords: Set<string>;
  } = create(null);

  style: {
    units: Set<string>;
  } = create(null);

  constructor () {

    this.script.keywords = new Set(Grammar.defaults.script.keywords);
    this.style.units = new Set(Grammar.defaults.style.units);
    this.html.tags = new Set(Grammar.defaults.html.tags);
    this.html.voids = new Set(Grammar.defaults.html.voids);
    this.html.embed = create(null);
    this.liquid.tags = new Set(Grammar.defaults.liquid.tags);
    this.liquid.else = new Set(Grammar.defaults.liquid.else);
    this.liquid.singletons = new Set(Grammar.defaults.liquid.singletons);
    this.liquid.embed = create(null);
    this.defaults();

  }

  embed (language: 'html' | 'liquid', tag: string) {

    return tag in this[language].embed;

  }

  defaults () {

    for (const tag in Grammar.defaults.html.embedded) {

      this.html.embed[tag] = create(null);

      for (const { language, attribute = null } of Grammar.defaults.html.embedded[tag]) {

        this.html.embed[tag].language = language;

        if (typeof attribute === 'object') {
          for (const attr in attribute) {

            this.html.embed[tag].attribute = attr;

            if (Array.isArray(attribute[attr])) {
              this.html.embed[tag].value = (v) => new Set(attribute[attr] as string).has(v);
            } else {
              this.html.embed[tag].value = (v) => new RegExp(attribute[attr] as string).test(v);
            }
          }
        } else {
          this.html.embed[tag].attribute = null;
        }
      }
    }

    for (const tag in Grammar.defaults.liquid.embedded) {

      this.liquid.embed[tag] = create(null);
      this.liquid.embed[tag].end = (v) => new RegExp(`^{%-?\\s*end${tag}`).test(v);

      for (const { language, argument } of Grammar.defaults.liquid.embedded[tag]) {

        this.liquid.embed[tag].language = language;

        if (argument) {
          if (Array.isArray(argument)) {
            this.liquid.embed[tag].attribute = (v) => new Set(argument).has(v);
          } else {
            this.liquid.embed[tag].attribute = (v) => new RegExp(argument).test(v);
          }
        } else {
          this.liquid.embed[tag].attribute = null;
        }
      }

    }

  }

  extend (rules: Options['grammar']) {

    for (const rule in rules) {

      if (rule === 'html') {

        if ('tags' in rules[rule] && Array.isArray(rules[rule].tags)) {
          for (const tag of rules[rule].tags) {
            if (!this.html.tags.has(tag)) this.html.tags.add(tag);
          }
        }

        if ('voids' in rules[rule] && Array.isArray(rules[rule].voids)) {
          for (const tag of rules[rule].voids) {
            if (!this.html.voids.has(tag)) this.html.voids.add(tag);
          }
        }

        if ('embedded' in rules[rule]) {
          // TODO
        }

      }

      if (rule === 'liquid') {

        if ('tags' in rules[rule] && Array.isArray(rules[rule].tags)) {
          for (const tag of rules[rule].tags) {
            if (!this.liquid.tags.has(tag)) this.liquid.tags.add(tag);
          }
        }

        if ('else' in rules[rule] && Array.isArray(rules[rule].else)) {
          for (const tag of rules[rule].else) {
            if (!this.liquid.else.has(tag)) this.liquid.else.add(tag);
          }
        }

        if ('singletons' in rules[rule] && Array.isArray(rules[rule].singletons)) {
          for (const tag of rules[rule].singletons) {
            if (!this.liquid.singletons.has(tag)) this.liquid.singletons.add(tag);
          }
        }

        if ('embedded' in rules[rule] && typeof rules[rule].embedded === 'object') {
          for (const tag in rules[rule].embedded) {

            if (!(tag in this.liquid.embed)) {
              this.liquid.embed[tag] = create(null);
              this.liquid.embed[tag].end = (v) => new RegExp(`{%-?\\s*end${tag}`).test(v);
            }

            for (const { language, argument } of rules[rule].embedded[tag]) {

              if (this.liquid.embed[tag].language !== language) {
                this.liquid.embed[tag].language = language;
              }

              if (argument) {
                if (this.liquid.embed[tag].attribute === null) {
                  if (Array.isArray(argument)) {
                    this.liquid.embed[tag].attribute = (v) => new Set(argument).has(v);
                  } else {
                    this.liquid.embed[tag].attribute = (v) => new RegExp(argument).test(v);
                  }
                } else {

                  const args = [];

                  for (const defaults of Grammar.defaults.liquid.embedded[tag]) {
                    if (Array.isArray(defaults.argument)) {
                      for (const def of defaults.argument) {
                        if (argument !== def) args.push(argument); else args.push(def);
                      }
                      this.liquid.embed[tag].attribute = (v) => new Set(args).has(v);
                    } else {
                      if (defaults.argument !== argument) {
                        this.liquid.embed[tag].attribute = (v) => new RegExp(argument as string).test(v);
                      }
                    }
                  }
                }
              }
            }
          }

        }
      }

      if (rule === 'style') {
        if ('units' in rules[rule] && Array.isArray(rules[rule].units)) {
          for (const tag of rules[rule].units) {
            if (!this.style.units.has(tag)) this.style.units.add(tag);
          }
        }
      }

      if (rule === 'script') {
        if ('keywords' in rules[rule] && Array.isArray(rules[rule].keywords)) {
          for (const tag of rules[rule].keywords) {
            if (!this.script.keywords.has(tag)) this.script.keywords.add(tag);
          }
        }
      }

    }
  }

}();
