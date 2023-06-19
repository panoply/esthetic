---
title: 'Liquid - Dedent Tag List'
layout: base
permalink: '/rules/liquid/dedentTagList/index.html'
describe:
  - Dedent Tag List
  - Rule Options
examples:
  - case
  - schema
---

::: grid col-8 p-100

# Dedent Tag List

Omit applied indentation within Liquid tag blocks. By default, Æsthetic will indent content encapsulated within Liquid tags blocks. Tag blocks are Liquid tokens which require ender type be passed. This is a Liquid specific formatting rule which defaults to using `[]` when no option has been specified. You should avoid applying de-dentation to common used Liquid tags. The **recommended** entry to provide the rule is the `case` tag name.

> The rules behavior will differ depending on the tag structure. Passing in singleton type tag names such as `"assign"` or `"render"` will have no effect on output.

:::

---

::: rule 💡

#### case

:::

The below sample will result in the `{% when %}` tokens of the expression to dedent. The tokens will align themselves to starting levels of the `{% case %}` and its `{% endcase %}` tag placements.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "dedentTagList": [
      "case"
    ]
  }
}
```

<!-- prettier-ignore -->
```liquid
{% case 'dedent-example' -%}
  {% when foo %}
    {{ object.prop }}
  {% when bar %}
    {{ object.prop | filter: 'xxx' }}
  {% when baz %}
    Hello World!
  {% else %}
    Lorem Ipsum
{% endcase %}
```

---

::: rule 💡

#### schema

:::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "dedentTagList": [
      "schema"
    ]
  }
}
```

<!-- prettier-ignore -->
```liquid
{% schema %}
  {
    "name": "Section",
    "tag": "main",
    "class": "some-class",
    "settings": [
      {
        "type": "header",
        "content": "Example",
        "info": "The braces {} will dedent"
      }
    ]
  }
{% endschema %}
```

---
