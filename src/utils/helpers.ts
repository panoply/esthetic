
/**
 * Repeats a character x amount of times.
 * Used for generating repeating characters
 * and is merely a wraper around `''.repeat()`
 */
export function repeatChar (count: number, ch: string) {

  if (count === 0) return ch;

  let char = '';
  let i = 1;

  do { char += ch; } while (i++ < count);

  return char;
}
