---
title: 'Markup - Ignore JS'
layout: base
permalink: '/rules/markup/ignoreJS/index.html'
describe:
  - Ignore JS
  - Rule Options
examples:
  - false
  - true
---

::: grid col-8 p-100

# Ignore JS

Whether or not to format regions of code that are identified to be JavaScript. Tags such as `<script>` and `{% javascript %}` can contain JavaScript and by default beautification is applied using the `script` rules. When ignored (ie: `true`) Æsthetic will not apply formatting to these regions.

When enabled (ie: `true`) the entire `<script>` region is excluded including indentation levels. If the `<script>` tag is being used to link an external file (eg: `<script src="/path/fle.js"></script>`) and no code is detected between the opening and closing tags then formatting will be applied in accordance with defined rules pertaining to markup.

> This rule only applies to HTML `<script>` tags. Use the Liquid [ignoreTagList](/rules/liquid/ignoreTagList/) rule to exclude beautification on Liquid tokens such as the `{% javascript %}` tag.

:::

---

::: rule 🧐

#### true

:::

Below is an example of how some input **might** look and the rule is enabled, ie: `true`. The only changes that will be applied in **after** formatting example will be applied to the `<title>` tags.

```json:rules
{
  "language": "html",
  "markup": {
    "ignoreJS": true
  }
}
```

<!-- prettier-ignore-->
```html
<!-- Before formatting -->
<head><title>Example</title>

<script>
  // This entire region will remain the same between formatting
  // the <script> tag will not move nor will this content.
  const foo = 'bar';
</script>


</head>
```

---

::: rule 🧐

#### true

:::

After formatting the above sample notice how the `<script></script>` region has been completely skipped from formatting. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

```json:rules
{
  "language": "html",
  "markup": {
    "ignoreJS": false
  }
}
```

<!-- prettier-ignore-->
```html
<!-- Before formatting -->
<head><title>Example</title>

<script>
const foo = 'bar';
</script>


</head>
```
