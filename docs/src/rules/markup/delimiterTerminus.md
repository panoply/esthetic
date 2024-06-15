---
title: 'Markup - Delimiter Terminus'
layout: base
permalink: '/rules/markup/delimiterTerminus/index.html'
describe:
  - Delimiter Terminus
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Delimiter Terminus

Whether or not ending HTML tag delimiters should be forced onto a newline when tag attributes exist. This will emulate the style of Prettier's `bracketSameLine` formatting option, wherein the last `>` delimiter character breaks itself onto a newline.

The rule accepts either a `boolean` or `number` type and defaults to `false`, which will prevent delimiters from newline breaks. When enabled, (i.e, `true`) forcing will be applied in accordance with the [attributeLineBreak](/rules/markup/attributeLineBreak/). The rule also accepts a `number` type, which will apply delimiter line breaks according to the number of attributes a tag contains.

:::

---

::: rule 🤌

#### false

:::

The `delimiterTerminus` rule is disabled (i.e, `false`) by default. The behavior of delimiter terminus using `false` results in the last `>` delimiter character occurrence being inlined

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": 2,
    "delimiterTerminus": false
  }
}
```

<!-- prettier-ignore -->
```html
<div
  id="x"
  class="xx"
  data-attr="foo"
>
  <div
    id="x"
    class="xx"
    data-attr="foo"
  >
    <!--
      Terminus will be inlined
    -->
  </div>
</div>
```

---

::: rule 🤡

#### true

:::

When the `delimiterTerminus` rule is set to `true`, Æsthetic will apply terminus in accordance with [`attributeLineBreak`](/rules/markup/attributeLineBreak/) or the [`wrap`](/rules/markup/wrap/) limit which triggers newline breaks. In te below code sample, we have set

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": 3,
    "delimiterTerminus": "force"
  }
}
```

<!-- prettier-ignore -->
```html
<div
  id="x"
  class="xx"
>
  <div
    id="x"
    class="xx"
    data-attr="foo"
  >
    <!--
      Terminus will be inlined
    -->
  </div>
</div>

<!-- Forced terminus will not be applied -->
<div
  id="bar"
  class="bax">

<!-- Forced terminus will apply -->
<div
id="x"class="xx"
data-attr="foo">
<!-- Forced terminus will apply -->
  <main
id="x"class="xx"
data-attr="foo">
    <!--
      Notice how terminus forcing has been applied to tags
      with more than 2 attributes only. This is because
      we set attribute forcing to that limit.
    -->
  </main>

  </div>
</div>
```

---

::: rule 👍

#### adapt

:::

When the `delimiterTerminus` rule is set to use `adapt` delimiter terminus will be determined based on structures. Æsthetic will apply the terminus based on several factors and take into consideration markup rules such a [`lineBreakValue`](/rules/markup/lineBreakValue). Terminus is not guaranteed when set to `adapt` but is generally the preferred option to use.

```json:rules
{
  "language": "html",
  "preserveLine": 1,
  "markup": {
    "attributeLineBreak": 3,
    "delimiterTerminus": "adapt"
  }
}
```

<!-- prettier-ignore -->
```html

<!-- Forced terminus will not be applied -->
<div
  id="bar"
  class="bax">

<!-- Forced terminus will apply -->
<div
id="x"class="xx"
data-attr="foo">
<!-- Forced terminus will apply -->
  <main
id="x"class="xx"
data-attr="foo">
    <!--
      Notice how terminus forcing has been applied to tags
      with more than 2 attributes only. This is because
      we set attribute forcing to that limit.
    -->
  </main>

  </div>
</div>
```
