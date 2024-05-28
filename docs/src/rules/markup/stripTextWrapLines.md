---
title: 'Markup - Strip Text Wrap Lines'
layout: base
permalink: '/rules/markup/stripTextWrapLines/index.html'
describe:
  - Strip Attribute Lines
  - Related Rules
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Strip Text Wrap Lines

Whether or not Æsthetic should strip newline occurrences when applying word-wrap on text content. This rule will only take effect if a word wrap limit has been defined via `wrap` option. When enabled, Æsthetic will remove newline occurrences from text identified content and produce a strictly formed wrap. By default, this rule is `false` and Æsthetic will preserve newlines within text content, ensuring that newline occurrences adhere to the `preserveLine` limit regardless of whether or not a `wrap` limit has been set. Setting this to `true` will override `preserveLine` within text specific content and instead refer to the `wrap` limitation.

### Related Rules

This rule wil only take effect when `forceAttribute` is enabled (ie: `true`) or a defined `forceAttribute` limit has been exceeded. The rule will also take effect if attribute forcing is being applied according to **global** `wrap` limits.

- [wrap](/rules/global/wrap/)
- [preserveLine](/rules/global/preserveLine/)

:::

---

::: rule 👍

#### false

:::

Below is the default, wherein the attributes preserve the newlines contained within, Notice how **before** formatting there is `4` lines present but **after** formatting only `2` are preserved as per the global `preserveLine` rule value.

```json:rules
{
  "language": "html",
  "preserveLine": 2,
  "wrap": 50,
  "markup": {
    "stripTextWrapLines": false
  }
}
```

<!-- prettier-ignore -->
```html
<p>
  Lorem ipsum, dolor sit amet consectetur adipisicing elit.

  Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!
</p>
```

---

::: rule 🙌

#### true

:::

Below is an example of how this rule works if it's enabled, ie: `true`. This will strip out empty new lines contained in markup tag attributes in accordance with `preserveLine` defined limit.

```json:rules
{
  "language": "html",
  "preserveLine": 3,
  "wrap": 50,
  "markup": {
    "stripTextWrapLines": true
  }
}
```

<!-- prettier-ignore -->
```html
<p>
  Lorem ipsum, dolor sit amet consectetur adipisicing elit.

  Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!
</p>
```
