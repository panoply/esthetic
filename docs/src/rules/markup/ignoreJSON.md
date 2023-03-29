---
title: 'Markup - Ignore JSON'
layout: base
permalink: '/rules/markup/ignoreJSON/index.html'
describe:
  - Ignore JSON
  - Rule Options
options:
  - false
  - true
---

# Ignore JSON

Whether or not to format regions of code that are identified to be JSON. Such tags are typically identified using attribute annotations like `<script type="application/json">`. By default, beautification is applied using the `json` rules. When ignored (ie: `true`) Prettify will not apply formatting to these regions.

#

---

#### Before Formatting

_Below is an example of how some input **might** look and the rule is enabled, ie: `true`. The only changes that will be applied in **after** formatting example will be applied to the `<title>` tags._

```liquid

<!-- Before formatting -->
<head>

      <title>
  Example
      </title>

<script type="application/ld+json">
{
  "foo": "bar",
"bax": "qux"
}
</script>

</head>


```

#### After Formatting

_After formatting the above sample notice how the `<script type="application/ld+json"></script>` region has been completely skipped from formatting. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied._

```liquid

<!-- After formatting -->
<head>

  <title>
    Example
  </title>

<script type="application/ld+json">
{
  "foo": "bar",
"bax": "qux"
}
</script>

</head>


```
