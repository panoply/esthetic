---
title: 'Markup - Force Indent'
layout: base
permalink: '/rules/forceIndent/index.html'
---

:: row
:: col-12 col-md-9

# Force Indent

The `forceIndent` rule controls indentation of content and tags without regard of text nodes. By default, this rule is set to `false` which results in a context-sensitive approach to indentation. The `forceIndent` rule allow you to choose between a strictly uniform indentation style or a more adaptive style that maintains a compact code structure.

::
::

---

:: row
:: col-12 col-md-7 col-lg-6

## true

Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the text type nodes encapsulated within `<li></li>` tags are expressed inline.

::
::

```json:rules
{
  "language": "html",
  "forceIndent": true
}
```

```html:before
<ul>
  <li>Foo Inline</li>
  <li>Bar Inline</li>
  <li>Baz Inline</li>
  <li>Qux Inline</li>
</ul>
```

```html:after
<ul>
  <li>
    Foo Inline
  </li>
  <li>
    Bar Inline
  </li>
  <li>
    Baz Inline
  </li>
  <li>
    Qux Inline
  </li>
</ul>
```

---

:: row
:: col-12 col-md-7 col-lg-6

## false

When disabled, the formatter preserves the indentation structure of the input code. Instead of enforcing a consistent indentation style, Æsthetic mirrors the existing indentation in the source code. Newline breaks are only applied when a newline character is present in the input.

::
::

```json:rules
{
  "language": "html",
  "forceIndent": false
}
```

```html:before
<ul>
  <li>    Foo Inline
  </li>
  <li>
  Bar Newline</li>
  <li>  Baz Inline
  </li>
  <li>
  Qux Newline</li>
</ul>
```

```html:after
<ul>
  <li> Foo Inline </li>
  <li>
    Bar Newline
  </li>
  <li> Baz Inline </li>
  <li>
    Qux Newline
  </li>
</ul>
```
