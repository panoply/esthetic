---
title: 'Liquid - Quote Convert'
layout: base
permalink: '/rules/liquid/quoteConvert/index.html'
describe:
  - Quote Convert
  - Rule Options
options:
  - none
  - double
  - single
---

# Quote Convert

How quotation characters of markup attributes and Liquid tokens should be handled. Allows for conversion to single quotes or double quotes. Markup tag attributes should always use double quotations, it's the standard in languages like HTML.

::: note

When working with Liquid, use `single` quotes for strings and always infer `double` in the markup.

:::

# Rule Options

::: rule 🤡

#### none

:::

Below is an example of how this rule works if set to `none` which is the **default** setting. No conversion of quotations is applied when using `none` as per the **before** and **after** examples

```json:rules
{
  "language": "liquid",
  "liquid": {
    "quoteConvert": "none"
  },
  "markup": {
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html

{% if 'some-string' %}

  {{ "string" | filter: 'string' }}

  {% cycle 'one', 'two', "three", "four", 'five' %}

{% endif %}

```

---

::: rule 👎

#### double

:::

Below is an example of how this rule works if set to `double` which will go about converting and ensuring all markup quotations are using doubles.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "quoteConvert": "double"
  },
  "markup": {
    "forceAttribute":  true
  }
}
```

<!-- prettier-ignore -->
```html
{% if 'some-string' %}

  {{ 'string' | filter: 'string' }}

  {% cycle 'one', 'two', 'three', 'four', 'five' %}

{% endif %}
```

---

::: rule 🙌

#### single

:::

Below is an example of how this rule works if set to `single` which will go about converting and ensuring all markup quotations are using singles.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "quoteConvert": "single"
  },
  "markup": {
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
{% if "some-string" %}

  {{ "string" | filter: "string" }}

  {% cycle "one", "two", "three", "four", "five" %}

{% endif %}
```
