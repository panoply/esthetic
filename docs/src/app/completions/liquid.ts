/* eslint-disable n/no-callback-literal */
import { Completions } from 'papyrus';

export default <Completions[]>[

  /* -------------------------------------------- */
  /* TAG NAMES                                    */
  /* -------------------------------------------- */

  {
    match: /(\w*)$/,
    index: 1,
    cache: false,
    context: (before) => /{%-?\s*$/.test(before),
    replace: (result: string) => `${result}`,
    search: (term, callback) => callback([
      'form',
      'paginate',
      'capture',
      'case',
      'comment',
      'for',
      'if',
      'raw',
      'tablerow',
      'unless',
      'schema',
      'style',
      'script',
      'stylesheet',
      'javascript'
    ].filter(tag => tag.indexOf(term) > -1))
  },
  {
    match: /(\w*)$/,
    index: 1,
    cache: false,
    context: (before) => /{%-?\s*end$/.test(before),
    replace: (result: string) => `${result}`,
    search: (term, callback) => callback([
      'form',
      'paginate',
      'capture',
      'case',
      'comment',
      'for',
      'if',
      'raw',
      'tablerow',
      'unless',
      'schema',
      'style',
      'script',
      'stylesheet',
      'javascript'
    ].filter(tag => tag.indexOf(term) > -1))
  }

];
