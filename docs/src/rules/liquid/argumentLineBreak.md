---
title: 'Liquid - Argument Line Break'
layout: base
permalink: '/rules/liquid/argumentLineBreak/index.html'
describe:
  - Argument Line Break
  - Related Rules
  - Rule Options
options:
  - 0
  - 1
  - 2
  - 3
---

::: grid col-12 col-sm-9 p-100

# Argument Line Break

Forces Liquid tag and filter argument expressions onto newlines. By default, this rule uses a value of `0` which will result in arguments being forced when the tag or output token containing them spans ¾ (or 75%) of defined global [`wrap`](/rules/global/wrap) limit.

> See [fractional wrapping](/terminologies#fractional-wrapping) for more information regarding how fraction based thresholds are determined and calculated.

# Related Rules

- [`wrap`](/rules/liquid/wrap/)
- [`filterLineBreak`](/rules/liquid/filterLineBreak/)
- [`lineBreakSeparator`](/rules/liquid/lineBreakSeparator/)
- [`delimiterPlacement`](/rules/liquid/lineBreakSeparator/)

:::

---

::: rule 👍

#### 0

:::

By default, this rule uses a value of `0` which infers forcing to apply at a length ¾ (or 75%) of the defined global [`wrap`](/rules/global/wrap) limit. If your global wrap is set to `0` then no forcing is applied.

<!-- RULES ARE REQUIRED -->

```json:rules@500
{
  "language": "liquid",
  "wrap": 80,
  "liquid": {
    "argumentLineBreak": 3,
    "filterLineBreak": 3,
    "lineBreakSeparator": "after"
  }
}
```

<!-- prettier-ignore -->
```liquid

{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{% render 'snippet',
param_1: true, param_2: 1000,
param_3: 'string', param_4: nil %}


<div id="foo" class="bar baz">

  {%
   unless product.title == nil
    and product.price == nil
    and product.currency == nil
    and product.description == nil
    and product.metafields.data.field.value == nil %}

{% form 'some-form',
  id: 'some-long-id',
  attr_1: 'foo',
  attr_2: 'bar',
  attr_3: 'baz',
  attr_4: 'xxx' %}

        {% endform %}

        {% endunless %}

<section data-id="qux" aria-label="{{ object.prop }}">
{% assign x = settings.logo
  | image_url: width: 500
  | image_tag:
   class: 'header__heading-logo motion-reduce',
    widths: '50, 100, 150', height: logo_height, foo: bar: 'bax'
  | replace: ',' , 'foo' | font_family: 'bold', '300', 'exec' %}
  </section>
</div>
```

---

::: rule 🙌

#### 3

:::

This is an example of the `filterLineBreak` using a value of `3` which will result in forcing only if the tag contains `3` or more filters. A tag with less than this number of filters will not have forcing applied (unless `wrap` is exceeded).

```json:rules
{
  "language": "liquid",
  "wrap": 80,
  "wrapFraction": 40,
  "liquid": {
    "argumentLineBreak": 4,
    "filterLineBreak": 3,
    "lineBreakSeparator": "after"
  }
}
```

<!-- prettier-ignore -->
```liquid

{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{% render 'snippet',
param_1: true, param_2: 1000,
param_3: 'string', param_4: nil %}


<div id="foo" class="bar baz">
<section data-id="qux" aria-label="{{ object.prop }}">
{% assign x = settings.logo
  | image_url: width: 500
  | image_tag:
   class: 'header__heading-logo motion-reduce'
  , widths: '50, 100, 150, 200, 250, 300, 400, 500',
  height: logo_height, width: settings.logo_width
  ,
   alt: logo_alt
  | replace: ',' , 'foo'
  | font_family: 'bold', '300', 'exec'
   | image_url: width: 500 %}
  </section>
</div>
```

---
