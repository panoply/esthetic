import type { EventListeners, RuleChanges, Rules } from 'types';

import { config } from 'config';
import { CNL, NWL } from 'lexical/chars';
import { parse } from 'parse/parser';
import { aesthetic } from 'rules/presets/aesthetic';
import { defaults } from 'rules/presets/default';
import { prettier } from 'rules/presets/prettier';
import { warrington } from 'rules/presets/warrington';
import { isValid, isValidChoice } from 'rules/validate';
import { hasProp, merge } from 'utils/helpers';
import { keys, object } from 'utils/native';

export const RULES = keys(defaults);

/**
 * Set Preset
 *
 * Sets the rule defaults to use. Checks the `options` for the existence
 * of the `preset` rule and assigns the rule defaults accordingly.
 */
export function setPreset (options: Rules) {

  if (isValidChoice('preset', options.preset)) {
    switch (options.preset) {
      case 'none': return merge(defaults, options);
      case 'aesthetic': return merge(aesthetic, options);
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
  let change: RuleChanges;

  if (events.rules.length > 0) change = {};

  if (has('language') && isValid('language', options.language) && parse.language !== options.language) {
    parse.language = parse.rules.language = options.language;
  }

  if (!parse.language) parse.language = 'auto';
  if (!parse.lexer) parse.lexer = 'auto';

  for (const rule of RULES) {

    if (has(rule) === false) continue;
    if (parse.rules[rule] === options[rule]) continue;
    if (change) change[rule] = object(null);
    if (isValid(rule, options[rule])) {

      if (change) {
        change[rule] = object(null);
        change[rule].from = parse.rules[rule];
        change[rule].to = options[rule];
      }

      if (rule === 'lineTermination') {
        parse.crlf = options[rule] === 'CRLF' ? CNL : NWL;
      }

      parse.rules[rule] = options[rule];

    }

  }

  if (events.rules.length > 0) {
    for (const cb of events.rules) {
      cb(change, parse.rules);
    }
  }

}
