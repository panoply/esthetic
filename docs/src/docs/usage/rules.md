---
title: 'Rules'
layout: base
permalink: '/usage/rules/index.html'
anchors:
  - Rules
  -
---

# Rules

The `rules` methods will augment formatting options (rules). Formatting options are persisted so when you apply changes they are used for every beautification process thereafter. This method can be used to define rules and preset the configuration logic to be used for every call you invoke relating to beautification or parsing.

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic';

// Define rules to be used when formatting
esthetic.rules({
  language: 'html',
  indentSize: 4,
  markup: {
    attributeSort: true,
    forceAttribute: true
    // etc etc
  },
  style: {
    noLeadZero: true
    // etc etc
  },
  script: {
    noSemicolon: true,
    vertical: true
    // etc etc
  }
});

try {

  // When calling format, the rules will be used.
  const output = esthetic.format('<div id="x" class="x"> etc etc </div>')

  console.log(output)

} catch(e) {

  console.error(e)

}

```

# Defaults

Æsthetic provides a granular set of beautification options (rules). The projects [Typings](https://github.com/panoply/Æsthetic/tree/pre-release/types/rules) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/Æsthetic) to get a better idea of how code will be beautified.
