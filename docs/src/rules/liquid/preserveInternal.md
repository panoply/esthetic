---
title: 'Liquid - Preserve Internal'
layout: base
permalink: '/rules/liquid/preserveInternal/index.html'
anchors:
  - ''
---

# RULE_NAME

Lorem Ipsum

::: note
Lorem Ipsum
:::

##### RELATED_RULES

Lorem Ipsum

---

# Rule Options

This is a LANGUAGE_NAME specific formatting rule which defaults to using `preserve` when no option has been specified.

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 👍

#### RULE_OPTION

:::

Lorem Ipsum

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "liquid",
  "liquid": {
    "preserveInternal": false
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
