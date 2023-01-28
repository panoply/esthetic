---
title: 'Formatting'
layout: base
permalink: '/usage/formatting/index.html'
---

# Formatting

There format method can be used to beautify code and accepts either a string or buffer type argument. An optional `rules` parameter can also be passed for setting beautification options. By default the method resolves to a promise but you can also invoke this in a synchronous manner using `esthetic.format.sync()`.

> When an error occurs the `esthetic.format.sync` method throws an instance of an Error.

## Asynchronous

The `esthetic.format` method resolves to a promise.

<!-- prettier-ignore -->
```js
import { format } from "esthetic";

const sample = `
  .class { font-size: 0.95rem; background-color: pink; }
`

// Async formatting
format(sample, {
  language: 'css',
  style: {
    noLeadZero: true
  }
}).then(output => {

  console.log(output)

});


// Sync formatting
const output = Æsthetic.format.sync('.class { font-size: 0.95rem; }', {
  language: 'css',
  style: {
    noLeadZero: true
  }
})

console.log(output)

```

### Synchronous

The `esthetic.format.sync` method resolves to a string.

<!-- prettier-ignore -->
```js
import { format } from "esthetic";

const sample = `
  .class { font-size: 0.95rem; background-color: pink; }
`

try {

  // Sync formatting
  const output = Æsthetic.format.sync(sample, {
    language: 'css',
    style: {
      noLeadZero: true
    }
  })

  console.log(output)

} catch (error) {

  console.log(error);

}

```

## Language Specific

Language specific formatting methods work the same as `esthetic.format` but are refined to operate on a language specific level. These methods accept only relative rules as a second parameter as the `language` option is inferred.

> Currently, only stable language specific methods are made available.

### HTML

```js
import esthetic from "esthetic";

format.html('..'): Promise<string>;
format.html.sync('..'): string;


```

### Liquid

```js
import esthetic from "esthetic";

// Liquid
//
format.liquid('..'): Promise<string>;
format.liquid.sync('..'): string;


```

### XML

```js
import esthetic from "esthetic";

// XML
//
format.xml('..'): Promise<string>;
format.xml.sync('..'): string;


```

### CSS

```js
import esthetic from "esthetic";

// Liquid
//
format.css('..'): Promise<string>;
format.css.sync('..'): string;


```

### JSON

```js
import esthetic from "esthetic";

// JSON
//
format.json('..'): Promise<string>;
format.json.sync('..'): string;


```
