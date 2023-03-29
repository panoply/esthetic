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

# Dedent Tag List

Omit applied indentation within Liquid tag blocks. By default, Æsthetic will indent content encapsulated within Liquid tags blocks. Tag blocks are Liquid tokens which require ender type be passed.

::: note
The rules behavior will differ depending on the tag structure. Passing in singleton type tag names such as `"assign"` or `"render"` will have no effect on output.
:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
💡 - 'Showing an example of the rule'
-->

# Rule Options

This is a Liquid specific formatting rule which defaults to using `[]` when no option has been specified. You should avoid applying de-dentation to common used Liquid tags. The **recommended** entry to provide the rule is the `case` tag name.

##### Example

In the below sample rule options we have set de-dentation rules on the `{% case %}` and `{% schema %}` tag blocks. The encapsulate contents of these tokens will exclude indentation.

```js
{
  "language": "liquid",
  "liquid": {
    "dedentTagList": ["case", "schema"] // {% case %} and {% schema %}
  }
}
```

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
```html
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
```html
{% schema %}
  {
    "name": "Section",
    "tag": "main",
    "class": "some-class",
    "settings": [
      {
        "type": "header",
        "content": "Example",
        "info": "The braces {} will align to the starting point of the tag."
      }
    ]
  }
{% endschema %}
```

---
