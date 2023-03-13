---
title: 'Liquid - Force Filter'
layout: base
permalink: '/rules/liquid/forceFilter/index.html'
describe:
  - Filter Wrap
  - Related Rules
  - Defaults
  - Rule Options
options:
  - 0
  - 1
  - 2
  - 3
---

# Force Filter

Forces Liquid filter `|` expressions onto newlines when the number of filters contained on a tag exceeds the limit defined. By default, this rule uses a value of `0` which will result in Liquid filters being forced when the tag or output token containing them spans **¾** (or 75%) of defined global [`wrap`](/rules/global/wrap) limit.

::: note

See [fractional wrapping](/terminologies#fractional-wrapping) for more information regarding how fraction based thresholds are determined and calculated.

:::

# Related Rules

The `forceArgument`

- [`wrap`](/rules/liquid/wrap/)
- [`forceArgument`](/rules/liquid/forceArgument/)
- [`lineBreakSeparator`](/rules/liquid/lineBreakSeparator/)
- [`delimiterPlacement`](/rules/liquid/lineBreakSeparator/)

# Rule Options

This is a Liquid specific formatting rule which defaults to using `0` when no option has been specified.

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 👍

#### 0

:::

By default, this rule uses a value of `0` which infers forcing to apply at a length ¾ (or 75%) of the defined global [`wrap`](/rules/global/wrap) limit. If your global wrap is set to `0` then no forcing is applied.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "liquid",
  "wrap": 30,
  "liquid": {
    "forceFilter": 0
  }
}
```

<!-- prettier-ignore -->
```html

```

---

::: rule 🙌

#### 3

:::

This is an example of the `forceFilter` using a value of `3` which will result in forcing only if the tag contains `3` or more filters. A tag with less than this number of filters will not have forcing applied (unless `wrap` is exceeded).

```json:rules
{
  "language": "liquid",
  "wrap": 0,
  "liquid": {
    "forceFilter": 3
  }
}
```

<!-- prettier-ignore -->
```html

{% # No forcing will be applied as only 2 filters exist %}
{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{% # Forcing is applied because there are 3 filters %}
{{ object.prop | filter_1: 'value' | filter_2: 'xxx' | filter_3: 'foo' }}

{% # No forcing will be applied as only 1 filter exists %}
{{ object.prop | filter_1: 'value' }}
```

---
