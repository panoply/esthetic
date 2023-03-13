---
title: 'Formatting'
layout: base
permalink: '/usage/formatting/index.html'
anchors:
  - Formatting
  - Language Specific
  - HTML
  - Liquid
  - XML
  - CSS
  - JSON
  - JavaScript
---

# Formatting

When using Æsthetic in your project, the `format` method is how you beautify code. The method accepts either a string or buffer type argument and an optional `rules` parameter can also be passed for setting beautification options.

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const input = `.class { font-size: 0.95rem; background-color: pink; }`

try {

  const output = esthetic.format(input, {
    language: 'css',
    style: {
      noLeadZero: true
    }
  })

  console.log(output)

} catch(e) {

  console.error(e)

}
```

# Language Specific

Language specific formatting methods work the same as `esthetic.format` but are refined to operate on a language specific level. These methods accept only relative rules as a second parameter as the `language` option is inferred.

> Currently, only stable language specific methods are made available.

### HTML

```js
import esthetic from "esthetic";

esthetic.html('..'): string;

```

### Liquid

```js
import esthetic from "esthetic";

// Liquid
//
esthetic.liquid('..'): string;

```

### XML

```js
import esthetic from "esthetic";

// XML
//
esthetic.xml('..'): string;


```

### CSS

```js
import esthetic from "esthetic";

// Liquid
//
esthetic.css('..'): string;


```

### JSON

```js
import esthetic from "esthetic";

// JSON
//
esthetic.json('..'): string;

```

### JavaScript

```js
import esthetic from "esthetic";

// JavaScript
//
esthetic.js('..'): string;

```
