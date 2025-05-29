---
title: 'Liquid - Equipoise Spacing'
layout: base
permalink: '/rules/liquid/equipoiseSpacing/index.html'
anchors:
  describe:
    - Normalize Spacing
    - Rule Options
  options:
    - true
    - false
---

:: row
:: col-12 col-md-9

# Equipoise Spacing

Whether or not to normalize and correct the inner spacing of Liquid tokens. The `equipoiseSpacing` rule will equally distribute whitespace sequences contained within Liquid tags and output type tokens. This is a Liquid specific formatting rule which will **default** to `true` when no option has been specified. The **recommended** option to use is `true`.

> Equipoise does not strip newline characters and does not process code encapsulated in quotation characters, such as "string" or 'string' expressions. Æsthetic considers these preservation sequences.

::
::

---

:: row
:: col-12 col-md-9

## true

When the `equipoiseSpacing` rule is set to `true` which is the **default** applied option the internal structure of Liquid tags and output tokens and formatted to have a equal whitespace distribution. Notice how the output (`object.prop`) token contains extraneous whitespace and `args` filter is not correctly spaced. In the `assign` tag token, the assignment operator (`=`), object dot notation `.` and `foo|bar` filter pipe separators are not using equally distributing whitespace. Settings

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "equipoiseSpacing": true
  }
}
```

```liquid:before
{{  object.prop
 |args:'x'  , 'xx'
 | filter  :  ' preserve string ' }}

{% assign  foo=   ' preserve ' |  append : object . prop %}

{%  for    x   in   (10 . . 200)
 %}

{{ object   .property  [  "string"  ]   .foo
 |  append : object . prop  |args:'x'  , 'xx' }}

{%   endfor  %}
```

```liquid:after
{{ object.prop
  | args: 'x', 'xx'
  | filter: ' preserve string ' }}

{% assign foo = ' preserve ' | append: object.prop %}

{% for x in (10..200) %}

  {{ object.property["string"].foo
    | append: object.prop
    | args: 'x', 'xx' }}

{% endfor %}
```

---

:: row
:: col-12 col-md-9

## false

::
::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "equipoiseSpacing": false
  }
}
```

```liquid:before
{{  object.prop
 |args:'x'  , 'xx'
 | filter  :  ' preserve string ' }}

{% assign  foo=   ' preserve ' |  append : object . prop %}

{%  for    x   in   (10 . . 200)
 %}

{{ object   .property  [  "string"  ]   .foo
 |  append : object . prop  |args:'x'  , 'xx' }}

{%   endfor  %}
```

```liquid:after
{{  object.prop
 |args:'x'  , 'xx'
 | filter  :  ' preserve string ' }}

{% assign  foo=   ' preserve ' |  append : object . prop %}

{%  for    x   in   (10 . . 200)
 %}

{{ object   .property  [  "string"  ]   .foo
 |  append : object . prop  |args:'x'  , 'xx' }}

{%   endfor  %}
```
