---
title: 'Liquid - Ignore Tag List'
layout: base
permalink: '/rules/liquid/ignoreTagList/index.html'
anchors:
  describe:
    - Ignore Tag List
    - Example Options
    - Rule Options
    - Example
---

::: grid col-12 col-md-9

# Ignore Tag List

A list of Liquid tags that should excluded from formatting. Only tags which contain a start and end types are valid. This is a Liquid specific formatting rule which defaults to using `0` when no option has been specified.

:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

---

::: rule 💡

#### Example

:::

Below we are ignoring `{liquid} {% for %}` and `{liquid} {% unless %}` tag regions. Æsthetic will be skipped formatting these tag blocks. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "ignoreTagList": [
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

{% # This region will not be formatted %}
{% for i in array %}
                              {{ i.xxx }}
{% endfor %}

{% if xx == true %}
<ul>
<li>
This tag will format but below will not
</li>

{% unless bar %}
<li> {% # This region is ignored %} </li>
{% endunless %}

<li>
This tag will format but above will not
</li>
</ul>
{% endif %}
{% endif %}
</div>
```

```liquid:after
<div>
  {% if x == true %}

{% # This region will not be formatted %}
{% for i in array %}
                              {{ i.xxx }}
{% endfor %}

    {% if xx == true %}
      <ul>
        <li>
          This tag will format but below will not
        </li>

{% unless bar %}
<li> {% # This region is ignored %} </li>
{% endunless %}

        <li>
          This tag will format but above will not
        </li>
      </ul>
    {% endif %}
  {% endif %}
</div>
```
