---
title: 'Liquid - Comment Indent'
layout: base
permalink: '/rules/liquid/commentIndent/index.html'
prev:
  label: 'Wrap Fraction'
  uri: '/rules/global/wrapFraction/'
next:
  label: 'Comment Newline'
  uri: '/rules/liquid/commentNewline/'
describe:
  - Comment Indent
  - Rule Override
  - Rule Options
options:
  - false
  - true
---

::: grid col-8 p-100

# Comment Indent

The `commentIndent` rule applies single level indentation to the containing content of Liquid **block** type comments. This is a Liquid specific formatting rule which defaults to using `false` when no option is defined. The **Recommended** setting to use is `true`.

> Liquid line type comments `{% # example %}` are currently not supported by this rule. Only block type Liquid tokens will be handled.

# Rule Override

When the [`preserveComment`](/rules/liquid/preserveComment) (liquid) rule is enabled (i.e: `true`) it will take precedence and override `commentIndent` rule.

- [preserveComment](/rules/liquid/preserveComment)

:::

---

::: rule 🙌

#### true

:::

Below is an example of how this rule works if it's enabled (`true`). Notice how after formatting when this rule is enabled that the inner contents of the Liquid comment tag regions are indented.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentIndent": true
  }
}
```

<!-- prettier-ignore -->
```liquid
{% comment %}
Example
The contents of this comment will have indentation applied
{% endcomment %}
```

---

::: rule 👎

#### false

:::

The `commentIndent` rule is **disabled** by default, so Liquid comments do not apply indentation. Liquid block comment contents will have indentation removed in the sample when formatting.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "liquid",
  "liquid": {
    "commentIndent": false
  }
}
```

<!-- prettier-ignore -->
```liquid
{% comment %}
  Example
  The contents of this comment will have indentation stripped.
{% endcomment %}
```
