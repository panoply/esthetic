---
title: 'Liquid - Line Break Separator'
layout: base
permalink: '/rules/liquid/lineBreakSeparator/index.html'
anchors:
  - Line Break Separator
  - Related Rules
  - Rule Options
  - After
  - Before
---

# Line Break Separator

The `lineBreakSeparator` rule controls the placement of separator type characters used within tag arguments which span multiple lines. Liquid tags which contain newlines with arguments separated using an operator inferred character (typically a comma `,`) are deemed a multiline expression by Æsthetic and will apply forcing in accordance with wrap rules. This option will allow you to control the placement of separators used in multiline expression structures.

::: note

This rule only applied to Liquid separators. Filter pipes `|` characters are not augmented.

:::

##### Related Rules

The `lineBreakSeparator` rule is typically used together with the Liquid `forceArgumentWrap` rule defined the wrap strategy to use when Liquid output or tag type tokens contain **multiple** filters and/or arguments. By default, Æsthetic will applying forcing when structures exceed ¾ (or 75%) of the global [`wrap`](/rules/global/wrap) limit.

- [`forceFilterWrap`](/rules/liquid/forceFilterWrap/)
- [`forceArgumentWrap`](/rules/liquid/forceFilterWrap/)

#####

---

# Rule Options

This is a Liquid specific formatting rule which will **default** to `after` when no option has been specified. The **recommended** option to use is `before`.

::: rule 👎

#### after

:::

_Below is an example of how this rule works if set to `before` which is recommended approach. This will ensure all operator separators begin at the start of arguments. Notice how **before** formatting the comma separators are placed at the end of each parameter argument but **after** formatting they are moved to the start._

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "after",
    "forceFilters": 2
  }
}
```

<!-- prettier-ignore -->
```html
{% # All argument comma separators will be placed at the end %}
{% render 'snippet',
  param_1: true,
  param_2: 1000
  , param_3: 'string'
  , param_4: nil %}

{% if condition == assertion %}

  {% # Filter argument using a comma separator will be placed at the end  %}
  {{ object.prop
    | param_1: true,
    | param_2: 1000
    | param_3:
    arg_1: 'value'
    , arg_2: 2000
    , arg_3: false
    , arg_4: nil
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
  "liquid": {
    "delimiterPlacement": "before",
    "forceFilters": 2
  }
}
```

<!-- prettier-ignore -->
```html
{% # All argument comma separators will be placed at before expression %}
{% render 'snippet',
  param_1: true,
  param_2: 1000
  , param_3: 'string'
  , param_4: nil %}

{% if condition == assertion %}

  {% # Filter argument using a comma separator will be placed before expressions %}
  {{ object.prop
    | param_1: true
    | param_2: 1000
    | param_3:
    arg_1: 'value',
    arg_2: 2000,
    arg_3: false,
    arg_4: nil
    | param_4: 'xxxx' }}

{% endif %}
```

---

::: rule 🤡

#### preserve

:::

The `inferred` option will preserve the order of separator type characters. When using inferred, separators can be placed before and after arguments. Level (indentation) applied during the beautification cycle respects the structural intent.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "preserve",
    "forceFilters": 2
  }
}
```

<!-- prettier-ignore -->
```html
{% # Inline open and close delimiters are preserved %}
{{ object.prop | filter: 'value' }}

{% # Forced open and close delimiters are preserved %}
{{
  object.prop | filter: 'value'
}}

{% # Forced open and inline close delimiters are preserved %}
{{
  object.prop | filter: 'value' }}

{% # Inline open and forced close delimiters are preserved %}
{{ object.prop
  | filter: 'value'
  | append: 'sample'
}}
```

---
