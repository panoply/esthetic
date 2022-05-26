# Conditions as attributes

This tests Liquid conditional tags being used to control HTML attributes. This type of expression is not very common in projects which use Liquid as the template language.

1. Conditional expression contained within `data-*-bar` attributes.
2. Conditional expression prepended before the `=` operator.
3.

### Results

### Rules

```json
{}
```

### Actual

Below is the test mock used

### Expected

Below is result after formatting has been executed.

```liquid
<div
  id="x"
  data-{% if x -%} {{ x }} {%- else -%} foo {%- endif %}-bar="ssss"
  class="baz">

  <div
    data-attr="{{ within.value }}"
    class={{ no.quotations }}
    id="{% if x == xx %} {{ condition.in_value -}} {% endif -%}">

    <div
      id={{ no.quotations }}
      class="xxx"
      {% unless x %}
      data-{{ attr_between | filter: 'xxx' }}-xxx="ssss"
      {% endunless %}></div>
  </div>
```
