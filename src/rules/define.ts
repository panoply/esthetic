import type { Rules, EventListeners, LanguageRuleNames, RulesChanges } from 'types';
import { parse } from 'parse/parser';
import { isValid, isValidChoice } from 'rules/validate';
import { defaults } from 'rules/presets/default';
import { recommended } from 'rules/presets/recommended';
import { strict } from 'rules/presets/strict';
import { warrington } from 'rules/presets/warrington';
import { prettier } from 'rules/presets/prettier';
import { assign } from 'utils';
import { CNL, NWL } from 'lexical/chars';

const GLOBS = [
  'crlf',
  'endNewline',
  'indentChar',
  'indentSize',
  'preserveLine',
  'wrap'
];

const LANGS: LanguageRuleNames[] = [
  'liquid',
  'markup',
  'script',
  'style',
  'json'
];

export function preset (options: Rules) {

  if (options.preset !== parse.rules.preset) {
    if (isValidChoice('global', 'preset', options.preset)) {

      parse.rules = defaults;
      parse.rules.preset = options.preset;

      if (options.preset === 'default') return;

      switch (options.preset) {
        case 'strict':
          for (const p of GLOBS) if (p in strict) parse.rules[p] = strict[p];
          for (const p of LANGS) if (p in strict) assign(parse.rules[p], strict[p]);
          break;
        case 'recommended':
          for (const p of GLOBS) if (p in recommended) parse.rules[p] = recommended[p];
          for (const p of LANGS) if (p in recommended) assign(parse.rules[p], recommended[p]);
          break;
        case 'warrington':
          for (const p of GLOBS) if (p in warrington) parse.rules[p] = warrington[p];
          for (const p of LANGS) if (p in warrington) assign(parse.rules[p], warrington[p]);
          break;
        case 'prettier':
          for (const p of GLOBS) if (p in prettier) parse.rules[p] = prettier[p];
          for (const p of LANGS) if (p in prettier) assign(parse.rules[p], prettier[p]);
          break;
      }

    }
  }
}

export function define (options: Rules, events: EventListeners) {

  let change: RulesChanges;

  if (events.rules.length > 0) change = {};
  if ('preset' in options) preset(options);

  for (const rule of GLOBS) {

    if (!(rule in options)) continue;
    if (parse.rules[rule] === options[rule]) continue;
    if (isValid('global', rule, options[rule])) {

      if (change) change[rule] = { from: parse.rules[rule], to: options[rule] };
      if (rule === 'crlf') parse.crlf = options[rule] ? CNL : NWL;

      parse.rules[rule] = options[rule];

    }
  }

  for (const lang of LANGS) {

    if (!(lang in options)) continue;
    if (parse.rules[lang] === options[lang]) continue;
    if (change) change[lang] = {};

    for (const rule in options[lang]) {
      if (isValid(lang, rule, options[lang][rule])) {
        if (change) change[lang][rule] = { from: parse.rules[lang][rule], to: options[lang][rule] };

        parse.rules[lang][rule] = options[lang][rule];

      }
    }
  }

  if (events.rules.length > 0) for (const cb of events.rules) cb(change, parse.rules);

  return parse.rules;
}
