import { Options } from '../prettify.d';
import { assign, create, keys } from '../../utils/native';
import { prettify } from '../prettify';
import { definitions } from './definitions';

export function options (lexer: string, opts: Options) {

  for (const option of keys(opts)) {

    if (!definitions[option]?.lexer) continue;

    if (definitions[option].lexer === 'all') {
      prettify.rules[lexer][option] = opts[option];
    } else {
      prettify.rules[definitions[option].lexer][option] = opts[option];
    }
  }

  return prettify.rules[lexer];

}

export function preset (lexer: string) {

  if (lexer === 'markup') {

    return assign(create(null), prettify.options, {
      language: 'html',
      languageName: 'html',
      lexer: 'markup'
    });

  }

  if (lexer === 'script') {

    return assign(create(null), prettify.options, {
      language: 'javascript',
      languageName: 'javascript',
      lexer: 'script'
    });

  }

  if (lexer === 'style') {

    return assign(create(null), prettify.options, {
      language: 'css',
      languageName: 'CSS',
      lexer: 'style'
    });

  }

  if (lexer === 'json') {

    return assign(create(null), prettify.options, {
      language: 'json',
      languageName: 'JSON',
      lexer: 'script',
      wrap: 0
    });

  }

}
