---
title: 'Markup - Attribute Casing'
layout: base
permalink: '/rules/markup/attributeCasing/index.html'
describe:
  - Attribute Casing
  - Rule Options
options:
  - preserve
  - lowercase
  - lowercase-name
  - lowercase-value
---

# Attribute Casing

How markup attribute names and value casing should be processed. This defaults to `preserve` which will leave casing intact and _typically_ the best option to use.

# Rule Options

::: rule 🙌

#### preserve

:::

The `preserve` option is what Æsthetic will **default** to using. The option will allow both lowercase and uppercase attributes be provided within HTML (markup) tags.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeCasing": "preserve"
  }
}
```

<!--prettier-ignore-->
```html
<div data-ATTR="FOO-bar-BAZ">

  Attribute casing will be preserved

</div>
```

---

::: rule 👎

#### lowercase

:::

Below is an example of how this rule work it it's set to `lowercase`. This might be problematic to use projects where casing needs to be respected as both attribute names and values will be converted to lowercase.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeCasing": "lowercase"
  }
}
```

<!--prettier-ignore-->
```html
<div data-ATTR="FOO-bar-BAZ">

  Attributes will convert to lowercase

</div>
```

---

::: rule 👍

#### lowercase-name

:::

Below is an example of how this rule work it it's set to `lowercase-name`. This will leave attribute values intact but convert attribute names to lowercase.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeCasing": "lowercase-name"
  }
}
```

<!--prettier-ignore-->
```html
<div DATA-ATTR="FOO-BAR">

  Attributes names will be converted to lowercase

</div>
```

---

::: rule 👎

#### lowercase-value

:::

Below is an example of how this rule work it it's set to `lowercase-value`. This will leave attribute names intact but convert attribute values to lowercase.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeCasing": "lowercase-value"
  }
}
```

<!--prettier-ignore-->
```html
<div DATA-ATTR="FOO-BAR">

  Attributes values will be converted to lowercase

</div>
```
