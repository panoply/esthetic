---
title: 'Liquid - Delimiter Placement'
layout: base
permalink: '/rules/liquid/delimiterPlacement/index.html'
describe:
  - Delimiter Placement
  - Related Rules
  - Rule Options
options:
  - Preserve
  - Default
  - Inline
  - Consistent
  - Force
---

# Delimiter Placement

Controls the placement of opening and closing Liquid delimiters `{%`, `{{`, `}}` and `%}`. The rule will take effect in accordance with the internal structure of output and tag tokens.

::: note
This rule will only be applied to start, singleton and output tag types. Delimiters of end `{% end %}` type tags and those which encapsulate Liquid comments will always be formatted inline.
:::

##### Related Rules

The `delimiterPlacement` can be used together with the Liquid `delimiterTrims` and `normalizeSpacing` rules, both of which pertain to Liquid contained character sequences within tags.

- [`delimiterTrims`](/rules/liquid/delimiterTrims/)
- [`normalizeSpacing`](/rules/liquid/normalizeSpacing/)

---

# Rule Options

This is a Liquid specific formatting rule which defaults to using `preserve` when no option has been specified. The **recommended** option to use is `consistent` or `force-multiline`.

::: rule 👍

#### preserve

:::

The `preserve` option is what Æsthetic will **default** to using. The option will skip internal analysis which the delimiters encapsulate and instead the provided structure as the point of reference. Unlike the other rules, `preserve` will allow for both inline and force delimiter placement. All delimiter placements in the sample will be preserved when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "preserve",
    "forceFilters": 2
  }
}
```

<!-- prettier-ignore -->
```html
{% # Inline open and close delimiters are preserved %}
{{ object.prop | filter: 'value' }}

{% # Forced open and close delimiters are preserved %}
{{
  object.prop | filter: 'value'
}}

{% # Forced open and inline close delimiters are preserved %}
{{
  object.prop | filter: 'value' }}

{% # Inline open and forced close delimiters are preserved %}
{{ object.prop
  | filter: 'value'
  | append: 'sample'
}}
```

---

::: rule 🤡

#### default

:::

The `default` option uses the standard style approach as per Liquid and Shopify documentation examples. All delimiters in the sample will be formatted in accordance with most common applied structures. This option will replicates the Liquid Prettier plugin style applied to delimiters.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "default"
  }
}
```

<!-- prettier-ignore -->
```html
{{ object.prop | filter: 'value' }}

{{
  object.prop | filter: 'value'
}}

{{
  object.prop | filter: 'value' }}
```

---

::: rule 👍

#### inline

:::

The `inline` option will ensure that delimiters always start and end on the same line. The option will strip newlines and whitespace sequences and use a single whitespace character as the separator. All delimiters which have been forced onto newlines in the sample will be inlined when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "inline"
  }
}
```

<!-- prettier-ignore -->
```html
{% # Delimiters will be inlined %}
{%
  liquid
  if condition == assertion
    echo 'hello world!'
  endif
%}

{% # Delimiters will be inlined %}
{%
 if condition == assertion
 or something == condition
%}

  {% # Delimiters are already inlined, no changes will apply here %}
  {{ object.prop | filter: 'value' }}

  {% # Open delimiter extraneous whitespace is stripped and close delimiter will be inlined %}
  {{   object.prop
    | filter: 'value'
    | filter: 'value'
  }}

{% endif %}
```

::: rule 🙌

#### consistent

:::

The `consistent` option will use the opening (`{%` or `{{`) delimiter placement as its reference point for how the closing (`%}` or `}}`) delimiter should be formatted. If you were to force the opening delimiter onto a newline then the closing delimiter will also be forced. Ending delimiters (`%}` or `}}`) in the sample will be forced onto newlines but only if their leading (`{%` or `{{`) delimiters are forced.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "consistent"
  }
}
```

<!-- prettier-ignore -->
```html
{% # The tags ending delimiter will be inlined %}
{{ object.prop
 | filter_1: 'ones'
 | filter_2: 'two'
 | filter_3: 'three'
}}

{% # The tags ending delimiter will be inlined %}
{%- render 'snippet',
  param_1: 'one',
  param_2: 'two'
%}

{% # The starting delimiter will be inlined %}
{{
object.prop | filter: t: 'xxx' }}
```

::: rule 😳

#### force

:::

The `forced` option will force delimiters onto newlines. You should avoid using this option as there a very few use cases where it would be applicable. All delimiters in the sample will be forced onto newlines when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "force"
  }
}
```

<!-- prettier-ignore -->
```html
{%
  if condition == assertion %}

{% # All delimiters will be forced %}

{{ object.prop | filter_1: 'one' }}
{{ object.prop | filter_1: 'one' | filter_2: 'two' }}

{% section 'xxx' %}

{{
object.prop
| filter_1: 'ones'
| filter_2: 'two'
| filter_3: 'three' }}

{% endif %}
```
