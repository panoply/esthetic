---
title: 'Markup - Line Break Value'
layout: base
permalink: '/rules/markup/lineBreakValue/index.html'
anchors:
  - Line Break Value
options:
  - 'preserve'
  - 'align'
  - 'indent'
  - 'force-preserve'
  - 'force-align'
  - 'force-indent'
---

# Line Break Value

Applies single indentation to containing content of HTML and XML comments which span multiple lines.

::: note

This rule only effects markup comments containing newlines. Inline markup comments which start and end on the same line will skipped.

:::

---

# Rule Options

This is a markup specific formatting rule which will be applied to HTML or XML comments. It will **default** to using `false` when no option has been specified and the **recommended** option to use is `true`.

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 👎

#### false

:::

The `commentIndent` rule is **disabled** by default, so Liquid comments do not apply indentation. Liquid block comment contents will have indentation removed in the sample when formatting.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "html",
  "markup": {
    "commentIndent": false
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  Indentation will be stripped
  Indentation will be stripped
-->
<div>
  <!--
    Indentation will be stripped
    Indentation will be stripped
  -->
  <nav>
    <ul>
      <li>Foo</li>
    </ul>
  </nav>
</div>
```

---

::: rule 🙌

#### true

:::

Below is an example of how this rule works if it's enabled (`true`). Notice how after formatting when this rule is enabled that the inner contents of the Liquid comment tag regions are indented.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentIndent": true
  }
}
```

<!-- prettier-ignore -->
```html
<!--
I am now indented
I am now indented
-->
<div>
  <!--
  I am now indented
  I am now indented
  -->
  <nav>
    <ul>
      <li>Foo</li>
    </ul>
  </nav>
</div>
```
