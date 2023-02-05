---
title: 'Liquid - Delimiter Placement'
layout: base
permalink: '/rules/liquid/delimiterPlacement/index.html'
anchors:
  - Preserve
  - Default
  - Consistent
  - Inline
  - Force Inline
  - Force Multiline
---

# Delimiter Placement

Controls the placement of opening and closing Liquid tag delimiters (`{%`, `{{`, `}}` and `%}`). This rule provides several different formatting options and will ensure that delimiters are beautified in concordance.

::: note
This rule applies to start, singleton and output tag types, End tag `{% end %}` delimiters will be inlined.
:::

##### Related Rules

The `delimiterPlacement` can be used together with the Liquid [`delimiterTrims`](/rules/liquid/delimiterTrims/) and [`normalizeSpacing`](/rules/liquid/normalizeSpacing/) rules all of which pertain to Liquid contained character sequences.

---

# Rule Options

This is a Liquid specific formatting rule which defaults to using `preserve` when no option has been specified. The **recommended** option to use is `consistent` or `force-multiline`.

::: rule 👍

#### preserve

:::

This is the **default** option. When `delimiterPlacement` is set to `preserve` Æsthetic will skip applying refinements to the delimiters and instead use the provided structure as its point of reference. All delimiter placements in the sample will be preserved when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "preserve"
  }
}
```

<!-- prettier-ignore -->
```html
{% # Inline delimiters are preserved %}
{{ object.prop | filter: 'value' }}

{% # Forced delimiters are preserved %}
{{
  object.prop | filter: 'value'
}}

{% # Opening force and closing inline is preserved %}
{{
  object.prop | filter: 'value' }}
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

The `inline` option will ensure that delimiters always start and end on the same line. Delimiters which have been forced onto newlines in the sample will be inlined when formatting.

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

{% endif %}
```

::: rule 🙌

#### consistent

:::

The `consistent` option will use the opening (`{%` or `{{`) delimiter placement as its reference point for how the closing (`%}` or `}}`) should be formatted. If you were to force the opening delimiter onto a newline then the closing delimiter will also be forced. Ending delimiters (`%}` or `}}`) in the sample will be forced onto newlines but only if their leading (`{%` or `{{`) delimiters are forced.

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

#### force-inline

:::

The `force-inline` option will force delimiters onto newlines. You should avoid using this option as there a very few use cases where it would be applicable. All delimiters in the sample will be forced onto newlines when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "force-inline"
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

::: rule 👎

#### force-multiline

:::

The `force-multiline` option will force delimiters only when tag contain spans multiple lines. Delimiters who's containing content spans multiple lines will be forced in the sample when formatting.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "delimiterPlacement": "force-multiline"
  }
}
```

<!-- prettier-ignore -->
```html
{% # These tags delimiters will be inlined as containing content is not multiline %}
{% if condition_1 == assertion_1
  and condition_2 == assertion_2
  and condition_3 == assertion_3 %}

{%- render 'snippet',
param_1: 'foo',
param_2: 'bar' -%}

{{ object.prop
  | filter_1: 'ones'
  | filter_2: 'two'
  | filter_3: 'three' }}

{% endif %}

{% # These tags delimiters will be inlined as containing content is not multiline %}

{%
  if condition_1 == assertion_1 and condition_2 == assertion_2
%}

{{
  object.prop | filter_1: 'ones'
}}

{{
  object.prop | filter_1: 'one' | filter_2: 'two'
}}

{% endif %}
````
