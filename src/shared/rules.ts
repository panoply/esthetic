import { Rules, RulesInternal } from 'types/internal';
import { parse } from '@parse/parser';

/**
 * Update Rules
 *
 * This function is used to update rules. This is invoked when
 * someone passes a custom rule change.
 */
function updateRules () {

}

/**
 * Rule Inheritance
 *
 * Some language specific rules (like JSON) will inherit a subset
 * of other rules. This is such the case for `json` wherein it will
 * use the `script` lexer and also use a custom set of script rules.
 */
function ruleInherit () {

}

/**
 * Parse Rules
 *
 * This function will assign rules to the `parse` handler are used
 * to expose logic directly on the parse class instance.
 */
function parseRules () {

}

/**
 * Related Rules
 *
 * This function is used to analyse related rules, typically these
 * are `liquid` and `markup` rulesets. Related rules are those which
 * function only when used together when other rules.
 */
function relatedRules () {

}

/**
 * Changed Rules
 *
 * This function is used to determine rule changes and used in reporting.
 * Changed rules are simply rules which change and/or do not match the
 * defaults applied.
 */
function changedRules (options: Rules) {

  const changes: RulesInternal = { ...parse.rules };

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
}
