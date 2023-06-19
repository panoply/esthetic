---
title: 'Global Rules - CRLF'
layout: base
permalink: '/rules/global/crlf/index.html'
---

::: grid col-9 p-100

# CRLF

If line termination should be Windows **CRLF** (CR = Carriage Return and LF = Line Feed) format. By default, Unix **LF** format is used. Setting this value to `true` will use CRLF.

:::

---

::: rule 👍

#### false

:::

```json:rules
{
  "esthetic": {
    "language": "html",
    "crlf": false
  },
  "papyrus": {
    "showCRLF": true
  }
}
```

This rule is **disabled** by default and line feed termination is used.

<!-- prettier-ignore -->
```liquid
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```

---

::: rule 👎

#### true

:::

When the rule is **enabled** carriage return and line feed termination is used.

```json:rules
{
  "esthetic": {
    "language": "html",
    "crlf": true
  },
  "papyrus": {
    "showCRLF": true
  }
}
```

<!-- prettier-ignore -->
```liquid
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```
