import type { LanguageName, Rules } from 'types';

import { RuleError } from 'parse/errors';
import { isArray, isBoolean, isNumber, isString } from 'utils/helpers';

/**
 * Is Valid
 *
 * Checks the type value provided against the acceptable rule options.
 * When an invalid is determined an error is thrown. The function also
 * converts types to their appropriate value, meaning is `0` or `1` is
 * passed to a `boolean` expected value it will return the `boolean` equivalent.
 */
export function isValid (rule: string, value: any) {

  switch (rule as keyof Rules) {
    case 'indentChar':

      return isValidString(rule, value);

    case 'preset':
    case 'language':
    case 'lineTermination':
    case 'lineBreakSeparator':
    case 'lineBreakLogical':
    case 'objectIndent':
    case 'delimiterPlacement':
    case 'delimiterTrims':
    case 'arrayFormat':
    case 'commentBracket':
    case 'singleQuote':
    case 'valueSpacing':
    case 'attributeCasing':
    case 'endComma':

      return isValidChoice(rule, value);

    case 'endNewline':
    case 'commentPreserve':
    case 'commentIndent':
    case 'classListUnique':
    case 'indentAttribute':
    case 'forceIndent':
    case 'attributePreserve':
    case 'ignoreJSON':
    case 'textBoundInline':
    case 'textPreserve':
    case 'selfCloseSpace':
    case 'selfCloseSVG':
    case 'stripAttributeLines':
    case 'braceAllman':
    case 'bracePadding':
    case 'objectSort':

      return isValidBoolean(rule, value);

    case 'argumentLineBreak':
    case 'indentLevel':
    case 'indentSize':
    case 'preserveLine':
    case 'wordWrap':

      return isValidNumber(rule, value);

    case 'attributeLineBreak':
    case 'filterLineBreak':
    case 'terminusBracket':

      if (isNumber(value)) return isValidNumber(rule, value);
      if (isBoolean(value)) return isValidBoolean(rule, value);

      throw RuleError({
        message: `Invalid rule (${rule}) type "${typeof value}" provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'number',
          'boolean'
        ]
      });

    case 'attributeSort':

      if (isBoolean(value)) return isValidBoolean(rule, value);
      if (isArray(value)) return isValidArray(rule, value);

      throw RuleError({
        message: `Invalid rule (${rule}) type "${typeof value}" provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'boolean',
          'string[]'
        ]
      });

    case 'ignoreTagList':

      return isValidArray(rule, value);

    default:
      return false;
  }

}

/**
 * IS VALID ARRAY
 *
 * Validates an array type and checks each entry is of a `string` type.
 */
