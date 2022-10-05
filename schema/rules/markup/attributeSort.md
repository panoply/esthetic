**Default** `false`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`

Provides sorting of HTML Attributes. When enabled it will sort attributes in an alpha-numeric order. Sorting is ignored on tags which contain or use Liquid tokens as attributes.

**Related**

When enabled you can use the `attributeSortList` rule to defined sorting order.

---

#### Example

_Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the attributes are not alphabetically sorted before formatting is applied whereas after formatting they are sorted alphabetically._

```html

<!-- Before formatting -->
<div
  id="x"
  data-b="100"
  data-a="foo"
  data-c="true"
  class="xxx"></div>

<!-- After formatting -->
<div
  class="xxx"
  data-a="foo"
  data-b="100"
  data-c="true"
  id="x"></div>

```
