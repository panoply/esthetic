---
title: 'Liquid - Filter Line Break'
layout: base
permalink: '/rules/liquid/filterLineBreak/index.html'
anchors:
  describe:
    - Filter Line Break
    - Related Rules
    - Defaults
    - Rule Options
  options:
    - 0
    - 1
    - 2
    - 3
---

::: grid col-12 col-sm-9 p-100

# Filter Line Break

Forces Liquid filter `|` expressions onto newlines when the number of filters contained on a tag exceeds the limit defined. By default, this rule uses a value of `0` which will result in Liquid filters being forced when the tag or output token containing them spans **¾** (or 75%) of defined global [`wrap`](/rules/global/wrap) limit. This is a Liquid specific formatting rule which defaults to using `0` when no option has been specified.

> See [fractional wrapping](/terminologies#fractional-wrapping) for more information regarding how fraction based thresholds are determined and calculated.

# Related Rules

The `argumentLineBreak`

- [`wrap`](/rules/liquid/wrap/)
- [`forceArgument`](/rules/liquid/forceArgument/)
- [`lineBreakSeparator`](/rules/liquid/lineBreakSeparator/)
- [`delimiterPlacement`](/rules/liquid/lineBreakSeparator/)

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do

-->

:::

---

::: rule 👍

#### 0

:::

By default, this rule uses a value of `0` which infers forcing to apply at a length ¾ (or 75%) of the defined global [`wrap`](/rules/global/wrap) limit. If your global wrap is set to `0` then no forcing is applied.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "liquid",
  "wrap": 50
}
```

<!-- prettier-ignore -->
```liquid:before

{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{{ object.prop
| filter_1: 'value'
| filter_2: 'xxx' | filter_3: 'foo' }}

{{ object.prop | filter_1: 'value' }}

```

```liquid:after

{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{{ object.prop
| filter_1: 'value'
| filter_2: 'xxx' | filter_3: 'foo' }}

{{ object.prop | filter_1: 'value' }}

```

---

::: rule 🙌

#### 3

:::

This is an example of the `filterLineBreak` using a value of `3` which will result in forcing only if the tag contains `3` or more filters. A tag with less than this number of filters will not have forcing applied (unless `wrap` is exceeded).

```json:rules
{
  "language": "liquid",
  "liquid": {
    "filterLineBreak": 3
  }
}
```

<!-- prettier-ignore -->
```liquid:before
{{ object.prop
| filter_1: 'value'
| filter_2: 'xxx' }}

{{ object.prop | filter_1: 'value' | filter_2: 'x' | filter_3: 'foo' }}

{{ object.prop
| filter_1: 'value' }}
```

```liquid:after

{{ object.prop
| filter_1: 'value'
| filter_2: 'xxx' }}

{{ object.prop | filter_1: 'value' | filter_2: 'x' | filter_3: 'foo' }}

{{ object.prop
| filter_1: 'value' }}
```

---
