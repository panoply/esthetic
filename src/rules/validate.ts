import type { GlobalRules, LanguageRuleNames, LiquidRules, MarkupRules, LanguageName } from 'types';
import { isArray, isBoolean, isNumber, isString } from 'utils/helpers';
import { RuleError } from 'parse/errors';

/**
 * Is Valid
 *
 * Checks the type value provided against the acceptable rule options.
 * When an invalid is determined an error is thrown. The function also
 * converts types to their appropriate value, meaning is `0` or `1` is
 * passed to a `boolean` expected value it will return the `boolean` equivalent.
 */
export function isValid (language: LanguageRuleNames, rule: string, value: any) {

  if (language === 'global') {

    switch (rule as keyof GlobalRules) {
      case 'indentChar':

        return isValidString(language, rule, value);

      case 'preset':
      case 'language':

        return isValidChoice(language, rule, value);

      case 'crlf':
      case 'correct':
      case 'endNewline':

        return isValidBoolean(language, rule, value);

      case 'indentLevel':
      case 'indentSize':
      case 'preserveLine':
      case 'wrap':
      case 'wrapFraction':

        return isValidNumber(language, rule, value);

      default:

        return false;

    }

  } else if (language === 'liquid') {

    switch (rule as keyof LiquidRules) {
      case 'commentNewline':
      case 'commentIndent':
      case 'indentAttribute':
      case 'normalizeSpacing':
      case 'preserveComment':
      case 'preserveInternal':

        return isValidBoolean(language, rule, value);

      case 'forceArgument':
      case 'forceFilter':

        return isValidNumber(language, rule, value);

      case 'ignoreTagList':
      case 'dedentTagList':

        return isValidArray(language, rule, value);

      case 'lineBreakSeparator':
      case 'delimiterPlacement':
      case 'delimiterTrims':
      case 'quoteConvert':

        return isValidChoice(language, rule, value);

    }

  } else if (language === 'markup') {

    switch (rule as keyof MarkupRules) {

      case 'forceAttribute':

        if (isNumber(value)) return isValidNumber(language, rule, value);
        if (isBoolean(value)) return isValidBoolean(language, rule, value);

        throw RuleError({
          message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
          option: `${language} → ${rule}`,
          provided: value,
          expected: [
            'boolean',
            'number'
          ]
        });

      case 'attributeSort':

        if (isBoolean(value)) return isValidBoolean(language, rule, value);
        if (isArray(value)) return isValidArray(language, rule, value);

        throw RuleError({
          message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
          option: `${language} → ${rule}`,
          provided: value,
          expected: [
            'boolean',
            'number'
          ]
        });

      case 'commentNewline':
      case 'commentIndent':
      case 'forceIndent':
      case 'forceAttributeValue':
      case 'ignoreCSS':
      case 'ignoreJS':
      case 'ignoreJSON':
      case 'preserveComment':
      case 'preserveText':
      case 'preserveAttribute':
      case 'selfCloseSpace':
      case 'selfCloseSVG':
      case 'stripAttributeLines':

        return isValidBoolean(language, rule, value);

      case 'attributeCasing':
      case 'delimiterTerminus':
      case 'lineBreakValue':
      case 'quoteConvert':

        return isValidChoice(language, rule, value);

    }

  } else if (language === 'style') {

    switch (rule) {

      case 'correct':
      case 'atRuleSpace':
      case 'classPadding':
      case 'noLeadZero':
      case 'sortSelectors':
      case 'sortProperties':

        return isBoolean(value);

      case 'quoteConvert':

        return isValidChoice(language, rule, value);

    }
  } else if (language === 'json') {

    switch (rule) {

      case 'arrayFormat':
      case 'objectIndent':

        return isValidChoice(language, rule, value);

      case 'allowComments':
      case 'braceAllman':
      case 'bracePadding':
      case 'objectSort':

        return isValidBoolean(language, rule, value);

    }
  }
}

/**
 * IS VALID ARRAY
 *
 * Validates an array type and checks each entry is of a `string` type.
 */
export function isValidArray (language: LanguageRuleNames, rule: string, value: string[]) {

  if (isArray(value)) {

    if (value.length === 0) return true;

    for (let index: number = 0; index < value.length; index++) {

      if (isString(value[index]) === false) {
        throw RuleError({
          message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
          option: `${language} → ${rule} (index: ${index})`,
          provided: value,
          expected: [
            'string'
          ]
        });
      }
    }

    return true;

  }

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
    option: language === 'global' ? rule : `${language} → ${rule}`,
    provided: value,
    expected: [
      'string[]'
    ]
  });

}

/**
 * IS VALID STRING
 *
 * Validates a string type, this is different from a choice validation.
 */
export function isValidString (language: LanguageRuleNames, rule: string, value: number) {

  if (typeof value === 'string') return true;

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
    option: language === 'global' ? rule : `${language} → ${rule}`,
    provided: value,
    expected: [
      'string'
    ]
  });

}

/**
 * IS VALID STRING
 *
 * Validates a number type
 */
