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

:::: grid row pr-5

::: grid col-6 p-100 pl-5

# Wrap

Character width limit before applying word wrap. A value of `0` will disable wrapping and is the default setting.

> When this rule is undefined in a `.liquidrc` file the Text Editors settings will be used, in vscode that is `*.endWithNewline` where `*` is a language name.

:::

::: grid col-12 p-100 pl-5

# Example

Adjust the range to input to see how Æsthetic handles word wrap.

```json:rules
{
  "papyrus": {
    "editor": false
  },
  "example": {
    "rule": "wrap",
    "min": 20,
    "max": 100,
    "value": 80,
    "step": 1
  },
  "esthetic": {
    "language": "html",
    "wrap": 80,
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
</p>
</header>
```

:::

::::
