---
title: 'Global Rules - Indent Character'
layout: base
permalink: '/rules/global/indentChar/index.html'
---

::: grid col-12 col-sm-9 p-100

# Indent Char

The string characters to comprise a single indentation. Any string combination is accepted. Generally speaking, you should leave this alone unless you know what you are doing.

# Related Rule

The `indentSize` rule will use this character. For example, if you were to set `indentSize` to `4` then this character will be repeated 4 times, ie: `    ` - by default the `indentSize` is set to `2`.

- [indentSize](/rules/global/indentSize)

:::

---

<!--

# Rule Options

This is a global rule definition and will be used for all languages.

::: options

### `false`

> Strip additional newlines from the end of input.

### `true`

> Insert a newline at the end of input

:::

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

::: rule 💡

#### ` `

:::

The default `indentChar` is a single whitespace value.

```json:rules
{
  "language": "html",
  "indentChar": " "
}
```

```html:before
<header>
<nav>
<ul class="foo">
<li>bar</li>
<li>baz</li>
</ul>
</nav>
</header>
```

```html:after
<header>
  <nav>
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  </nav>
</header>
```

---

::: rule 💡

#### `\t`

:::

Below we are using tab `\t` character for indentation.

```json:rules
{
  "language": "html",
  "indentChar": "\t"
}
```

```html:before
<header>
  <nav>
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  </nav>
</header>
```

```html:after
<header>
  <nav>
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  </nav>
</header>
```
