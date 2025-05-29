---
title: 'Liquid - Line Break Separator'
layout: base
permalink: '/rules/liquid/lineBreakSeparator/index.html'
describe:
  - Line Break Separator
  - Related Rules
  - Rule Options
options:
  - preserve
  - after
  - before
---

:: row
:: col-12 col-md-9

# Line Break Separator

The `lineBreakSeparator` rule controls the placement of separator type characters used within tag arguments which span multiple lines. Liquid tags which contain newlines with arguments separated using an operator inferred character (typically a comma `,`) are deemed a multiline expression by Æsthetic and will apply forcing in accordance with wrap rules. This option will allow you to control the placement of separators used in multiline expression structures.

> Æsthetic does not support `=` character inferred assertions. It expects nested arguments follow `:` parameter expressions.

This is a Liquid specific formatting rule which will **default** to `after` when no option has been specified. The **recommended** option to use is `before`.

#### Related Rules

The `lineBreakSeparator` rule is typically used together with the Liquid `argumentWrap` rule defined the wrap strategy to use when Liquid output or tag type tokens contain **multiple** filters and/or arguments. By default, Æsthetic will applying forcing when structures exceed `¾` (or 75%) of the global [wrap](/rules/global/wrap) limit.

- [filterWrap](/rules/liquid/filterWrap/)
- [argumentWrap](/rules/liquid/argumentWrap/)
- [wrapFraction](/rules/liquid/wrapFraction/)

::
::

---

:: row
:: col-12 col-md-9

## after

Below is an example of how this rule works if set to `before` which is recommended approach. This will ensure all operator separators begin at the start of arguments. Notice how **before** formatting the comma separators are placed at the end of each parameter argument but **after** formatting they are moved to the start.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "lineBreakSeparator": "after"
  }
}
```

```liquid:before
{% render 'snippet'
  , param_1: true
  , param_2: 1000
  , param_3: 'string'
  , param_4: nil
  , param_5: false
%}
```

```liquid:after
{% render 'snippet',
  param_1: true,
  param_2: 1000,
  param_3: 'string',
  param_4: nil,
  param_5: false
%}
```

---

:: row
:: col-12 col-md-9

## before

Below is an example of how this rule works if set to `default` which is the **default** setting and will leave operator placement intact. Notice in the example how the comma separator of `param_1` begins at the end of the argument whereas the comma separator of `param_3` and `param_4` begins at the start.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "lineBreakSeparator": "before"
  }
}
```

```liquid:before
{% render 'snippet',
  param_1: true,
  param_2: 1000,
  param_3: 'string',
  param_4: nil,
  param_5: false
%}
```

```liquid:after
{% render 'snippet'
  , param_1: true
  , param_2: 1000
  , param_3: 'string'
  , param_4: nil
  , param_5: false
%}
```

---

:: row
:: col-12 col-md-9

## preserve

Preserve the placement of separators.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "lineBreakSeparator": "preserve"
  }
}
```

```liquid:before
{% render 'snippet',
  param_1: true
  , param_2: 1000,
  param_3: 'string'
  , param_4: nil
  , param_5: false
%}
```

```liquid:after
{% render 'snippet',
  param_1: true
  , param_2: 1000,
  param_3: 'string'
  , param_4: nil
  , param_5: false
%}
```
