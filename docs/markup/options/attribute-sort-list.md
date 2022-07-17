# Attribute Sort List

A comma separated list of attribute names. Attributes will be sorted according to this list and then alphanumerically. This option requires `attributeSort` have to be enabled, ie: have a value of `true`. Below is an example of how this rule works if it's enabled and you've defined the following attribute sorting structure.

# Recommendation

# Definition

```js
{
  attributeSort: true, // Must be true when using this rule
  attributeSortList: ['id', 'class', 'data-b']
}
```

# Examples

Using the above options, notice how how `data-a`, `data-c` and `data-d` are sorted alphabetically in order following the sort list we provided:

### Before Formatting

```html
<div data-a id="x" data-d data-c data-b class="xx"></div>
```

### After Formatting

```html
<div id="x" class="xx" data-b data-a data-c data-d></div>
```

# Notes
