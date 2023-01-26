import { grammar } from '@parse/grammar';
import { parse } from '@parse/parser';
import { definitions } from '@parse/definitions';
import { detect } from '@parse/detection';
import { Modes } from 'lexical/enum';
import { getLexerName, getLexerType, stats, defineProperties } from 'utils';
import type {
  Rules,
  LanguageName,
  Events,
  RulesChanges,
  RulesInternal,
  LexerName,
  Stats,
  ParseHook
} from 'types/internal';
import { CNL, NWL } from 'lexical/chars';

class Instance {

  private events: Events = {
    format: [],
    language: [],
    rules: [],
    parse: []
  };

  public async: boolean;
  public language: LanguageName;
  public lexer: LexerName;
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

  on (name: 'format' | 'rules' | 'parse' | 'language', callback: any) {

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
    } else {
      this.language = options.language;
      this.lexer = getLexerName(options.language);
    }

    if (typeof options === 'object') this.rules(options);

    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const output = parse.document(invoke);

    this.stats = action((output as string).length);

    if (this.events.format.length > 0) {
      for (const cb of this.events.format) {
        if (cb.bind({ parsed: parse.data })(source as string, parse.rules) === false) {
          return source;
        }
      }
    }

    if (!this.async) {
      if (parse.error.length) throw new Error(parse.error);
      return output;
    }

    // RESOLVE OUTPUT AS PROMISE
    //
    return new Promise((resolve, reject) => {
      if (parse?.error?.length) return reject(parse.error);
      return resolve(output);
    });

  };

  parse (source: string | Buffer, options?: Rules) {

    parse.source = source;

    if (typeof options === 'object') this.rules(options);

    this.lexer = getLexerName(parse.language);

    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const parsed = parse.document(invoke, Modes.Parse);

    this.stats = action(parse.count);

    if (this.events.parse.length > 0) {
      for (const cb of this.events.parse) {
        if (cb.bind({ parsed: parse.data })(source as string, parse.rules) === false) {
          return source;
        }
      }
    }

    if (!this.async) {
      if (parse.error.length) throw new Error(parse.error);
      return parsed;
    }

    return new Promise((resolve, reject) => {
      if (parse.error.length) return reject(parse.error);
      return resolve(parsed);
    });

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
          for (const cb of this.events.rules) {
            cb(diff, parse.rules);
          }
        }
      }
    }

    return parse.rules;

  }

}

class Esthetic extends Instance {

  liquid (source: string | Buffer, options?: Rules) {
    return this.format(source, options);
  }

  html (source: string | Buffer, options?: Rules) {
    return this.format(source, options);
  }

  xml (source: string | Buffer, options?: Rules) {
    return this.format(source, options);
  }

  css (source: string | Buffer, options?: Rules) {
    return this.format(source, options);
  }

  json (source: string | Buffer, options?: Rules) {
    return this.format(source, options);
  }

}

export default (function (binding) {

  const prettify = new Esthetic();

  for (const language of binding) {
    defineProperties(prettify[language], {
      sync: {
        value (source: string | Buffer, options?: Rules) {
          prettify.async = false;
          prettify.language = language;
          prettify.lexer = getLexerName(language);
          return prettify[language](source, options);
        }
      }
    });
  }

  defineProperties(prettify.format, {
    sync: {
      value (source: string | Buffer, options?: Rules) {
        prettify.async = false;
        return prettify.format(source, options);
      }
    }
  });

  return prettify;

})([
  'liquid',
  'html',
  'xml',
  'json',
  'css'
]);
