import type { Options } from 'types/prettify';
import { prettify } from 'prettify';
import { definitions } from '@options/definitions';
import { parse as parser } from '@parser/parse';
import { mode } from '@parser/mode';
import { keys, assign } from '@utils/native';

export function options (rules: Options) {

  for (const rule of keys(rules)) {

    if (definitions?.[rule]?.lexer === 'all') {
      prettify.options[rule] = rules[rule];
    } else if (rule === 'markup') {
      assign(prettify.options.markup, rules.markup);
    } else if (rule === 'script') {
      assign(prettify.options.script, rules.script);
    } else if (rule === 'style') {
      assign(prettify.options.style, rules.style);
    } else if (rule === 'json') {
      assign(prettify.options.json, rules.json);
    } else if (rule in prettify.options) {
      prettify.options[rule] = rules[rule];
    }
  }

  return prettify.options;

}

export function format (source: string, rules?: Options) {

  prettify.source = source;

  if (typeof rules === 'object') prettify.options = options(rules);

  const formatted = mode(prettify);

  return new Promise((resolve, reject) => {

    if (parser.error.length) return reject(parser.error);

    return resolve(formatted);

  });

};

export function parse (source: string, rules?: Options) {

  prettify.source = source;
  prettify.mode = 'parse';

  if (typeof rules === 'object') prettify.options = options(rules);

  const formatted = mode(prettify);

  return new Promise((resolve, reject) => {

    if (parser.error.length) return reject(parser.error);

    return resolve(formatted);

  });

};
