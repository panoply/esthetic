import type { Rules, LanguageName, Events, RulesChanges, RulesInternal, LexerName, Stats, ParseHook } from 'types/internal';
import { grammar } from '@shared/grammar';
import { parse } from '@parse/parser';
import { defineProperties } from '@utils/native';
import { Modes } from '@shared/enums';
import { stats } from '@utils/helpers';
import { getLexerName, getLexerType } from '@utils/maps';
import { definitions } from '@shared/definitions';
import { detect } from '@parse/detection';

/* -------------------------------------------- */
/* LANGUAGE EXPORT                              */
/* -------------------------------------------- */

class Instance {

  static events: Events = {
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

  on (name: 'format' | 'rule' | 'parse' | 'language', callback: any) {

    Instance.events[name].push(callback);

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

    if (typeof options === 'object') this.rules(options);

    const invoke = getLexerType(this.language);
    const action = stats(this.language, this.lexer);
    const output = parse.document(invoke);

    this.stats = action((output as string).length);

    if (Instance.events.format.length > 0) {
      for (const cb of Instance.events.format) {
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

    if (Instance.events.parse.length > 0) {
      for (const cb of Instance.events.parse) {
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

    if (Instance.events.rules.length > 0) changes = { ...parse.rules };

    for (const rule in options) {
      if (rule in parse.rules) {

        if (typeof parse.rules[rule] === 'object') {
          if (parse.rules[rule] !== options[rule]) {
            parse.rules[rule] = { ...parse.rules[rule], ...options[rule] };
          }
        } else {
          if (rule === 'crlf') {
            parse.rules[rule] = options[rule];
            parse.crlf = parse.rules[rule] ? '\r\n' : '\n';
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

        if (Instance.events.rules.length > 0) {
          for (const cb of Instance.events.rules) {
            cb(diff, parse.rules);
          }
        }
      }
    }

    return parse.rules;

  }

}

class Prettify extends Instance {

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

  const prettify = new Prettify();

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
