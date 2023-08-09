---
title: 'Liquid - Ignore Tag List'
layout: base
permalink: '/rules/liquid/ignoreTagList/index.html'
describe:
  - Ignore Tag List
  - Example Options
  - Rule Options
  - Examples
---

::: grid col-9 p-100

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

# Example

```json:rules
{
  "language": "liquid",
  "wrap": 0,
  "preserveLine": 2,
  "liquid": {
    "ignoreTagList": [
      "for",
      "unless"
    ]
  }
}
```

Below we are ignoring `{% for %}` and `{% unless %}` tag regions. Æsthetic will be skipped formatting these tag blocks. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

<!-- prettier-ignore -->
```liquid
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
