---
title: 'Liquid - Normalize Spacing'
layout: base
permalink: '/rules/liquid/normalizeSpacing/index.html'
describe:
  - Normalize Spacing
  - Rule Options
options:
  - true
  - false
---

::: grid col-9 p-100

# Normalize Spacing

Whether or not to normalize and correct the inner spacing of Liquid tokens. The `normalizeSpacing` rule will equally distribute whitespace sequences contained within Liquid tags and output type tokens.

> Normalized spacing does not strip newline characters and does not process code encapsulated in quotation characters, such as `"string"` or `'string'` expressions. Æsthetic considers these preservation sequences.

This is a Liquid specific formatting rule which will **default** to `true` when no option has been specified. The **recommended** option to use is `true`.

:::

---

::: rule 🙌

#### true

:::

When the `normalizeSpacing` rule is set to `true` which is the **default** applied option the internal structure of Liquid tags and output tokens and formatted to have a equal whitespace distribution. Notice how the output (`object.prop`) token contains extraneous whitespace and `args` filter is not correctly spaced. In the `assign` tag token, the assignment operator (`=`), object dot notation `.` and `foo|bar` filter pipe separators are not using equally distributing whitespace. Settings

```json:rules
{
  "language": "liquid",
  "liquid": {
    "normalizeSpacing": true,
    "forceFilter": 2
  }
}
```

<!--prettier-ignore-->
```liquid
{{  object.prop
 |args:'x'  , 'xx'
 | filter  :  ' preserve string ' }}

{% assign  foo=   ' preserved ' |  append : object . prop |foo|bar%}

{%  for    x   in   (10 . . 200)
 parameter  :  2000 param  limit :1  %}

{{
   object   .property  [  "string"  ]   .foo
 |  append : object . prop  |args:'x'  , 'xx'
 }}

{%   endfor  %}


```

---

::: rule 👎

#### false

:::

```json:rules
{
  "language": "liquid",
  "liquid": {
    "normalizeSpacing": false,
    "forceFilter": 2
  }
}
```

<!--prettier-ignore-->
```liquid
{{  object.prop
 |args:'x'  , 'xx'
 | filter  :  ' preserve string ' }}

{% assign  foo=   ' preserved ' |  append : object . prop |foo|bar%}


{%  for    x   in   (10 . . 200) parameter  :  2000 param  limit :1  %}
{{ object.property[foo][0][100].prop[object.prop[0]] }}
{%   endfor  %}
```
