---
title: 'Introduction - What is Æsthetic?'
layout: base
permalink: '/introduction/what-is-esthetic/index.html'
prev:
  label: 'What is Æsthetic'
  uri: '/introduction/what-is-esthetic'
next:
  label: 'Motivation'
  uri: '/introduction/motivation'
anchors:
  - What is Æsthetic?
  - Why Æsthetic?
  - Æsthetic vs. Prettier
  - Æsthetic vs. JSBeautify
---

# What is Æsthetic?

Æsthetic is a lightweight, fast, and extensible code beautification tool that offers comprehensive formatting support for front-end oriented (client-side) languages. It presents itself as a viable alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/), providing developers with a powerful and flexible option for code formatting. Based on a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm, Æsthetic has been thoughtfully adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

# Why Æsthetic?

The adoption of Æsthetic as a code beautification tool largely comes down to personal preference. However, several key differentiators set it apart from alternative solutions in the realm of code formatting. Æsthetic's unique approach involves formatting code in alignment with the **implied** structures of the provided input. It takes a preservationist approach while incorporating progressive adaptation to ensure the most natural and intuitive formatting results.

At the core of Æsthetic is a commitment to maintaining the original intent of the code. It achieves this through a uniformed data structure known as the parse table, which enables progressive customizations, incremental updates, and extensible control during traversal operations. The parse table itself provides a concise lexical context of the code input, streamlining the formatting process.

Æsthetic boasts a remarkably efficient two-cycle process for parse and format operations, eliminating the need for additional resources. It exposes a granular set of formatting rules, empowering developers to produce results that align with their preferred code style while retaining readability and consistency.

# Æsthetic vs. Prettier

Æsthetic does not seek to replace tools like Prettier; in fact, Prettier remains a fantastic tool, and the Æsthetic project itself utilizes it to format markdown files. The decision to choose Æsthetic over Prettier revolves around code expression and the nature of the programming languages at hand.

Prettier is an opinionated tool with defined conventions, which can be excellent for many scenarios. However, when dealing with languages consisting of intricate patterns and complex structures, Prettier's opinionated approach may inadvertently hinder the intended code structure. This becomes especially relevant in programming languages where flexibility is of utmost importance.

Æsthetic has the capability to produce the same formatting results as Prettier, but it employs a different overall architecture and approach. By offering a more adaptable and customizable formatting experience, Æsthetic caters to scenarios where maintaining the structural intent and code flexibility are crucial. This distinction makes Æsthetic a preferred choice for projects that necessitate fine-tuned control over code expression.

# Æsthetic vs. JS Beautify

Æsthetic and JS Beautify are both powerful code beautification tools, each offering distinct approaches to code formatting that cater to different preferences and requirements. JSBeautify, is known for its well-established conventions, is an excellent choice for developers seeking a straightforward and opinionated code formatting solution. It excels at automatically applying consistent formatting to JavaScript code, making it easy to achieve a uniform and standardized style.

On the other hand, Æsthetic takes a more adaptable and customizable approach to code beautification. It prioritizes preserving the structural intent of the code while providing developers with a granular set of formatting rules. This allows for fine-tuned control over the code expression, making it ideal for projects with complex patterns and nuanced structures.

Ultimately, the decision between Æsthetic and JS Beautify will depend on the specific needs and preferences of the developer and the nature of the project at hand. Both tools have their merits, providing valuable formatting solutions for JavaScript codebase with different degrees of complexity and expression requirements.
