---
title: 'Markup - Preserve Text'
layout: base
permalink: '/rules/markup/preserveText/index.html'
describe:
  - Preserve Text
  - Rule Options
options:
  - false
  - true
---

::: grid col-8 p-100

# Preserve Text

Whether markup text content should formatted or preserved. This rule accepts a `boolean` type, and when enabled (i.e, `true`) the rule will effectively ignore regions of text and in addition a small subset of tags surrounded by text identified tokens. The rule has side-effects and one should be aware of the overrides incurred.

> The global defined [`preserveLine`](/rules/global/preserveLine) rule will be and applied to the surrounding regions of text identified blocks, however the inner contents is ignored and `preserveLine` will have no effect.

### Related Rules

The `preserveText` rule will override [`wrap`](/rules/global/wrap), [`indentSize`](/rules/global/indentSize) and [`preserveLine`](/rules/global/preserveLine).

- [`wrap`](/rules/global/wrap)
- [`indentSize`](/rules/global/indentSize)
- [`preserveLine`](/rules/global/preserveLine)

:::

---

---

::: rule 👍

#### false

:::

Text contents are formatted

```json:rules
{
  "language": "html",
  "markup": {
    "preserveText": false
  }
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<div id="foo" class="bar">

<h1>
      Hello
          World

</h1>

  </div>
<p>
Lorem ipsum dolor sit amet, consectetur
    adipiscing elit, sed do eiusmod tempor
incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation
      ullamco laboris nisi ut
            aliquip ex ea commodo
consequat.
</p>
<p>

  quis nostrud exercitation
      ullamco laboris nisi ut
            aliquip ex ea commodo
consequat.

</p>

</header>
```

---

::: rule 🫡

#### true

:::

Text contents are preserved

```json:rules
{
  "language": "html",
  "markup": {
    "preserveText": true
  }
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<div id="foo" class="bar">

<h1>
      Hello
          World

</h1>

  </div>
<p>
Lorem ipsum dolor sit amet, consectetur
    adipiscing elit, sed do eiusmod tempor
incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation
      ullamco laboris nisi ut
            aliquip ex ea commodo
consequat.
</p>
<p>

  quis nostrud exercitation
      ullamco laboris nisi ut
            aliquip ex ea commodo
consequat.

</p>

</header>
```
