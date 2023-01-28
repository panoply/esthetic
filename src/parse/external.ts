import { grammar } from '@shared/grammar';

/**
 * Determine External
 *
 * Returns a boolean when an external language tag name is
 * determined to require another lexer. Optionally provide
 * a second `ref` parameter to only check sepecific grammars.
 */
export function determine (tag: string, ref: 'html' | 'liquid', attrs?: any) {

  if (ref === 'html') {

    if (!(tag in grammar.html.embed)) return false;

    const token = grammar.html.embed[tag];

    if (token.attr.size > 0) {
      for (const attribute of token.attr.values()) {

        if (!attrs) return attribute;

        if (attribute.attr.has(attrs[0]) && attribute.attr.get(attrs[0]).value.has(attrs[1])) {
          return attribute.attr.get(attrs[0]);
        }
      }
    }

    return token.attr.has(attrs[0]) ? token.attr.get(attrs[0]).attr.has(attrs[1])
      ? token.attr.get(attrs[0]).attr.get(attrs[1])
      : token.attr.get(attrs[0]) : token;

  } else if (ref === 'liquid') {

    if (!(tag in grammar.liquid.embed)) return false;

    const token = grammar.liquid.embed[tag];

    if (token.args.size > 0) {
      for (const [ match, key ] of token.args) {
        if (match instanceof RegExp && match.test(attrs)) return key;
      }
    }

    return token;

  }

}

/**
 * Detect External
 *
 * Returns a boolean when an external language tag name is
 * determined to require another lexer. Optionally provide
 * a second `language` parameter to only check sepecific grammars.
 */
export function detect <T extends 'html' | 'liquid'> (tag: string, language?: T) {

  if (typeof language !== 'undefined') return tag in grammar[language].embed;

  return (
    tag in grammar.html.embed ||
    tag in grammar.liquid.embed
  );

}
