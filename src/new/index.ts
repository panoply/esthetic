import { Options, Rules } from './prettify.d';
import { parse } from './parser/parse';
import { mode } from './parser/mode';
import { prettify as Prettify } from './prettify';
import { options, preset } from './options/options';

export { definitions } from './options/definitions';
export * from './parser/parse';
export * from './lexers/style';
export * from './lexers/script';
export * from './lexers/markup';
export * from './beautify/style';
export * from './beautify/markup';
export * from './beautify/script';

Prettify.rules.script = preset('script');
Prettify.rules.style = preset('style');
Prettify.rules.json = preset('json');
Prettify.rules.markup = preset('markup');

const prettify = function (source: string, rules: Options = {}) {

  Prettify.source = source;
  Prettify.options = options(rules.lexer, rules);

  const formatted = mode(Prettify);

  return new Promise((resolve, reject) => {

    if (parse.error.length) return reject(parse.error);

    return resolve(formatted);

  });

};

prettify.rules = function rules (rules: Rules) {

  return options('auto', rules);

};

prettify.markup = function markup (source: string, rules: Options = {}) {

  Prettify.source = source;
  Prettify.options = options('markup', rules);

  const formatted = mode(Prettify);

  return new Promise((resolve, reject) => {

    if (parse.error.length) return reject(parse.error);

    return resolve(formatted);

  });

};

prettify.script = function script (source: string, rules: Options = {}) {

  Prettify.source = source;
  Prettify.options = options('script', rules);

  const formatted = mode(Prettify);

  return new Promise((resolve, reject) => {

    if (parse.error.length) return reject(parse.error);

    return resolve(formatted);

  });

};

prettify.style = function style (source: string, rules: Options = {}) {

  Prettify.source = source;
  Prettify.options = options('style', rules);

  const formatted = mode(Prettify);

  return new Promise((resolve, reject) => {

    if (parse.error.length) return reject(parse.error);

    return resolve(formatted);

  });

};

prettify.json = function json (source: string, rules: Options = {}) {

  Prettify.source = source;
  Prettify.options = options('json', rules);

  const formatted = mode(Prettify);

  return new Promise((resolve, reject) => {

    if (parse.error.length) return reject(parse.error);

    return resolve(formatted);

  });

};

export default prettify;
