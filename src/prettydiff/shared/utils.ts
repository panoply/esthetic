import { cc } from './enums';

/**
 * Checks where the provided string contains Liquid
 * delimiters. Optionally accepts a `where` parameter
 * which allows for checking start, end, both or containment.
 *
 * Where Parameter
 *
 * - `1` Check starting delimiters, eg: `{{`, `%}`
 * - `2` Check ending delimiters, eg: `}}`, `%}`
 * - `3` Check starting and ending delimiters
 * - `4` Check if input contains starting delimiters
 * - `5` Check if input contains starting and ending delimiters
 */
export function isLiquid (input: string, direction: 1 | 2 | 3 | 4 | 5): boolean {

  if (direction === 1) {
    return input.charCodeAt(0) === cc.LCB && (
      input.charCodeAt(1) === cc.PER ||
      input.charCodeAt(1) === cc.LCB
    );
  } else if (direction === 2) {
    return (
      input.charCodeAt(input.length - 1) === cc.RCB && (
        input.charCodeAt(input.length - 2) === cc.PER ||
        input.charCodeAt(input.length - 2) === cc.RCB
      )
    );

  } else if (direction === 3) {
    return (
      input.charCodeAt(0) === cc.LCB && (
        input.charCodeAt(1) === cc.PER ||
        input.charCodeAt(1) === cc.LCB
      )
    ) && (
      input.charCodeAt(input.length - 1) === cc.RCB && (
        input.charCodeAt(input.length - 2) === cc.PER ||
        input.charCodeAt(input.length - 2) === cc.RCB
      )
    );

  } else if (direction === 4) {

    return /{[{%}]/.test(input);

  } else if (direction === 5) {

    return (/{[{%]/.test(input) && /[%}]}/.test(input));

  }
}

export function isLiquidOutputTag (tag: string) {

  return (
    tag.charCodeAt(0) === cc.LCB
    && tag.charCodeAt(1) === cc.LCB
    && tag.charCodeAt(tag.length - 1) === cc.RCB
    && tag.charCodeAt(tag.length - 2) === cc.RCB
  );

}

export function isLiquidElseTag (tag: string) {

  if (tag.charCodeAt(0) === cc.LCB && tag.charCodeAt(1) === cc.PER) {

    const name = (
      tag.charCodeAt(2) === cc.DSH
        ? tag.slice(3)
        : tag.slice(2)
    )
      .trimStart()
      .toLowerCase();

    return (
      name === 'else' ||
      name === 'when' ||
      name === 'elsif'
    ) === true;
  }

  return false;
}

export function isLiquidStartTag (tag: string) {

  if (tag.charCodeAt(0) === cc.LCB && tag.charCodeAt(1) === cc.PER) {
    const name = (
      tag.charCodeAt(2) === cc.DSH
        ? tag.slice(3)
        : tag.slice(2)
    )
      .trimStart()
      .toLowerCase();

    return name.startsWith('end') === false && (
      name === 'else' ||
      name === 'when' ||
      name === 'elsif'
    ) === false;
  }

  return false;
}

export function isLiquidEndTag (tag: string) {

  if (tag.charCodeAt(0) === cc.LCB && tag.charCodeAt(1) === cc.PER) {
    return (
      tag.charCodeAt(2) === cc.DSH
        ? tag.slice(3)
        : tag.slice(2)
    )
      .trimStart()
      .toLowerCase()
      .startsWith('end');

  }

  return false;
}
