---
title: 'Markup - Attribute Line Break'
layout: base
permalink: '/rules/markup/attributeLineBreak/index.html'
anchors:
  describe:
    - Attribute Line Break
    - Related Rules
    - Mirrored Rule
  options:
    - false
    - true
    - limit
    - wrap
---

::: grid col-12 p-100

# Attribute Line Break

Controls newline behavior of tag attributes. This rule accepts a `boolean` or `number` type and will allow you to refine how attributes are to be formatted independent of the Æsthetic's default behavior which applies newline breaks in accordance with the global [`wrap`](/rules/global/wrap) limit or when a newline character exists before the first attribute sequence. When you provide `attributeLineBreak` an integer value of **1 or more** Æsthetic will apply newline breaks when the number of attributes contained within a tag exceeds the limit.

#### Related Rules

If you are using the global defined [`wrap`](/rules/global/wrap) then Æsthetic will inline the leading (first) attribute. For developers who have become accustomed to the Prettier formatting style which forces ending `>` markup tag delimiters onto newlines can replicate this output using the `delimiterTerminus` rule.

- [wrap](/rules/global/wrap/)
- [delimiterTerminus](/rules/markup/delimiterTerminus/)
- [valueLineBreak](/rules/markup/valueLineBreak/)

#### Mirrored Rule

The Liquid [`indentAttributes`](/rules/liquid/indentAttributes) rule uses `attributeLineBreak` as disablement mirror. When attribute forcing is disabled then the Liquid `indentAttributes` rule reflects the disablement. In order to leverage the Liquid `indentAttributes` rule you will need to define an occurrence limit or enable this rule.

- [indentAttributes](/rules/liquid/indentAttributes)

:::

---

::: rule 🫡

#### false

:::

The default behavior for Æsthetic is to disable attribute newline breaks and only apply forcing when word wrap limit has been exceeded (see [wrap](#wrap) example below). If you are formatting with wrap disabled (i.e, `wrap` is set to `0`) then attributes will be formatted inline and any newline occurrences will be stripped.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": false
  }
}
```

```html:before
<div class="foo"
  id="bar"
  data-x="baz">

  Attributes will be inlined

</div>
<div
  class="foo" id="bar"
  data-x="baz">

  Attributes will be indented

</div>
```

```html:after
<div class="foo" id="bar" data-x="baz">

  Attributes will be inlined

</div>
<div class="foo" id="bar" data-x="baz">

  Attributes will be inlined

</div>
```

---

::: rule 👎

#### true

:::

Below is an example of how this rule works if it's enabled, ie: `true`. When working with html this is typically going to be the better option to use opposed when you desire a clear uniform across all your project.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": true
  }
}
```

<!-- prettier-ignore -->
```html:before
<div class="foo" id="bar" data-x="baz">
  <div class="foo" id="bar" data-x="baz">

    Attributes will be forced onto newlines

  </div>
</div>
```

```html:after
<div
 class="foo"
 id="bar"
 data-x="baz">
  <div
   class="foo"
   id="bar"
   data-x="baz">

    Attributes will be forced onto newlines

  </div>
</div>
```

---

::: rule 🙌

#### limit

:::

Below is an example of forced attributes when an integer value of `3` was provided. This is typically the best option to control attribute beautification.

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": 3
  }
}
```

<!-- prettier-ignore -->
```html:before
<div
 class="foo"
 id="bar">

Attributes will not be forced as only 2 exist on tag

</div>

<div
 class="foo"
 id="bar" data-x="baz">

  Attributes will be forced as tag contains 3

  <div class="foo">
    Tag contains 1 attribute, it will not be forced
  </div>

  <div
   class="foo" id="bar" data-x="baz" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>

</div>
```

```html:after
<div
 class="foo"
 id="bar">

Attributes will not be forced as only 2 exist on tag

</div>

<div
 class="foo"
 id="bar" data-x="baz">

  Attributes will be forced as tag contains 3

  <div class="foo">
    Tag contains 1 attribute, it will not be forced
  </div>

  <div
   class="foo" id="bar" data-x="baz" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>

</div>
```

---

::: rule 🧐

#### wrap

:::

The below example is using [`wrap`](/rules/global/wrap) to apply attribute newline breaks. If you wish to apply wrap based forcing to attributes then the `attributeLineBreak` rule should be set to `false` and the global `wrap` rules must contain a value.

```json:rules
{
  "language": "html",
  "wrap": 50,
  "markup": {
    "attributeLineBreak": false
  }
}
```

<!-- prettier-ignore -->
```html
<div class="foo" id="bar">

 Attributes will not be forced as only 2 exist on tag

</div>

<div class="foo" id="bar" data-x="baz">

   Attributes will be forced as tag contains 3

  <div class="foo">
    Tag contains 1 attribute, it will not be forced
  </div>

  <div class="foo" id="bar" data-x="baz" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>

</div>
```
