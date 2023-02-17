---
title: 'Liquid - Delimiter Trims'
layout: base
permalink: '/rules/liquid/delimiterTrims/index.html'
---

# Delimiter Trims

Delimiter whitespace trim dashes `{%-`, `-%}`, `{{-` and `-}}` control. This rule can be used for handling trim `-` application of Liquid tags and output tokens.

::: note

This rule will not touch Liquid tokens encapsulated within strings, e.g: `"{{ foo }}"` and/or `'{{ foo }}'`. Tags which exist in string values or those contained between quotation characters are left intact.

:::

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

---

# Rule Options

This is a Liquid specific formatting rule which defaults to using `preserve` when no option has been specified. The **recommended** option to use is `tags` or `never`.

::: rule 👍

#### preserve

:::

The `delimiterTrims` rule is set to `preserve` by default and delimiter trims applied Liquid tokens intact. In the sample all occurrences of whitespace trims will be preserved.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "preserve"
  }
}
```

<!-- prettier-ignore -->
```html
{% if condition -%}
  {{- foo }}
  {{ bar -}}
{%- endif -%}
```

---

::: rule 👍

#### tags

:::

When the `delimiterTrims` rule is set to `tags` then Liquid tokens using `{%` and `%}` delimiters will have trims applied. This rule will leave output token (`{{` and `}}`) delimiter trims intact. In the sample all tag occurrences have trims applied, whereas output token types are preserved.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "tags"
  }
}
```

<!-- prettier-ignore -->
```html
{% if condition -%}

  {% # Trims will be inserted here %}
  {% render 'snippet' %}

  {% # These output tag type delimiter trims are preserved %}
  {{- foo }}
  {{ bar -}}

{% endif %}
```

---

::: rule 👎

#### outputs

:::

When the `delimiterTrims` rule is set to `outputs` then Liquid tokens using `{{` and `}}` delimiters will have trims applied. This rule will leave tag type token (`{% and `%}`) delimiter trims intact. In the sample the `if`, `render`and`endif` tag delimiter trims will be preserved but the`{{ foo }}`and `{{ bar }}` output types will have trims inserted.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "outputs"
  }
}
```

<!-- prettier-ignore -->
```html
{%- if condition -%}

  {% # Trim application will be preserved %}
  {% render 'snippet' -%}

  {% # The output tags will have trims applied %}
  {{ foo }}
  {{ bar }}

{%- endif %}
```

---

::: rule 👎

#### never

:::

When the `delimiterTrims` rule is set to `never` then all occurrence's trim dash delimiters will be stripped from Liquid tag and output token types. In the sample, all `-` delimiters expressions are removed.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "never"
  }
}
```

<!-- prettier-ignore -->
```html
{%- if condition -%}

  {% # All trims will be stripped %}

  {%- render 'snippet' -%}

  {{- foo -}}
  {{- bar -}}
  {{- baz -}}

{%- endif %}
```

---

::: rule 😳

#### always

:::

When the `delimiterTrims` rule is set to `always` then all Liquid delimiters will have trims applied. Maybe avoid using this option unless you are **sure** the resulting render is as you intend. Keep in mind, trims are a minor performance hit in Liquid. In the sample, all `{{`, `{%`, `}}` and `%}` delimiters have trims inserted.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "always"
  }
}
```

<!-- prettier-ignore -->
```html
{% if condition %}

  {% # Trims will be applied to all tokens %}

  {% render 'snippet' %}

  {{ foo }}
  {{ bar }}
  {{ baz }}

{% endif %}
```
