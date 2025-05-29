---
title: 'Global Rules - Indent Level'
layout: base
permalink: '/rules/indentLevel/index.html'
describe:
  - Indent Level
---

:: row
:: col-12 col-md-9

# Indent Level

The `indentLevel` rule is typically used internally and will control the padding indentation to be applied.

::
::

---

:: row
:: col-12 col-md-9

## `0`

The default `indentLevel` is set to `0`

::
::

```json:rules
{
  "language": "html",
  "indentLevel": 0
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

---

:: row
:: col-12 col-md-9

## `2`

Below we are using an `indentLevel` value of `2`

::
::

```json:rules
{
  "language": "html",
  "indentLevel": 2
}
```

```html:before
<!--  2x Left Increment -->
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
    <!-- 2x Left Increment  -->
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

## `5`

Below we are using an `indentLevel` value of `5`

::
::

```json:rules
{
  "language": "html",
  "indentLevel": 4
}
```

<!-- prettier-ignore -->
```html:before
<!-- 4x Left Increment -->
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
        <!-- 4x Left Increment -->
        <header>
          <nav>
            <ul>
              <li>foo</li>
              <li>bar</li>
            </ul>
          </nav>
        </header>
```
