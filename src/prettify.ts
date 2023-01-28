import type { Rules, LanguageName, Events, RulesChanges } from 'types/internal';
import { grammar } from '@shared/grammar';
import { parse } from '@parse/parser';
import { assign, defineProperties } from '@utils/native';
import { Modes } from '@shared/enums';
import { getLexerName, getLexerType } from '@utils/maps';
import { definitions } from '@shared/definitions';
import { detect } from '@parse/detection';

/* -------------------------------------------- */
/* LANGUAGE EXPORT                              */
/* -------------------------------------------- */

export default (function () {

  const events: Events = {
    before: [],
    language: [],
    rules: [],
    after: []
  };

  defineProperties(format, {
    sync: {
      value: format.bind({ sync: true })
    }
  });

  defineProperties(rules, {
    listen: {
      value (callback: Events['rules'][number]) {
        events.rules.push(callback);
      }
    }
  });

  defineProperties(parse, {
    stats: {
      get () {
        return parse.stats;
      }
    },
    sync: {
      value: parser.bind({ sync: true })
    }
  });

  function format (this: { sync: boolean, language?: LanguageName}, source: string | Buffer, options?: Rules) {

    console.time('time');

    parse.source = source;

    if (typeof this.language === 'string' && this.language !== parse.language) {
      parse.language = this.language;
      parse.lexer = getLexerName(parse.language);
    }

    if (typeof options === 'object') rules(options);

    const output = parse.full(getLexerType(parse.language));

    console.timeEnd('time');

    // if (s.events.dispatch('before', rules, source) === false) return source;

    // if (s.events.dispatch('after', output, rules) === false) return source;

    if (this.sync === true) {
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

  function rules (options?: Rules) {

    if (typeof options === 'undefined') return parse.rules;

    let changes: Rules;

    if (events.rules.length > 0) {
      changes = assign<Rules, Rules>({}, parse.rules as Rules);
    }

    for (const rule in options) {
      if (rule in parse.rules) {
        if (typeof parse.rules[rule] === 'object') {
          assign(parse.rules[rule], options[rule]);
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
            rule !== 'json'
          ) {
            if (changes[rule] !== options[rule]) {
              diff[rule] = { from: changes[rule], to: options[rule] };
            }
          } else {
            for (const prop in options[rule]) {
              if (changes[rule][prop] !== options[rule][prop]) {
                if (!(rule in diff)) diff[rule] = {};
                diff[rule][prop] = { from: changes[rule][prop], to: options[rule][prop] };
              }
            }
          }
        }

        //  for (const cb of s.events.rules) cb(diff, prettify.rules);

      }
    }

    return rules;

  }

  function parser (this: { sync: boolean }, source: string, options?: Rules) {

    parse.source = source;

    if (typeof options === 'object') rules(options);

    const lexer = getLexerType(parse.language);
    const parsed = parse.full(lexer, Modes.Parse);

    if (this.sync === true) {
      if (parse.error.length) throw new Error(parse.error);
      return parsed;
    }

    return new Promise((resolve, reject) => {
      if (parse.error.length) return reject(parse.error);
      return resolve(parsed);
    });

  };

  return {
    format,
    rules,
    parse: parser,
    liquid: format.bind({ language: 'liquid' }),
    html: format.bind({ language: 'html' }),
    css: format.bind({ language: 'css' }),
    json: format.bind({ language: 'json' }),
    get data () {
      return parse.data;
    },
    get grammar () {
      return grammar.extend;
    },
    get definitions () {
      return definitions;
    },
    get language () {
      return detect;
    }

  };
})();
