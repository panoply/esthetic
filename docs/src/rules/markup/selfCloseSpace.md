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

:: row
:: col-12 col-md-9

# Self Close Space

Whether markup self-closing (void) tags should apply a single space to ending portion of the delimiter which results in the tag output to produce `' />'` instead of `'/>'`.

::
::

---

:: row
:: col-12 col-md-9

## true

When the markup `selfCloseSpace` rule is enabled (i.e: `true`) then forward slash closing delimiters will insert a single space character.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "selfCloseSpace": true
  }
}
```

```html:before
<picture>
  <path srcset="."/>
  <path srcset="."/>
</picture>
```

```html:after
<picture>
  <path srcset="." />
  <path srcset="." />
</picture>
```

---

:: row
:: col-12 col-md-9

## false

When the markup `selfCloseSpace` rule is disabled (i.e: `false`) then forward slash closing delimiters will strip leading spaces.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "selfCloseSpace": false
  }
}
```

```html:before
<picture>
  <path srcset="." />
  <path srcset="." />
</picture>
```

```html:after
<picture>
  <path srcset="."/>
  <path srcset="."/>
</picture>
```
