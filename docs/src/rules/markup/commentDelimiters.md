---
title: 'Markup - Comment Delimiters'
layout: base
permalink: '/rules/markup/commentDelimiters/index.html'
describe:
  - Comment Delimiters
  - Rule Options
options:
  - preserve
  - inline
  - inline-align
  - force
  - consistent
---

::: grid col-9 p-100

# Comment Delimiters

Controls the placement of HTML and XML (i.e: markup) type comment delimiters. This is a **markup** specific formatting rule that defaults to using `preserve` and applied to languages using (`<!--` and `-->`= delimiter tokens.

### Related Rules

The `commentDelimiters` rule will reference the `commentIndent` rule and behave in accordance. When the **markup** specific `preserveComment` rule has been defined and set to `true` it will takes precedence and this option will have no effect.

- [`commentIndent`](/rules/markup/commentIndent)
- [`preserveComment`](/rules/markup/preserveComment)

:::

---

::: rule 👍

#### preserve

:::

The `commentDelimiters` rule is set to `preserve` by default. Markup comment delimiters using this option can using a mixed placement structure.

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "html",
  "markup": {
    "commentDelimiters": "preserve"
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  The start and end delimiters will be preserved -->
<div>
  <!-- Comment delimiters are inlined -->
  <nav>

    <!-- Comment delimiters can be forced or inlined
    -->

    <!--
      Delimiters will adapt to their placement
    -->
  </nav>
</div>
```

---

::: rule 😳

#### inline

:::

When the `commentDelimiters` rule is set to `inline`, markup comment delimiters will be placed inline. When `commentIndent` is enabled and comments span multiple lines then each newline indentation will align with the comments starting delimiter `-` dash character that will comprise of a single indentation. Toggle the `rules` tab to enable/disable `commentIndent` and observe the differences applied to comments which span multiple lines.

```json:rules
{
  "language": "html",
  "markup": {
    "commentIndent": true,
    "commentDelimiters": "inline"
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  Comment delimiters will always be inlined -->
<div>
  <!--
    Forcing is not possible when set to inline
  -->
  <nav>
    <!--
      Comments which span multiple lines will still
      respect wrap but will begin and end on the same
      line as the comment contents. This is generally
      not very elegant, but I'm not the boss of you, so
      do what the fuck you want.
    -->
  </nav>
</div>
```

---

::: rule 😳

#### inline-align

:::

When the `commentDelimiters` rule is set to `inline-align`, markup comment delimiters will be placed inline, identical to `inline` but the difference with `inline-align` is that when comment span multiple lines, each newline will begin at the end of starting delimiter. This option requires that `commentIndent` is enabled, when disabled the rules will behave identical to `inline`. Toggle the `rules` tab to enable/disable `commentIndent` and observe the differences applied to comments which span multiple lines.

```json:rules
{
  "language": "html",
  "markup": {
    "commentIndent": true,
    "commentDelimiters": "inline-align"
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  Comment delimiters will always be inlined -->
<div>
  <!--
    Forcing is not possible when set to inline
  -->
  <nav>
    <!--
      Comments which span multiple lines will still
      respect wrap but will begin and end on the same
      line as the comment contents. This is generally
      not very elegant, but I'm not the boss of you, so
      do what the fuck you want.
    -->
  </nav>
</div>
```

---

::: rule 🙌

#### force

:::

When the `commentDelimiters` rule is set to `force` delimiters will be forced onto newlines.

```json:rules
{
  "language": "html",
  "markup": {
    "commentIndent": true,
    "commentDelimiters": "force"
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  Comment delimiters will always apply forcing -->
<div>
  <!-- Example -->
  <nav>
    <!-- This is the authors choice. It's rather
    elegant to always applying forcing, but only some
    dev's like that style (the cool ones).
    -->
  </nav>
</div>
```

---

::: rule 🤡

#### consistent

:::

The `consistent` option will use the opening (`<!--`) delimiter placement as its reference point for how the closing (`-->`) delimiter should be formatted. If you were to force the opening delimiter onto a newline then the closing delimiter will also be forced. Forcing is applied accordion to how the opening delimiter is structured.

```json:rules
{
  "language": "html",
  "markup": {
    "commentIndent": true,
    "commentDelimiters": "consistent"
  }
}
```

<!-- prettier-ignore -->
```html
<!--
  Comment delimiters either be forced or inlined -->
<div>
  <!-- Forcing is determined by the starting delimiter
   -->
  <nav>
    <!-- The first comment will be forced because a newline
    follows the starting delimiter, but the second comment
    will have delimiters inlined because the starting delimiter
    is not forced.

    This comment will applying forcing, as similar to the 2nd
    comment, the first delimiter is inline with this text.
    -->
  </nav>
</div>
```
