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

::: grid col-12 col-sm-9 p-100

# Attribute Sort

Provides sorting of HTML and XML Attributes. When **enabled** (`true`) it will sort attributes in an alphanumeric order. The rule also accepts a list of attribute names and when provided will be sorted according to order passed.

> Sorting is ignored on tags which contain Liquid output and tag type tokens as attributes.

:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

---

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

---

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

---

::: rule 🙌

#### string[]

:::

In addition to alphabetical sorting using boolean `true`, developers may prefer to control the sorting behavior of Æsthetic. The `attributeSort` rule accepts a string list of attribute names. When provided, markup attributes will be sorted according to the list entries and then alphabetically. Custom sorting will sort in the same order passed. Click the **rules** tab to inspect the sorting logic being used in the below sample.

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
