import { Grammars } from 'types/prettify';
import { create } from '@utils/native';

export const grammar = (function () {

  const model: Grammars = create(null);

  model.html = create(null);
  model.script = create(null);
  model.liquid = create(null);
  model.style = create(null);

  /* -------------------------------------------- */
  /* HTML                                         */
  /* -------------------------------------------- */

  model.html.tags = new Set(
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

  model.html.voids = new Set(
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
  /* LIQUID                                       */
  /* -------------------------------------------- */

  model.liquid.tags = new Set(
    [
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

  model.liquid.else = new Set(
    [
      'case',
      'default',
      'else',
      'when',
      'elsif'
    ]
  );

  model.liquid.singletons = new Set(
    [
      'assign',
      'increment',
      'decrement',
      'render',
      'include'
    ]
  );

  /* -------------------------------------------- */
  /* SCRIPT                                       */
  /* -------------------------------------------- */

  model.script.keywords = new Set(
    [
      'ActiveXObject',
      'ArrayBuffer',
      'AudioContext',
      'Canvas',
      'CustomAnimation',
      'DOMParser',
      'DataView',
      'Date',
      'Error',
      'EvalError',
      'FadeAnimation',
      'FileReader',
      'Flash',
      'Float32Array',
      'Float64Array',
      'FormField',
      'Frame',
      'Generator',
      'HotKey',
      'Image',
      'Iterator',
      'Intl',
      'Int16Array',
      'Int32Array',
      'Int8Array',
      'InternalError',
      'Loader',
      'Map',
      'MenuItem',
      'MoveAnimation',
      'Notification',
      'ParallelArray',
      'Point',
      'Promise',
      'Proxy',
      'RangeError',
      'Rectangle',
      'ReferenceError',
      'Reflect',
      'RegExp',
      'ResizeAnimation',
      'RotateAnimation',
      'Set',
      'SQLite',
      'ScrollBar',
      'Set',
      'Shadow',
      'StopIteration',
      'Symbol',
      'SyntaxError',
      'Text',
      'TextArea',
      'Timer',
      'TypeError',
      'URL',
      'Uint16Array',
      'Uint32Array',
      'Uint8Array',
      'Uint8ClampedArray',
      'URIError',
      'WeakMap',
      'WeakSet',
      'Web',
      'Window',
      'XMLHttpRequest'
    ]
  );

  /* -------------------------------------------- */
  /* STYLE                                        */
  /* -------------------------------------------- */

  model.style.units = new Set(
    [
      '%',
      'cap',
      'ch',
      'cm',
      'deg',
      'dpcm',
      'dpi',
      'dppx',
      'em',
      'ex',
      'fr',
      'grad',
      'Hz',
      'ic',
      'in',
      'kHz',
      'lh',
      'mm',
      'ms',
      'mS',
      'pc',
      'pt',
      'px',
      'Q',
      'rad',
      'rem',
      'rlh',
      's',
      'turn',
      'vb',
      'vh',
      'vi',
      'vmax',
      'vmin',
      'vw'
    ]
  );

  return model;

})();
