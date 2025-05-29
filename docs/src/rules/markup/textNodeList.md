---
title: 'Markup - Text Node List'
layout: base
permalink: '/rules/markup/textNodeList/index.html'
---

# Text Node List

List of HTML tag names to apply inline formatting upon when their child type is text content. By default, Æsthetic will format tags containing text content according to a special cherry-picked list of phrasing-content type tags. You can override the default list, add to the default list by prefixing entries with a `+` character, or alternatively, you can exclude certain tags from the default list using an `!` prefix (see below example).

```js
// Excluding: Continue to use the default list but exclude <span> and <h1> tags.
{
  textNodes: ['!span', '!h1'];
}
// Extending: Continue to use the default list and include <label> and <p> tags.
{
  textNodes: ['+label', '+p'];
}
// Overrides: Do not use defaults, only treat <div> and <p> as text nodes.
{
  textNodes: ['div', 'p'];
}
```

Text nodes defined here will be excluded from forced indentation if `forceIndent` is `true` and the child token is text content. Entries here will be used by the `textBoundTag` rule when it is set to the `default` option.\*\*

#### Related Rules
