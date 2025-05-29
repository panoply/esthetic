---
title: 'Liquid - Padded Tag List'
layout: base
permalink: '/rules/liquid/paddedTagList/index.html'
describe:
  - Ignore Tag List
  - Example Options
  - Rule Options
  - Examples
---

:: row
:: col-12 col-md-9

# Padded Tag List

A list of Liquid tags that should have newlines inserted above and below inner contents. Padding will only apply to Liquid start/end type tags or singleton types which can be used together to perform chained control flows. Passing isolated singleton (or _void_) liquid tags such as `assign` or Liquid object output types will have no effect.

::
::

---

:: row
:: col-12 col-md-9

# Example

Below we are ignoring `{% for %}` and `{% unless %}` tag regions. Æsthetic will be skipped formatting these tag blocks. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 0,
  "preserveLine": 2,
  "liquid": {
    "paddedTagList": [
      "for",
      "unless"
    ]
  }
}
```

<!-- prettier-ignore -->
```liquid:before
<div>
{% if x == true %}

{% for i in array %}
{% # This region will not be formatted %}
    {% for x in i.ignored %}
{{ i.xxx }} {% # Nested tags are also ignored %}
  {% endfor %}
          {% # Notice how no indentation is applied %}
{% endfor %}

{% if xx == true %}
<ul>
<li>
This tag will format but below will not
</li>
  {% unless bar %}

      <li>
{% # This region will not be formatted %}
      </li>

  {% endunless %}
<li>
This tag will format but above will not
</li>
</ul>
{% endif %}
{% endif %}
</div>
```

<!-- prettier-ignore -->
```liquid:after
<div>
  {% if x == true %}

    {% for i in array %}
      {% # This region will not be formatted %}
      {% for x in i.ignored %}
        {{ i.xxx }}
        {% # Nested tags are also ignored %}
      {% endfor %}
      {% # Notice how no indentation is applied %}
    {% endfor %}

    {% if xx == true %}
      <ul>
        <li>
          This tag will format but below will not
        </li>
        {% unless bar %}

          <li>
            {% # This region will not be formatted %}
          </li>

        {% endunless %}
        <li>
          This tag will format but above will not
        </li>
      </ul>
    {% endif %}
  {% endif %}
</div>
```
