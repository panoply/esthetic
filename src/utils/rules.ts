import { assign } from './native';
import {
  LanguageRuleNames,
  LiquidRules,
  MarkupRules,
  Rules,
  RulesInternal,
  ScriptRules,
  StyleRules
} from 'types/internal';

export function merge (defaultRules: RulesInternal, userRules: RulesInternal): Rules {

  const { defaults = undefined } = userRules;
  const globals = {};

  for (const glob of [
    'crlf',
    'endNewline',
    'indentChar',
    'indentSize',
    'preserveLine',
    'wrap'
  ]) {

    if (glob in userRules) globals[glob] = userRules[glob];

  }

  if (defaults === 'strict') {

    const extend = assign<RulesInternal, RulesInternal>({
      defaults: 'none',
      language: 'auto',
      indentChar: ' ',
      indentLevel: 0,
      crlf: false,
      endNewline: true,
      indentSize: 2,
      preserveLine: 1,
      wrap: 0
    }, globals);

    extend.liquid = strict('liquid', userRules) as LiquidRules;
    extend.markup = strict('markup', userRules) as MarkupRules;
    extend.json = strict('json', userRules) as ScriptRules;
    extend.style = strict('style', userRules) as StyleRules;
    extend.script = strict('script', userRules) as ScriptRules;

    return extend as Rules;

  } else if (defaults === 'recommended') {

    const extend = assign<RulesInternal, RulesInternal>({
      defaults: 'none',
      language: 'auto',
      indentChar: ' ',
      indentLevel: 0,
      crlf: false,
      endNewline: true,
      indentSize: 2,
      preserveLine: 3,
      wrap: 0
    }, globals);

    extend.liquid = recommended('liquid', userRules) as LiquidRules;
    extend.markup = recommended('markup', userRules) as MarkupRules;
    extend.json = recommended('json', userRules) as ScriptRules;
    extend.style = recommended('style', userRules) as StyleRules;
    extend.script = recommended('script', userRules) as ScriptRules;

    return extend as Rules;

  } else if (defaults === 'liquid-prettier') {

    const extend = assign<RulesInternal, RulesInternal>({
      crlf: false,
      defaults: 'none',
      language: 'auto',
      endNewline: false,
      indentChar: ' ',
      indentLevel: 0,
      preserveLine: 1,
      indentSize: 2,
      wrap: 80
    }, globals);

    extend.liquid = prettierLiquid('liquid', userRules) as LiquidRules;
    extend.markup = prettierLiquid('markup', userRules) as MarkupRules;
    extend.json = prettierLiquid('json', userRules) as ScriptRules;
    extend.style = prettierLiquid('style', userRules) as StyleRules;
    extend.script = prettierLiquid('script', userRules) as ScriptRules;

    return extend as Rules;

  }

  for (const lang of [
    'liquid',
    'markup',
    'style',
    'json',
    'script'
  ]) {

    if (lang in userRules && typeof userRules[lang] === 'object') {
      globals[lang] = assign({}, defaultRules[lang], userRules[lang]);
    } else {
      globals[lang] = assign({}, defaultRules[lang]);
    }

  }

  return globals as Rules;

}

function strict (language: LanguageRuleNames, rules: RulesInternal) {

  const options = language in rules ? undefined : rules[language];

  if (language === 'liquid') {

    return assign<LiquidRules, LiquidRules>({
      commentNewline: true,
      commentIndent: true,
      correct: true,
      delimiterTrims: 'force',
      ignoreTagList: [],
      indentAttributes: true,
      lineBreakSeparator: 'before',
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'single'
    }, options);

  } else if (language === 'markup') {

    let attributeSortList: string[] = [ 'id', 'class' ];

    if (typeof options === 'object' && 'attributeSortList' in options) {
      if (options.attributeSortList.length > 0) {
        attributeSortList = [];
      }
    }

    return assign<MarkupRules, MarkupRules>({
      attributeCasing: 'lowercase-name',
      attributeSort: true,
      attributeSortList,
      correct: true,
      commentNewline: true,
      commentIndent: true,
      delimiterForce: false,
      forceAttribute: 2,
      forceLeadAttribute: true,
      forceIndent: true,
      ignoreCSS: false,
      ignoreJS: false,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripAttributeLines: true,
      quoteConvert: 'double'
    }, options);

  } else if (language === 'json') {

    return assign<ScriptRules, ScriptRules>({
      arrayFormat: 'indent',
      braceAllman: true,
      bracePadding: false,
      objectIndent: 'indent',
      objectSort: true
    }, options);

  } else if (language === 'style') {

    return assign<StyleRules, StyleRules>({
      correct: true,
      atRuleSpace: true,
      classPadding: true,
      noLeadZero: true,
      sortSelectors: false,
      sortProperties: true,
      quoteConvert: 'double'
    }, options);

  }

}

function recommended (language: LanguageRuleNames, rules: RulesInternal) {

  const options = language in rules ? undefined : rules[language];

  if (language === 'liquid') {

    return assign<LiquidRules, LiquidRules>({
      commentNewline: false,
      commentIndent: true,
      correct: true,
      ignoreTagList: [ 'javascript' ],
      delimiterTrims: 'preserve',
      indentAttributes: false,
      lineBreakSeparator: 'after',
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'single'
    }, options);

  } else if (language === 'markup') {

    return assign<MarkupRules, MarkupRules>({
      attributeCasing: 'preserve',
      attributeSort: false,
      attributeSortList: [],
      correct: false,
      commentNewline: true,
      commentIndent: true,
      delimiterForce: true,
      forceAttribute: 3,
      forceLeadAttribute: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripAttributeLines: false,
      quoteConvert: 'double'
    }, options);

  } else if (language === 'json') {

    return assign<ScriptRules, ScriptRules>({
      arrayFormat: 'indent',
      braceAllman: true,
      bracePadding: false,
      objectIndent: 'default',
      objectSort: false
    }, options);

  } else if (language === 'style') {

    return assign<StyleRules, StyleRules>({
      correct: false,
      atRuleSpace: true,
      classPadding: true,
      noLeadZero: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: 'double'
    }, options);

  }

}

function prettierLiquid (language: LanguageRuleNames, rules: RulesInternal) {

  const options = language in rules ? undefined : rules[language];

  if (language === 'liquid') {

    return assign<LiquidRules, LiquidRules>({
      commentNewline: false,
      commentIndent: true,
      correct: true,
      ignoreTagList: [ 'javascript' ],
      delimiterTrims: 'preserve',
      indentAttributes: true,
      lineBreakSeparator: 'after',
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'double'
    }, options);

  } else if (language === 'markup') {

    return assign<MarkupRules, MarkupRules>({
      attributeCasing: 'preserve',
      attributeSort: false,
      attributeSortList: [],
      correct: false,
      commentNewline: true,
      commentIndent: true,
      delimiterForce: true,
      forceAttribute: 1,
      forceLeadAttribute: true,
      forceIndent: true,
      ignoreCSS: true,
      ignoreJS: true,
      ignoreJSON: false,
      preserveComment: false,
      preserveText: false,
      preserveAttributes: false,
      selfCloseSpace: true,
      selfCloseSVG: false,
      stripAttributeLines: true,
      quoteConvert: 'double'
    }, options);

  } else if (language === 'json') {

    return assign<ScriptRules, ScriptRules>({
      arrayFormat: 'indent',
      braceAllman: true,
      bracePadding: false,
      objectIndent: 'indent',
      objectSort: false
    }, options);

  } else if (language === 'style') {

    return assign<StyleRules, StyleRules>({
      correct: true,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: 'double'
    }, options);

  }

}
