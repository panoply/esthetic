---
title: 'Markup - Attribute Sort'
layout: base
permalink: '/rules/markup/attributeSort/index.html'
describe:
  - Attribute Sort
  - Rule Options
options:
  - false
  - true
  - 'string[]'
---

::: grid col-9 p-100

# Attribute Sort

Provides sorting of HTML and XML Attributes. When **enabled** (`true`) it will sort attributes in an alpha-numeric order. Sorting is ignored on tags which contain Liquid output and tag type tokens as attributes. The rule also accepts a list of attribute names and when provided will be sorted according to order passed.

:::

---

# Rule Options

::: rule 🙌

#### false

:::

Take the following tag with several attributes defined in no specific order. When the rule is enabled (ie: `true`) the sorting order of these attributes will change. Attributes will be alphabetically sorted (A-Z).

```json:rules
{
  "language": "html",
  "markup": {
    "attributeSort": false,
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
<div
  id="x"
  data-c="true"
  data-b="100"
  class="xxx"
  data-a="foo"></div>
```

::: rule 👍

#### true

:::

Take the following tag with several attributes defined in no specific order. When the rule is enabled (ie: `true`) the sorting order of these attributes will change. Attributes will be alphabetically sorted (A-Z).

```json:rules
{
  "language": "html",
  "markup": {
    "attributeSort": true,
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
<!-- After formatting -->
<div
  class="xxx"
  data-a="foo"
  data-b="100"
  data-c="true"
  id="x"></div>
```

::: rule 🙌

#### string[]

:::

Below is an example of how this rule works and you've defined the following attribute sorting structure

```js
{
  markup: {
    attributeSort: ['id', 'class', 'data-b', 'data-z'];
  }
}
```

Using the above example options, let's consider the following attributes contained on a tag. Notice how each attribute is expressed in a no specific order. This will change **after** formatting as per the **after** example.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeSort": [
      "id",
      "class",
      "data-b",
      "data-z"
    ],
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
<div
  data-z
  data-a
  id="x"
  data-d
  data-c
  data-b
  data-e
  class="xx">

  <div
    data-z
    data-a
    id="x"
    data-d
    data-c
    data-b
    data-e
    class="xx"></div>

</div>
```
