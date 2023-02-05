&nbsp;⚙️&nbsp;&nbsp;&nbsp;**Default** `false`

&nbsp;💁🏽‍♀️&nbsp;&nbsp;&nbsp;Recommended setting is `true`

#### Strip Attribute Lines

Whether or not newlines contained within tag attributes or preserved. This rule will be used along side the `forceAttribute` rule and when enabled (`true`) will strip newlines contained in HTML attributes. When disabled (`false`) then newlines will be preserved according to the **global** `preserveLine` limit defined.

#### Related Rules

This rule wil only take effect when `forceAttribute` is enabled (ie: `true`) or the `forceAttribute` limit has been exceeded as per the provided value. In addition to `forceAttribute`, the global `preserveLine` rule value is used to determine the amount of lines allowed.

#

---

#### Example Options

_Below is an example of how this rule works using the following rule sets_

```js
{
  "preserveLine": 2, // Line preservations will respected this value
  "markup": {
    "forceAttribute": 2, // Can also be set to true but must not be false.
    "stripAttributeLines": true // This defaults to false
  }
}
```

#### Disabled `false`

_Below is the default, wherein the attributes preserve the newlines contained within, Notice how **before** formatting there is `4` lines present but **after** formatting only `2` are preserved as per the global `preserveLine` rule value._

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

#### Enabled `true`

_Below is an example of how this rule works if it's enabled, ie: `true`. This will strip out empty new lines contained in markup tag attributes._

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
