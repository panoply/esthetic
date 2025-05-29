---
title: 'Liquid - Argument Line Break'
layout: base
permalink: '/rules/argumentLineBreak/index.html'
anchors:
  describe:
    - Argument Line Break
    - Related Rules
    - Rule Options
  options:
    - 0
    - 3
---

:: row
:: col-12 col-md-9

# Argument Line Break

This rule governs the application of newline breaks to Liquid tags and/or output tokens containing argument-like expression structures. By default, the rule employs a value of `0`. This default setting causes arguments to be forced onto new lines when the tag or output token containing them exceeds the global word [wrap](/rules/global/wrap/) limit.

::
::

---

:: row
:: col-12 col-md-7 col-lg-6

#### 0

By default, this rule uses a value of `0` which infers forcing to apply at a length ¾ (or 75%) of the defined global [`wrap`](/rules/global/wrap) limit. If your global wrap is set to `0` then no forcing is applied.

::
::

```json:rules
{
  "language": "liquid",
  "argumentLineBreak": 0
}
```

```liquid:before
{% render 'file',
  a: 'x',
  b: 'x',
  c: 'x' %}
```

```liquid:after
{% render 'file', a: 'x', b: 'x', c: 'x' %}
```

---

:: row
:: col-12 col-md-7 col-lg-6

## 3

This is an example of the `filterLineBreak` using a value of `3` which will result in forcing only if the tag contains `3` or more filters. A tag with less than this number of filters will not have forcing applied (unless `wrap` is exceeded).

::
::

```json:rules
{
  "language": "liquid",
  "argumentLineBreak": 3
}
```

```liquid:before
{% render 'file', a: 'x', b: 'x', c: 'x' %}
```

```liquid:after
{% render 'file',
  a: 'x',
  b: 'x',
  c: 'x' %}
```

---
