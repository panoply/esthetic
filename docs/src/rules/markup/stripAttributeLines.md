---
title: 'Markup - Strip Attribute Lines'
layout: base
permalink: '/rules/markup/stripAttributeLines/index.html'
describe:
  - Strip Attribute Lines
  - Related Rules
  - Rule Options
options:
  - false
  - true
---

# Strip Attribute Lines

Whether or not newlines contained within tag attributes should be preserved. This rule is used along side the `forceAttribute` rule. When enabled (`true`) then Æsthetic will strip _empty_ newline occurrences within HTML tags attributes. When disabled (`false`) then newlines occurrences will be preserved in accordance with the **global** `preserveLine` limit defined.

# Related Rules

This rule wil only take effect when `forceAttribute` is enabled (ie: `true`) or a defined `forceAttribute` limit has been exceeded. The rule will also take effect if attribute forcing is being applied according to **global** `wrap` limits.

- [forceAttribute](/rules/markup/forceAttribute/)
- [preserveLine](/rules/global/preserveLine/)

# Rule Options

Below is an example of how this rule works using the following rule sets:

```js
{
  "preserveLine": 2, // Line preservations will respected this value
  "markup": {
    "forceAttribute": 2, // Can also be set to true but must not be false.
    "stripAttributeLines": true // This defaults to false
  }
}
```

::: rule 👍

#### `false`

:::

Below is the default, wherein the attributes preserve the newlines contained within, Notice how **before** formatting there is `4` lines present but **after** formatting only `2` are preserved as per the global `preserveLine` rule value.

<!-- prettier-ignore -->
```html


<!-- Before Formatting -->
<div
  class="x"

  {% # The lines above and below will be preserved %}

  id="{{ foo }}"
  data-x="xx">

  <div
    data-attr-1="one"
    data-attr-2="two"




    data-attr-3="three"
    data-attr-4="four"

    data-attr-5="five">


  </div>

</div>


<!-- After Formatting -->
<div
  class="x"

  {% # The lines above and below will be preserved %}

  id="{{ foo }}"
  data-x="xx">

  <div
    data-attr-1="one"
    data-attr-2="two"


    data-attr-3="three"
    data-attr-4="four"

    data-attr-5="five">

  </div>

</div>



```

---

::: rule 👎

#### `true`

:::

Below is an example of how this rule works if it's enabled, ie: `true`. This will strip out empty new lines contained in markup tag attributes.

<!-- prettier-ignore -->
```html

<!-- Before Formatting -->
<div
  class="x"

  {% # The lines above and below will be stripped %}

  id="{{ foo }}"
  data-x="xx">

  <div
    data-attr-1="one"
    data-attr-2="two"




    data-attr-3="three"
    data-attr-4="four"

    data-attr-5="five">

  </div>

</div>


<!-- After Formatting -->
<div
  class="x"
  {% # The lines above and below will be stripped %}
  id="{{ foo }}"
  data-x="xx">

  <div
    data-attr-1="one"
    data-attr-2="two"
    data-attr-3="three"
    data-attr-4="four"
    data-attr-5="five">

  </div>

</div>


```
