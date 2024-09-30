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

# Comment Ignores

Æsthetic supports inline ignore comments which can be used within files. There are 3 different ignore comments available that can be used to control exclusion points within documents.

##### esthetic-ignore

The `esthetic-ignore` comment can be used to exclude formatting on the entire document.

::: grid comments

```liquid

// esthetic-ignore

/* esthetic-ignore */

<!-- esthetic-ignore -->

{% # esthetic-ignore %}

{% comment %} esthetic-ignore {% endcomment %}

```

:::

##### esthetic-ignore-next

::: grid comments

<!-- prettier-ignore -->
```liquid
// esthetic-ignore-next

/* esthetic-ignore-next */

<!-- esthetic-ignore-next -->

{% # esthetic-ignore-next %}

{% comment %} esthetic-ignore-next {% endcomment %}
```

:::

##### esthetic-ignore-start → esthetic-ignore-end

::: grid comments

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

:::
