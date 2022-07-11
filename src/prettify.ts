import type { Options, Prettify } from 'types/prettify';
import { prettify, definitions, grammar } from '@prettify/model';
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
format.before = (callback: Prettify['hooks']['before'][number]) => prettify.hooks.before.push(callback);
format.after = (callback: Prettify['hooks']['after'][number]) => prettify.hooks.after.push(callback);

/* -------------------------------------------- */
/* OPTIONS LISTENER                             */
/* -------------------------------------------- */

options.listen = (callback: Prettify['hooks']['rules'][number]) => prettify.hooks.rules.push(callback);

/* -------------------------------------------- */
/* STATS GETTER                                 */
/* -------------------------------------------- */

Object.defineProperty(format, 'stats', { get () { return prettify.stats; } });

/* -------------------------------------------- */
/* RULES GETTER                                 */
/* -------------------------------------------- */

Object.defineProperty(options, 'rules', { get () { return prettify.options; } });

/* -------------------------------------------- */
/* FORMAT FUNCTION                              */
/* -------------------------------------------- */

function format (source: string | Buffer, rules?: Options) {

  prettify.source = source;

  if (typeof rules === 'object') prettify.options = options(rules);

  // TRIGGER BEFORE HOOKS
  //
  if (prettify.hooks.before.length > 0) {
    for (const cb of prettify.hooks.before) {
      if (cb(prettify.options, source as string) === false) return source;
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

  // console.log(prettify);

  // RESOLVE OUTPUT
  //
  return new Promise((resolve, reject) => {

    if (parser.error.length) return reject(parser.error);

    return resolve(output);

  });

};

/* -------------------------------------------- */
/* OPTIONS FUNCTION                             */
/* -------------------------------------------- */

function options (rules: Options) {

  for (const rule of keys(rules) as Array<keyof Options>) {

    if (definitions?.[rule]?.lexer === 'auto') {
      prettify.options[rule as string] = rules[rule];
    } else if (rule === 'markup') {
      assign(prettify.options.markup, rules.markup);
    } else if (rule === 'script') {
      assign(prettify.options.script, rules.script);
    } else if (rule === 'style') {
      assign(prettify.options.style, rules.style);
    } else if (rule === 'json') {
      assign(prettify.options.script, rules.json);
    } else if (rule === 'grammar') {

      if (rules.grammar?.html?.voids) {
        assign(prettify.options.grammar.html, rules.grammar.html);
        for (const token of rules.grammar.html.voids) grammar.html.voids.add(token);
      }

      if (rules.grammar?.liquid) {
        if (rules.grammar?.liquid?.tags) {
          prettify.options.grammar.liquid.tags = rules.grammar.liquid.tags;
          for (const token of rules.grammar.liquid.tags) grammar.liquid.tags.add(token);
        }
        if (rules.grammar?.liquid?.singletons) {
          prettify.options.grammar.liquid.singletons = rules.grammar.liquid.singletons;
          for (const token of rules.grammar.liquid.singletons) grammar.liquid.singletons.add(token);
        }
      }
    } else if (rule in prettify.options) {
      prettify.options[rule as string] = rules[rule];
    }
  }

  // TRIGGER UPDATED HOOK
  //
  if (prettify.hooks.rules.length > 0) {
    for (const cb of prettify.hooks.rules) cb(prettify.options);
  }

  return prettify.options;

}

/* -------------------------------------------- */
/* PARSE FUNCTION                               */
/* -------------------------------------------- */

function parse (source: string | Buffer, rules?: Options) {

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
