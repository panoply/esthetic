---
title: 'Usage - Method Chains'
layout: base
permalink: '/usage/method-chaining/index.html'
---

# Method Chains

---

## Rules

## Settings

The `settings` method supports chaining.

<!-- prettier-ignore-->
```js
import esthetic from 'esthetic';

// We will disable stat reporting and then define some formatting rules
// Below we deconstruct the format method, but this can also be chained
//
const { format } = esthetic
.settings({ reportStats: false })
.grammar({ html: { voids: ['singleton'] }})
.rules({ markup: { forceIndent: true } })

try {

  const input = `<h1>Hello World!</h1> <singleton id="custom">`;
  const output = format(, { language: 'html' });

  console.log(output);

} catch(e) {
  console.error(e);
}

```
