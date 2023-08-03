---
title: 'Inline Control'
layout: base
permalink: '/usage/inline-control/index.html'
prev:
  label: 'Format'
  uri: '/usage/format'
next:
  label: 'Parse'
  uri: '/usage/parse'
---

# Inline Control

Æsthetic provides inline control options for developers using comments.

### Ignore File

<!--prettier-ignore-->
```html
<!-- esthetic-ignore -->

<div class="foo">
<ul>
<li>File will not be formatted</li>
</ul>
</div>
```

### Ignore Next

<!--prettier-ignore-->
```html

<!-- esthetic-ignore-next -->
<div class="foo">
This token will not be formatted
</div>

<ul>
  <li>This will format</li>
</ul>
```

### Ignore Region

<!--prettier-ignore-->
```html

<!-- esthetic-ignore-start -->
<div class="foo">
This token will not be formatted
</div>
<!-- esthetic-ignore-end -->

<ul>
  <li>This will format</li>
</ul>
```
