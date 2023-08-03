---
title: 'Style - Preserve Comment'
layout: base
permalink: '/rules/style/preserveComment/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-9 p-100

# Preserve Comment

Preserve the inner contents of style language comments. When this rule is enabled (i.e: `true`) it will ignore formatting style comments and override `commentIndent` and `commentNewline` rule definitions.

### Rule Options

The `preserveComment` rule is disabled (`false`) by default. The **recommended** setting to use is `false` unless you have extensive context contained within comments.

### Example

In the below example we have enabled comment preservation. Both the `commentIndent` and `commentNewline` rules will no longer have effect on output as the the `preserveComment` rule takes precedence.

:::

::: grid col-7

```json
{
  "language": "css",
  "liquid": {
    "commentNewline": false, // This setting will be ignored
    "commentIndent": true, // This setting will be ignored
    "preserveComment": true // When enabled, this rule takes precedence
  }
}
```

:::

---

::: rule 🙌

#### false

:::

This `preserveComment` rule is set to `false` by default. In the example below, the Liquid comment will be formatted.

```json:rules
{
  "language": "css",
  "preserveLine": 2,
  "style": {
    "commentNewline": true,
    "commentIndent": true,
    "preserveComment": false
  }
}
```

<!--prettier-ignore-->
```css
/*

  This comment will be preserved
  Even though we have set both the
  "commentNewline" and "commentIndent"
  rules to true.

        The comment tag will will align
        itself to the li node above
        but the content will not be touched.

              This is nice when you need to provide detailed
              descriptions or code examples within comments.
 */

code[class*="language-"] {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```

---

::: rule 🧐

#### true

:::

When the `preserveComment` rule is enabled (`true`) then the contents of block comments will be excluded from formatting. As aforementioned, when set to `true` the rule will override `commentNewline` and `commentIndent` settings.

```json:rules
{
  "language": "css",
  "style": {
    "commentNewline": true,
    "commentIndent": true,
    "preserveComment": true
  }
}
```

<!--prettier-ignore-->
```css
/*
 *
 * This comment will be preserved
 * Even though we have set both the
 * "commentNewline" and "commentIndent"
 * rules to true.
 *       The comment tag will will align
 *       itself to the li node above
 *       but the content will not be touched.
 *            This is nice when you need to provide detailed
 *            descriptions or code examples within comments.
 */

code[class*="language-"] {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1em 3.8em;
  overflow: auto;
  inset: 0;
}
```

---
