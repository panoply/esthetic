---
title: 'Global Rules - Indent Character'
layout: base
permalink: '/rules/preserveLine/index.html'
---

:: row
:: col-12 col-md-9

# Preserve Line

The maximum number of consecutive empty lines to retain (ie: preserve). By default, `3` newlines are preserved.

> This is a global option and it will be used for markup, json, styles and scripts languages.

::
::

---

:: row
:: col-12 col-md-9

## `0`

Below is we instructed to Æsthetic to preserve `0` empty lines. Notice how before formatting the code has several empty newlines but after formatting all lines are stripped.

::
::

```json:rules
{
  "language": "html",
  "preserveLine": 0
}
```

```html:before
<ul>

  <li>Hello</li>


  <li>World</li>


</ul>
<div id="example">

  Lines


</div>
```

```html:after
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
<div id="example">
  Lines
</div>
```
