---
title: 'Global Rules - Wrap'
layout: base
permalink: '/rules/global/wrap/index.html'
prev:
  label: 'Preset'
  uri: '/rules/global/preset/'
next:
  label: 'Wrap Fraction'
  uri: '/rules/global/wrapFraction/'
describe:
  - Wrap
  - Example
---

# Wrap

Character width limit before applying word wrap. A value of `0` will disable wrapping.

::: note

When this rule is undefined in a `.liquidrc` file the Text Editors settings will be used, in vscode that is `*.endWithNewline` where `*` is a language name.

:::

<!--
🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

# Example

The global `endNewline` rule is disabled (i.e: `false`) by default. This will result in newline occurrences at the end of documents/files to be stripped. In the below sample, the newline is removed after formatting.

```json:rules
{
  "$": {
    "form": "range",
    "rule": "wrap",
    "value": 80,
    "mode": "example"
  },
  "rules": {
    "language": "liquid",
    "wrap": 80,
    "endNewline": false
  }
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<p>
  The newline at the end of this sample will be stripped.
</p>
</header>
```
