---
title: 'Style - Sort Selectors'
layout: base
permalink: '/rules/style/sortSelectors/index.html'
anchors:
  - ''
---

# Sort Selectors

The `sortSelectors` rule will apply alphabetical sorting to style language class name selectors.

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
    "sortSelectors": false
  }
}
```

<!-- prettier-ignore -->
```css
.v,
.z,
.y,
.a,
.x > .a > .b,
.x > .c > .d,
.c > .d > .x,
.r,
.t > .v > .x,
.w,
.b,
.o {
  background-position: right top;
  background-attachment: fixed;
  font-weight: 100;
  font-style: bold;
  margin-top: 100px;
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
    "sortSelectors": true
  }
}
```

<!-- prettier-ignore -->
```css
.v,
.z,
.y,
.a,
.x > .a > .b,
.x > .c > .d,
.c > .d > .x,
.r,
.t > .v > .x,
.w,
.b,
.o {
  background-position: right top;
  background-attachment: fixed;
  font-weight: 100;
  font-style: bold;
  margin-top: 100px;
}
```
