---
title: 'Liquid - Delimiter Placement'
layout: base
permalink: '/rules/liquid/delimiterPlacement/index.html'
anchors:
  describe:
    - Delimiter Placement
    - Related Rules
    - Rule Options
  options:
    - preserve
    - inline
    - consistent
    - newline-multiline
---

:: row
:: col-12 col-md-9

# Delimiter Placement

Controls the placement of opening and closing Liquid delimiters `{%`, `{{`, `}}` and `%}`. The rule will take effect in accordance with the internal structure of output and tag tokens. This is a Liquid specific formatting rule which defaults to using `preserve` when no option has been specified. The **recommended** option to use is `consistent` or `newline-multiline`.

The `delimiterPlacement` can be used together with the Liquid [delimiterTrims](/rules/liquid/delimiterTrims/) and [equipoiseSpacing](/rules/liquid/equipoiseSpacing/) rules, both of which pertain to Liquid contained character sequences within tokens.

> This rule will only be applied to start, singleton and output tag types. Delimiters of end `{liquid} {% end %}` type tags and those which encapsulate Liquid comments will always be formatted inline.

::
::

---

:: row
:: col-12 col-md-9

## preserve

The `preserve` option is what Æsthetic will **default** to using. The option will skip internal analysis which the delimiters encapsulate and instead the provided structure as the point of reference. Unlike the other rules, `preserve` will allow for both inline and force delimiter placement. All delimiter placements in the sample will be preserved when formatting.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 70,
  "liquid": {
    "delimiterPlacement": "preserve"
  }
}
```

```liquid:before
{%
  if condition and expectation %}
  {{
    object.prop | filter: 'foo'
  }}
  {{
    object.prop | filter: 'bar' }}
{% endif %}
```

```liquid:after
{%
  if condition and expectation %}
  {{
    object.prop | filter: 'foo'
  }}
  {{
    object.prop | filter: 'bar' }}
{% endif %}
```

---

:: row
:: col-12 col-md-9

## inline

The `inline` option will ensure that delimiters always start and end on the same line. The option will strip newlines and whitespace sequences and use a single whitespace character as the separator. All delimiters which have been forced onto newlines in the sample will be inlined when formatting.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 70,
  "liquid": {
    "delimiterPlacement": "inline"
  }
}
```

```liquid:before
{%
 if condition == assertion
%}
  {{
    foo | filter: 'hello' }}
  {{ bar | filter: 'world'
  }}
{% endif %}
```

```liquid:after
{% if condition == assertion %}
  {{ foo | filter: 'hello' }}
  {{ bar | filter: 'world' }}
{% endif %}
```

---

:: row
:: col-12 col-md-9

## consistent

The `consistent` option will use the opening (`{%` or `{{`) delimiter placement as its reference point for how the closing (`%}` or `}}`) delimiter should be formatted. If you were to force the opening delimiter onto a newline then the closing delimiter will also be forced. Ending delimiters (`%}` or `}}`) in the sample will be forced onto newlines but only if their leading (`{%` or `{{`) delimiters are forced.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 70,
  "liquid": {
    "delimiterPlacement": "consistent"
  }
}
```

```liquid:before
{{ object.prop | filter: 'one'
}}
{%-
  render 'snippet' %}
{{
  object.prop | filter: t: 'xxx' }}
```

```liquid:after
{{ object.prop | filter: 'one' }}
{%-
  render 'snippet'
%}
{{
  object.prop | filter: t: 'xxx'
}}
```

---

:: row
:: col-12 col-md-9

#### newline-multiline

The `forced` option will force delimiters onto newlines. You should avoid using this option as there a very few use cases where it would be applicable. All delimiters in the sample will be forced onto newlines when formatting.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 70,
  "liquid": {
    "delimiterPlacement": "newline-multiline"
  }
}
```

<!-- prettier-ignore -->
```liquid:before
{%
  if condition == assertion %}
{{ object.prop | filter_1: 'one' }}
{{ object.prop | filter_1: 'one' | filter_2: 'two' }}
{% section 'xxx' %}
{{ object.prop
  | filter_1: 'ones'
  | filter_2: 'two'
  | filter_3: 'three' }}

{% endif %}
```

```liquid:after
{% if condition == assertion %}
  {{ object.prop | filter_1: 'one' }}
  {{ object.prop | filter_1: 'one' | filter_2: 'two' }}
  {% section 'xxx' %}
  {{
    object.prop
    | filter_1: 'ones'
    | filter_2: 'two'
    | filter_3: 'three'
  }}
{% endif %}
```
