---
title: 'Style  - Comment Newline'
layout: base
permalink: '/rules/style/commentNewline/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Comment Newline

Inserts a new line above comment tags. When enabled the rule will add a newline even if `preserveLine` is set to `0`. The rule will not inject new lines when the previous expression is determined to already contain a new line.

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

:::

---

::: rule 👎

#### false

:::

The `commentNewline` rule is **disabled** by default. HTML comments will not insert a newline above comments.

```json:rules
{
  "language": "css",
  "style": {
    "commentNewline": false
  }
}
```

```css
.class-0 {
  width: 100%;
  height: 100%;
  /* some comment */
  padding: 1em 3.8em;
  overflow: auto;
}
/* some comment */
.class-1 {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  /* some comment */
  margin: 0;
  /* some comment */
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```

---

::: rule 🙌

#### true

:::

When the style `commentNewline` rule is enabled (i.e: `true`) then newlines will be inserted above the comments. The first comment in the example below will have a newline inserted. The second comment will remain intact as a newline already exists.

```json:rules
{
  "language": "css",
  "style": {
    "commentNewline": true
  }
}
```

```css
.class-0 {
  width: 100%;
  height: 100%;
  /* some comment */
  padding: 1em 3.8em;
  overflow: auto;
}
/* some comment */
.class-1 {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  /* some comment */
  margin: 0;
  /* some comment */
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```
