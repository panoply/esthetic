---
title: 'Markup - Comment Preserve'
layout: base
permalink: '/rules/markup/commentPreserve/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Comment Preserve

Preserve the inner contents of HTML comments. When this rule is enabled (i.e: `true`) it will ignore formatting HTML comments and override `commentIndent` and `commentNewline` rule definitions.

### Rule Options

The `commentPreserve` rule is disabled (`false`) by default. The **recommended** setting to use is `false` unless you have extensive context contained within comments.

### Example

In the below example we have enabled comment preservation. Both the `commentIndent` and `commentNewline` rules will no longer have effect on output as the the `commentPreserve` rule takes precedence.

:::

::: grid col-7

```json
{
  "language": "html",
  "markup": {
    "commentNewline": false, // This setting will be ignored
    "commentIndent": true, // This setting will be ignored
    "commentPreserve": true // When enabled, this rule takes precedence
  }
}
```

:::

---

::: rule 🙌

#### false

:::

This `commentPreserve` rule is set to `false` by default. In the example below, the Liquid comment will be formatted.

```json:rules
{
  "language": "html",
  "preserveLine": 2,
  "markup": {
    "commentNewline": true,
    "commentIndent": true,
    "commentPreserve": false
  }
}
```

<!--prettier-ignore-->
```html
<main>
  <!--

  This comment will be indented and a newline
  will be inserted above. We have set both the
  "commentNewline" and "commentIndent" rules
  to true.

        These lines however will be aligned to
        the starting point of the comment blocks.

                  In the next example where we set
                  this rule the true, you will notice
                  how preservation is respected.

  -->
  <aside>
    Hello World!
  </aside>
  <!--
                  Same as above, the comment will be formatted!
                  -->
</main>
```

---

::: rule 🧐

#### true

:::

When the `commentPreserve` rule is enabled (`true`) then the contents of block comments will be excluded from formatting. As aforementioned, when set to `true` the rule will override `commentNewline` and `commentIndent` settings.

```json:rules
{
  "language": "html",
  "markup": {
    "commentNewline": true,
    "commentIndent": true,
    "commentPreserve": true
  }
}
```

<!--prettier-ignore-->
```html
<ul>
  <li>Hello</li>

    <!--

  This comment will be preserved
  Even though we have set both the
  "commentNewline" and "commentIndent"
  rules to true.

        The comment tag will will align
        itself to the li node above
        but the content will not be touched.

              This is nice when you need to provide detailed
              descriptions or code examples within comments.

    -->

  <li>World</li>
<!--
              Same as above, the comment is preserved!

              -->
</ul>
```

---
