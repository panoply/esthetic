# Conditions in attributes

This tests Liquid conditional tags being used in HTML attributes. This type of expression is not very common in projects which use Liquid as the template language.

### Overview

We will be testing against the follow:

1. Conditional expression contained within `data-*-bar` attributes.
2. Conditional expression prepended before the `=` operator.
3. Conditional expression used to apply a liquid `{{ object }}` attribute.

### Rules

```json
{}
```

# Mock

Below is the test mock used

```liquid
<div id="x" data-{% if x -%} {{ x }} {%- else -%} foo {%- endif %}-id="within"
  class
="xxx xxx xxx">

<div    {% if xx -%}data-{{ xx }}{%- else -%}
id{%- endif %}="prepended"
    class={{ no_quotations }}
>

    <div
    {% unless x or 'xxx' -%}
      {{ object }}
    {%- endunless -%}>

    Lorem ipsum dolor.
</div></div>

</div>
```

# Expected

Below is result after formatting has been executed.

### Forced attribute option is enabled

When the `forceAttribute` rule is set to `true`

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
</div>
```
