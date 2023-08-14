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

Whether or not ending HTML tag delimiters should be forced onto a newline. This will emulate the style of Prettier's `singleAttributePerLine` formatting option, wherein the last `>` delimiter character breaks itself onto a new line. Though this output style was popularized by Prettier, the resulting structures produced are far from elegant (aesthetically).

:::

---

::: rule 🤌

#### inline

:::

The `delimiterTerminus` rule is set to use an `inline` terminus by default. The behavior of delimiter terminus using `inline` results in the last `>` delimiter character occurrence being inlined.

```json:rules
{
  "language": "html",
  "preserveLine":0,
  "markup": {
    "forceAttribute": 2,
    "delimiterTerminus": "inline"
  }
}
```

<!-- prettier-ignore -->
```html
<div
id="x"class="xx"
data-attr="foo">

  <div
  id="x"
  class="xx" data-attr="foo">
    <!--
      Attributes will apply forcing but ending delimiter
      character will remain inline.
    -->
  </div>
</div>
```

---

::: rule 🤡

#### force

:::

When the `delimiterTerminus` rule is set to use `force` then formatting behavior will replicate that of Prettier. Æsthetic will use forced terminus in accordance with the [`forceAttribute`](/rules/markup/forceAttribute) defined rule and only apply forcing when structures adhere. In the below code sample, toggle the **Rules** tab and inspect the ruleset.

```json:rules
{
  "language": "html",
  "preserveLine": 1,
  "markup": {
    "forceAttribute": 3,
    "delimiterTerminus": "force"
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
    "forceAttribute": 3,
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
