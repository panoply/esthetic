---
title: 'Global Rules - Indent Character'
layout: base
permalink: '/rules/indentChar/index.html'
---

:: row mb-5
:: col-12 col-md-9

# Indent Char

The string characters to comprise a single indentation. Any string combination is accepted. The [`indentSize`](/rules/indentSize/) rule will use this character, so if (for example) you'd set `indentSize` to `4` then this character will be repeated 4 times.

#### Default

The `indentChar` rules will default to a single whitespace character.

:: row ai-center mb-4
:: col-8

```json:no-lines
{
  "indentChar": " "
}
```

::
::

#### Tabs

Using tab indentation is acheived when setting the `indentChar` to tab.

:: row ai-center
:: col-8

```json:no-lines
{
  "indentChar": "\t"
}
```

::
::

::
::

# Examples

:: row
:: col-12 col-md-9

## `" "`

The default `indentChar` is a single whitespace value.

::
::

```json:rules
{
  "language": "html",
  "indentChar": " "
}
```

```html:before
<header>
<nav>
<ul class="foo">
<li>bar</li>
<li>baz</li>
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

:: row
:: col-12 col-md-9

## `"\t"`

Below we are using tab `\t` character for indentation.

::
::

```json:rules
{
  "language": "html",
  "indentChar": "\t"
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
