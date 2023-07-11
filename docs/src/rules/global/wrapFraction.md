---
title: 'Global Rules - Wrap Fraction'
layout: base
permalink: '/rules/global/wrapFraction/index.html'
describe:
  - Wrap Fraction
  - Rule Options
---

:::: grid row pr-5

::: grid col-6 p-100 pl-5

# Wrap

The `wrapFraction` rule is secondary character limit used to applying forcing on token structures. Fractional wrapping applied forcing when at `¾` (or 75%) of the global [wrap](/rules/global/wrap) limit and is referenced by different rules.

:::

::: grid col-12 p-100 pl-5

# Example

Adjust the range to input to see how Æsthetic handles word wrap.

```json:rules
{
  "papyrus": {
    "editor": false
  },
  "example": {
    "rule": "wrapFraction",
    "min": 20,
    "max": 100,
    "value": 80,
    "step": 1
  },
  "esthetic": {
    "language": "liquid",
    "wrap": 100,
    "wrapFraction":80,
    "endNewline": false,
    "liquid": {
      "forceFilter": 0,
      "forceArgument": 0,
      "delimiterPlacement": "force-multiline"
    },
    "markup": {
      "forceIndent": true,
      "preserveText": false
    }
  }
}
```

<!-- prettier-ignore -->
```liquid
<header>
{% unless product.metafields.data == nil and product == nil %}

  {% form 'x', id: 'xxx', attr_1: 'foo', attr_2: 'bar' %}

    {{ settings.logo
          | replace: ',' , 'foo'
          | font_family: 'bold', '300', 'exec' }}

    {% render 'snippet', param_1: true, param_2: 1000 %}
  {% endform %}


  {% endunless %}
</header>
```

:::

::::
