---
title: 'Liquid - Comment Preserve'
layout: base
permalink: '/rules/liquid/commentPreserve/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

:: row
:: col-12 col-md-9

# Comment Preserve

The Comment Preserve rule is designed to maintain the original formatting within Liquid block comments. When enabled by setting it to `true`, this rule prevents any automatic formatting of the content inside Liquid comments. It takes precedence over both the `commentIndent` and `commentNewline` rules, effectively overriding their definitions. By default, the Comment Preserve rule is disabled, with its value set to `false`. The recommended setting for most cases is to keep this rule disabled (`false`). This allows other formatting rules to apply to comment content, potentially improving overall code consistency.

> There are scenarios where preserving comment formatting might be preferable. If your codebase contains comments with extensive context, complex formatting, or pre-formatted text that shouldn't be altered, you may want to consider enabling this rule.

::
::

---

:: row
:: col-12 col-md-9

## false

This `commentPreserve` rule is set to `false` by default. In the example below, the Liquid comment will be formatted.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentPreserve": false
  }
}
```

```liquid:before
{% comment %}
Lorem ipsum dolor sit amet consectetur,
adipisicing elit.
              Officia eius neque autem
  molestias, doloribus corrupti
    nulla totam
      atque libero, iusto est asperiores, culpa
blanditiis provident!
{% endcomment %}
```

```liquid:after
{% comment %}
  Lorem ipsum dolor sit amet consectetur,
  adipisicing elit.
  Officia eius neque autem
  molestias, doloribus corrupti
  nulla totam
  atque libero, iusto est asperiores, culpa
  blanditiis provident!
{% endcomment %}
```

---

:: row
:: col-12 col-md-9

## true

When the `commentPreserve` rule is enabled (`true`) then the contents of block comments will be excluded from formatting. As aforementioned, when set to `true` the rule will override `commentNewline` and `commentIndent` settings.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentPreserve": true
  }
}
```

```liquid:before
{% comment %}
    Lorem ipsum dolor sit amet consectetur,
            adipisicing elit.
                  Officia eius neque autem
  molestias, doloribus corrupti
    nulla totam
      atque libero, iusto est asperiores, culpa
blanditiis provident!
{% endcomment %}
```

```liquid:after
{% comment %}
    Lorem ipsum dolor sit amet consectetur,
            adipisicing elit.
                  Officia eius neque autem
  molestias, doloribus corrupti
    nulla totam
      atque libero, iusto est asperiores, culpa
blanditiis provident!
{% endcomment %}
```
