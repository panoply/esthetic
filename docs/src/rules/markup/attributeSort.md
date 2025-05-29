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

:: row
:: col-12 col-md-9

# Attribute Sort

Provides sorting of HTML and XML Attributes. When **enabled** (`true`) it will sort attributes in an alphanumeric order. The rule also accepts a list of attribute names and when provided will be sorted according to order passed.

> Sorting is ignored on tags which contain Liquid output and tag type tokens as attributes.

::
::

---

:: row
:: col-12 col-md-9

## false

Take the following tag with several attributes defined in no specific order. When the rule is enabled (ie: `true`) the sorting order of these attributes will change. Attributes will be alphabetically sorted (A-Z).

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "attributeSort": false,
    "attributeLineBreak": true
  }
}
```

```html:before
<div
  id="x"
data-c="true"
data-b="100"
  class="xxx"
  data-a="foo">

 Attributes will not be sorted!

</div>
```

```html:after
<div
  id="x"
  data-c="true"
  data-b="100"
  class="xxx"
  data-a="foo">

  Attributes will not be sorted!

</div>
```

---

:: row
:: col-12 col-md-9

## true

Take the following tag with several attributes defined in no specific order. When the rule is enabled (ie: `true`) the sorting order of these attributes will change. Attributes will be alphabetically sorted (A-Z).

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "attributeSort": true,
    "attributeLineBreak": true
  }
}
```

```html:before
<div
  id="x"
  data-x="last"
  data-c="true"
  data-b="100"
  class="xxx"
  data-a="foo">
  Attributes will be sorted alphabetically!
</div>
```

```html:after
<div
  class="xxx"
  data-a="foo"
  data-b="100"
  data-c="true"
  data-x="last"
  id="x">
  Attributes will be sorted alphabetically!
</div>
```

---

:: row
:: col-12 col-md-9

## string[]

In addition to alphabetical sorting using boolean `true`, developers may prefer to control the sorting behavior of Æsthetic. The `attributeSort` rule accepts a string list of attribute names. When provided, markup attributes will be sorted according to the list entries and then alphabetically. Custom sorting will sort in the same order passed. Click the **rules** tab to inspect the sorting logic being used in the below sample.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": true,
    "attributeSort": [
      "id",
      "class",
      "data-b",
      "data-z"
    ]
  }
}
```

```html:before
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
    class="xx">
    Attributes will be custom sorted first!
  </div>
</div>
```

```html:after
<div
  id="x"
  class="xx"
  data-b
  data-z
  data-a
  data-c
  data-d
  data-e>
  <div
    id="x"
    class="xx"
    data-b
    data-z
    data-a
    data-c
    data-d
    data-e>
    Attributes will be custom sorted first!
  </div>
</div>
```
