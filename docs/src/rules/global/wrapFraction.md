---
title: 'Global Rules - Wrap Fraction'
layout: base
permalink: '/rules/global/wrapFraction/index.html'
describe:
  - Wrap Fraction
  - Rule Options
---

# Wrap Fraction

The `wrapFraction` rule is secondary character limit used to applying forcing on token structures. Fractional wrapping applied forcing when at `¾` (or 75%) of the global [wrap](/rules/global/wrap) limit and is referenced by different rules.

<!--
🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

# Example

Adjust the range to input to see how Æsthetic handles word wrap.

```json:rules
{
  "example": {
    "form": "range",
    "rule": "wrapFraction",
    "value": 90,
    "mode": "example"
  },
  "esthetic": {
    "language": "liquid",
    "wrapFraction": 50
  }
}
```

<!-- prettier-ignore -->
```liquid
{% # No forcing will be applied as only 2 filters exist %}
{{ object.prop | filter_1: 'value' | filter_2: 'xxx' }}

{% # Forcing is applied because there are 3 filters %}
{{ object.prop | filter_1: 'value' | filter_2: 'xxx' | filter_3: 'foo' }}

{% # No forcing will be applied as only 1 filter exists %}
{{ object.prop | filter_1: 'value' }}
```