export function isValidNumber (language: LanguageRuleNames, rule: string, value: number) {

  if (isNumber(value) && isNaN(value) === false) return true;

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
    option: language === 'global' ? rule : `${language} → ${rule}`,
    provided: value,
    expected: [
      'number'
    ]
  });

}

/**
 * IS VALID BOOLEAN
 *
 * Validates a boolean type. Also accepts numbers and will return valid boolean if provided
 */
export function isValidBoolean (language: LanguageRuleNames, rule: string, value: number | boolean) {

  if (isNumber(value)) return value !== 0;
  if (isBoolean(value)) return true;

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
    option: language === 'global' ? rule : `${language} → ${rule}`,
    provided: value,
    expected: [
      'boolean'
    ]
  });

}

/**
 * IS VALID CHOICE
 *
 * Validates a multi-option types, Ensures type passed is a string and checks
 * against all accepted choices, throwing if an invalid option is passed.
 */
export function isValidChoice (language: LanguageRuleNames, rule: string, value: string) {

  if (isString(value) === false) {

    throw RuleError({
      message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
      option: `${language} → ${rule}`,
      provided: value,
      expected: [
        'string'
      ]
    });

  }

  if (rule === 'language') {

    switch (value as LanguageName) {
      case 'text':
      case 'markup':
      case 'html':
      case 'liquid':
      case 'xml':
      case 'javascript':
      case 'typescript':
      case 'jsx':
      case 'tsx':
      case 'json':
      case 'less':
      case 'scss':
      case 'sass':
      case 'css': return true;
    }

    throw RuleError({
      message: `Unsupported "${rule}" identifier provided`,
      option: language === `${rule} (global)` ? rule : `${language} → ${rule}`,
      provided: value,
      expected: [
        'text',
        'auto',
        'markup',
        'html',
        'liquid',
        'xml',
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'json',
        'less',
        'scss',
        'sass',
        'css'
      ]
    });

  } else if (rule === 'preset') {

    switch (value as GlobalRules['preset']) {
      case 'default':
      case 'strict':
      case 'recommended':
      case 'warrington':
      case 'prettier': return true;
    }

    throw RuleError({
      message: `Unsupported "${rule}" provided`,
      option: language === `${rule} (global)` ? rule : `${language} → ${rule}`,
      provided: value,
      expected: [
        'default',
        'strict',
        'recommended',
        'warrington',
        'prettier'
      ]
    });

  } else if (rule === 'attributeCasing') {

    switch (value as MarkupRules['attributeCasing']) {
      case 'preserve':
      case 'lowercase':
      case 'lowercase-name':
      case 'lowercase-value': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'preserve',
          'lowercase',
          'lowercase-name',
          'lowercase-value'
        ]
      });
    }

  } else if (rule === 'delimiterTrims') {

    switch (value as LiquidRules['delimiterTrims']) {
      case 'preserve':
      case 'never':
      case 'always':
      case 'tags':
      case 'outputs':
      case 'multiline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'preserve',
          'never',
          'always',
          'tags',
          'outputs',
          'multiline',
          'linebreak'
        ]
      });
    }

  } else if (rule === 'delimiterPlacement') {

    switch (value as LiquidRules['delimiterPlacement']) {
      case 'default':
      case 'inline':
      case 'preserve':
      case 'consistent':
      case 'force':
      case 'force-multiline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'default',
          'inline',
          'preserve',
          'consistent',
          'force',
          'force-multiline'
        ]
      });
    }

  } else if (rule === 'lineBreakSeparator') {

    switch (value as LiquidRules['lineBreakSeparator']) {
      case 'preserve':
      case 'before':
      case 'after': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'preserve',
          'before',
          'after'
        ]
      });
    }

  } else if (rule === 'delimiterTerminus') {

    switch (value as MarkupRules['delimiterTerminus']) {
      case 'force':
      case 'inline':
      case 'adapt': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'force',
          'inline',
          'adapt'
        ]
      });
    }

  } else if (rule === 'lineBreakValue') {

    switch (value as MarkupRules['lineBreakValue']) {
      case 'preserve':
      case 'align':
      case 'indent':
      case 'force-preserve':
      case 'force-align':
      case 'force-indent':
        return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'preserve',
          'align',
          'indent',
          'force-preserve',
          'force-align',
          'force-indent'
        ]
      });
    }

  } else if (rule === 'quoteConvert') {

    switch (value) {

      case 'none':
      case 'double':
      case 'single': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'none',
          'double',
          'single'
        ]
      });
    }

  } else if (rule === 'objectIndent' || rule === 'arrayFormat') {

    switch (value) {
      case 'default':
      case 'indent':
      case 'inline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'default',
          'indent',
          'inline'
        ]
      });
    }

  } else if (rule === 'endComma') {

    switch (value) {
      case 'none':
      case 'always':
      case 'never': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'none',
          'always',
          'never'
        ]
      });
    }

  } else if (rule === 'variableList') {

    switch (value) {
      case 'none':
      case 'each':
      case 'list': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'none',
          'each',
          'list'
        ]
      });
    }

  }

}
