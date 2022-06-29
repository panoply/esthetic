
/**
 * Repeats a character x amount of times.
 * Used for generating repeating characters
 * and is merely a wraper around `''.repeat()`
 */
export function repeatChar (count: number, ch: string = ' ') {

  if (count === 0) return ch;

  let char = '';
  let i = 1;

  do { char += ch; } while (i++ < count);

  return char;
}

/**
 * Converts byte size to killobyte, megabyte,
 * gigabyte or terrabyte
 */
export function size (bytes: number): string {

  const kb = 1024;
  const mb = 1048576;
  const gb = 1073741824;

  if (bytes < kb) return bytes + ' B';
  else if (bytes < mb) return (bytes / kb).toFixed(1) + ' KB';
  else if (bytes < gb) return (bytes / mb).toFixed(1) + ' MB';
  else return (bytes / gb).toFixed(1) + ' GB';

};
