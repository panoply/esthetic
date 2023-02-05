---
title: 'Global Rules - CRLF'
layout: base
permalink: '/rules/global/crlf/index.html'
---

# CRLF

If line termination should be Windows **CRLF** (CR = Carriage Return and LF = Line Feed) format. By default, Unix **LF** format is used. Setting this value to `true` will use CRLF.

::: note
If you are unsure which setting to use then leave this set to `false` - CRLF terminations are typically rare.
:::

# Rule Options

This is a global rule definition and will be used for all languages.

#### Disabled `false`

This rule is **disabled** by default and line feed termination is used.

<!-- prettier-ignore -->
```html
<ul>␊
  <li>Foo</li>␊
  <li>Bar</li>␊
  <li>Baz</li>␊
</ul>␊
```

#### Enabled `true`

When the rule is **enabled** carriage return and line feed termination is used.

<!-- prettier-ignore -->
```html
<ul>␍␊
  <li>Foo</li>␍␊
  <li>Bar</li>␍␊
  <li>Baz</li>␍␊
</ul>␍␊
```
