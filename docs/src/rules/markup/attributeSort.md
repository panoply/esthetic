# Attribute Sort

Provides sorting of HTML and XML Attributes. When **enabled** (`true`) it will sort attributes in an alpha-numeric order. Sorting is ignored on tags which contain Liquid output and tag type tokens as attributes.

::: note

When using `attributeSort`

:::

#### Related Rule

When enabled you can use the `attributeSortList` rule to defined sorting order.

#

---

#### Before Formatting

_Take the following tag with several attributes defined in no specific order. When the rule is enabled (ie: `true`) the sorting order of these attributes will change._

```html
<!-- After formatting -->
<div class="xxx" data-a="foo" data-b="100" data-c="true" id="x"></div>
```

#### After Formatting

_Using the above **before** sample, notice how all the attributes have now been alphabetically sorted (A-Z)._

```html
<!-- After formatting -->
<div class="xxx" data-a="foo" data-b="100" data-c="true" id="x"></div>
```
