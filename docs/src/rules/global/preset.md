---
title: 'Global Rules - Default'
permalink: '/rules/preset/index.html'
layout: base
---

# Preset

The `preset` rule is a global option that will set a different **default** ruleset style guide. Using the `preset` rule will assign formatting rules from which Æsthetic will default.

# Rule Options

Æsthetic provides 3 different preset options. When the rule is `undefined` it will default to using `none` which is least obtrusive formatting style.

#### `none`

This is the default style guide rulset. It is most unobtrusive preset option.

<!-- prettier-ignore -->
```json
{
  "preset": "none",
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
  "xml": {
    "attributeSort": false,
    "attributeSortList": [],
    "commentIndent": false,
    "commentNewline": false,
    "namingConvention": "lowercase",
    "forceAttribute": false,
    "forceLeadAttribute": false,
    "forceIndent": false,
    "preserveAttributes": false,
    "preserveComment": true,
    "preserveText": true,
    "stripAttributeLines": false,
  },
  "html": {
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
    "quoteConvert": "double",
  },
  "css": {
    "atRuleSpace": false,
    "commentIndent": false,
    "commentNewline": false,
    "correct": false,
    "classPadding": false,
    "noLeadZero": false,
    "preserveComment": true,
    "sortProperties": false,
    "sortSelectors": false,
    "quoteConvert": "none",
  },
  "sass": {
    "atRuleSpace": false,
    "commentIndent": false,
    "commentNewline": false,
    "correct": false,
    "classPadding": false,
    "forceMaps": true,
    "noLeadZero": false,
    "preserveComment": true,
    "sortProperties": false,
    "sortSelectors": false,
    "quoteConvert": "none",
    "vertical": false,
  },
  "json": {
    "allowComments": false,
    "arrayFormat": "default",
    "braceAllman": true,
    "bracePadding": false,
    "objectIndent": "indent",
    "objectSort": false
  },
  "javascript": {
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

#### `reccomended`

This style guide is typically suited for most cases.

<!-- prettier-ignore -->
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
    "quoteConvert": "double",
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
    "quoteConvert": "none",
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

#### `strict`

This is a strict ruleset for developers who think highly of themselves.

<!-- prettier-ignore -->
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
    "quoteConvert": "double",
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
    "quoteConvert": "none",
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
