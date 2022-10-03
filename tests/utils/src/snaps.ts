/**
 * Snapshot Descriptions
 *
 * Temporary utility for writting meaningful snapshot
 * description labels.
 */
export function snap (...description: string[]) {

  return description.join('\n');
}

/**
 * Snapshot Descriptions Rules
 *
 * Stringify rules
 */
export function json (object: any) {

  return JSON.stringify(object, null, 2);

}
