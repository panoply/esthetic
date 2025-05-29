---
title: 'Markup - Comment Preserve'
layout: base
permalink: '/rules/markup/commentPreserve/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

:: row
:: col-12 col-md-9

# Comment Preserve

Preserve the inner contents of HTML comments. When this rule is enabled (i.e: `true`) it will ignore formatting HTML comments and override `commentIndent` and `commentDelimiter` rule definitions.

#### Example

In the below example we have enabled comment preservation. Both the `commentIndent` and `commentDelimiter` rules will no longer have effect on output as the the `commentPreserve` rule takes precedence.

::
:: col-12 col-md-9

<!--prettier-ignore-->
```json
{
  "language": "html",
  "markup": {
    "commentPreserve": true,        // When enabled, this rule takes precedence
    "commentDelimiter": "newline",  // This will be ignored
    "commentIndent": true           // This will be ignored
  }
}
```

::
::

---

:: row
:: col-12 col-md-9

## false

This `commentPreserve` rule is set to `false` by default. In the example below, the Liquid comment will be formatted.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "commentDelimiter": "newline",
    "commentIndent": true,
    "commentPreserve": false
  }
}
```

```html:before
<ul>
  <li>Hello</li>

      <!--

    This comment will be not be preserved

    These lines however will be aligned to
    the starting point of the comment blocks.
    In the next example where we set
    this rule the true, you will notice
    how preservation is respected.

      -->
  <li>World</li>
  <!--
              Same as above, the comment is preserved!

              -->
</ul>
```

```html:after
<main>
  <!--
    This comment will not be indented and aligned.

    These lines however will be aligned to
    the starting point of the comment blocks.
    In the next example where we set
    this rule the true, you will notice
    how preservation is respected.
  -->
  <aside>
    Hello World!
  </aside>
  <!--
    Same as above, the comment will be formatted!
  -->
</main>
```

---

:: row
:: col-12 col-md-9

## true

When the `commentPreserve` rule is enabled (`true`) then the contents of block comments will be excluded from formatting. As aforementioned, when set to `true` the rule will override `commentDelimiter` and `commentIndent` settings.

::
::

```json:rules
{
  "language": "html",
  "markup": {
    "commentDelimiter": "newline",
    "commentIndent": true,
    "commentPreserve": true
  }
}
```

```html:before
<ul>
 <li>    Hello    </li>
    <!--

  This comment will be preserved
  Even though we have set both the
  "commentNewline" and "commentIndent"
  rules to true.

        The comment tag will will align
        itself to the li node above
        but the content will not be touched.

              This is nice when you need to provide detailed
              descriptions or code examples within comments.

    -->

<li>World</li>
<!--
              Same as above, the comment is preserved!

              -->
</ul>
```

```html:after
<ul>
  <li>Hello</li>
      <!--

    This comment will be preserved
    Even though we have set both the
    "commentNewline" and "commentIndent"
    rules to true.

          The comment tag will will align
          itself to the li node above
          but the content will not be touched.

                This is nice when you need to provide detailed
                descriptions or code examples within comments.

      -->
  <li>World</li>
<!--
              Same as above, the comment is preserved!

              -->
</ul>
```

---
