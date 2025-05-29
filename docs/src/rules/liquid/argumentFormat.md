---
title: 'Liquid - Argument Format'
layout: base
permalink: '/rules/liquid/argumentFormat/index.html'
anchors:
  describe:
    - Argument Format
    - Determination Reference
    - What constitutes an argument?
  options:
    - inline-newline
    - newline
    - inline
    - preserve
---

:: row
:: col-12 col-md-9

# Argument Format

The `argumentFormat` rule controls the formatting tactic Æsthetic uses when handling argument expressions. Arguments are value expressions passed to tag parameters and filters. The rule takes effect in conjunction with, [lineBreakSeparator](/rules/liquid/lineBreakSeparator/), [argumentLineBreak](/rules/liquid/forceArgument/) and [wrap](/rules/global/wrap/) settings. By default, Æsthetic uses the `argumentLineBreak` value as a reference for determining how to format arguments.

> The `argumentFormat` rule has a significant impact on output and interacts closely with options related to the beautification of arguments, filters, and separators. It's a versatile rule and is capable of producing eight distinct structural variations in code formatting.

### Determination Reference

This rule uses [argumentLineBreak](/rules/liquid/forceArgument/) as its primary determination reference. The resulting output applies in accordance with the value provided to `argumentLineBreak`. By default, `argumentLineBreak` is set to `0`, which signals to Æsthetic that it should apply newline breaks to arguments only when the [wrap](/rules/global/wrap/) limit has been exceeded. This wrap limit is a separate configuration that defines the maximum line length before wrapping occurs. The determination reference for `argumentFormat` rests upon these ruleset values. This rule operates in accordance with these rules, which determine how argument expressions are formatted within the constraints set by `argumentLineBreak`.

### What constitutes an argument?

Æsthetic categorizes "arguments" according to the syntactic formation of character and keyword occurrences contained within Liquid tokens. Understanding what constitutes an argument is mostly about prefix analysis and character sequencing. The table below attempts to describe what Æsthetic considers an "argument" in each of the token example. Each entry in the array represents what Æsthetic has determined to be an argument.

| Token                                                           | Arguments                                         |
| --------------------------------------------------------------- | ------------------------------------------------- |
| `{liquid} {{ object \| filter: 'foo', 'bar' }}`                 | `{ts} ["'foo'", "'bar'"]`                         |
| `{liquid} {{ object \| filter: param: 'foo', 'bar' }}`          | `{js} ["param:", "'foo'", "'bar'"]`               |
| `{liquid} {{ object \| filter: foo: a, bar: b, baz: 'c','d' }}` | `{js} ["foo: a", "bar: b", "baz:", "'c'", "'d'"]` |
| `{liquid} {% render 'file', param: 'example' %}`                | `{js} ["param:", "'example'"`                     |
| `{liquid} {% cycle foo, bar, baz %}`                            | `{js} ["foo", "bar", "baz"]`                      |
| `{liquid} {% custom, id='value', class='xxx' %}`                | `{js} ["id='value'", "class='xxx'"]`              |

::
::

---

:: row
:: col-12 col-md-9

## preserve

The `preserve` option is the **default** selection. This option will preserve line arguments placement. Both newline and inline determination is left up to you. Æsthetic will perform equipoise operations in conjunction with the input structure, which includes [`wrap`](/rules/liquid/wrap/) based line breaks and [`lineBreakSeparator`](/rules/liquid/lineBreakSeparator/) changes.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "argumentFormat": "preserve"
  }
}
```

```liquid:before
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w, height: h, alt: alt
    , size: size
    , preload: true
}}
```

```liquid:after
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w, height: h, alt: alt
    , size: size
    , preload: true
}}
```

---

:: row
:: col-12 col-md-9

## newline

The `newline` option emulates the behavior of the Liquid Prettier Plugin. The options will force indent all arguments onto newlines and uses the [argumentLineBreak](/rules/liquid/forceArgument/) rule as its primary determination reference. Æsthetic recommends that developers consider alternative options rather than adhering to the prettier style.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "argumentFormat": "newline"
  }
}
```

```liquid:before
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h, alt: alt, size: size, preload: true
}}
```

```liquid:after
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x'
    , width: w
    , height: h
    , alt: alt
    , size: size
    , preload: true
}}
```

---

:: row
:: col-12 col-md-9

## inline

All arguments are applied inline, line breaks occurs at wrap limit or according to argument linebreak.

::
::

```json:rules
{
  "language": "liquid",
  "wrap": 50,
  "liquid": {
    "argumentLineBreak": 0,
    "argumentFormat": "inline"
  }
}
```

```liquid:before
{{ settings.logo
  | image_url:
    width: 600
  | image_tag:
    class: 'x', width: w,
    height: h, alt: alt,
    size: size,
    preload: true
}}
```

```liquid:after
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w, height: h, alt: alt,
    size: size, preload: true
}}
```

---

:: row
:: col-12 col-md-9

#### inline-newline

The `inline-newline` option uses [argumentLineBreak](/rules/liquid/forceArgument/) to determine the maximum number of arguments that can appear on a single line. Any arguments which exceed or break the `argumentLineBreak` value will be placed on subsequent newlines. As per its name, this option is a combination of both inline and newline.

::
::

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "liquid",
  "wrap": 70,
  "liquid": {
    "argumentFormat": "inline-newline"
  }
}
```

```liquid:before
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h,
    alt: alt,
    size: size,
    preload: true
}}
```

```liquid:after
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w, height: h, alt: alt
    , size: size
    , preload: true
}}
```
