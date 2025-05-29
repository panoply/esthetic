---
title: 'Global Rules - End Newline'
layout: base
permalink: '/rules/endNewline/index.html'
anchors:
  describe:
    - End Newline
  options:
    - false
    - true
---

:: row
:: col-12 col-md-9

# End Newline

Whether or not formatted content should conclude with an empty newline character. It functions as a global setting, applying uniformly across all supported languages in your project. The recommended configuration is to set this option to `true`, which instructs the formatter to automatically append a newline at the end of each file. Ending files with a newline is widely considered a best practice in software development. This approach enhances compatibility with various tools and systems that expect files to terminate with a newline.

> It is recommend to keep this set to `true` to align with the POSIX standard, which defines a line as a sequence of characters followed by a newline and prevent certain issues that may arise in version control systems.

::
::

---

:: row
:: col-12 col-md-9

## false

The global `endNewline` rule is disabled (i.e: `false`) by default. This will result in newline occurrences at the end of documents/files to be stripped. In the below sample, the newline is removed after formatting.

::
::

```json:rules
{
  "language": "html",
  "endNewline": false
}
```

```html:before
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus corrupti nulla totam
atque libero, iusto est asperiores, culpa
blanditiis provident!

```

```html:after
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus corrupti nulla totam
atque libero, iusto est asperiores, culpa
blanditiis provident!
```

---

:: row
:: col-12 col-md-9

## true

When the global `endNewline` rule is enabled (i.e: `true`) then documents/files will always end with a newline. If a document ends with multiple newlines then they will be stripped and replaced with a single newline only.

::
::

```json:rules
{
  "language": "html",
  "endNewline": true
}
```

```html:before
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus corrupti nulla totam
atque libero, iusto est asperiores, culpa
blanditiis provident!
```

```html:after
Lorem ipsum dolor sit amet consectetur,
adipisicing elit. Officia eius neque autem
molestias, doloribus corrupti nulla totam
atque libero, iusto est asperiores, culpa
blanditiis provident!

```
