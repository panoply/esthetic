---
title: 'Markup - Ignore CSS'
layout: base
permalink: '/rules/markup/ignoreCSS/index.html'
describe:
  - Ignore CSS
  - Rule Options
examples:
  - false
  - true
---

::: grid col-8 p-100

# Ignore CSS

Whether or not to format regions of code that are identified to be CSS. The HTML `<style>` tag can contain CSS and by default beautification is applied using the `style` rules. When ignored (ie: `true`) Æsthetic will not apply formatting to these regions.

> This rule only applied to HTML `<style>` tags. Use the Liquid [ignoreTagList](/rules/liquid/ignoreTagList/) rule to exclude beautification on Liquid tokens such as the `{% style %}` or `{% stylesheet %}` tags.

:::

---

<!--

🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice

-->

::: rule 🧐

#### true

:::

The below example shows embedded CSS code region. When the rule is `false` the entire region is preserved and formatting is skipped.

```json:rules
{
  "language": "html",
  "markup": {
    "ignoreCSS": true
  }
}
```

<!-- prettier-ignore-->
```html
<section>
<div>


<style>
  .class {
font-size: 12px;
background-color   : #FFF;
    }

        </style>

</div>
</section>
```

---

::: rule 🙌

#### false

:::

Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist, so it is up to you to apply beautification in your preferred manner. Only the surrounding tokens have beautification applied, the `<style></style>` tag remains in the same position and state as it was **before** formatting.

```json:rules
{
  "language": "html",
  "markup": {
    "ignoreCSS": false
  }
}
```

<!-- prettier-ignore-->
```html
<section>
<div>

<style>
  .class {
font-size: 12px;
background-color   : #FFF;
    }

        </style>

</div>
</section>
```
