---
title: 'Liquid - Line Break Logical'
layout: base
permalink: '/rules/liquid/lineBreakLogical/index.html'
anchors:
  describe:
    - Line Break Logical
    - Related Rules
    - Rule Options
  options:
    - preserve
    - after
    - before
    - wrap
---

::: grid col-12 p-100

# Line Break Logical

The `lineBreakLogical` rule controls the placement of logical joins found within Liquid conditional tags. Logical expressions are used to join multiple conditions together, in Liquid this accounts for `or` and `and` keyword names. The rule takes effect when conditional tags exceed word wrap and will align the logical keywords either to the right, left or leave them intact.

# Related Rules

- [wrap](/rules/global/wrap/)
- [lineBreakSeparator](/rules/liquid/lineBreakSeparator/)
- [filterLineBreak](/rules/liquid/filterLineBreak/)
- [argumentLineBreak](/rules/liquid/argumentLineBreak/)

:::

---

::: rule 👎

#### after

:::

Below is an example of how this rule works if set to `before` which is recommended approach. This will ensure all operator separators begin at the start of arguments. Notice how **before** formatting the comma separators are placed at the end of each parameter argument but **after** formatting they are moved to the start.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "lineBreakLogical": "after"
  }
}
```

<!-- prettier-ignore -->
```liquid
{% # All argument comma separators will be placed at the end %}
{% render 'snippet'
  , param_1: true
  , param_2: 1000
  , param_3: 'string'
  , param_4: nil %}

{% if condition == assertion %}

  {{ object.prop
    | param_1: true
    | param_2: 1000
    | param_3: arg_1: 'value', arg_2: 2000, arg_3: false, arg_4: nil
    | param_4: 'xxxx' }}

{% endif %}
```

---

::: rule 🙌

#### before

:::

Below is an example of how this rule works if set to `default` which is the **default** setting and will leave operator placement intact. Notice in the example how the comma separator of `param_1` begins at the end of the argument whereas the comma separator of `param_3` and `param_4` begins at the start.

```json:rules
{
  "language": "liquid",
  "wrap": 0,
  "liquid": {
    "lineBreakLogical": "before"
  }
}
```

<!-- prettier-ignore -->
```liquid
{% # Comma separated args will be placed before expression %}
{% render 'snippet',
  param_1: true,
  param_2: 1000,
  param_3: 'string',
  param_4: nil %}

{% if condition == assertion %}

{% # Comma separated args will be placed before expression %}
  {{
    object.prop
    | filter:
     arg_1: 'foo',
     arg_2: 2000,
    arg_3: false,
    arg_4: nil
    | append: 'xxx'
    }}

{% endif %}
```
