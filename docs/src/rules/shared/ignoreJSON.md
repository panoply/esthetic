---
title: 'Markup - Ignore JSON'
layout: base
permalink: '/rules/ignoreJSON/index.html'
---

:: row gx-5
:: col-12 col-md-9

# Ignore JSON

Whether or not to format regions of code that are identified to be JSON. Such tags are typically identified using attribute annotations or in Liquid, identification is determine by tag name. By default, beautification will use all JSON specific rules.

Liquid tags containing JSON

- `{liquid} {% schema %}`

Markup script tags use type value

- `{json} "application/json"`
- `{json} "application/ld+json"`

::
::

---

:: row
:: col-12 col-md-7 col-lg-6

## false

After formatting the above sample notice how the `{json} "application/ld+json"` region has been completely skipped from formatting. Ignored regions are excluded in a strict manner, so indentation levels are completely void of change and will persist. Only the surrounding tokens will have beautification applied.

::
::

```json:rules
{
  "language": "html",
  "ignoreJSON": false
}
```

<!-- prettier-ignore-->
```html:before
<head>
      <title>
  Example
      </title>
<script type="application/ld+json">
{"foo"
: "bar",
"bax"      : "qux"
}
</script>
</head>
```

```html:after
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

---

:: row
:: col-12 col-md-7 col-lg-6

## true

Below is an example of how some input **might** look and the rule is enabled, ie: `{js} true`. The only changes that will be applied in **after** formatting example will be applied to the `<title>` tags.

::
::

```json:rules
{
  "language": "html",
  "ignoreJSON": true
}
```

```html:before
<head>
      <title>
  Example
      </title>
<script type="application/ld+json">
{"foo"
: "bar",
"bax"      : "qux"
}
</script>
</head>
```

```html:after
<head>
  <title>
    Example
  </title>
  <script type="application/ld+json">
    {"foo"
    : "bar",
    "bax"      : "qux"
    }
  </script>
</head>
```
