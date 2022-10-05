**Default** `[]`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `[]`

A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires `attributeSort` to be enabled, ie: have a value of `true`. If you have not set `attributeSort` to `true` then this rule will have no effect.

**Required**

The `attributeSort` rule must be enabled, ie: `true`

---

#### Example

_Below is an example of how this rule works and you've defined the following attribute sorting structure_

```js

{
  attributeSort: true, // must be true when using this rule
  attributeSortList: [
    'id',
    'class',
    'data-b',
    'data-z'
  ]
}

```

_Using the above options, notice how `data-a`, `data-c` `data-d` and `data-e` are sorted in an alphabetical order following the sort list we provided. All attributes not defined in the `attributeSortList` will be sorted alphabetically._

```html

<!-- Before formatting -->
<div
  data-z
  data-a
  id="x"
  data-d
  data-c
  data-b
  data-e
  class="xx"></div>

<!-- After formatting -->
<div
  id="x"
  class="xx"
  data-b
  data-z
  data-a
  data-c
  data-d></div>

```
