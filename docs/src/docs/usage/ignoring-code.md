---
title: 'Ignoring Code'
layout: base
permalink: '/usage/ignoring-code/index.html'
prev:
  label: 'Format'
  uri: '/usage/format'
next:
  label: 'Parse'
  uri: '/usage/parse'
---

# Ignoring Code

Æsthetic provides flexible options for excluding specific code regions, entire documents, or token-specific occurrences from beautification, with methods varying by language and approach. These mechanisms ensure developers can preserve critical code structures or skip formatting where needed, maintaining control over the output. The most common way to exclude code from beautification is through special comment directives.

- Region ignores for large blocks of code with complex or sensitive formatting.
- Apply single-line ignores for quick, isolated exclusions with start/end markers.
- Document file-level ignores for files that should never be formatted.

> Æsthetic supports three distinct ignore comments, each serving a specific purpose to control exclusion points within documents. These comments are language-aware and designed to be intuitive for HTML, Liquid, and JSON workflows.

# Ignore Files

Place `esthetic-ignore` comments the start of a document to exclude the entire file from beautification. This is particularly helpful for files with highly customized or minified code that should not be altered.

:: row comments mt-4 mb-4
:: col-12 fc-white ff-head fs-sm
**HTML / XML**
::
:: col-10 ff-code fs-sm mb-4

```
<!-- esthetic-ignore -->
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Line**
::
:: col-10 ff-code fs-sm mb-4

```
{% # esthetic-ignore %}
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Block**
::
:: col-10 ff-code fs-sm mb-4

```
{% comments %} esthetic-ignore {% endcomment %}
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Line**
::
:: col-10 ff-code fs-sm mb-4

```
// esthetic-ignore
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Block**
::
:: col-10 ff-code fs-sm

```
/* esthetic-ignore */
```

::
::

---

# Region Ignores

Use `esthetic-ignore-start` and `esthetic-ignore-end` to exclude a specific block of code. Any code between these markers remains untouched during beautification. This is ideal for preserving complex or sensitive structures, such as inline scripts or custom Liquid tags, that might be disrupted by formatting.

:: row comments mt-4 mb-4
:: col-12 fc-white ff-head fs-sm
**HTML / XML**
::
:: col-12 ff-code fs-sm mb-2

```
<!-- esthetic-ignore-start -->
```

::
:: col-12 ff-code fs-sm mb-4

```
<!-- esthetic-ignore-start -->
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Line**
::
:: col-12 ff-code fs-sm mb-2

```
{% # esthetic-ignore-start %}
```

::
:: col-10 ff-code fs-sm mb-4

```
{% # esthetic-ignore-end %}
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Block**
::
:: col-12 ff-code fs-sm mb-2

```
{% comments %} esthetic-ignore-start {% endcomment %}
```

::
:: col-12 ff-code fs-sm mb-4

```
{% comments %} esthetic-ignore-end {% endcomment %}
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Line**
::
:: col-12 ff-code fs-sm mb-2

```
// esthetic-ignore-start
```

::
:: col-12 ff-code fs-sm mb-4

```
// esthetic-ignore-end
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Block**
::
:: col-12 ff-code fs-sm

```
/* esthetic-ignore-start */
```

::
:: col-12 ff-code fs-sm

```
/* esthetic-ignore-end */
```

::
::

---

# Next Ignores

Use `esthetic-ignore-next` comments to skip formatting for the line immediately following the comment. This is useful for isolated lines and contained blocks of code. Æsthetic will exclude formatting of the entire structure when annotated above containers of logic, up until the point where logic ends.

:: row comments mt-4 mb-4
:: col-12 fc-white ff-head fs-sm
**HTML / XML**
::
:: col-10 ff-code fs-sm mb-4

```
<!-- esthetic-ignore-next -->
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Line**
::
:: col-10 ff-code fs-sm mb-4

```
{% # esthetic-ignore-next %}
```

::
:: col-12 fc-white ff-head fs-sm
**Liquid Block**
::
:: col-10 ff-code fs-sm mb-4

```
{% comments %} esthetic-ignore-next {% endcomment %}
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Line**
::
:: col-10 ff-code fs-sm mb-4

```
// esthetic-ignore-next
```

::
:: col-12 fc-white ff-head fs-sm
**JSONC Block**
::
:: col-10 ff-code fs-sm

```
/* esthetic-ignore-next */
```

::
::
