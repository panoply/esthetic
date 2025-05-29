---
title: 'Liquid - Indent Attribute'
layout: base
permalink: '/rules/liquid/indentAttribute/index.html'
---

:: row
:: col-12 col-md-9

# Indent Attribute

Whether indentation should be applied to HTML (markup) attributes that are encapsulated by Liquid identified tag blocks contained within HTML Tags. This rule emulates the Liquid Prettier Plugin style of attribute formatting and will use depth indentation (each nested Liquid expression will increase indent level by factor of **1**).

> Liquid tags blocks contained within attribute values (e.g: `{liquid} <div class="a {% if x %} c {% endif %} b">`) will be excluded and remain untouched during the beautification cycle.

### Mirrored Rule

The `indentAttributes` rule will mirror disablement of the [`forceAttribute`](/rules/markup/forceAttribute) (markup) rule. When `forceAttribute` is set to `false` then this rule will be disabled. The `forceAttribute` markup rule **must** be set to `true` or (alternatively) use a force limit value (e.g: `2`). If the attribute forcing is disabled (i.e: `false`) then indentation will not be applied to Liquid contained structures and this rule will have no effect.

::
::

---

:: row
:: col-12 col-md-9

## false

When the `indentAttributes` rule is **disabled** (i.e: `false`) all HTML attributes which are encapsulated within Liquid tag block expressions will not have indentation applied.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "indentAttribute": false
  }
}
```

```liquid:before
<div
  class="foo"
  {% if condition %}
    data-attr-1="hello"
    data-attr-2="world"
    {% if xx %}
      data-attr-3="bar"
    {% else %}
      id="xxxxx"
      data-baz="100"
      {% unless xxxx %}
        data-foo="bar"
      {% endunless %}
    {% endif %}
  {% endif %}
  data-id="bar">
  Attributes contained in Liquid not indent
</div>
```

```liquid:after
<div
  class="foo"
  {% if condition %}
  data-attr-1="hello"
  data-attr-2="world"
  {% if xx %}
  data-attr-3="bar"
  {% else %}
  id="xxxxx"
  data-baz="100"
  {% unless xxxx %}
  data-foo="bar"
  {% endunless %}
  {% endif %}
  {% endif %}
  data-id="bar">
  Attributes contained in Liquid not indent
</div>
```

---

:: row
:: col-12 col-md-9

## true

When the `indentAttributes` rule is **enabled** (i.e: `true`) all HTML attributes which are encapsulated within Liquid tag block expressions will have indentation applied. Nested block types will also apply indentation.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "indentAttribute": true
  }
}
```

```liquid:before
<div
  class="foo"
  {% if condition %}
  data-attr-1="hello"
  {% if xx %}
  data-attr-2="world"
  {% else %}
  data-attr-3="bar"
  data-baz="100"
  {% unless xxxx %}
  data-foo="bar"
  {% endunless %}
  {% endif %}
  {% endif %}
  data-id="bar">
  Attributes contained in Liquid will indent
</div>
```

```liquid:after
<div
  class="foo"
  {% if condition %}
    data-attr-1="hello"
    {% if xx %}
      data-attr-2="world"
    {% else %}
      data-attr-3="bar"
      data-baz="100"
      {% unless xxxx %}
        data-foo="bar"
      {% endunless %}
    {% endif %}
  {% endif %}
  data-id="bar">
  Attributes contained in Liquid will indent
</div>
```
