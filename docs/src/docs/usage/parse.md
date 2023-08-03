---
title: 'Parse'
layout: base
permalink: '/usage/parse/index.html'
prev:
  label: 'Inline Control'
  uri: '/usage/inline-control'
next:
  label: 'Settings'
  uri: '/usage/settings'
anchors:
  - Parse
  - Basic Usage
---

# Parse

The `parse` method can returns a uniform parse table data structure. Unlike many parsers that typically generate an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree), Æsthetic follows a distinct path. Its implementation of Sparser results in a uniform table-like structure.

### Basic Usage

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const input = `<div class="block">{% if x %}Hello World{% endif %}</div>`;

try {

  const data = esthetic.parse(sample)
  console.log(data)

} catch(e) {

  console.error(e)

}

```
