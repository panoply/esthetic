---
title: 'Markup - Text Node List'
layout: base
permalink: '/rules/markup/textBoundInline/index.html'
---

:: row
:: col-12 col-md-9

# Text Bound Inline

Controls how text bound tags (i.e, tags surrounded by text content) should be formatted. By default, Æsthetic will respect input intent, and format tags in accordance with the implied structures.

::
::

---

:: row
:: col-12 col-md-9

## true (default)

Tags which are encapsulated by text content will remain inline and not adhere to atrribute line breaks for forced indentation. Instead, Æsthetic will format in accordance with structure.

::
::

```json:rules
{
  "language": "html",
  "wrap": 50,
  "markup": {
    "textBoundInline": true
  }
}
```

<!-- prettier-ignore -->
```html:before
Lorem ipsum dolor sit amet, consectetur adipiscing
elit, sed do eiusmod tempor incididunt ut labore
et dolore magna. <span id="c">baz hello world</span> lorem ipsum
<div id="a" class="b">yoo </div> qux foo <span> bar </span> baz
<header> <h1>Hello World</h1> <p> A newline will be inserted at
the bottom of this sample </p> </header>
```

```html:after
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
<span id="c" class="d">baz hello world</span> lorem ipsum
<div id="a" class="b">yoo </div> qux foo <span> bar </span> baz
<header> <h1>Hello World</h1> <p> A newline will be inserted at
the bottom of this sample </p> </header>
```

---

:: row
:: col-12 col-md-9

## false

Setting this option to `false` will apply formatting in accordance with current rulesets and tags which are encapsulated by text content will format without regard for placement.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "textBoundInline": false
  }
}
```

```html:before
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
<span id="c" class="d">baz hello world</span> lorem ipsum
<div id="a" class="b">yoo </div> qux foo <span> bar </span> baz
<header> <h1>Hello World</h1> <p> A newline will be inserted at
the bottom of this sample </p> </header>
```

```html:after
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
<span id="c" class="d">baz hello world</span> lorem ipsum
<div id="a" class="b">yoo </div> qux foo <span> bar </span> baz
<header> <h1>Hello World</h1> <p> A newline will be inserted at
the bottom of this sample </p> </header>
```
