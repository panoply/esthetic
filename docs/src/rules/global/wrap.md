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

::: grid col-6 p-100 px-2

# Wrap

Character width limit before applying word wrap. A value of `0` will disable wrapping and is the default setting.

> When this rule is undefined in a `.liquidrc` file the Text Editors settings will be used, in vscode that is `*.endWithNewline` where `*` is a language name.

<!--
🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

:::

::: grid col-11 p-100 px-2

# Example

Adjust the range to input to see how Æsthetic handles word wrap.

```json:rules
{
  "example": {
    "form": "range",
    "rule": "wrap",
    "value": 90,
    "mode": "example"
  },
  "esthetic": {
    "language": "html",
    "wrap": 90,
    "endNewline": false,
    "markup": {
      "forceIndent": true,
      "preserveText": false
    }
  }
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<div id="foo" class="bar">

<h1>Hello World</h1>

  </div>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
</p>
<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat

</header>
```

:::
