---
title: 'Style - No Lead Zero'
layout: base
permalink: '/rules/style/noLeadZero/index.html'
anchors:
  - ''
---

# No Lead Zero

The `noLeadZero` rule will eliminate leading zeros from numbers expressed within values.

---

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 👍

#### false

:::

Lorem Ipsum

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "css",
  "style": {
    "noLeadZero": false
  }
}
```

<!-- prettier-ignore -->
```css
.class-a {
  width: 0.5px;
  height: 0.05rem;
  left: 0.1em;
  right: 0.50cm;
  top: 0.3ch;
}
```

---

::: rule 👍

#### true

:::

```json:rules
{
  "language": "css",
  "style": {
    "noLeadZero": true
  }
}
```

<!-- prettier-ignore -->
```css
.class-a {
  width: 0.5px;
  height: 0.05rem;
  left: 0.1em;
  right: 0.50cm;
  top: 0.3ch;
}
```
