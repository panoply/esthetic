---
title: 'Formatting'
layout: base
permalink: '/usage/formatting/index.html'
---

# Formatting

When using Æsthetic in your project, the `format` method is how you beautify code. The method accepts either a string or buffer type argument and an optional `rules` parameter can also be passed for setting beautification options.

> When an error occurs the `esthetic.format.sync` method throws an instance of an Error.

##### Example

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const input = `.class { font-size: 0.95rem; background-color: pink; }`

const output = esthetic.format(input, {
  language: 'css',
  style: {
    noLeadZero: true
  }
})

console.log(output)

```

# Language Specific

Language specific formatting methods work the same as `esthetic.format` but are refined to operate on a language specific level. These methods accept only relative rules as a second parameter as the `language` option is inferred.

> Currently, only stable language specific methods are made available.

### HTML

```js
import esthetic from "esthetic";

format.html('..'): string;

```

### Liquid

```js
import esthetic from "esthetic";

// Liquid
//
format.liquid('..'): string;

```

### XML

```js
import esthetic from "esthetic";

// XML
//
format.xml('..'): string;


```

### CSS

```js
import esthetic from "esthetic";

// Liquid
//
format.css('..'): string;


```

### JSON

```js
import esthetic from "esthetic";

// JSON
//
format.json('..'): string;

```
