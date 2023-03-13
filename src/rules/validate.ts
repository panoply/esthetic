import type { LanguageRuleNames } from 'types';
import { isArray } from 'utils';
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

    switch (rule) {
      case 'indentChar':

        return isValidString(language, rule, value);

      case 'preset':
      case 'language':

        return isValidChoice(language, rule, value);

      case 'crlf':
      case 'endNewline':

        return isValidBoolean(language, rule, value);

      case 'indentLevel':
      case 'indentSize':
      case 'preserveLine':
      case 'wrap':

        return isValidNumber(language, rule, value);

      default:

        return false;

    }

  } else if (language === 'liquid') {

    switch (rule) {
      case 'commentNewline':
      case 'commentIndent':
      case 'indentAttributes':
      case 'normalizeSpacing':
      case 'preserveComment':
      case 'preserveInternal':

        return isValidBoolean(language, rule, value);

      case 'forceFilterWrap':

        return isValidNumber(language, rule, value);

      case 'ignoreTagList':

        return isValidArray(language, rule, value);

      case 'lineBreakSeparator':
      case 'delimiterPlacement':
      case 'delimiterTrims':
      case 'quoteConvert':

        return isValidChoice(language, rule, value);

    }

  } else if (language === 'markup') {

    switch (rule) {

      case 'forceAttribute':

        if (typeof value === 'number') return isValidNumber(language, rule, value);
        if (typeof value === 'boolean') return isValidBoolean(language, rule, value);

        return isValidTypes(language, rule, value, [
          'number',
          'boolean'
        ]);

      case 'attributeSort':
      case 'correct':
      case 'commentNewline':
      case 'commentIndent':
      case 'delimiterForce':
      case 'forceLeadAttribute':
      case 'forceIndent':
      case 'ignoreCSS':
      case 'ignoreJS':
      case 'ignoreJSON':
      case 'preserveComment':
      case 'preserveText':
      case 'preserveAttributes':
      case 'selfCloseSpace':
      case 'selfCloseSVG':
      case 'stripAttributeLines':

        return isValidBoolean(language, rule, value);

      case 'attributeCasing':
      case 'quoteConvert':

        return isValidChoice(language, rule, value);

      case 'attributeSortList':

        return isValidArray(language, rule, value);

    }

  } else if (language === 'style') {

    switch (rule) {

      case 'correct':
      case 'atRuleSpace':
      case 'classPadding':
      case 'noLeadZero':
      case 'sortSelectors':
      case 'sortProperties':

        return typeof value === 'boolean';

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
 * IS VALID TYPE
 *
 * Fallback helper which throws with correct `expected` types.
 */
export function isValidTypes (language: LanguageRuleNames, rule: string, value: number, expected: string[]) {

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${typeof value}" provided`,
    option: `${language} → ${rule}`,
    provided: value,
    expected
  });

}

/**
 * IS VALID ARRAY
 *
 * Validates an array type and checks each entry is of a `string` type.
 */
export function isValidArray (language: LanguageRuleNames, rule: string, value: number) {

  let index: number = 0;

  if (isArray(value)) {

    if (value.length === 0) return true;

    for (; index < value.length; index++) {
      if (!(typeof value[index] === 'string')) {
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

  if (typeof value === 'number' && isNaN(value) === false) return true;

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

  const type = typeof value;

  if (type === 'number') return value !== 0;
  if (type === 'boolean') return true;

  throw RuleError({
    message: `Invalid ${language} rule (${rule}) type "${type}" provided`,
    option: language === 'global' ? rule : `${language} → ${rule}`,
    provided: value,
    expected: [
      'boolean',
      '0',
      '1'
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

  if (typeof value !== 'string') {

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

    switch (value) {
      case 'text':
      case 'auto':
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

      default: throw RuleError({
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

    }

  } else if (rule === 'preset') {

    switch (value) {
      case 'default':
      case 'strict':
      case 'recommended':
      case 'warrington':
      case 'prettier': return true;

      default: throw RuleError({
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

    }

  } else if (rule === 'attributeCasing') {

    switch (value) {

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

  } else if (rule === 'delimiterForce') {

    switch (value) {

      case 'preserve':
      case 'never':
      case 'always':
      case 'tags':
      case 'outputs': return true;

      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'preserve',
          'never',
          'always',
          'tags',
          'outputs'
        ]
      });
    }

  } else if (rule === 'delimiterPlacement') {

    switch (value) {

      case 'default':
      case 'inline':
      case 'preserve':
      case 'consistent':
      case 'force': return true;

      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: `${language} → ${rule}`,
        provided: value,
        expected: [
          'default',
          'inline',
          'preserve',
          'consistent',
          'force'
        ]
      });
    }

  } else if (rule === 'lineBreakSeparator') {

    switch (value) {

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

  } else if (rule === 'quoteConvert') {

    switch (value) {

      case 'none':
      case 'double':
      case 'single': return true;

      default:throw RuleError({
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