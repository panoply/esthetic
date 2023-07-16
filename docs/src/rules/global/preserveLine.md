---
title: 'Global Rules - Indent Character'
layout: base
permalink: '/rules/global/preserveLine/index.html'
---

::: grid col-8 p-100

# Preserve Line

The maximum number of consecutive empty lines to retain (ie: preserve). By default, `3` newlines are preserved.

> This is a global option and it will be used for markup, json, styles and scripts languages.

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

Below is we instructed to Æsthetic to preserve `0` empty lines. Notice how before formatting the code has several empty newlines but after formatting all lines are stripped.

```json:rules
{
  "esthetic": {
    "language": "html",
    "preserveLine": 0
  },
  "papyrus": {
    "showLF": true
  }
}
```

<!-- prettier-ignore -->
```html
<ul>



  <li>Hello</li>

  <li>World</li>



</ul>


<div id="example">

  Lines




</div>
```
