---
title: 'Liquid - Line Break Logical'
layout: base
permalink: '/rules/liquid/lineBreakLogical/index.html'
---

:: row
:: col-12 col-md-9

# Line Break Logical

The `lineBreakLogical` rule controls the placement of logical joins found within Liquid conditional tags. Logical expressions are used to join multiple conditions together, in Liquid this accounts for `or` and `and` keyword names. The rule takes effect when conditional tags exceed word wrap and will align the logical keywords either to the right, left or leave them intact.

#### Related Rules

- [wrap](/rules/global/wrap/)
- [lineBreakSeparator](/rules/liquid/lineBreakSeparator/)
- [filterLineBreak](/rules/liquid/filterLineBreak/)
- [argumentLineBreak](/rules/liquid/argumentLineBreak/)

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
  "wrap": 40,
  "liquid": {
    "lineBreakLogical": "after"
  }
}
```

```liquid:before
{%
  if x > y
  and y > z
  or z > x
  or u == w
  and x == y
%}
  The logicals will be placed right
{% endif %}
```

```liquid:after
{%
  if x > y and
  y > z or
  z > x or
  u == w and
  x == y
%}
  The logicals will be placed right
{% endif %}
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
  "wrap": 40,
  "liquid": {
    "lineBreakLogical": "before"
  }
}
```

```liquid:before
{%
  if x > y and
  y > z or
  z > x or
  u == w and
  x == y
%}
  The logicals will be placed left
{% endif %}
```

```liquid:after
{%
  if x > y
  and y > z
  or z > x
  or u == w
  and x == y
%}
  The logicals will be placed right
{% endif %}
```
