import type { Rules, EventListeners, LanguageRuleNames, RulesChanges } from 'types';
import { parse } from 'parse/parser';
import { isValid, isValidChoice } from 'rules/validate';
import { defaults } from 'rules/presets/default';
import { recommended } from 'rules/presets/recommended';
import { strict } from 'rules/presets/strict';
import { warrington } from 'rules/presets/warrington';
import { prettier } from 'rules/presets/prettier';
import { assign, object } from 'utils/native';
import { CNL, NWL } from 'lexical/chars';
import { hasProp } from 'utils/helpers';
import { config } from 'config';
import merge from 'mergerino';

const GLOB = [
  'correct',
  'crlf',
  'endNewline',
  'indentChar',
  'indentLevel',
  'indentSize',
  'preserveLine',
  'wrap',
  'wrapFraction'
];

const LANG: LanguageRuleNames[] = [
  'liquid',
  'markup',
  'style',
  'json',
  'script'
];

/**
 * Set Preset
 *
 * Sets the rule defaults to use. Checks the `options` for the existence
 * of the `preset` rule and assigns the rule defaults accordingly.
 */
export function setPreset (options: Rules) {

  if (options.preset === parse.rules.preset) return;

  if (isValidChoice('global', 'preset', options.preset)) {

    parse.rules = assign({}, defaults);
    parse.rules.preset = options.preset;

    if (options.preset === 'default') return;

    let has: ReturnType<typeof hasProp>;

    switch (options.preset) {
      case 'strict':
        has = hasProp(strict);
        for (const p of GLOB) if (has(p)) parse.rules[p] = strict[p];
        for (const p of LANG) if (has(p)) assign(parse.rules[p], strict[p]);
        break;
      case 'recommended':
        has = hasProp(recommended);
        for (const p of GLOB) if (has(p)) parse.rules[p] = recommended[p];
        for (const p of LANG) if (has(p)) assign(parse.rules[p], recommended[p]);
        break;
      case 'warrington':
        has = hasProp(warrington);
        for (const p of GLOB) if (has(p)) parse.rules[p] = warrington[p];
        for (const p of LANG) if (has(p)) assign(parse.rules[p], warrington[p]);
        break;
      case 'prettier':
        has = hasProp(prettier);
        for (const p of GLOB) if (has(p)) parse.rules[p] = prettier[p];
        for (const p of LANG) if (has(p)) assign(parse.rules[p], prettier[p]);
        break;
    }
  }
}

/**
 * Assign Rules
 *
 * Sets the `parse.rules` reference, sets the `preset` and
 * handles rule assignments
 */
export function setRules (opts: Rules, events: EventListeners) {

  const options: Rules = opts;

  /**
   * Properties Existence
   */
  const has = hasProp(options);

  /**
   * Rule Changes
   */
  let change: RulesChanges;

  if (events.rules.length > 0) change = {};
  if ('preset' in options) setPreset(options);

  if (has('language') && isValid('global', 'language', options.language) && parse.language !== options.language) {
    parse.language = parse.rules.language = options.language;
  }

  for (const rule of GLOB) {

    if (has(rule) === false) continue;
    if (parse.rules[rule] === options[rule]) continue;
    if (isValid('global', rule, options[rule])) {

      if (change) change[rule] = { from: parse.rules[rule], to: options[rule] };
      if (rule === 'crlf') parse.crlf = options[rule] ? CNL : NWL;
      if (rule === 'wrap' && options[rule] > 0) {
        if (has('wrapFraction') === false || (has('wrapFraction') && options.wrapFraction <= 0)) {
          options.wrapFraction = options[rule] - (options[rule] / 4);
        }
      }

      parse.rules[rule] = options[rule];

    }
  }

  for (const lang of LANG) {

    if (has(lang) === false) continue;
    if (parse.rules[lang] === options[lang]) continue;
    if (change) change[lang] = object(null);

    for (const rule in options[lang]) {
      if (isValid(lang, rule, options[lang][rule])) {

        if (change) {
          change[lang][rule] = object(null);
          change[lang][rule].old = parse.rules[lang][rule];
          change[lang][rule].new = options[lang][rule];
        }

        parse.rules[lang][rule] = options[lang][rule];

      }
    }
  }

  if (events.rules.length > 0) for (const cb of events.rules) cb(change, parse.rules);

  return parse.rules;

}
