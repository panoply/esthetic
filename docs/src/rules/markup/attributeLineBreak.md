---
title: 'Markup - Attribute Line Break'
layout: base
permalink: '/rules/attributeLineBreak/index.html'
---

:: row
:: col-12 col-md-9

# Attribute Line Break

Configures newline behavior for tag attributes. Accepts a `boolean` or `number`. Overrides Æsthetic's default, which applies newlines based on the global [`wordWrap`](/rules/wordWrap/) limit or existing newlines before the first attribute. Setting `attributeLineBreak` to an integer (e.g., `1`) triggers newlines when the number of attributes exceeds the specified limit.

When [`wordWrap`](/rules/wordWrap/) is enabled, Æsthetic inlines the first attribute to maintain readability within the specified character limit. The Liquid [`indentAttributes`](/rules/liquid/indentAttributes) rule depends on `attributeLineBreak` to determine its formatting behavior. For `indentAttributes` to apply indentation correctly, you must either set an occurrence limit (e.g., a number like `1` to trigger newlines after a certain number of attributes) or explicitly enable the `attributeLineBreak` rule to activate this functionality.

To replicate the Prettier formatting style, which places ending `>` tag delimiters on newlines when attributes trigger line breaks, configure the `terminusBracket` rule to `2`. Alternatively, enable the `prettier` preset to automatically apply this behavior, ensuring consistent output that aligns with Prettier's attribute and tag delimiter formatting conventions.

::
::

---

:: row mt-5
:: col-12 col-md-7 col-lg-6

## false

The default behavior for Æsthetic is to disable attribute newline breaks and only apply forcing when word wrap limit has been exceeded. Æsthetic in its default state sets `wordWrap` to `0` and this results in inline formatting behaviour of tag attributes, with any newline occurrence being stripped.

::
::

```json:rules
{
  "language": "html",
  "attributeLineBreak": false
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

  Attributes will be inlined

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

:: row
:: col-12 col-md-7 col-lg-6

## true

Setting the rule to `true` will applied forced linebreak indentation. A single occurence of a tag attribute will result in newline breaks.

::
::

```json:rules
{
  "language": "html",
  "attributeLineBreak": true
}
```

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

:: row
:: col-12 col-md-7 col-lg-6

## limit

You can control attribute limits before line breaks apply by providing the rule an integer. Below, we've passed `attributeLineBreak` a value of `3` which results in newline breaks applied to tags with `3` (or more) attributes.

::
::

```json:rules
{
  "language": "html",
  "attributeLineBreak": 3
}
```

```html:before
<div
  class="foo"
  id="bar">
  Attributes will not be forced as only 2 exist on tag
</div>
<div
  class="foo"
  id="bar" data-x="baz">
  <div
    class="foo">
    Tag contains 1 attribute, it will not be forced
  </div>
  <div
   class="foo" id="bar" data-x="baz" data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>
</div>
```

```html:after
<div class="foo" id="bar">
  Attributes will not be forced as only 2 exist on tag
</div>
<div
  class="foo"
  id="bar"
  data-x="baz">
  <div class="foo">
    Tag contains 1 attribute, it will not be forced
  </div>
  <div
    class="foo"
    id="bar"
    data-x="baz"
    data-xx="xxx">
    Tag contains 4 attributes, they will be forced
  </div>
</div>
```

---

:: row
:: col-12 col-md-7 col-lg-6

## wordWrap

Attributes can apply newline breaks in accordance with [`wordWrap`](/rules/wordWrap/), which might be preferred for some developers. Æsthetic will respect wrap based forcing to attributes then the `attributeLineBreak` rule is set to `false` and `wordWrap` has a value greater than `0` defined.

::
::

```json:rules
{
  "language": "html",
  "wordWrap": 50,
  "attributeLineBreak": false
}
```

```html:before
<div
  class="inline">
  <div
    class="foo"
    id="bar"
    data-x="baz">
    <div class="foo" id="bar" data-x="baz" data-xx="xxx">
      Tag attributes apply newlines
    </div>
  </div>
</div>
```

```html:after
<div class="inline">
  <div class="foo" id="bar" data-x="baz">
    <div
      class="foo"
      id="bar"
      data-x="baz"
      data-xx="xxx">
      Tag attributes apply newlines
    </div>
  </div>
</div>
```
