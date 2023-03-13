---
title: 'Liquid - Delimiter Trims'
layout: base
permalink: '/rules/liquid/delimiterTrims/index.html'
describe:
  - Delimiter Trims
  - Rule Coupling
  - Rule Options
options:
  - preserve
  - tags
  - outputs
  - never
  - always
  - multiline
  - linebreak
---

# Delimiter Trims

Delimiter whitespace trim dashes `{%-`, `-%}`, `{{-` and `-}}` control. This rule can be used for handling trim `-` application of delimiter expressions in Liquid tag and output type tokens.

::: note

This rule will not touch Liquid tokens encapsulated within strings, e.g: `"{{ foo }}"` and/or `'{{ foo }}'`. Tags which exist in string values or those contained between quotation characters are left intact.

:::

# Rule Coupling

The [linebreak](#linebreak) or [multiline](#multiline) choices will apply trims `-` to tokens that span multiple lines and when using these options with [delimiterPlacement](/rules/liquid/delimiterPlacement/) set to `force-multiline` will result in **rule coupling**. Coupled rules work in unison and are designed to enhance how the internal structure of applied code is generated.

- [delimiterPlacement](/rules/liquid/delimiterPlacement/)

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

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

When the `delimiterTrims` rule is set to `outputs` then Liquid tokens using `{{` and `}}` delimiters will have trims applied. This rule will leave tag type token `{%` and `%}` delimiter trims intact. In the sample the `if`, `render` and `endif` tag delimiter trims will be preserved but the `{{ foo }}`and `{{ bar }}` output tags will have trims inserted.

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

::: rule 👎

#### multiline

:::

When the `delimiterTrims` rule is set to `multiline` trims will be applied to tags and output type tokens when the internal structure spans multiple lines. This typically occurs on tokens which contain several filters, arguments or control conditions. Both the opening and closing delimiters will apply trims.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "multiline"
  }
}
```

<!-- prettier-ignore -->
```html
{%
  if condition == assertion
  or condition == expectation
  or something == comparison
%}

  {{
    object.prop
    | param_1: true
    | param_2: 1000
    | param_3:
      arg_1: 'value',
      arg_2: 2000,
      arg_3: false,
      arg_4: true,
      arg_5: 2000,
      arg_6: nil
    | param_4: true
    | param_5: 1000
  }}

{% endif %}
```

---

::: rule 🙌

#### linebreak

:::

When the `delimiterTrims` rule is set to `linebreak` then a single trim will be applied to an **opening** delimiter (`{{`, `{%`) of multiline tokens. The choice uses the internal structure of tokens together with the [lineBreakSeparator](/rules/liquid/lineBreakSeparator) and [delimiterPlacement](/rules/liquid/delimiterPlacement) rules to determine when a trim `-` insertion is to be applied. Using this choice helps overall readability but comes with drawbacks. Trims will only ever be applied to multiline tokens and insertion differs based on the `lineBreakSeparator` value. The `delimiterPlacement` rule is also referenced during the determination cycle.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterTrims": "linebreak",
    "delimiterPlacement": "force-multiline"

  }
}
```

<!-- prettier-ignore -->
```html
{%
  if condition == assertion
  or condition == expectation
  or something == comparison %}

  {{-
    object.prop
    | param_1: true
    | param_2: 1000
    | param_3:
      arg_1: 'value',
      arg_2: 2000,
      arg_3: false,
      arg_4: true,
      arg_5: 2000,
      arg_6: nil
    | param_4: true
    | param_5: 1000
  }}

{% endif %}
```

---
