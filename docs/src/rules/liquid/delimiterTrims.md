---
title: 'Liquid - Delimiter Trims'
layout: base
permalink: '/rules/liquid/delimiterTrims/index.html'
anchors:
  describe:
    - Delimiter Trims
  options:
    - preserve
    - tags
    - outputs
    - never
    - always
    - multiline
---

:: row
:: col-12 col-md-9

# Delimiter Trims

Delimiter whitespace trim dashes `{%-`, `-%}`, `{{-` and `-}}` control. This rule can be used for handling trim `-` application of delimiter expressions in Liquid tag and output type tokens. This is a Liquid specific formatting rule which defaults to using `preserve` when no option has been specified. The **recommended** option to use is `tags` or `never`.

> This rule will not touch Liquid tokens encapsulated within strings. Tags which exist in string values or those contained between quotation characters are left intact.

::
::

---

:: row
:: col-12 col-md-9

## preserve

The `delimiterTrims` rule is set to `preserve` by default and delimiter trims applied Liquid tokens intact. In the sample all occurrences of whitespace trims will be preserved.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "preserve"
  }
}
```

```liquid:before
{% if condition -%}
  {{- foo }}
  {{ bar -}}
{%- endif -%}
```

```liquid:after
{% if condition -%}
  {{- foo }}
  {{ bar -}}
{%- endif -%}
```

---

:: row
:: col-12 col-md-9

## tags

When the `delimiterTrims` rule is set to `tags` then Liquid tokens using `{%` and `%}` delimiters will have trims applied. This rule will leave output token (`{{` and `}}`) delimiter trims intact. In the sample all tag occurrences have trims applied, whereas output token types are preserved.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "tags"
  }
}
```

```liquid:before
{% if condition -%}

  {% # Trims inserted %}
  {% render 'snippet' %}

  {% # Trims stripped %}
  {{- foo }}
  {{ bar -}}
  {{- baz -}}

{% endif %}
```

```liquid:after
{%- if condition -%}

  {% # Trims inserted %}
  {%- render 'snippet' -%}

  {% # Trims stripped %}
  {{ foo }}
  {{ bar }}
  {{ baz }}

{%- endif -%}
```

---

:: row
:: col-12 col-md-9

## outputs

When the `delimiterTrims` rule is set to `outputs` then Liquid tokens using `{{` and `}}` delimiters will have trims applied. This rule will leave tag type token `{%` and `%}` delimiter trims intact. In the sample the `if`, `render` and `endif` tag delimiter trims will be preserved but the `{{ foo }}`and `{{ bar }}` output tags will have trims inserted.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "outputs"
  }
}
```

```liquid:before
{% if condition %}

  {% # Trims preserve %}
  {% render 'snippet' -%}

  {% # Trims inserted %}
  {{ foo }}
  {{ bar }}
  {{ baz }}

{% endif %}
```

```liquid:after
{% if condition -%}

  {% # Trims preserve %}
  {% render 'snippet' -%}

  {% # Trims inserted %}
  {{- foo -}}
  {{- bar -}}
  {{- baz -}}

{% endif %}
```

---

:: row
:: col-12 col-md-9

## never

When the `delimiterTrims` rule is set to `never` then all occurrence's trim dash delimiters will be stripped from Liquid tag and output token types. In the sample, all `-` delimiters expressions are removed.

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "never"
  }
}
```

<!-- prettier-ignore -->
```liquid:before
{%- if condition -%}

  {%- render 'snippet' -%}

  {{- foo -}}
  {{- bar -}}
  {{- baz -}}

{%- endif %}
```

```liquid:after
{% if condition %}

  {% render 'snippet' %}

  {{ foo }}
  {{ bar }}
  {{ baz }}

{% endif %}
```

---

:: row
:: col-12 col-md-9

## always

::
::

When the `delimiterTrims` rule is set to `always` then all Liquid delimiters will have trims applied. Maybe avoid using this option unless you are **sure** the resulting render is as you intend. Keep in mind, trims are a minor performance hit in Liquid. In the sample, all `{{`, `{%`, `}}` and `%}` delimiters have trims inserted.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "always"
  }
}
```

```liquid:before
{% if condition %}

  {% # Trims inserted %}

  {% render 'snippet' %}

  {{ foo }}
  {{ bar }}
  {{ baz }}

{% endif %}
```

```liquid:after
{%- if condition -%}

  {% # Trims inserted %}

  {%- render 'snippet' -%}

  {{- foo -}}
  {{- bar -}}
  {{- baz -}}

{%- endif -%}
```

---

:: row
:: col-12 col-md-9

## multiline

When the `delimiterTrims` rule is set to `multiline` trims will be applied to tags and output type tokens when the internal structure spans multiple lines. This typically occurs on tokens which contain several filters, arguments or control conditions. Both the opening and closing delimiters will apply trims.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "delimiterTrims": "multiline"
  }
}
```

```liquid:before
{%
  if condition == assertion
  or condition == expectation
  or something == comparison %}

  {{ object.prop
    | filter_1: true
    | filter_2: 'value'
    | filter_3: 1000  }}

{% endif %}
```

```liquid:after
{%-
  if condition == assertion
  or condition == expectation
  or something == comparison -%}

  {{- object.prop
    | filter_1: true
    | filter_2: 'value'
    | filter_3: 1000 -}}

{% endif %}
```

---
