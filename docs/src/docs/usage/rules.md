---
title: 'Rules'
layout: base
permalink: '/usage/rules/index.html'
---

# Rule Options

The `rules` methods will augment formatting options (rules). Formatting options are persisted so when you apply changes they are used for every beautification process thereafter. This method can be used to define rules and preset the configuration logic to be used for every call you invoke relating to beautification or parsing.

<!-- prettier-ignore -->
```js
import { rules, format } from 'esthetic';

// Define rules to be used when formatting
rules({
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

// When calling format, the rules will be used.
format('<div id="x" class="x"> etc etc </div>').then(output => {

  console.log(output);

});

```

# Defaults

Æsthetic provides a granular set of beautification options (rules). The projects [Typings](https://github.com/panoply/Æsthetic/tree/pre-release/types/rules) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/Æsthetic) to get a better idea of how code will be beautified.

```json
{
  "language": "auto",
  "indentSize": 2,
  "indentChar": " ",
  "wrap": 0,
  "crlf": false,
  "endNewline": false,
  "preserveLine": 3,
  "liquid": {
    "commentIndent": false,
    "commentNewline": false,
    "correct": true,
    "delimiterTrims": "preserve",
    "ignoreTagList": [],
    "indentAttributes": false,
    "lineBreakSeparator": "default",
    "normalizeSpacing": true,
    "preserveComment": true,
    "quoteConvert": "double"
  },
  "markup": {
    "attributeCasing": "preserve",
    "attributeSort": false,
    "attributeSortList": [],
    "commentIndent": false,
    "commentNewline": false,
    "correct": true,
    "delimiterForce": false,
    "forceAttribute": false,
    "forceLeadAttribute": false,
    "forceIndent": false,
    "ignoreCSS": false,
    "ignoreJS": false,
    "ignoreJSON": false,
    "preserveAttributes": false,
    "preserveComment": true,
    "preserveText": true,
    "selfCloseSpace": false,
    "selfCloseSVG": true,
    "stripAttributeLines": false,
    "quoteConvert": "double"
  },
  "style": {
    "atRuleSpace": false,
    "commentIndent": false,
    "commentNewline": false,
    "correct": false,
    "classPadding": false,
    "noLeadZero": false,
    "preserveComment": true,
    "sortProperties": false,
    "sortSelectors": false,
    "quoteConvert": "none"
  },
  "json": {
    "allowComments": false,
    "arrayFormat": "default",
    "braceAllman": true,
    "bracePadding": false,
    "objectIndent": "indent",
    "objectSort": false
  },
  "script": {
    "commentIndent": false,
    "commentNewline": false,
    "arrayFormat": "default",
    "braceAllman": false,
    "bracePadding": false,
    "braceStyle": "none",
    "endComma": "never",
    "braceNewline": true,
    "correct": false,
    "caseSpace": false,
    "elseNewline": true,
    "functionNameSpace": true,
    "functionSpace": false,
    "methodChain": 0,
    "neverFlatten": false,
    "noCaseIndent": false,
    "noSemicolon": false,
    "objectIndent": "indent",
    "objectSort": false,
    "preserveComment": true,
    "preserveText": true,
    "quoteConvert": "single",
    "ternaryLine": false,
    "variableList": "none",
    "vertical": false,
    "styleGuide": "none"
  }
}
```

### Globals

Global rules will be applied to all lexer modes. You cannot override globals on a per lexer basis. Globals are exposed as first level properties.

```json
{
  "language": "auto",
  "indentSize": 2,
  "indentChar": " ",
  "wrap": 0,
  "crlf": false,
  "endNewline": false,
  "preserveLine": 3
}
```

### Liquid

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/liquid.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- **Liquid**

```json
{
  "liquid": {
    "commentIndent": false,
    "commentNewline": false,
    "correct": true,
    "delimiterTrims": "preserve",
    "ignoreTagList": [],
    "indentAttributes": false,
    "lineBreakSeparator": "default",
    "normalizeSpacing": true,
    "preserveComment": true,
    "quoteConvert": "double"
  }
}
```

### Markup

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/markup.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- **Liquid**
- **HTML**
- **XHTML**
- **XML**
- **JSX**
- **TSX**

```ts
{
  markup: {
    attributeCasing: 'preserve',
    attributeSort: false,
    attributeSortList: [],
    commentIndent: false,
    commentNewline: false,
    correct: true,
    delimiterForce: false,
    forceAttribute: false,
    forceLeadAttribute: false,
    forceIndent: false,
    ignoreCSS: false,
    ignoreJS: false,
    ignoreJSON: false,
    preserveAttributes: false,
    preserveComment: true,
    preserveText: true,
    selfCloseSpace: false,
    selfCloseSVG: true,
    stripAttributeLines: false,
    quoteConvert: 'double',
  }
}
```

### Style

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/style.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- **CSS**
- **SCSS/SASS**
- **LESS**

```json
{
  "style": {
    "atRuleSpace": false,
    "commentIndent": false,
    "commentNewline": false,
    "correct": false,
    "classPadding": false,
    "noLeadZero": false,
    "preserveComment": true,
    "sortProperties": false,
    "sortSelectors": false,
    "quoteConvert": "none"
  }
}
```

> _Æsthetic supports Liquid infused style formatting and when encountered it will apply beautification using Markup rules_

### Script

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/script.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- **JavaScript**
- **TypeScript**
- **JSX**
- **TSX**

```ts
{
  script: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    commentIndent: false,
    commentNewline: false,
    endComma: 'never',
    braceNewline: true,
    correct: false,
    caseSpace: false,
    elseNewline: true,
    functionNameSpace: true,
    functionSpace: false,
    methodChain: 0,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveComment: true,
    preserveText: true,
    quoteConvert: 'single',
    ternaryLine: false,
    variableList: 'none',
    vertical: false,
    styleGuide: 'none'
  }
}
```

> _Æsthetic supports Liquid infused script formatting and when encountered it will apply beautification using Markup rules_

### JSON

Refer to the [JSON](/docs/rules/json.md) declaration file for description. Rules will be used when formatting the following languages:

- **JSON**
- **JSONC**

```json
{
  "arrayFormat": "default",
  "braceAllman": true,
  "bracePadding": false,
  "objectIndent": "indent",
  "objectSort": false
}
```

> _Æsthetic partially supports Liquid infused JSON formatting, but you should avoid coupling these 2 language together._
