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
  "preserveLine": 0,
  "liquid": {
    "ignoreTagList": [
      "capture",
      "unless"
    ]
  }
}
```

Below we are ignoring `{% capture %}` and `{% unless %}` tag regions. Æsthetic will be skipped formatting these tag blocks. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

<!-- prettier-ignore -->
```liquid
<div>
{% if x %}

{% capture foo %}   I will not be formatter   {% endcapture %}

{% if xx %}
<ul>


{% unless bar %}

<li>
{% # This region will be skipped completely %}
</li>

{% endunless %}

<li>
Hello World
</li>

</ul>
{% endif %}
{% endif %}
</div>
```
