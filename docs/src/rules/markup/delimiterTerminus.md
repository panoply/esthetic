---
title: 'Markup - Delimiter Terminus'
layout: base
permalink: '/rules/markup/delimiterTerminus/index.html'
describe:
  - Delimiter Terminus
  - Rule Options
options:
  - false
  - true
  - 3
---

:: row
:: col-12 col-md-9

# Delimiter Terminus

Whether or not ending HTML tag delimiters should be forced onto a newline when tag attributes exist. This will emulate the style of Prettier's `bracketSameLine` formatting option, wherein the last `>` delimiter character breaks itself onto a newline.

The rule accepts either a `boolean` or `number` type and defaults to `false`, which will prevent delimiters from newline breaks. When enabled, forcing will be applied in accordance with the [attributeLineBreak](/rules/markup/attributeLineBreak/). The rule also accepts a `number` type, which will apply delimiter line breaks according to the number of attributes a tag contains.

#### Related Rules

This rules interfaces with `attributeLineBreak` and will behave in accordance.

- [attributeLineBreak](/rules/markup/attributeLineBreak/)

::
::

---

:: row
:: col-12 col-md-9

## false

The `delimiterTerminus` rule is disabled (i.e, `false`) by default. The behavior of delimiter terminus using `false` results in the last `>` delimiter character occurrence being inlined.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": 2,
    "delimiterTerminus": false
  }
}
```

```html:before
<div
  id="x"
  class="xx"
  data-attr="foo"
>
  <div
    id="x"
    class="xx"
    data-attr="foo"
  >
  </div>
</div>
```

```html:after
<div
  id="x"
  class="xx"
  data-attr="foo">
  <div
    id="x"
    class="xx"
    data-attr="foo"></div>
</div>
```

---

:: row
:: col-12 col-md-9

## true

When the `delimiterTerminus` rule is enabled, Æsthetic applies the terminus based on the [attributeLineBreak](/rules/markup/attributeLineBreak/) rule or the [wrap](/rules/markup/wrap/) limit, triggering newline breaks as needed. If `attributeLineBreak` is set to an integer, terminus adheres to this value. For example, setting attributeLineBreak to `3` as per the below example will format attributes on separate lines when an element has three or more attributes. If fewer than three attributes are present, they are formatted inline, and terminus follows this behavior.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "attributeLineBreak": 3,
    "delimiterTerminus": true
  }
}
```

```html:before
<div id="x">
  <div
    id="x"
    class="xx"
  >
    Terminus will be inlined
  </div>
</div>
<div id="bar">
  <div
    id="x"
    class="xx"
    data-attr="foo"
  >
    <main
      id="x"
      class="xx"
      data-attr="foo"
    >
      Notice how all elements with 3 attributes
      break onto newlines, but those with 1 are inline
    </main>
  </div>
</div>
```

```html:after
<div id="x">
  <div id="x" class="xx">
    Terminus will be inlined
  </div>
</div>
<div id="bar">
  <div
    id="x"
    class="xx"
    data-attr="foo"
  >
    <main
      id="x"
      class="xx"
      data-attr="foo"
    >
      Notice how all elements with 3 attributes
      break onto newlines, but those with 1 are inline
    </main>
  </div>
</div>
```

---

:: row
:: col-12 col-md-9

## 4

When the `delimiterTerminus` rule is set to an integer value, it uses the number of attributes to determine terminus behavior. For example, if delimiterTerminus is set to `4` and attributeLineBreak to `3` as per the below demonstration, delimiters are line breaked, only when an element has four or more attributes.

::
::

```json:rules
{
  "language": "html",
  "preserveLine": 1,
  "markup": {
    "attributeLineBreak": 3,
    "delimiterTerminus": 4
  }
}
```

```html:before
<div id="bar" class="bax">
  The below element will apply terminus
  <div
    id="1"
    class="two"
    data-x="3"
    data-y="4"
  >
    <main
      id="x"
      class="xx"
      data-attr="foo"
    >
      No terminus wil apply here
    </main>
  </div>
</div>
```

```html:after
<div id="bar" class="bax">
  The below element will apply terminus
  <div
    id="1"
    class="two"
    data-x="3"
    data-y="4"
  >
    <main
      id="x"
      class="xx"
      data-attr="foo">
        No terminus wil apply here
    </main>
  </div>
</div>
```
