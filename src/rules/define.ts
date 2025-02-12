import type { EventListeners, LanguageRuleNames, Rules, RulesChanges } from 'types';

import { config } from 'config';
import { CNL, NWL } from 'lexical/chars';
import { parse } from 'parse/parser';
import { defaults } from 'rules/presets/default';
import { prettier } from 'rules/presets/prettier';
import { recommended } from 'rules/presets/recommended';
import { strict } from 'rules/presets/strict';
import { warrington } from 'rules/presets/warrington';
import { isValid, isValidChoice } from 'rules/validate';
import { hasProp, merge } from 'utils/helpers';
import { object } from 'utils/native';

const GLOB = [
  'correct',
  'crlf',
  'endNewline',
  'indentChar',
  'indentLevel',
  'indentSize',
  'preserveLine',
  'wrap'
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

  if (isValidChoice('global', 'preset', options.preset)) {

    switch (options.preset) {
      case 'default': return merge(defaults, options);
      case 'strict': return merge(strict, options);
      case 'recommended': return merge(recommended, options);
      case 'warrington': return merge(warrington, options);
      case 'prettier': return merge(prettier, options);
    }
  }

  return options;

}

/**
 * Assign Rules
 *
 * Sets the `parse.rules` reference, sets the `preset` and
 * handles rule assignments
 */
export function setRules (opts: Rules, events: EventListeners) {

  /**
   * Properties Existence
   */
  const has = hasProp(opts);

  if (config.persistRules === false) parse.rules = merge(defaults);

  /**
   * Formatting Options - Applies preset if provided
   */
  const options: Rules = has('preset') ? setPreset(opts) : opts;

  /**
   * Rule Changes
   */
  let change: RulesChanges;

  if (events.rules.length > 0) change = {};

  if (
    has('language') &&
    isValid('global', 'language', options.language) &&
    parse.language !== options.language) {

    parse.language = parse.rules.language = options.language;

  }

  for (const rule of GLOB) {

    if (has(rule) === false) continue;
    if (parse.rules[rule] === options[rule]) continue;
    if (isValid('global', rule, options[rule])) {
      if (change) change[rule] = { from: parse.rules[rule], to: options[rule] };
      if (rule === 'crlf') parse.crlf = options[rule] ? CNL : NWL;
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

  if (events.rules.length > 0) {
    for (const cb of events.rules) {
      cb(change, parse.rules);
    }
  }

}
