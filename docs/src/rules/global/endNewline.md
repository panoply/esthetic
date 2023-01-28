---
title: 'Global Rules - End Newline'
layout: base
permalink: '/rules/endNewline/index.html'
---

#### End Newline

Whether or not files should end with an empty newline.

::: note
If you are using Æsthetic within a text editor and this rule is undefined or omitted then your text editor settings will be used, in vscode that is `*.endWithNewline` where `*` is a language name. If an `.editorconfig` file is found present in root, those rules will be applied in **precedence** over your text editor settings.
:::

# Rule Options

This is a global rule definition and will be used for all languages.

#### Disabled `false`

The `endNewline` rule is **disabled** (`false`) by default. Documents will strip additional newlines from the end of input. In the below sample, notice how no newline follows the closing `</div>` tag.

<!-- prettier-ignore -->
```html
<div class="xxx">
  <!-- DOCUMENT WILL NOT END WITH AN EMPTY NEWLINE -->
<div>
```

#### Enabled `true`

When the `endNewline` rule is **enabled** (`true`)carriage return and line feed termination is used.

<!-- prettier-ignore -->
```html
<ul>␍␊
  <li>Foo</li>␍␊
  <li>Bar</li>␍␊
  <li>Baz</li>␍␊
</ul>␍␊
```
