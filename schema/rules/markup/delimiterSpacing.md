**Default** `false`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `true`

Whether or not Liquid delimiters should apply a single space at the starting and ending points of their structure or be left intact.

---

#### Example

_Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the extraneous whitespace and newlines are removed **after** formatting was applied._

```html

<!-- Before formatting -->
{%    for i in arr   %}

  {{
    i.object
       }}

  {%if x%}
    {{foo}} {{bar   }} {{   baz   }}
  {%   endif%}

{%endfor              %}

<!-- After formatting -->
{% for i in arr %}
  {{ i.object }}
  {% if x %}
    {{ foo }} {{ bar }} {{ baz }}
  {% endif %}
{% endfor %}

```

