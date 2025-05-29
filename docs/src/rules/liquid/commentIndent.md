---
title: 'Liquid - Comment Indent'
layout: base
permalink: '/rules/liquid/commentIndent/index.html'
anchors:
  describe:
    - Comment Indent
    - Rule Override
    - Rule Options
  options:
    - true
    - false
---

:: row
:: col-12 col-md-9

# Comment Indent

The `commentIndent` rule is a Liquid-specific formatting rule that applies single-level indentation to the content within Liquid block comments. By default, when no option is defined, this rule is set to `false`. However, the recommended setting is `true`, which enables the indentation feature for better readability of comment blocks.

> It's important to note that this rule currently only supports Liquid block type comments. Line type comments are not affected by this rule. The `commentIndent` rule exclusively handles block type Liquid tokens.

# Rule Override

The `commentIndent` rule interacts with another Liquid-specific rule called `commentPreserve`. When `commentPreserve` is enabled (set to `true`), it takes precedence and overrides the `commentIndent` rule. This override ensures that the original formatting within comments is maintained when preservation is deemed more important than enforcing a specific indentation style. Developers should be aware of this interaction when configuring their Liquid formatting rules, as it can impact the final appearance of their commented code.

- [Comment Preserve](/rules/liquid/commentPreserve/)

::
::

---

:: row
:: col-12 col-md-9

## true

Below is an example of how this rule works if it's enabled (`true`). Notice how after formatting when this rule is enabled that the inner contents of the Liquid comment tag regions are indented.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentIndent": true
  }
}
```

```liquid:before
{% comment %}
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus.
{% endcomment %}
```

```liquid:after
{% comment %}
  Lorem ipsum dolor sit amet consectetur,
  adipisicing elit. Officia eius neque autem
  molestias, doloribus.
{% endcomment %}
```

---

:: row
:: col-12 col-md-9

## false

The `commentIndent` rule is **disabled** by default, so Liquid comments do not apply indentation. Liquid block comment contents will have indentation removed in the sample when formatting.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentIndent": false
  }
}
```

<!-- prettier-ignore -->
```liquid:before
{% comment %}
  Lorem ipsum dolor sit amet consectetur,
  adipisicing elit. Officia eius neque autem
  molestias, doloribus.
{% endcomment %}
```

```liquid:after
{% comment %}
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus.
{% endcomment %}
```
