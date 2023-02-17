---
title: 'Global Rules - End Newline'
layout: base
permalink: '/rules/global/endNewline/index.html'
---

# End Newline

Whether or not files should end with an empty newline.

::: note
If you are using Æsthetic within a text editor and this rule is undefined or omitted then your text editor settings will be used, in vscode that is `*.endWithNewline` where `*` is a language name. If an `.editorconfig` file is found present in root, those rules will be applied in **precedence** over your text editor settings.
:::

# Rule Options

This is a global rule definition and will be used for all languages.

::: options

### `false`

> Strip additional newlines from the end of input.

### `true`

> Insert a newline at the end of input

:::

# Example

Toggle the sample below to see how this rule works.

<!-- prettier-ignore -->
```html
<html>
<head>
<title>Æsthetic | End Newline</title>
</head>
<body>
<main class="container">
<div id="xxx">
<ul>
<li>Foo</li>
<li>Bar</li>
<li>Baz</li>
</ul>
</div>
</main>
</body>
</html>
```
