---
title: 'Markup - Attribute Casing'
layout: base
permalink: '/rules/attributeCasing/index.html'
describe:
  - Attribute Casing
  - Rule Options
options:
  - preserve
  - lowercase
  - lowercase-name
  - lowercase-value
---

:: row
:: col-12 col-md-9

# Attribute Casing

Controls the casing of markup attribute names and values. The default setting, `preserve`, retains the original casing and is generally the recommended choice for maintaining consistency and compatibility with existing codebases.

::
::

---

:: row
:: col-12 col-md-7 col-lg-6

## preserve

The `preserve` option is what Æsthetic will **default** to using. The option will allow both lowercase and uppercase attributes be provided within markup tags.

::
::

```json:rules
{
  "language": "html",
  "attributeCasing": "preserve"
}
```

```html:before
<div data-ATTR="FOO-bar-BAZ">

  Attribute casing will be preserved

</div>
```

```html:after
<div data-ATTR="FOO-bar-BAZ">

  Attribute casing will be preserved

</div>
```

---

:: row
:: col-12 col-md-7 col-lg-6

## lowercase

Below is an example of how this rule work it it's set to `lowercase`. This might be problematic to use projects where casing needs to be respected as both attribute names and values will be converted to lowercase.

::
::

```json:rules
{
  "language": "html",
  "attributeCasing": "lowercase"
}
```

```html:before
<div data-ATTR="FOO-bar-BAZ">

  Attributes will convert to lowercase

</div>
```

```html:after
<div data-attr="foo-bar-baz">

  Attributes will convert to lowercase

</div>
```

---

:: row
:: col-12 col-md-7 col-lg-6

## lowercase-name

Below is an example of how this rule work it it's set to `lowercase-name`. This will leave attribute values intact but convert attribute names to lowercase.

::
::

```json:rules
{
  "language": "html",
  "attributeCasing": "lowercase-name"
}
```

```html:before
<div DATA-ATTR="FOO-BAR">

  Attributes names will be converted to lowercase

</div>
```

```html:after
<div data-attr="FOO-BAR">

  Attributes names will be converted to lowercase

</div>
```

---

:: row
:: col-12 col-md-7 col-lg-6

## lowercase-value

Below is an example of how this rule work it it's set to `lowercase-value`. This will leave attribute names intact but convert attribute values to lowercase.

::
::

```json:rules
{
  "language": "html",
  "attributeCasing": "lowercase-value"
}
```

```html:before
<div DATA-ATTR="FOO-BAR">

  Attributes values will be converted to lowercase

</div>
```

```html:after
<div DATA-ATTR="foo-bar">

  Attributes values will be converted to lowercase

</div>
```
