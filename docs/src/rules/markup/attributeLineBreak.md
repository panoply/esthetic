---
title: 'Markup - Attribute Line Break'
layout: base
permalink: '/rules/markup/forceAttribute/index.html'
describe:
  - Attribute Line Break
  - Related Rules
  - Mirrored Rules
options:
  - Enable
  - Disable
  - Limit
examples:
  - Wrap Forcing
---

::: grid col-12 col-sm-9 p-100

# Attribute Line Break

Whether or not markup attributes should be forced indented onto newlines. This rule accepts a `boolean` or `integer` type, both of which allow you to refine how attributes are to be formatted independent of Æsthetic's default behavior of using the global [`wrap`](/rules/global/wrap) limit. When you provide `forceAttribute` an integer value of **`1` or more** Æsthetic will apply forcing when the number of attributes contained within a tag exceeds the supplied value limit.

> Attribute forcing is disabled by default as the global [`wrap`](/rules/global/wrap) limit is set to `0`. If you want wrap based forcing, you will need to set a word wrap character width.

### Related Rules

If you are using the global defined [`wrap`](/rules/global/wrap) then Æsthetic will inline the leading (first) attribute. For developers who have become accustomed to the Prettier formatting style which forces ending `>` markup tag delimiters onto newlines can replicate this output using the `delimiterTerminus` rule.

- [`wrap`](/rules/global/wrap)
- [`delimiterTerminus`](/rules/markup/forceLeadAttribute)

### Mirrored Rule

The Liquid [`indentAttributes`](/rules/liquid/indentAttributes) rule uses `forceAttribute` as disablement mirror. When attribute forcing is disabled then the Liquid `indentAttributes` rule reflects the disablement. In order to leverage the Liquid `indentAttributes` rule you will need to define an occurrence limit or enable this rule.

- [`indentAttributes`](/rules/liquid/indentAttributes)

:::

---

::: rule 👎

#### false

:::

Below is the default, wherein attributes are not forced or indented.

```json:rules
{
  "language": "liquid",
  "markup": {
    "forceAttribute": false
  }
}
```

<!-- prettier-ignore -->
```html
<div
  class="x"
  id="{{ foo }}"
  data-x="xx">

  Attributes will be inlined

</div>
```

---

::: rule 👎

#### true

:::

Below is an example of how this rule works if it's enabled, ie: `true`. When working with Liquid this is typically going to be the better option to use opposed when you desire a clear uniform across all your project.

```json:rules
{
  "language": "liquid",
  "markup": {
    "forceAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
<div class="x" id="{{ foo }}" data-x="xx">
  <div class="x" id="{{ foo }}" data-x="xx">

    Attributes will be forced onto newlines

  </div>
</div>
```

---

::: rule 🙌

#### 3

:::

Below is an example of forced attributes when an integer value of `3` was provided. This is typically the best option to control attribute beautification.

```json:rules
{
  "language": "liquid",
  "markup": {
    "forceAttribute": 3
  }
}
```

<!-- prettier-ignore -->
```html
<div class="x" id="{{ foo }}">

Attributes will not be forced as only 2 exist on tag

</div>

<div class="x" id="{{ foo }}" data-x="xx">

  Attributes will be forced as tag contains 3

  <div class="x">
    Tag contains 1 attribute, it will not be forced
  </div>

  <div class="x" id="{{ foo }}" data-x="xx" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>

</div>
```

---

# Wrap Forcing

The below example is using [`wrap`](/rules/global/wrap) forcing. If you wish to apply wrap based forcing to attributes then the `forceAttribute` rule should be set to `false` and the global `wrap` rules must contain a value.

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "markup": {
    "forceAttribute": false
  }
}
```

<!-- prettier-ignore -->
```html
<div class="x" id="{{ foo }}">

 Attributes will not be forced as only 2 exist on tag

</div>

<div class="x" id="{{ foo }}" data-x="xx">

   Attributes will be forced as tag contains 3

  <div class="x">
    Tag contains 1 attribute, it will not be forced
  </div>

  <div class="x" id="{{ foo }}" data-x="xx" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>

</div>
```
