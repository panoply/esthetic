---
title: 'Markup - Strip Attribute Lines'
layout: base
permalink: '/rules/markup/stripAttributeLines/index.html'
describe:
  - Strip Attribute Lines
  - Related Rules
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Strip Attribute Lines

Whether or not newlines contained within tag attributes should be preserved. This rule is used along side the `forceAttribute` rule. When enabled (`true`) then Æsthetic will strip _empty_ newline occurrences within HTML tags attributes. When disabled (`false`) then newlines occurrences will be preserved in accordance with the **global** `preserveLine` limit defined.

### Related Rules

This rule wil only take effect when `forceAttribute` is enabled (ie: `true`) or a defined `forceAttribute` limit has been exceeded. The rule will also take effect if attribute forcing is being applied according to **global** `wrap` limits.

- [forceAttribute](/rules/markup/forceAttribute/)
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
  "markup": {
    "stripAttributeLines": false
  }
}
```

<!-- prettier-ignore -->
```html
<div
  class="x"
  id="foo"
  data-x="xx">
  <div
    data-attr-1="one"
    data-attr-2="two"



    data-attr-3="three"
    data-attr-4="four"

    data-attr-5="five">

    <!-- All attribute newlines will be preserved -->

  </div>
</div>
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
  "markup": {
    "stripAttributeLines": true
  }
}
```

<!-- prettier-ignore -->
```html
<div
  class="x"


  id="foo"
  data-x="xx">
  <div
    data-attr-1="one"

    data-attr-2="two"




    data-attr-3="three"
    data-attr-4="four"
    data-attr-5="five">

    <!-- All attribute newlines will be stripped -->

  </div>
</div>
```
