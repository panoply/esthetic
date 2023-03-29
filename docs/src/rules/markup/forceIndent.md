---
title: 'Markup - Force Indent'
layout: base
permalink: '/rules/markup/forceIndent/index.html'
describe:
  - Force Indent
  - Rule Options
options:
  - false
  - true
---

# Force Indent

Will force indentation upon all content and tags without regard for the text nodes. To some degree this rule emulates a result similar to that you'd expect in the Prettier uniform.

::: note

Inline preservation is respected in cases where a Liquid output object token is encapsulated between text nodes. In such scenarios the text content will only force indent the start and end portions.

:::

# Rule Options

#### Before Formatting

_Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the text type nodes encapsulated within `<li></li>` tags are expressed inline._

```html
<!-- Before Formatting -->
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
```

#### After Formatting

_Using the above sample with the rule enabled (ie: `true`), when applying beautification the text type node are no longer inlined, but instead have applied new line breaks and been force indented._

```html
<!-- After Formatting -->
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
```
