---
title: 'Global Rules - Indent Level'
layout: base
permalink: '/rules/global/indentLevel/index.html'
describe:
  - Indent Level
---

::: grid col-12 col-sm-9 p-100

# Indent Level

The `indentLevel` rule is typically used internally and will control the padding indentation to be applied.

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

#### `0`

:::

The default `indentLevel` is set to `0`

```json:rules
{
  "language": "html",
  "indentLevel": 0
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

---

::: rule 💡

#### `2`

:::

Below we are using an `indentLevel` value of `2`

```json:rules
{
  "language": "html",
  "indentLevel": 2
}
```

<!-- prettier-ignore -->
```html
<!--  2x Left Increment -->
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
    <!-- 2x Left Increment  -->
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

#### `5`

:::

Below we are using an `indentLevel` value of `5`

```json:rules
{
  "language": "html",
  "indentLevel": 4
}
```

<!-- prettier-ignore -->
```html
<!-- 4x Left Increment -->
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
        <!-- 4x Left Increment -->
        <header>
          <nav>
            <ul>
              <li>foo</li>
              <li>bar</li>
            </ul>
          </nav>
        </header>
```
