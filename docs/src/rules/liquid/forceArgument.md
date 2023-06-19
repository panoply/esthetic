---
title: 'Liquid - Force Argument'
layout: base
permalink: '/rules/liquid/forceArgument/index.html'
describe:
  - Force Argument
  - Related Rules
  - Rule Options
options:
  - 0
  - 1
  - 2
  - 3
---

::: grid col-9 p-100

# Force Filter

Forces Liquid tag and filter argument expressions onto newlines. By default, this rule uses a value of `0` which will result in arguments being forced when the tag or output token containing them spans ¾ (or 75%) of defined global [`wrap`](/rules/global/wrap) limit.

> See [fractional wrapping](/terminologies#fractional-wrapping) for more information regarding how fraction based thresholds are determined and calculated.

# Related Rules

The `forceArgument`

- [`wrap`](/rules/liquid/wrap/)
- [`forceArgument`](/rules/liquid/forceArgument/)
- [`lineBreakSeparator`](/rules/liquid/lineBreakSeparator/)
- [`delimiterPlacement`](/rules/liquid/lineBreakSeparator/)

:::
