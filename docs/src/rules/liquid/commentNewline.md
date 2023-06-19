---
title: 'Liquid - Comment Newline'
layout: base
permalink: '/rules/liquid/commentNewline/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-8 p-100

# Comment Newline

Inserts a new line above comment tags. When enabled the rule will add a newline even if `preserveLine` is set to `0`. The rule will not inject new lines when the previous expression is determined to already contain a new line. The `commentNewline` rule is disabled (`false`) by default. Newline insertion will not be applied to comments blocks in the sample.

> Liquid line type comments are currently not supported by this rule. Only block type Liquid tokens will be handled.

:::

---

::: rule 👍

#### false

:::

If the rule is `undefined` or set to `false` (which is the default). In the sample, there will be no change applied.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentNewline": false
  }
}
```

<!--prettier-ignore-->
```liquid
<main>
  {% comment %}
    No newline will be inserted above this comment
  {% endcomment %}
  <aside>
    Hello World!
  </aside>
  {% comment %}
    No newline will be inserted above this comment
  {% endcomment %}
</main>
```

---

::: rule 🙌

#### true

:::

When the `commentNewline` rule is enabled (`true`) then a newline will inserted above the `{% comment %}` tag. In the sample, the comment which immediately follows the `<li>` tag will have a newline inserted above. When a newline exists above a comment tag then no insertion is applied.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentNewline": true
  }
}
```

<!--prettier-ignore-->
```liquid
<ul>
  <li>Hello</li>
  {% comment %}
    A newline will be inserted above this comment
  {% endcomment %}
  <li>World</li>
  {% comment %}
    Same as above, a newline will be inserted
  {% endcomment %}
</ul>
```
