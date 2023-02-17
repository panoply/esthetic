---
title: 'Liquid - Normalize Spacing'
layout: base
permalink: '/rules/liquid/normalizeSpacing/index.html'
---

#### Normalize Spacing

Whether or not to normalize and correct the inner spacing of Liquid tokens. The `normalizeSpacing` rule will equally distribute whitespace sequences contained within Liquid tags and output type tokens.

::: Note

Normalized spacing does not strip newline characters and does not process code encapsulated in quotation characters (ie: `"string"` or `'string'`). Below is an example of how this rule works if it's enabled, ie: `true` which is the default.

:::

---

# Rule Options

This is a Liquid specific formatting rule which will **default** to `true` when no option has been specified. The **recommended** option to use is `true`.

::: rule 🙌

#### true

:::

Take the following Liquid output and tag type tokens. Notice how the output (`object.prop`) token contains extraneous whitespace and `args` filter is not correctly spaced. In the `assign` tag token, the assignment operator (`=`), object dot notation `.` and `foo|bar` filter pipe separators are not using equally distributing whitespace.

<!--prettier-ignore-->
```html
{{  object.prop   |args:'x'  , 'xx'|    filter   :   ' preserve   string '   }}

{% assign  foo  =   'preserved  '   |  append : object . prop |foo|bar    %}
```

::: rule 😳

#### false

:::

_Using the above **before** formatting example, both the output and tag tokens are corrected. All extraneous whitespace is stripped and injected where necessary. Notice how all string tokens are left intact, this is because the `normalizeSpacing` rule does not touch or process string structures._

<!--prettier-ignore-->
```html
<!-- After formatting -->

{{ object.prop | filter: 'x', 'xx' | filter: ' preserve   string ' }}

{% assign foo = 'preserved  ' | append: object.prop %}
```
