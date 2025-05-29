---
title: 'Global Rules - Wrap'
layout: base
permalink: '/rules/wordWrap/index.html'
---

:: row
:: col-12 col-md-9

# Word Wrap

Character width limit before applying word wrap. A value of `0` will disable wrapping and is the default setting.

::
::

:: row mt-5
:: col-12 col-md-9

## wrap

Below is we instructed to Æsthetic to preserve `0` empty lines. Notice how before formatting the code has several empty newlines but after formatting all lines are stripped.

::
::

```json:rules
{
  "language": "html",
  "endNewline": false,
  "wordWrap": 30,
  "forceIndent": true,
  "preserveText": false

}
```

```html:before
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et
  dolore magna aliqua. Ut enim ad minim veniam, quis
  nostrud exercitation ullamco laboris nisi ut aliquip ex
  ea commodo consequat.
</p>
<p>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et
  dolore magna aliqua. Ut enim ad minim veniam, quis
  nostrud exercitation ullamco laboris nisi ut aliquip ex
  ea commodo consequat
</p>
```

```html:after
<p>
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit,
  sed do eiusmod tempor
  incididunt ut labore et
  dolore magna aliqua. Ut enim
  ad minim veniam, quis
  nostrud exercitation ullamco
  laboris nisi ut aliquip ex
  ea commodo consequat.
</p>
<p>
  Lorem ipsum dolor sit amet,
  consectetur adipiscing elit,
  sed do eiusmod tempor
  incididunt ut labore et
  dolore magna aliqua. Ut enim
  ad minim veniam, quis
  nostrud exercitation ullamco
  laboris nisi ut aliquip ex
  ea commodo consequat
</p>
```
