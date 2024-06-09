export function bigSign (bigIntValue) {
  return (bigIntValue > 0n) - (bigIntValue < 0n);
}

function prefixCandidate (context, selector) {
  const prefix = context.tailwindConfig.prefix;
  return typeof prefix === 'function' ? prefix(selector) : prefix + selector;
}

// Polyfill for older Tailwind CSS versions
function getClassOrderPolyfill (classes, { env }) {
  // A list of utilities that are used by certain Tailwind CSS utilities but
  // that don't exist on their own. This will result in them "not existing" and
  // sorting could be weird since you still require them in order to make the
  // host utitlies work properly. (Thanks Biology)
  const parasiteUtilities = new Set([
    prefixCandidate(env.context, 'group'),
    prefixCandidate(env.context, 'peer')
  ]);

  const classNamesWithOrder = [];

  for (const className of classes) {
    let order =
      env
        .generateRules(new Set([ className ]), env.context)
        .sort(([ a ], [ z ]) => bigSign(z - a))[0]?.[0] ?? null;

    if (order === null && parasiteUtilities.has(className)) {
      // This will make sure that it is at the very beginning of the
      // `components` layer which technically means 'before any
      // components'.
      order = env.context.layerOrder.components;
    }

    classNamesWithOrder.push([ className, order ]);
  }

  return classNamesWithOrder;
}

export function sortClasses (parts: string[], { env, ignoreFirst = false, ignoreLast = false }) {

  let result = '';
  let classes = parts.filter((_, i) => i % 2 === 0);
  const whitespace = parts.filter((_, i) => i % 2 !== 0);

  if (classes[classes.length - 1] === '') {
    classes.pop();
  }

  let prefix = '';
  if (ignoreFirst) {
    prefix = `${classes.shift() ?? ''}${whitespace.shift() ?? ''}`;
  }

  let suffix = '';
  if (ignoreLast) {
    suffix = `${whitespace.pop() ?? ''}${classes.pop() ?? ''}`;
  }

  classes = sortClassList(classes, { env });

  for (let i = 0; i < classes.length; i++) {
    result += `${classes[i]}${whitespace[i] ?? ''}`;
  }

  return prefix + result + suffix;

}

export function sortClassList (classList, { env }) {
  const classNamesWithOrder = env.context.getClassOrder
    ? env.context.getClassOrder(classList)
    : getClassOrderPolyfill(classList, { env });

  return classNamesWithOrder
    .sort(([ , a ], [ , z ]) => {
      if (a === z) return 0;
      // if (a === null) return options.unknownClassPosition === 'start' ? -1 : 1
      // if (z === null) return options.unknownClassPosition === 'start' ? 1 : -1
      if (a === null) return -1;
      if (z === null) return 1;
      return bigSign(a - z);
    })
    .map(([ className ]) => className);
}
