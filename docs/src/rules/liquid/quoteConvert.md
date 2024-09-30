---
title: 'Liquid - Quote Convert'
layout: base
permalink: '/rules/liquid/quoteConvert/index.html'
anchors:
  describe:
    - Quote Convert
    - Rule Options
  options:
    - none
    - double
    - single
---

::: grid col-12

# Quote Convert

How quotation characters of markup attributes and Liquid tokens should be handled. Allows for conversion to single quotes or double quotes. Markup tag attributes should always use double quotations, it's the standard in languages like HTML.

:::

---

::: rule 🤡

#### none

:::

Below is an example of how this rule works if set to `none` which is the **default** setting. No conversion of quotations is applied when using `none` and one should consider setting a specific value.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "quoteConvert": "none"
  }
}
```

```liquid:before


{{ "string" | filter: 'string' }}

{% cycle 'one', 'two', "three", "four", 'five' %}


```

```liquid:after


{{ "string" | filter: 'string' }}

{% cycle 'one', 'two', "three", "four", 'five' %}


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
  }
}
```

```liquid:before


{{ 'string' | filter: 'string' }}

{% cycle 'one', 'two', 'three', 'four', 'five' %}


```

```liquid:after


{{ "string" | filter: "string" }}

{% cycle "one", "two", "three", "four", "five" %}


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
  }
}
```

```liquid:before

{{ "string" | filter: "string" }}

{% cycle "one", "two", "three", "four", "five" %}


```

```liquid:after


{{ 'string' | filter: 'string' }}

{% cycle 'one', 'two', 'three', 'four', 'five' %}


```
