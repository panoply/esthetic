---
title: 'Introduction - What is Æsthetic?'
layout: base
permalink: '/introduction/what-is-esthetic/index.html'
---

# What is Æsthetic?

Æsthetic is a lightweight, fast and extensible code beautification tool that exists as an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). It currently provides formatting support for front-end orientated client side languages. Æsthetic implements a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and has been adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

Æsthetic provides parse, format and language detection capabilities with support for **10** different languages:

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

# Why Æsthetic?

Æsthetic is little different from other formatters in the nexus. The parse approach implemented is an original strategic concept that produces a uniformed table like structure and allows for otherwise complex structures to be traversed and interpreted for handling without having to bend, augment or reach for additional resources to address weaknesses. The data structure generated is a refined uniform array comprised of identifiable types, characters sequences and stack references that make sense of supplied (code) input. The parse table is used to reconstruct code during the beautification cycle and adhere to the granular set of beautification that work in accordance with the developers intent.

###### _"Code is poetry. Don't let the auto-formatters take that away from you" - [David Wells](https://twitter.com/DavidWells)_

# Æsthetic vs. Prettier

Æsthetic does not want to replace tools like Prettier and even the Æsthetic project uses Prettier when formatting markdown `.md` files. The usage proposition for choosing Æsthetic over Prettier or other formatters in the nexus is a matter of code expression. When working with languages comprised of complex patterns the opinionated conventions of a project like Prettier tend to impede upon structural intent and this can become problematic.

Æsthetic is a different tool. Despite Prettier and Æsthetic providing formatting features their goals, philosophy and approaches differ.
