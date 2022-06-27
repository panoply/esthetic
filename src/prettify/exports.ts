import type { Options, Prettify } from 'types/prettify';
import { prettify } from 'prettify';
import { definitions } from '@options/definitions';
import { parse as parser } from '@parser/parse';
import { mode } from '@parser/mode';
import { keys, assign } from '@utils/native';

/* -------------------------------------------- */
/* LANGUAGE EXPORT                              */
/* -------------------------------------------- */

export { detect as language } from '@parser/language';

/* -------------------------------------------- */
/* FORMATTING HOOKS                             */
/* -------------------------------------------- */

format.before = function (callback: Prettify['hooks']['before'][number]) {
  prettify.hooks.before.push(callback);
};

format.after = function (callback: Prettify['hooks']['after'][number]) {
  prettify.hooks.after.push(callback);
};

options.listen = function (callback: Prettify['hooks']['rules'][number]) {
  prettify.hooks.rules.push(callback);
};

Object.defineProperty(format, 'stats', {
  get () { return prettify.stats; }
});

Object.defineProperty(options, 'rules', {
  get () { return prettify.options; }
});

function format (source: string, rules?: Options) {

  prettify.source = source;

  if (typeof rules === 'object') prettify.options = options(rules);

  // TRIGGER BEFORE HOOKS
  //
  if (prettify.hooks.before.length > 0) {
    for (const cb of prettify.hooks.before) {
      if (cb(prettify.options, source) === false) return source;
    }
  }

  // BEAUTIFY
  //
  const output = mode(prettify);

  // TRIGGER AFTER HOOKS
  //
  if (prettify.hooks.after.length > 0) {
    for (const cb of prettify.hooks.after) {
      if (cb.call(prettify.parsed, output, prettify.options) === false) return source;
    }
  }

  // RESOLVE OUTPUT
  //
  return new Promise((resolve, reject) => {

    if (parser.error.length) return reject(parser.error);

    return resolve(output);

  });

};

/* -------------------------------------------- */
/* OPTION HOOK                                  */
/* -------------------------------------------- */

function options (rules: Options) {

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
      assign(prettify.options.script, rules.script);
    } else if (rule in prettify.options) {
      prettify.options[rule] = rules[rule];
    }
  }

  // TRIGGER UPDATED HOOK
  //
  if (prettify.hooks.rules.length > 0) {
    for (const cb of prettify.hooks.rules) cb(prettify.options);
  }

  return prettify.options;

}

function parse (source: string, rules?: Options) {

  prettify.source = source;
  prettify.mode = 'parse';

  if (typeof rules === 'object') prettify.options = options(rules);

  const formatted = mode(prettify);

  return new Promise((resolve, reject) => {

    if (parser.error.length) return reject(parser.error);

    return resolve(formatted);

  });

};

export { format, options, parse };
