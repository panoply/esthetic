---
title: 'Style - Class Padding'
layout: base
permalink: '/rules/style/classPadding/index.html'
anchors:
  - ''
---

::: grid col-9 p-100

# Class Padding

The `classPadding` rule will insert a newline **before** and **after** the starting and ending structure of class selectors properties.

---

:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 🙌

#### false

:::

Lorem Ipsum

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "css",
  "style": {
    "classPadding": false
  }
}
```

<!-- prettier-ignore -->
```css
.class-a {
  width: 100px;
}
.class-b {
  width: 100px;
}
.class-c {
  width: 100px;
}
.class-d {
  width: 100px;
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
    "classPadding": true
  }
}
```

<!-- prettier-ignore -->
```css
.class-a {
  width: 100px;
}
.class-b {
  width: 100px;
}
.class-c {
  width: 100px;
}
.class-d {
  width: 100px;
}
```
