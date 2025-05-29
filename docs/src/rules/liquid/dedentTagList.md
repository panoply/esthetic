---
title: 'Liquid - Dedent Tag List'
layout: base
permalink: '/rules/liquid/dedentTagList/index.html'
anchors:
  describe:
    - Dedent Tag List
    - Rule Options
  examples:
    - case
    - schema
---

:: row
:: col-12 col-md-9

# Dedent Tag List

The Dedent Tag List rule is a Liquid-specific formatting feature that allows you to omit applied indentation within certain Liquid tag blocks. By default, Æsthetic applies indentation to content encapsulated within Liquid tag blocks. These tag blocks are Liquid tokens that require an ender type to be passed. When no option is specified, this rule defaults to an empty list, represented as `{js} []`.

It's generally advisable to avoid applying de-dentation to commonly used Liquid tags, as this could negatively impact code readability. The recommended approach is to provide the rule with specific tag names that would benefit from de-dentation. For instance, the control conditional `{liquid} {% case %}` tag is often a good candidate for this rule. However, it should be used judiciously to maintain overall code consistency and readability.

> It's important to note that the rule's behavior varies depending on the tag structure. Singleton-type tag names, such as assign or render, will not be affected by this rule and will have no impact on the output.

::
::

---

:: row
:: col-12 col-md-9

## case

The below sample will result in the `{% when %}` tokens of the expression to dedent. The tokens will align themselves to starting levels of the `{% case %}` and its `{% endcase %}` tag placements.

::
::

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

```liquid:before
{% case 'dedent' %}
  {% when foo %}
    {{ object.prop }}
  {% when bar %}
    Hello World!
  {% else %}
    Lorem Ipsum
{% endcase %}
```

```liquid:after
{% case 'dedent' %}
{% when foo %}
  {{ object.prop }}
{% when bar %}
  Hello World!
{% else %}
  Lorem Ipsum
{% endcase %}
```

---

:: row
:: col-12 col-md-9

## schema

::
::

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

```liquid:before
{% schema %}
  {
    "name": "Section",
    "tag": "main",
    "settings": []
  }
{% endschema %}
```

```liquid:after
{% schema %}
{
  "name": "Section",
  "tag": "main",
  "settings": []
}
{% endschema %}
```

---
