import { cc } from 'lexical/codes';
import { Attrs } from 'types';

export function sortEntries (entries: Attrs, list: string[] = []): Attrs {

  if (entries.length === 0) return entries;

  // Pre-compute attribute names once
  const attrNames = entries.map(([ key ]) => key.split('=')[0].trim());

  // Create priority lookup map for O(1) access
  const priorityMap = new Map<string, number>();
  const prefixRules: Array<{ prefix: string; priority: number }> = [];

  list.forEach((item, index) => item.endsWith(cc.ARS)
    ? prefixRules.push({ prefix: item.slice(0, -1), priority: index })
    : priorityMap.set(item, index));

  // Helper function to get priority for an attribute name
  function getPriority (attrName: string): number {

    // Check exact match first

    if (priorityMap.has(attrName)) return priorityMap.get(attrName)!;
    // Check prefix matches
    for (const { prefix, priority } of prefixRules) {
      if (attrName.startsWith(prefix)) return priority;
    }

    // Default priority (items not in list go last)
    return list.length;

  };

  // Sort entries directly without creating intermediate arrays
  return entries
    .map((entry, index) => ({ entry, attrName: attrNames[index] }))
    .sort((a, b) => {

      const priA = getPriority(a.attrName);
      const priB = getPriority(b.attrName);

      // Secondary sort: alphabetically by attribute name
      return priA !== priB
        ? priA - priB
        : a.attrName.localeCompare(b.attrName);

    })
    .map(({ entry }) => entry);
}
