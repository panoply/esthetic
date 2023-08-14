---
title: 'Global Rules - End Newline'
layout: base
permalink: '/rules/global/endNewline/index.html'
describe:
  - End Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# End Newline

Whether or not files should end with an empty newline. This is a global rule definition and will be used for all languages. The **Recommended** option to use is `true` which will insert a newline at the end of documents.

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

::: rule 🧐

#### false

:::

The global `endNewline` rule is disabled (i.e: `false`) by default. This will result in newline occurrences at the end of documents/files to be stripped. In the below sample, the newline is removed after formatting.

```json:rules
{
  "language": "html",
  "endNewline": false
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<p>
  The newline at the end of this sample will be stripped.
</p>
</header>

```

---

::: rule 🧐

#### true

:::

When the global `endNewline` rule is enabled (i.e: `true`) then documents/files will always end with a newline. If a document ends with multiple newlines then they will be stripped and replaced with a single newline only.

```json:rules
{
 "esthetic": {
    "language": "html",
    "endNewline": true
  },
  "papyrus": {
    "trimEnd": false,
    "showLF": true
  }
}
```

<!-- prettier-ignore -->
```html
<header>
<h1>Hello World</h1>
<p>
  A newline will be inserted at the bottom of this sample
</p>
</header>
```
