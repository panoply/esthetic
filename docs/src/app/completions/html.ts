/* eslint-disable n/no-callback-literal */
import { Completions } from 'papyrus';

export default <Completions[]>[

  /* -------------------------------------------- */
  /* TAG NAMES                                    */
  /* -------------------------------------------- */

  {
    match: /<(\w*)$/,
    index: 1,
    cache: false,
    replace: (result: string) => [ `<${result}>`, `</${result}>` ],
    search: (term, callback) => callback([
      'a',
      'abbr',
      'acronym',
      'address',
      'applet',
      'article',
      'aside',
      'audio',
      'b',
      'basefont',
      'bdi',
      'bdo',
      'big',
      'blockquote',
      'body',
      'button',
      'canvas',
      'caption',
      'center',
      'cite',
      'code',
      'colgroup',
      'data',
      'datalist',
      'dd',
      'del',
      'details',
      'dfn',
      'dialog',
      'dir',
      'div',
      'dl',
      'dt',
      'em',
      'fieldset',
      'figcaption',
      'figure',
      'figure',
      'font',
      'footer',
      'form',
      'frame',
      'frameset',
      'h1',
      'h6',
      'head',
      'header',
      'html',
      'i',
      'iframe',
      'ins',
      'isindex',
      'kbd',
      'label',
      'legend',
      'fieldset',
      'li',
      'main',
      'map',
      'mark',
      'marquee',
      'menu',
      'meter',
      'nav',
      'noframes',
      'frame',
      'noscript',
      'object',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'object',
      'picture',
      'pre',
      'progress',
      'q',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'script',
      'section',
      'select',
      'small',
      'picture',
      'video',
      'audio',
      'span',
      'strike',
      'strong',
      'style',
      'sub',
      'summary',
      'details',
      'sup',
      'svg',
      'table',
      'tbody',
      'td',
      'template',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'title',
      'tr',
      'audio',
      'video',
      'tt',
      'u',
      'ul',
      'var',
      'video'
    ].filter(tag => tag.indexOf(term) > -1))
  }

];