export function isValidArray (rule: string, value: string[]) {

  if (isArray(value)) {

    if (value.length === 0) return true;

    for (let index: number = 0, size = value.length; index < size; index++) {
      if (isString(value[index]) === false) {
        throw RuleError({
          message: `Invalid rule (${rule}) type "${typeof value}" provided`,
          option: `${rule} (index: ${index})`,
          provided: value,
          reference: `/rules/${rule}/`,
          expected: [
            'string'
          ]
        });
      }
    }

    return true;
  }

  throw RuleError({
    message: `Invalid rule (${rule}) type "${typeof value}" provided`,
    option: rule,
    provided: value,
    reference: `/rules/${rule}/`,
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
export function isValidString (rule: string, value: number) {

  if (typeof value === 'string') return true;

  throw RuleError({
    message: `Invalid rule (${rule}) type "${typeof value}" provided`,
    option: rule,
    provided: value,
    reference: `/rules/${rule}/`,
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
export function isValidNumber (rule: string, value: number) {

  if (isNumber(value) && isNaN(value) === false) return true;

  throw RuleError({
    message: `Invalid rule (${rule}) type "${typeof value}" provided`,
    option: rule,
    provided: value,
    reference: `/rules/${rule}/`,
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
export function isValidBoolean (rule: string, value: number | boolean) {

  if (isNumber(value)) return value !== 0;
  if (isBoolean(value)) return true;

  throw RuleError({
    message: `Invalid rule (${rule}) type "${typeof value}" provided`,
    option: rule,
    provided: value,
    reference: `/rules/${rule}/`,
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
export function isValidChoice (rule: string, value: string) {

  if (isString(value) === false) {

    throw RuleError({
      message: `Invalid rule (${rule}) type "${typeof value}" provided`,
      option: rule,
      provided: value,
      reference: `/rules/${rule}/`,
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
      case 'json': return true;
    }

    throw RuleError({
      message: `Unsupported "${rule}" provided`,
      option: rule,
      provided: value,
      reference: `/rules/${rule}/`,
      expected: [
        'text',
        'auto',
        'markup',
        'html',
        'liquid',
        'xml',
        'json'
      ]
    });

  } else if (rule === 'preset') {

    switch (value as Rules['preset']) {
      case 'aesthetic':
      case 'none':
      case 'warrington':
      case 'prettier': return true;
    }

    throw RuleError({
      message: `Unsupported "${rule}" provided`,
      option: rule,
      provided: value,
      reference: `/rules/${rule}/`,
      expected: [
        'aesthetic',
        'none',
        'warrington',
        'prettier'
      ]
    });

  } else if (rule === 'attributeCasing') {

    switch (value as Rules['attributeCasing']) {
      case 'preserve':
      case 'lowercase':
      case 'lowercase-name':
      case 'lowercase-value': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'lowercase',
          'lowercase-name',
          'lowercase-value'
        ]
      });
    }

  } else if (rule === 'commentBracket') {

    switch (value as Rules['commentBracket']) {
      case 'preserve':
      case 'consistent':
      case 'inline':
      case 'inline-align':
      case 'newline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'consistent',
          'newline',
          'inline',
          'inline-align'
        ]
      });
    }

  } else if (rule === 'delimiterTrims') {

    switch (value as Rules['delimiterTrims']) {
      case 'preserve':
      case 'never':
      case 'always':
      case 'tags':
      case 'outputs':
      case 'multiline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'never',
          'always',
          'tags',
          'outputs',
          'multiline'
        ]
      });
    }

  } else if (rule === 'delimiterPlacement') {

    switch (value as Rules['delimiterPlacement']) {
      case 'inline':
      case 'preserve':
      case 'consistent':
      case 'newline-multiline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'inline',
          'preserve',
          'consistent',
          'newline-multiline'
        ]
      });
    }

  } else if (rule === 'lineBreakSeparator') {

    switch (value as Rules['lineBreakSeparator']) {
      case 'preserve':
      case 'before':
      case 'after': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'before',
          'after'
        ]
      });
    }

  } else if (rule === 'lineBreakLogical') {

    switch (value as Rules['lineBreakLogical']) {
      case 'preserve':
      case 'before':
      case 'after': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'before',
          'after'
        ]
      });
    }

  } else if (rule === 'valueSpacing') {

    switch (value as Rules['valueSpacing']) {
      case 'preserve':
      case 'equipoise':
      case 'wrap': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'equipoise',
          'wrap',
          'wrap-fraction'
        ]
      });
    }

  } else if (rule === 'singleQuote') {

    switch (value as Rules['singleQuote']) {

      case 'always':
      case 'preserve':
      case 'liquid':
      case 'markup':
      case 'never': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'always',
          'preserve',
          'liquid',
          'markup',
          'never'
        ]
      });
    }

  } else if (rule === 'objectIndent' || rule === 'arrayFormat') {

    switch (value as Rules['objectIndent']) {
      case 'default':
      case 'indent':
      case 'inline': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'default',
          'indent',
          'inline'
        ]
      });
    }

  } else if (rule === 'endComma') {

    switch (value as Rules['endComma']) {
      case 'preserve':
      case 'always':
      case 'never': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'preserve',
          'always',
          'never'
        ]
      });
    }

  } else if (rule === 'lineTermination') {

    switch (value as Rules['lineTermination']) {
      case 'LF':
      case 'CRLF': return true;
      default: throw RuleError({
        message: `Invalid "${rule}" option provided`,
        option: rule,
        provided: value,
        reference: `/rules/${rule}/`,
        expected: [
          'LF',
          'CRLF'
        ]
      });
    }

  }

}
