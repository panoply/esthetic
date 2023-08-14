---
title: 'Markup - Comment Newline'
layout: base
permalink: '/rules/markup/commentNewline/index.html'
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

The `commentNewline` rule is **disabled** by default. HTML comments will not insert a newline above comments. Notice how the HTML type comment tag immediately following the `<li>` nodes will only adhere to the `preserveLine` global rule.

```json:rules
{
  "language": "html",
  "markup": {
    "commentNewline": false
  }
}
```

```html
<ul>
  <li>Hello</li>
  <!--
    No newline will be inserted above
  -->
  <li>World</li>

  <!--
    The newline above will be preserve unless the global
    preserveLine rule has been set to 0 (defaults to 3).
  -->
  <li>How are you?</li>
</ul>
```

---

::: rule 🙌

#### true

:::

When the markup `commentNewline` rule is enabled (i.e: `true) then newlines will be inserted above the comments. The first comment in the example below will have a newline inserted. The second comment will remain intact as a newline already exists.

```json:rules
{
  "language": "html",
  "markup": {
    "commentNewline": true
  }
}
```

```html
<ul>
  <li>Hello</li>
  <!--
   A newline will be added above me
  -->
  <li>World</li>

  <!--
   I already have a newline contained above me
   so no lines will be inserted.
  -->
  <li>How are you?</li>
</ul>
```
