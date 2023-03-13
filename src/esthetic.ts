import type { Rules, LanguageName, LexerName, Stats, ParseHook, EventListeners } from 'types';
import { grammar } from 'parse/grammar';
import { parse } from 'parse/parser';
import { definitions } from 'rules/definitions';
import { detect } from 'parse/detection';
import { define } from 'rules/define';
import { Modes } from 'lexical/enum';
import { stats } from 'utils';
import { getLexerName, getLexerType } from 'rules/language';
import { isValidChoice } from 'rules/validate';

export const esthetic = new class Esthetic {

  public events: EventListeners = {
    format: [],
    error: [],
    rules: [],
    parse: []
  };

  public language: LanguageName = 'auto';
  public lexer: LexerName = 'auto';
  public stats: Stats;

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

    if (typeof options === 'object') {

      if ('language' in options && this.language !== options.language) {
        if (isValidChoice('global', 'language', options.language)) {
          this.language = parse.language = parse.rules.language = options.language;
          this.lexer = parse.lexer = getLexerName(parse.language);
        }
      }

    }

    this.rules(options);

    if (this.lexer === 'auto') {
      const detect = this.detect(parse.source);
      this.language = parse.language = parse.rules.language = detect.language;
      this.lexer = parse.lexer = getLexerName(detect.language);
    }

    const lexer = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const output = parse.document(lexer) as string;

    if (parse.error !== null) {
      if (this.events.error.length > 0) {
        // @ts-ignore
        for (const cb of this.events.error) cb(parse.error);
        return output;
      } else {
        throw parse.error;
      }
    }

    const timing = this.stats = action(output.length);

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

  parse (source: string | Buffer, options?: Rules) {

    parse.source = source;

    if (typeof options === 'object') {

      if ('language' in options && this.language !== options.language) {
        if (isValidChoice('global', 'language', options.language)) {
          this.language = parse.language = parse.rules.language = options.language;
          this.lexer = parse.lexer = getLexerName(parse.language);
        }
      }

      this.rules(options);
    }

    if (this.lexer === 'auto') {
      const detect = this.detect(parse.source);
      this.language = parse.language = parse.rules.language = detect.language;
      this.lexer = parse.lexer = getLexerName(detect.language);
    }

    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const parsed = parse.document(invoke, Modes.Parse);
    const statistic = this.stats = action(parse.count);

    if (this.events.parse.length > 0) {
      for (const cb of this.events.parse) {

        const fn = cb({
          get data () { return parse.data; },
          get stats () { return statistic; },
          get rules () { return parse.rules; }
        });

        if (fn === false) return source;

      }
    }

    if (parse.error !== null) {

      if (this.events.error.length > 0) {
        // @ts-ignore
        for (const cb of this.events.error) cb(parse.error);
      }

      return [];

    }

    return parsed;

  };

  rules (options?: Rules) {

    if (typeof options === 'undefined') return parse.rules;

    return define(options, this.events);

  }

  liquid (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'liquid';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

  html (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'html';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

  xml (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'xml';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

  css (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'css';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

  json (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'json';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

  js (source: string | Buffer, options?: Rules) {

    this.language = parse.language = parse.rules.language = 'javascript';
    this.lexer = parse.lexer = getLexerName(parse.language);

    return this.format(source, options);
  }

}();
