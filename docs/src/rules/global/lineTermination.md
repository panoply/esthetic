---
title: 'Global Rules - CRLF'
layout: base
permalink: '/rules/lineTermination/index.html'
anchors:
  - 'CRLF'
  - false
  - true
---

:: row
:: col-12 col-md-9

# Line Termination

If line termination should be Windows **CRLF** (CR = Carriage Return and LF = Line Feed) format. By default, Unix **LF** format is used. Setting this value to `true` will use CRLF.

::
::

---

:: row
:: col-12 col-md-9

## LF

This rule is **disabled** by default and line feed termination is used.

::
::

```json:rules
{
  "language": "html",
  "lineTermination": "LF"
}
```

```html:before
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```

```html:after
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```

---

:: row
:: col-12 col-md-9

## CRLF

When the rule is **enabled** carriage return and line feed termination is used.

::
::

```json:rules
{
  "language": "html",
  "lineTermination": "CRLF"
}
```

```html:before
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```

```html:after
<ul>
  <li>Foo</li>
  <li>Bar</li>
  <li>Baz</li>
</ul>
```
