---
title: 'Introduction - What is Æsthetic?'
layout: base
permalink: '/introduction/what-is-esthetic/index.html'
prev:
  label: 'What is Æsthetic'
  uri: '/introduction/what-is-esthetic'
next:
  label: 'Installation'
  uri: '/introduction/installation'
anchors:
  - What is Æsthetic?
  - Why Æsthetic?
  - Æsthetic vs. Prettier
---

# What is Æsthetic?

Æsthetic is a lightweight, fast and extensible code beautification tool that provides formatting support for front-end orientated (client side) languages that exists as an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). Æsthetic implements a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and has been adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

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

# Why Æsthetic?

The usage proposition for Æsthetic is mostly a matter of preference but there are several notable differences that separate it from alternative solutions available in the beautification nexus. The approach of Æsthetic involves formatting code in accordance with the **implied** structures of the provided input. It takes a preservationist approach with progressive adaptation and in its default state makes an effort to not impede upon the developers intent.

Adhering to intent is at the core of Æsthetic and what separates it from other tools. The uniformed data structure (parse table) that Æsthetic produces and works with during traversal operations allows for progressive customizations, incremental updates and extensible control. The parse table alone provides concise lexical context of code input, both the parse and format operations execute in a modest 2 cycle process without needing to bend, augment or reach for additional resources. The tool exposes a granular set of formatting rules which allow developers to produce results that do not impede on preferred code style tastes.

# Æsthetic vs. Prettier

Æsthetic does not want to replace tools like Prettier. Prettier is a fantastic tool and even the Æsthetic project leverages it to format markdown files. The usage proposition for choosing Æsthetic over Prettier is a matter of code expression. When working with languages comprised of complex patterns the opinionated conventions of Prettier tend to impede upon structural intent and this can become problematic in programming languages where flexibility is a necessity.
