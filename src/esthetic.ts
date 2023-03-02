import { grammar } from '@parse/grammar';
import { parse } from '@parse/parser';
import { definitions } from '@parse/definitions';
import { detect } from '@parse/detection';
import { Modes } from 'lexical/enum';
import { CNL, NWL } from 'lexical/chars';
import { getLexerName, getLexerType, stats } from '@utils';
import type {
  Rules,
  LanguageName,
  RulesChanges,
  RulesInternal,
  LexerName,
  Stats,
  ParseHook,
  EventListeners
} from 'types/export';

class Esthetic {

  public language: LanguageName;
  public lexer: LexerName;
  public stats: Stats;
  private events: EventListeners = {
    format: [],
    error: [],
    rules: [],
    parse: []
  };

  get data () {
    return parse.data;
  }

  get grammar () {
    return grammar.extend;
  }

  get definitions () {
    return definitions;
  }

  get detect () {
    return detect;
  }

  // settings (settings: Settings) {}

  on (name: 'error' | 'format' | 'rules' | 'parse' | 'language', callback: any) {
    this.events[name].push(callback);
  }

  hook (name: 'parse', callback: ParseHook) {
    parse.hooks[name] = [ callback ];
  }

  format (source: string | Buffer, options?: Rules) {

    parse.source = source;

    if (typeof this.language === 'string' && this.language !== parse.language) {
      parse.language = this.language;
      parse.lexer = getLexerName(parse.language);
    }

    if (typeof options === 'object') {

      if (this.language !== parse.language) {
        this.language = options.language;
        this.lexer = getLexerName(options.language);
      } else if (this.lexer !== parse.lexer) {
        this.lexer = getLexerName(options.language);
      }

      this.rules(options);

    }

    const invoke = getLexerType(this.language || parse.language);
    const action = stats(this.language || parse.language, this.lexer || parse.lexer as LexerName);
    const output = parse.document(invoke);

    if (parse.error !== null) {

      if (this.events.error.length > 0) {
        // @ts-ignore
        for (const cb of this.events.error) cb(parse.error);
        return output;
      } else {
        throw parse.error;
      }
    }

    const timing = action((output as string)?.length);

    this.stats = timing;

    if (this.events.format.length > 0) {
      for (const cb of this.events.format) {

        const fn = cb.call(
          {
            get data () {
              return parse.data;
            }
          }, {
            get output () {
              return source;
            },
            get stats () {
              return timing;
            },
            get rules () {
              return parse.rules;
            }
          }
        );

        if (fn === false) return source;

      }
    }

    return output;

  };

  parse (source: string | Buffer, options?: Rules) {

    parse.source = source;

    if (typeof options === 'object') this.rules(options);

    this.lexer = getLexerName(parse.language);

    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const parsed = parse.document(invoke, Modes.Parse);
    const statistic = this.stats = action(parse.count);

    if (this.events.parse.length > 0) {
      for (const cb of this.events.parse) {

        const fn = cb({
          get data () {
            return parse.data;
          },
          get stats () {
            return statistic;
          },
          get rules () {
            return parse.rules;
          }
        });

        if (fn === false) return source;

      }
    }

    if (parse.error !== null) {

      // @ts-ignore
      if (this.events.error.length > 0) for (const cb of this.events.error) cb(parse.error);

      return [];

    }

    return parsed;

  };

  rules (options?: Rules) {

    if (typeof options === 'undefined') return parse.rules;

    let changes: RulesInternal;

    if (this.events.rules.length > 0) changes = { ...parse.rules };

    for (const rule in options) {
      if (rule in parse.rules) {
        if (typeof parse.rules[rule] === 'object') {
          if (parse.rules[rule] !== options[rule]) {
            parse.rules[rule] = { ...parse.rules[rule], ...options[rule] };
          }
        } else {
          if (rule === 'crlf') {
            parse.rules[rule] = options[rule];
            parse.crlf = parse.rules[rule] ? CNL : NWL;
          } else if (rule === 'language') {
            parse.rules[rule] = options[rule];
            if (parse.language !== parse.rules[rule]) {
              parse.language = options[rule];
              parse.lexer = getLexerName(parse.language);
            }
          } else {
            parse.rules[rule] = options[rule];
          }
        }

      }

      if (changes) {

        const diff: RulesChanges = {};

        for (const rule in options) {
          if (
            rule !== 'liquid' &&
            rule !== 'markup' &&
            rule !== 'script' &&
            rule !== 'style' &&
            rule !== 'json') {

            if (changes[rule] !== options[rule]) diff[rule] = { from: changes[rule], to: options[rule] };

          } else {

            for (const prop in options[rule]) {
              if (changes[rule][prop] !== options[rule][prop]) {
                if (!(rule in diff)) diff[rule] = {};
                diff[rule][prop] = { from: changes[rule][prop], to: options[rule][prop] };
              }
            }
          }
        }

        if (this.events.rules.length > 0) {
          for (const cb of this.events.rules) cb(diff, parse.rules);
        }
      }
    }

    return parse.rules;

  }

  liquid (source: string | Buffer, options?: Rules) {

    this.language = 'liquid';
    this.lexer = getLexerName('liquid');

    return this.format(source, options);
  }

  html (source: string | Buffer, options?: Rules) {

    this.language = 'html';
    this.lexer = getLexerName('html');

    return this.format(source, options);
  }

  xml (source: string | Buffer, options?: Rules) {

    this.language = 'xml';
    this.lexer = getLexerName('xml');

    return this.format(source, options);
  }

  css (source: string | Buffer, options?: Rules) {

    this.language = 'css';
    this.lexer = getLexerName('css');

    return this.format(source, options);
  }

  json (source: string | Buffer, options?: Rules) {

    this.language = 'json';
    this.lexer = getLexerName('json');

    return this.format(source, options);
  }

}

export const esthetic = new Esthetic();
