# Attribute Sort

HTML Attribute sorting. When enabled it will sort attributes alphabetically. Attribute sorting is ignored on tags that contain
template attributes. Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the attributes are not alphabetically sorted before formatting is applied whereas after formatting they are sorted alphabetically.\_

# Examples

#### Before Formatting

```html
<div id="x" data-b="100" data-a="foo" data-c="x" class="xx"></div>
```

#### After Formatting

```html
<div class="xx" data-a="foo" data-b="100" data-c="x" id="x"></div>
```
