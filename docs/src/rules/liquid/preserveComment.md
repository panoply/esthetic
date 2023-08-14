---
title: 'Liquid - Preserve Comment'
layout: base
permalink: '/rules/liquid/preserveComment/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Preserve Comment

Preserve the inner contents of Liquid block comments. When this rule is enabled (i.e: `true`) it will ignore formatting Liquid comments and will override `commentIndent` and `commentNewline` rule definitions. The `preserveComment` rule is disabled (`false`) by default. The **recommended** setting to use is `false` unless you have extensive context contained within comments.

> Comment blocks which appear on the same line, e.g: `{% comment %} xxx {% endcomment %}` are always preserved. The rule only take effect on comments which span multiple lines.

:::

---

::: rule 🙌

#### false

:::

This `preserveComment` rule is set to `false` by default. In the example below, the Liquid comment will be formatted.

```json:rules
{
  "language": "liquid",
  "preserveLine": 2,
  "liquid": {
    "commentNewline": true,
    "commentIndent": true,
    "preserveComment": false
  }
}
```

<!--prettier-ignore-->
```liquid
<main>
  {% comment %}

  This comment will be indented and a newline
  will be inserted above. We have set both the
  "commentNewline" and "commentIndent" rules
  to true.

        These lines however will be aligned to
        the starting point of the comment blocks.

                  In the next example where we set
                  this rule the true, you will notice
                  how preservation is respected.

  {% endcomment %}
  <aside>
    Hello World!
  </aside>
  {% comment %}
                  Same as above, the comment will be formatted!
                  {% endcomment %}
</main>
```

---

::: rule 🧐

#### true

:::

When the `preserveComment` rule is enabled (`true`) then the contents of block comments will be excluded from formatting. As aforementioned, when set to `true` the rule will override `commentNewline` and `commentIndent` settings.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentNewline": true,
    "commentIndent": true,
    "preserveComment": true
  }
}
```

<!--prettier-ignore-->
```liquid
<ul>
  <li>Hello</li>

    {% comment %}

  This comment will be preserved
  Even though we have set both the
  "commentNewline" and "commentIndent"
  rules to true.

        The comment tag will will align
        itself to the li node above
        but the content will not be touched.

              This is nice when you need to provide detailed
              descriptions or code examples within comments.

    {% endcomment %}

  <li>World</li>
{% comment %}
              Same as above, the comment is preserved!

              {% endcomment %}
</ul>
```
