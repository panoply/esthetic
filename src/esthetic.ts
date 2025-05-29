import type {
  EventListeners,
  Grammars,
  ISettings,
  LanguageName,
  LexerName,
  ParseHook,
  RulePresetNames,
  Rules,
  Stats
} from 'types';

import { config } from 'config';
import { Action, Modes } from 'lexical/enum';
import { detection } from 'parse/detection';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { setRules } from 'rules/define';
import { getLexerName, getLexerType } from 'rules/language';
import { aesthetic } from 'rules/presets/aesthetic';
import { defaults } from 'rules/presets/default';
import { prettier } from 'rules/presets/prettier';
import { warrington } from 'rules/presets/warrington';
import { isValidChoice } from 'rules/validate';
import { isObject, isUndefined, merge, stats } from 'utils/helpers';
import { defineProperties, defineProperty } from 'utils/native';

export const esthetic = new class Esthetic {

  constructor () {

    if (config.env === 'node') config.cwd = process.cwd();
    if (config.env === 'browser') {
      // @ts-expect-error
      if (!('esthetic' in window)) {
      // @ts-expect-error
        defineProperty(window, 'esthetic', {
          configurable: true,
          get () {
            return esthetic;
          }
        });
      }
    }

    defineProperties(this.preset, {
      default: { get () { return defaults; } },
      warrington: { get () { return warrington; } },
      prettier: { get () { return prettier; } },
      aesthetic: { get () { return aesthetic; } }
    });

  }

  define (source: string | Buffer, rules: Rules) {

    parse.source = source;

    if (isObject(rules)) {
      if ('language' in rules && this.language !== rules.language) {
        if (isValidChoice('language', rules.language)) {
          this.language = parse.language = parse.rules.language = rules.language;
          this.lexer = parse.lexer = getLexerName(parse.language);
        }
      }
    }

    this.rules(rules);

    if (this.language === 'auto') {

      parse.action = Action.Detect;
      const detect = detection(parse.source);
      parse.action = Action.Parse;

      this.language = parse.language = parse.rules.language = detect.language;
      this.lexer = parse.lexer = getLexerName(detect.language);

    }

  }

  public language: LanguageName = 'auto';
  public lexer: LexerName = 'auto';
  public stats: Stats = null;
  public events: EventListeners = {
    format: [],
    error: [],
    rules: [],
    parse: []
  };

  preset (preset: RulePresetNames, rules: Rules) {

    return merge(this.preset[preset], rules);

  }

  get detect () { return detection; }
  get table () { return parse.data; }
  get error () { return parse.error; }
  get lines () { return parse.numbers; }

  grammar (grammars?: Grammars) {

    if (!grammars) return grammar.extend();

    grammar.extend(grammars);

    return this;

  }

  settings (options?: ISettings) {

    if (!isObject(options)) return config;

    for (const prop in options) {
      if (prop in config) {
        config[prop] = options[prop];
      }
    }

    if (config.env === 'browser' && config.globalThis === false) {
      // @ts-expect-error
      if ('esthetic' in window) delete window.esthetic;
    }

    return this;

  }

  on (name: 'error' | 'format' | 'rules' | 'parse' | 'language', callback: any) {

    this.events[name].push(callback);

    return this;

  }

  hook (name: 'parse', callback: ParseHook) {

    parse.hooks[name] = [ callback ];

  }

  format (source: string | Buffer, rules?: Rules) {

    this.define(source, rules);

    const lexer = getLexerType(this.language);
    const action = config.reportStats ? stats(this.language, this.lexer) : null;
    const output = parse.document(lexer, Modes.Format) as string;

    if (parse.error !== null) {

      if (this.events.error.length > 0) {
        // @ts-ignore
        for (const cb of this.events.error) cb(parse.error);
        return source;
      } else {
        if (config.throwErrors) throw new Error(parse.error);
        return source;
      }

    }

    const timing = action === null ? null : this.stats = action(output.length);

    if (this.events.format.length > 0) {
      for (const cb of this.events.format) {

        const fn = cb.call({ get data () { return parse.data; } }, {
          get output () { return source; },
          get stats () { return timing; },
          get rules () { return parse.rules; }
        });

        if (fn === false) return source;
      }
    }

    return output;

  };

  parse (source: string | Buffer, rules?: Rules) {

    this.define(source, rules);

    const invoke = getLexerType(this.language);
    const action = config.reportStats ? stats(this.language, this.lexer) : null;
    const parsed = parse.document(invoke, Modes.Parse);

    if (parse.error !== null) {
      if (this.events.error.length > 0) {
        // @ts-ignore
        for (const cb of this.events.error) cb(parse.error);
        return [];
      } else {
        if (config.throwErrors) throw parse.error;
        return [];
      }
    }

    const timing = action === null ? null : this.stats = action(parse.count);

    if (this.events.parse.length > 0) {
      for (const cb of this.events.parse) {

        const fn = cb({
          get data () { return parse.data; },
          get stats () { return timing; },
          get rules () { return parse.rules; }
        });

        if (fn === false) return source;

      }
    }

    return parsed;

  };

  rules (rules?: Rules) {
    if (isUndefined(rules)) return parse.rules;
    setRules(rules, this.events);
    this.language = parse.language;
    this.lexer = parse.lexer = getLexerName(parse.language);
    return parse.rules;

  }

  liquid (source: string | Buffer, rules?: Rules) {
    this.language = parse.language = parse.rules.language = 'liquid';
    this.lexer = parse.lexer = getLexerName(parse.language);
    return this.format(source, rules);
  }

  html (source: string | Buffer, rules?: Rules) {
    this.language = parse.language = parse.rules.language = 'html';
    this.lexer = parse.lexer = getLexerName(parse.language);
    return this.format(source, rules);
  }

  xml (source: string | Buffer, rules?: Rules) {
    this.language = parse.language = parse.rules.language = 'xml';
    this.lexer = parse.lexer = getLexerName(parse.language);
    return this.format(source, rules);
  }

  json (source: string | Buffer, rules?: Rules) {
    this.language = parse.language = parse.rules.language = 'json';
    this.lexer = parse.lexer = getLexerName(parse.language);
    return this.format(source, rules);
  }

}();
