---
title: 'Introduction - What is Æsthetic?'
layout: base
permalink: '/introduction/what-is-esthetic/index.html'
anchors:
  - What is Æsthetic?
  - Why Æsthetic?
  - Æsthetic vs. Prettier
---

# What is Æsthetic?

Æsthetic is a lightweight, fast and extensible code beautification tool that exists as an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/) in providing formatting support for front-end orientated client side languages. Æsthetic implements a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and has been adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

Æsthetic supports parse, format and language detection capabilities for the following languages:

- [Liquid](https://shopify.github.io/liquid/)
- [HTML](https://en.wikipedia.org/wiki/HTML)
- [XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)
- [CSS](https://en.wikipedia.org/wiki/CSS)
- [SCSS](https://sass-lang.com)
- [JSON](https://en.wikipedia.org/wiki/JSON)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_overview)
- [TypeScript](https://www.typescriptlang.org/)
- [JSX](https://facebook.github.io/jsx/)
- [TSX](https://www.typescriptlang.org/docs/handbook/jsx.html)

# Motivation

Æsthetic was originally developed to handle chaotic and unpredictable Liquid + HTML markup structures. Before creating Æsthetic, there was no solution or tool available which supported Liquid infused syntax and developers working on projects using the template language were unable to leverage beautifiers. This became the accepted status-quo until [Austin Cheney](https://github.com/prettydiff) support for Liquid beautification in Sparser and PrettyDiff.

Before their (unofficial) retirement in late 2019 both [Sparser](https://github.com/Unibeautify/sparser) and its sister tool [PrettyDiff](https://github.com/prettydiff/prettydiff) supported diffing, beautification and minification for over **40+** different languages. Having grown fond and accustomed to the generated output of PrettyDiff I began sifting through the codebase to fix a couple defects and quickly became fascinated with the overall architecture of these tools.

The formatting style and overall approaches of these tools were different from others and by focusing attention to edge-cases pertaining to a template language like Liquid.

# Why Æsthetic?

The usage proposition for Æsthetic is mostly a matter of preference but there are several differences which separate it from alternative solutions in the nexus. Programming is form of artistic expression and Æsthetic does not want to impede upon the developers intent so it takes a "_First, do no harm_" approach. Code beautification will be **applied** in accordance with the **implied** structures of the **provided** input. Æsthetic is able to achieve this progressive adaptation with the uniformed data structure (parse table) it produces through the re-application of [Sparser](https://github.com/Unibeautify/sparser) and traversal cycle of [PrettyDiff](https://github.com/prettydiff/prettydiff). The parse table provides concise lexical context of code input which allows for otherwise complex structures to be interpreted for handling without needing to bend, augment or reach for additional resources.

##### _"Code is poetry. Don't let the auto-formatters take that away from you" - [David Wells](https://twitter.com/DavidWells)_

Adhering to the developers intent is a default behavior in Æsthetic and fundamental to the reconstruction process when code input is transformed (beautified). The granular set of formatting rules made available are applied in a progressively manner and the inferred changes it makes are expectational based. Because Æsthetic approaches beautification this way, it allows the developer to be both critical and explicit in how code should be formatted for their project at hand.

# Æsthetic vs. Prettier

Æsthetic does not want to replace tools like Prettier. Prettier is a fantastic tool and even the Æsthetic project uses Prettier when formatting markdown `.md` files. The usage proposition for choosing Æsthetic over Prettier or other formatters in the nexus is a matter of code expression. When working with languages comprised of complex patterns the opinionated conventions of Prettier tend to impede upon structural intent and this can become problematic.

Æsthetic is a different tool. Despite Prettier and Æsthetic providing formatting features their goals, philosophy and approaches differ.
