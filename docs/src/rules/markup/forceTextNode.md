---
title: 'Markup - Force Text Node'
layout: base
permalink: '/rules/markup/forceTextNode/index.html'
describe:
  - Strip Attribute Lines
  - Related Rules
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Force Text Node

Controls the forcing behavior of text node (phrasing content) intra-paragraph elements. Tags like `<strong>`, `<i>`, `<label>` etc are categorized as "Phrasing Content". This rule will apply to only those elements. The rule accepts either a `boolean` or `number` value.

- Passing a value of `false` will preventing forcing from being applied.
- Passing a value of `true` will force text node content.
- Passing a value of `0` will apply forcing in accordance with `forceAttribute`
- Passing a value of `1` or more will apply forcing when attribute count exceeds limit defined

If left `undefined`, text nodes will apply in accordance with `forceIndent` and `forceAttribute`, with `forceIndent` overriding `forceAttribute` if enabled.

### Related Rules

This rule wil only take effect when `forceAttribute` is enabled (ie: `true`) or a defined `forceAttribute` limit has been exceeded. The rule will also take effect if attribute forcing is being applied according to **global** `wrap` limits.

- [forceIndent](/rules/markup/forceIndent/)
- [forceAttribute](/rules/global/forceAttribute/)

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
