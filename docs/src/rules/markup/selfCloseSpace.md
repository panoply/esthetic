---
title: 'Markup - Self Close Space'
layout: base
permalink: '/rules/markup/selfCloseSpace/index.html'
describe:
  - Self Close Space
  - Rule Options
options:
  - true
  - false
---

::: grid col-8 p-100

# Self Close Space

Whether markup self-closing (void) tags should apply a single space to ending portion of the delimiter which results in the tag output to produce `' />'` instead of `'/>'`.

:::

---

---

::: rule 🙌

#### true

:::

When the markup `selfCloseSpace` rule is enabled (i.e: `true`) then forward slash closing delimiters will insert a single space character.

```json:rules
{
  "language": "html",
  "markup": {
    "selfCloseSpace": true
  }
}
```

<!-- prettier-ignore -->
```html
<!-- Before formatting -->
<picture>
  <path srcset="."/>
  <path srcset="."/>
</picture>

<!-- After Formatting - Notice the the space insertion applied -->
<picture>
  <path srcset="."/>
  <path srcset="."/>
</picture>
```

---

::: rule 👎

#### false

:::

When the markup `selfCloseSpace` rule is disabled (i.e: `false`) then forward slash closing delimiters will strip leading spaces.

```json:rules
{
  "language": "html",
  "markup": {
    "selfCloseSpace": false
  }
}
```

<!-- prettier-ignore -->
```html
<!-- Before formatting -->
<picture>
  <path srcset="." />
  <path srcset="." />
</picture>

<!-- After Formatting - Notice the the space insertion applied -->
<picture>
  <path srcset="." />
  <path srcset="." />
</picture>
```
