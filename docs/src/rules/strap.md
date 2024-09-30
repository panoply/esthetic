---
title: 'LANGUAGE - RULE_NAME'
layout: base
permalink: '/rules/[LANGUAGE]/[RULE_NAME]/index.html'
anchors:
  - ''
---

# RULE_NAME

Lorem Ipsum

::: note
Lorem Ipsum
:::

##### RELATED_RULES

Lorem Ipsum

---

# Rule Options

This is a LANGUAGE_NAME specific formatting rule which defaults to using `preserve` when no option has been specified.

<!--

🤡 => The choice of a clown
🙌 => Authors choice
👍 => Good choice.
🤌 => Delightful. Your mother is proud of you.
👎 => Not recommended
🫡 => Alright
😳 => We live in a society, we\'re not animals
💡 => Showing an example of the rule
🧐 => You gotta do, what you gotta do

-->

::: rule 👍

#### RULE_OPTION

:::

Lorem Ipsum

<!-- RULES ARE REQUIRED -->

```json:rules
{
  "language": "",
}
```

<!-- prettier-ignore -->
```liquid

```

---

<!-- prettier-ignore -->
```liquid

LINE BREAK SEPARATOR AFTER

USING DEFAULT WITH WRAP
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h,
    alt: alt,
    size: size,
    preload: true
}}

USING DEFAULT WITH ARGUMENT LINE BREAK LIMIT
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h,
    alt: alt,
    size: size,
    preload: true
}}


LINE BREAK SEPARATOR BEFORE

USING DEFAULT WITH WRAP
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w
    , height: h
    , alt: alt
    , size: size
    , preload: true
}}

USING DEFAULT WITH ARGUMENT LINE BREAK LIMIT
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h,
    alt: alt,
    size: size,
    preload: true
}}

USING INLINE
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x', width: w,
    height: h, alt: alt, size: size,
    preload: true
}}

USING NEWLINE
{{ settings.logo
  | image_url: width: 600
  | image_tag:
    class: 'x',
    width: w,
    height: h,
    alt: alt,
    size: size,
    preload: true
}}

USING NEWLINE
{{ settings.logo
  | image_url: width: 600
  | image_tag:
    , class: 'x'
    , width: w
    , height: h
    , alt: alt
    , size: size
    , preload: true
}}

USING PRESERVE
{{ settings.logo
  | image_url: width: 600
  | image_tag: class: 'x',
    width: w,
    height: h, alt: alt,
    size: size, preload: true
}}

```
