---
title: 'Global Rules - Indent Size'
layout: base
permalink: '/rules/global/indentSize/index.html'
describe:
  - Indent Size
  - Rule Options
---

::: grid col-8 p-100

# Indent Size

The number of `indentChar` values to comprise a single indentation. By default this is set to `2` meaning a single indentation will be 2 whitespace characters.

#### How to use Tabs?

If you're heathen who prefers Tabs, then you will need to set the `indentChar` to `\t` and infer the size limit here.

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

Below is we have set the `indentSize` to `4` - Notice how the indentation increases by `2` after formatting.

```json:rules
{
  "language": "html",
  "indentSize": 4
}
```

<!-- prettier-ignore -->
```html
<header>
<nav>
<ul class="foo">
<li>bar</li>
<li>baz</li>
</ul>
</nav>
</header>
```
