---
title: 'Style - Comment Indent'
layout: base
permalink: '/rules/style/commentIndent/index.html'
describe:
  - Comment Indent
  - Rule Options
options:
  - false
  - true
---

::: grid col-9 p-100

# Comment Indent

Applies single indentation to containing content of style (block) comments which span multiple lines. This is a style specific formatting rule which will be applied to CSS and SCSS Languages. It will **default** to using `false` when no option has been specified and the **recommended** option to use is `true`.

---

::: rule 👎

#### false

:::

The `commentIndent` rule is **disabled** by default, so style block comments do not apply indentation. Style block comment contents will have indentation removed in the sample when formatting.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "css",
  "style": {
    "commentIndent": false,
    "commentNewline": false
  }
}
```

<!-- prettier-ignore -->
```css
.class-0 {
  width: 100%;
  height: 100%;
  /*
  *some comment
  */
  padding: 1em 3.8em;
  overflow: auto;
}
/*
* some comment
*/
.class-1 {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  /*
  *some comment
  */
  margin: 0;
 /*
  *some comment
  */
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```

---

::: rule 🙌

#### true

:::

Below is an example of how this rule works if it's enabled (`true`). Notice how after formatting when this rule is enabled that the inner contents of the Style block comments are indented.

```json:rules
{
  "language": "css",
  "style": {
    "commentIndent": true
  }
}
```

<!-- prettier-ignore -->
```css
.class-0 {
  width: 100%;
  height: 100%;
  /*
  *some comment
  */
  padding: 1em 3.8em;
  overflow: auto;
}
/*
*some comment
*/
.class-1 {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  /*
  * some comment
  */
  margin: 0;
 /*
  *some comment
  */
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```
