import qvp from 'qvp';
import { LinesAndColumns } from 'lines-and-columns';
import JSONFallback from 'json-parse-better-errors';

/**
 * Check if an element is out of the viewport
 */
export function isOutOfViewport (element: HTMLElement) {

  // Get element's bounding
  const bounding = element.getBoundingClientRect();

  const top = bounding.top < 0;
  const left = bounding.left < 0;
  const bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  const right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);

  return top || left || bottom || right;

};

/**
 * Whether or not we are within a screen viewport
 */
export function isScreen (screens: string) {

  return screens.split('|').some(qvp.active);

}

export function parseJSON (input: string) {

  try {

    try {
      return JSON.parse(input);

    } catch (error) {
      JSONFallback(input);
      throw error;

    }
  } catch (error) {

    const indexMatch = error.message.match(/in JSON at position (\d+) while parsing/);

    if (indexMatch && indexMatch.length > 0) {

      const lines = new LinesAndColumns(input);
      const index = Number(indexMatch[1]);
      const location = lines.locationForIndex(index);

      error.message = error.message.replace(/parsing/, 'parsing:\n\n').replace(/'/g, '');

      error.stack = [
        `LineNo:  ${location.line}`,
        `Column:  ${location.column}`,
        `Offset:  ${indexMatch[1]}`
      ].join('\n');
    }

    throw error;

  }

}
