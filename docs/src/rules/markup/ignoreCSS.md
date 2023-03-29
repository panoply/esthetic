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

#### Ignore CSS

Whether or not to format regions of code that are identified to be CSS. The HTML `<style>` tag can contain CSS and by default beautification is applied using the `style` rules. When ignored (ie: `true`) Æsthetic will not apply formatting to these regions.

::: note

This rule only applied to HTML `<style>` tags. Use the Liquid [ignoreTagList](/rules/liquid/ignoreTagList/) rule to exclude beautification on Liquid tokens such as the `{% style %}` or `{% stylesheet %}` tags.

:::

---

#### Before Formatting

_Below is an example of how some input **might** look and the rule is enabled, ie: `true`. The only changes that will be applied in **after** formatting example will be applied to the `<title>` tags._

```liquid

<!-- Before formatting -->
<section>
    <div> {% if x%}

<style>
.class { font-size: 12px; }
</style>

{% endif %}
</div> </section>


```

#### After Formatting

_After formatting the above sample notice how the `<style></style>` region has been completely skipped from formatting. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist, so it is up to you to apply beautification in your preferred manner. Only the surrounding tokens have beautification applied, the `<style></style>` tag remains in the same position and state as it was **before** formatting._

```liquid

<!-- After formatting -->
<section>
  <div>
    {% if x%}

<style>
.class { font-size: 12px; }
</style>

    {% endif %}
  </div>
</section>


```
