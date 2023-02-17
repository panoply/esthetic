---
title: 'Rules'
layout: base
permalink: '/rules/index.html'
---

# Rules

Æsthetic provides a granular set of beautification options (rules). The projects [Typings](https://github.com/panoply/esthetic/tree/pre-release/types/rules) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/Æsthetic) to get a better idea of how code will be beautified.

## Global

Æsthetic global rules are formatting options which will be used within all supported languages.

- [Crlf](#)
- [End Newline](#)
- [Indent Char](#)
- [Indent Size](#)
- [Language](#)
- [Preserve Line](#)
- [Preset](#)
- [Wrap](#)

## Liquid

Æsthetic provides formatting support for the [Liquid Template Language](https://shopify.github.io/liquid/). Liquid syntax contained within HTML, CSS, JavaScript and JSON languages are all supported. Æsthetic exposes **14** different Liquid specific beautification rules and has informative error diagnostics.

- [Comment Indent](/rules/liquid/commentIndent)
- [Comment Newline](/rules/liquid/commentNewline)
- [Delimiter Placement](/rules/liquid/delimiterPlacement)
- [Delimiter Trims](/rules/liquid/delimiterTrims)
- [Force Filter Wrap](/rules/liquid/forceFilterWrap)
- [Force Lead Argument](/rules/liquid/forceLeadArgument)
- [Ignore Tag List](/rules/liquid/ignoreTagList)
- [Indent Attributes](/rules/liquid/indentAttributes)
- [Line Break Separator](/rules/liquid/lineBreakSeparator)
- [Normalize Spacing](/rules/liquid/normalizeSpacing)
- [Preserve Comment](/rules/liquid/preserveComment)
- [Preserve Internal](/rules/liquid/preserveInternal)
- [Quote Convert](/rules/liquid/quoteConvert)

## HTML

Æsthetic provides formatting support for the HTML markup language.

- [Attribute Casing](#)
- [Attribute Sort](#)
- [Attribute Sort List](#)
- [Comment Indent](#)
- [Comment Newline](#)
- [Correct](#)
- [Delimiter Force](#)
- [Force Attribute](#)
- [Force Indent](#)
- [Force Lead Attribute](#)
- [Ignore CSS](#)
- [Ignore JS](#)
- [Ignore JSON](#)
- [Preserve Attribute](#)
- [Preserve Comment](#)
- [Preserve Text](#)
- [Self Close Space](#)
- [Self Close SVG](#)
- [Strip Attribute Lines](#)
- [Quote Convert](#)

## CSS

Æsthetic provides formatting support for the CSS language.

- [At Rule Space](#)
- [Comment Indent](#)
- [Comment Newline](#)
- [Correct](#)
- [Class Padding](#)
- [No Lead Zero](#)
- [Preserve Comment](#)
- [Sort Properties](#)
- [Sort Selectors](#)
- [Quote Convert](#)

## JSON

Æsthetic provides formatting support for the JSON language.

- [Allow Comments](#)
- [Array Format](#)
- [Brace Allman](#)
- [Brace Padding](#)
- [Object Indent](#)
- [Object Sort](#)
