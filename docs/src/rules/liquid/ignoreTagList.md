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

# Ignore Tag List

A list of Liquid tags that should excluded from formatting. Only tags which contain a start and end types are valid.

# Example Options

Below is an example of how this rule works and you've set the following Liquid tags to be ignored.

# Rule Options

This is a Liquid specific formatting rule which defaults to using `0` when no option has been specified.

##### Example

```js
{
  language: 'liquid',
  liquid: {
    ignoreTagList: [
      'capture',
      'unless'
    ]
  }
}
```

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

# Examples

::: rule 👍

#### `['capture', 'unless']`

:::

Using the above example configuration whenever Prettify encounters a `{% capture %}` or `{% unless %}` tag region it will be skipped from formatting. It is important to note that ignored tags will not apply indentation, so it is up to you to refine the ignore tag yourself.

<!-- prettier-ignore -->
```html
<div>
{% if x %}

{% capture foo %}   I will not be formatter   {% endcapture %}

{% if xx %}
<ul>
<li>
Hello World
</li>

{% unless bar %}

<li> I
     will not be formatter  </li>

{% endunless %}

</ul>
{% endif %}
{% endif %}
</div>
```

#### After Formatting

_After formatting the above sample notice how the `{% capture %}` and `{% unless %}` tags region has been completely skipped from formatting. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied._

<!-- prettier-ignore -->
```html
<div>
  {% if x %}

{% capture foo %}   I will not be formatted   {% endcapture %}

    {% if xx %}

      <ul>
        <li>
          Hello World
        </li>

{% unless bar %} <li> I will not be formatted </li> {% endunless %}

      </ul>
    {% endif %}
  {% endif %}
</div>
```
