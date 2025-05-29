---
title: 'Markup - Text Preserve'
layout: base
permalink: '/rules/markup/textPreserve/index.html'
---

:: row
:: col-12 col-md-9

# Text Preserve

Whether markup text content should formatted or preserved. This rule accepts a `boolean` type, and when enabled the rule will effectively ignore regions of text and in addition a small subset of tags surrounded by text identified tokens. The rule has side-effects and one should be aware of the overrides incurred.

> The global defined `preserveLine` rule will be and applied to the surrounding regions of text identified blocks, however the inner contents is ignored and `preserveLine` will have no effect.

#### Related Rules

The `textPreserve` rule will override global rules.

- [wrap](/rules/global/wrap/)
- [indentSize](/rules/global/indentSize/)
- [preserveLine](/rules/global/preserveLine/)

::
::

---

:: row
:: col-12 col-md-9

## false

Text contents are formatted

::
::

```json:rules
{
  "language": "html",
  "wrap": 50,
  "markup": {
    "textBoundInline": false,
    "textPreserve": false
  }
}
```

```html:before
<p>
  Lorem     ipsum dolor sit amet,
        consectetur adipiscing elit,
    sed    do eiusmod tempor     incididunt ut
  labore et dolore magna aliqua. Ut enim
                ad minim veniam
  laboris
    nisi ut aliquip      ex ea
                          commodo consequat.
</p>
```

```html:after
<p>
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim
  ad minim veniam
  laboris
  nisi ut aliquip ex ea
  commodo consequat.
</p>
```

---

:: row
:: col-12 col-md-9

## true

Text contents are preserved

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "textPreserve": true
  }
}
```

```html:before
<p>
  Lorem     ipsum dolor sit amet,
        consectetur adipiscing elit,
    sed    do eiusmod tempor     incididunt ut
  labore et dolore magna aliqua. Ut enim
                ad minim veniam
  laboris
    nisi ut aliquip      ex ea
                          commodo consequat.
</p>
```

```html:after
<p>
  Lorem     ipsum dolor sit amet,
        consectetur adipiscing elit,
    sed    do eiusmod tempor     incididunt ut
  labore et dolore magna aliqua. Ut enim
                ad minim veniam
  laboris
    nisi ut aliquip      ex ea
                          commodo consequat.
</p>
```
