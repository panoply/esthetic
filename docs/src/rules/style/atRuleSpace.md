---
title: 'Style - At Rule Space'
layout: base
permalink: '/rules/style/atRuleSpace/index.html'
describe:
  - Delimiter Trims
  - Rule Options
options:
  - preserve
  - tags
  - outputs
  - never
  - always
  - multiline
---

::: grid col-9 p-100

# At Rule Space

Insert or strip whitespace of `@` at rules prefixed CSS rules and their starting parenthesis.
:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

---

::: rule 👍

#### true

:::

The `atRuleSpace` style rule is enabled (i.e: `true`) by default. The rule will ensure the `@` at rules will use a single whitespace occurrences before the starting parenthesis.

```json:rules
{
  "language": "css",
  "style": {
    "atRuleSpace": true
  }
}
```

<!-- prettier-ignore -->
```css

@media(min-width: 1200px) {
  .some-selector {
    font-size: 1.5rem;
    background-color: whitesmoke;
  }
}

@media(prefers-reduced-motion: reduce) {
 .foo {
    color: black;
    width: 200px;
    height: 200px;
  }
}

```

---

::: rule 🤡

#### false

:::

The `atRuleSpace` style rule is disabled (i.e: `false`) then `@` rule occurrences will have white stripped between the rule name and the starting parenthesis.

```json:rules
{
  "language": "css",
  "style": {
    "atRuleSpace": false
  }
}
```

<!-- prettier-ignore -->
```css

@media(min-width: 1200px) {
  .some-selector {
    font-size: 1.5rem;
    background-color: whitesmoke;
  }
}

@media(prefers-reduced-motion: reduce) {
 .foo {
    color: black;
    width: 200px;
    height: 200px;
  }
}

```
