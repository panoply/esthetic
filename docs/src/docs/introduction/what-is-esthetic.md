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

Æsthetic is a lightweight, fast, and extensible code beautification tool that offers comprehensive formatting support for front-end oriented languages. It presents itself as a viable alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). Based on a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm, Æsthetic has been thoughtfully adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

# Why Use Æsthetic?

The adoption of Æsthetic as a code beautification tool largely comes down to personal preference. However, several key differentiators set it apart from alternative solutions in the realm of code formatting. Æsthetic employs a "first, do no harm" tactic to formatting code, wherein it will align with the implied structures of provided input. This is preservationist approach with progressive adaptation.

At the core of Æsthetic is a commitment to maintaining the original intent of the code. It achieves this through a uniformed data structure known as the parse table, which enables progressive customizations, incremental updates, and extensible control during traversal operations. Data structure generation is executed in an efficient two-cycle process, wherein both parse and format operations are applied. It exposes a granular set of formatting rules, empowering developers to produce results that align with their preferred code style while retaining readability and consistency.

# Æsthetic vs. Prettier

Æsthetic does not seek to replace tools like Prettier, which remains an excellent formatter used even within the Æsthetic project for markdown files. The choice between Æsthetic and Prettier hinges on code expression needs, the nature of the programming languages involved and LoC. Prettier is an opinionated tool with defined conventions, which can be excellent for many scenarios. However, when dealing with languages consisting of intricate patterns and complex structures, Prettier's opinionated approach can inadvertently hinder upon the intended code structure in programming languages where flexibility is of utmost importance.

Although Æsthetic can produce formatting results similar to Prettier, it employs a distinct architecture and approach. Æsthetic excels in projects requiring fine-tuned control over strictness, particularly in scenarios where preserving structural intent and maintaining code malleability are crucial. Both tools have their merits: Prettier is a mature and brilliant tool, while Æsthetic offers greater flexibility and greater performance with large files. The decision between them ultimately depends on the target language, project requirements, and codebase characteristics. There's no universally right choice; rather, developers should select the tool that best aligns with their specific needs and preferences.

# Æsthetic vs. JS Beautify

Æsthetic and JS Beautify are both powerful code beautification tools that offer distinct approaches to code formatting. JS Beautify has well-established conventions, it provides a straightforward solution that excels at automatically applying consistent formatting to code with minimal configuration and is the fastest beautification tool available in the JavaScript ecosystem. Æsthetic, in contrast, adopts a more adaptable and customizable approach to code beautification that prioritizes preserving the structural intent with progressive customization.

The choice between these tools ultimately depends on the language being formatted, the specific needs of the developer and the nature of the project. While JS Beautify offers simplicity, speed, and adherence to established standards, Æsthetic provides enhanced customization for achieving malleable results. Developers should select the tool that best aligns with their project's demands, considering whether consistency and speed or customization and structural preservation are more critical for their code formatting approach.
