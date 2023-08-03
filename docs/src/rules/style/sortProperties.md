---
title: 'Style - Sort Properties'
layout: base
permalink: '/rules/style/sortProperties/index.html'
anchors:
  - ''
---

# Sort Properties

The `sortProperties` rule will apply alphabetical sorting to style class selector properties..

---

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 🙌

#### true

:::

Lorem Ipsum

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "css",
  "style": {
    "sortProperties": true
  }
}
```

<!-- prettier-ignore -->
```css
.class {
  z-index: 999;
  color: #fff;
  width: 200px;
  background-repeat: no-repeat;
  background-position: top;
  background-attachment: fixed;
  font-weight: 100;
  font-style: bold;
  margin-top: 100px;
  display: flex;
  position: absolute;
  float: right;
  margin-left: 100px;
  padding-right: 25px;
  transition: ease-in;
  visibility: visible;
  padding-bottom: 40px;
  font-weight: 100;
  font-style: bold;
  padding-left: 25px;
  visibility: collapse;
  min-inline-size: inherit;
}
```

---

::: rule 👍

#### false

:::

```json:rules
{
  "language": "css",
  "style": {
    "sortProperties": false
  }
}
```

<!-- prettier-ignore -->
```css
.class {
  z-index: 999;
  color: #fff;
  width: 200px;
  background-repeat: no-repeat;
  background-position: top;
  background-attachment: fixed;
  font-weight: 100;
  font-style: bold;
  margin-top: 100px;
  display: flex;
  position: absolute;
  float: right;
  margin-left: 100px;
  padding-right: 25px;
  transition: ease-in;
  visibility: visible;
  padding-bottom: 40px;
  font-weight: 100;
  font-style: bold;
  padding-left: 25px;
  visibility: collapse;
  min-inline-size: inherit;
}
```
