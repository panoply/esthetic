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

Excluding regions of code, entire documents and token specific occurrences can be achieved a few different ways in Æsthetic. Code exclusion and preservation is handled differently depending on the method leveraged and language.

# Comments

Æsthetic supports inline ignore comments and developers.

##### esthetic-ignore

The `esthetic-ignore` comment can be used to exclude formatting on the entire document.

```liquid

// esthetic-ignore

/* esthetic-ignore */

<!-- esthetic-ignore -->

{% # esthetic-ignore %}

{% comment %} esthetic-ignore {% endcomment %}

```


##### esthetic-ignore-next

```html

<!-- esthetic-ignore-next -->

{% # esthetic-ignore-next %}

{% comment %} esthetic-ignore-next {% endcomment %}
```

##### esthetic-ignore-start → esthetic-ignore-end

```liquid

// esthetic-ignore-start
// esthetic-ignore-end

/* esthetic-ignore-start */
/* esthetic-ignore-end */

<!-- esthetic-ignore-start -->
<!-- esthetic-ignore-end -->

{% # esthetic-ignore-start %}
{% # esthetic-ignore-end %}

{% comment %} esthetic-ignore-start {% endcomment %}
{% comment %} esthetic-ignore-end {% endcomment %}

```


# Rules

