import { create } from '@utils/native';

export const html = create(null);
export const liquid = create(null);

/* -------------------------------------------- */
/* HTML TOKEN                                   */
/* -------------------------------------------- */

/**
 * HTML Block reference map
 */
html.blocks = new Set(
  [
    'body',
    'colgroup',
    'dd',
    'dt',
    'head',
    'html',
    'li',
    'option',
    'p',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr'
  ]
);

/**
 * HTML Void reference map
 */
html.voids = new Set(
  [
    'area',
    'base',
    'basefont',
    'br',
    'col',
    'embed',
    'eventsource',
    'frame',
    'hr',
    'image',
    'img',
    'input',
    'isindex',
    'keygen',
    'link',
    'meta',
    'path',
    'param',
    'progress',
    'source',
    'wbr',
    'use'
  ]
);

/* -------------------------------------------- */
/* LIQUID TOKENS                                */
/* -------------------------------------------- */

/**
 * Liquid Template reference map
 */
liquid.tags = new Set(
  [
    'autoescape',
    'case',
    'capture',
    'comment',
    'embed',
    'filter',
    'for',
    'form',
    'if',
    'macro',
    'paginate',
    'raw',
    'switch',
    'tablerow',
    'unless',
    'verbatim',
    'schema',
    'style',
    'javascript',
    'highlight',
    'stylesheet'
  ]
);

liquid.else = new Set(
  [
    'case',
    'default',
    'else',
    'elsif',
    'when'
  ]
);

export function extend () {

  /**
     * Liquid Template reference map
     */
  const names = new Set([
    'autoescape',
    'case',
    'capture',
    'comment',
    'embed',
    'filter',
    'for',
    'form',
    'if',
    'macro',
    'paginate',
    'raw',
    'switch',
    'tablerow',
    'unless',
    'verbatim',
    'schema',
    'style',
    'javascript',
    'highlight',
    'stylesheet'
  ]);

  const condelse = new Set(
    [
      'case',
      'default',
      'else',
      'when',
      'elsif'
    ]
  );

}
