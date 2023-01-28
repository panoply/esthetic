---
title: 'Global Rules - Indent Character'
layout: base
permalink: '/rules/preserveLine/index.html'
---

# Preserve Line

The maximum number of consecutive empty lines to retain (ie: preserve). By default, `3` newlines are preserved.

#### Note

This is a global option and it will be used for markup, json, styles and scripts languages.

# Example

Below is we instructed to Prettify to preserve only `1` empty line. Notice how before formatting the code has several empty newlines but after formatting only a single line is retained.

###### BEFORE FORMATTING

<!-- prettier-ignore -->
```html
<ul>

  <li>Hello</li>

  <li>World</li>
</ul>


<div id="example">

  Lines


</div>
```

###### AFTER FORMATTING

<!-- prettier-ignore -->
```html
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
<div id="example">
  Lines
</div>
```
