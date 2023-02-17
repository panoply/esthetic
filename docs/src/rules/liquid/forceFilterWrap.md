---
title: 'Liquid - Force Filter Wrap'
layout: base
permalink: '/rules/liquid/forceFilterWrap/index.html'
---

# Force Filter Wrap

The character width limit to use on tags containing Liquid filters `|` before forcing is applied. Tags and output tokens will force filter filter expressions onto newlines when the token width exceed the limit defined. By default, this rule uses a value of `0` which will result in Liquid filters being forced when the tag or output token containing them spans ¾ (or 75%) of defined global [`wrap`](/rules/global/wrap) limit.

::: note

See [fractional wraps](/terminoligies#fractional-wraps) for more information regarding how fraction based limits are determined and calculated.

:::

##### RELATED_RULES

The `forceFilterWrap` rule will refer

---

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

#### 0 (default)

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

<!-- RULES ARE REQUIRED -->

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
