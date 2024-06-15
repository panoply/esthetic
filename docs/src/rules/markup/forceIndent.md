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

The `forceIndent` rule controls indentation of content and tags without regard of text nodes. By default, this rule is set to `false` which results in a context-sensitive approach to indentation. The `forceIndent` rule allow you to choose between a strictly uniform indentation style or a more adaptive style that maintains a compact code structure.

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
