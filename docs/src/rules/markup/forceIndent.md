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

::: grid col-8 p-100

# Force Indent

Will force indentation upon all content and tags without regard for the text nodes. To some degree this rule emulates a result similar to that you'd expect in the Prettier uniform.

> Inline preservation is respected in cases where a Liquid output object token is encapsulated between text nodes. In such scenarios the text content will only force indent the start and end portions.

:::

---

::: rule 👍

#### true

:::

Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the text type nodes encapsulated within `<li></li>` tags are expressed inline.

```json:rules
{
  "language": "html",
  "markup": {
    "forceIndent": true
  }
}
```

```html
<!-- Before Formatting -->
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
```

---

::: rule 👍

#### false

:::

Using the above sample with the rule enabled (ie: `true`), when applying beautification the text type node are no longer inlined, but instead have applied new line breaks and been force indented.

```json:rules
{
  "language": "html",
  "markup": {
    "forceIndent": false
  }
}
```

```html
<!-- Before Formatting -->
<ul>
  <li>Hello</li>
  <li>World</li>
</ul>
```
