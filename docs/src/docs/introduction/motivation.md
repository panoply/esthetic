---
title: 'Motivation'
layout: base
permalink: '/introduction/motivation/index.html'
prev:
  label: 'What is Æsthetic'
  uri: '/introduction/what-is-esthetic'
next:
  label: 'Language Support'
  uri: '/introduction/language-support'
anchors:
  - Motivation
  - The Evolution of Open Source
  - Balancing Consistency
---

# Motivation

Æsthetic was born out of the necessity to support Liquid + HTML markup formatting. Prior to the development of Æsthetic, there were no available solutions or tools capable of handling Liquid-infused syntax, leaving developers working on projects using this template language without the ability to leverage beautifiers. This limitation was accepted as the status quo until [Austin Cheney](https://github.com/prettydiff) introduced Liquid beautification support in Sparser and PrettyDiff.

Austin's tools became the go-to solution for Liquid beautification until their (unofficial) retirement in late 2019. At the time of their sunset, [Sparser](https://github.com/Unibeautify/sparser) and its sister tool [PrettyDiff](https://github.com/prettydiff/prettydiff) supported diffing, beautification, and minification for over **40+** different languages. Despite their abandonment, these tools continue to be used in production by thousands of projects, which is an ode to their exceptional reliability and enduring impact on the developer community.

# The Evolution of Open Source

Prior to their retirement, Sparser and PrettyDiff played a crucial role in supporting the [VSCode Liquid](https://github.com/panoply/vscode-liquid) extension. However, when maintenance ceased, it became imperative to confront the arising issues and defects. This was essential to ensure the seamless continuity of formatting capabilities in the VSCode Liquid extension, and to meet the needs of over 100k developers who relied on beautification features.

In order to sustain and enhance Liquid formatting support in VSCode, the existing codebase of Sparser/PrettyDiff was hard-forked and refinements were carried out. Navigating through the Sparser and PrettyDiff repositories posed challenges, given the lack of comments and limited guidance. Since Austin had been the sole maintainer of these projects for a significant period, the code reflected his specific style and acclimatization was difficult.

The process of delving into the code architecture proved otherwise fascinating, particularly the lexing approach crafted for language awareness and data structures. The parse algorithm itself served as a valuable source of inspiration and motivation during this process. Initially, efforts focused on fixing bugs and defects, but over time, minor refactors turned into substantial ones. The codebase and usage purpose began to shift, and though the original parse approach persists (serving as the foundation) the projects evolved into what we now know as Æsthetic.

# Balancing Consistency

In the world of code beautification, opinionated tooling has been the norm, often leaving developers with limited customization options. However, Æsthetic was conceived with a different motivation—to empower developers with a tool that offers both consistency and customization, bridging the gap between rigid formatters and flexible linting solutions.

In projects where flexibility and customization are paramount, strict formatters can pose challenges. While they excel in providing a standardized style, they may not always align with a developer's preferred code expression. This can lead to a sense of constraint, especially for developers who value their unique coding style and preferences. The goal of Æsthetic is to embrace these nuances with grace and flexibility, ensuring that developers have the freedom to shape their code while preserving readability and structure.

Finding the right balance between maintaining code consistency and allowing room for individual expression is a key challenge that Æsthetic addresses. By providing a granular set of formatting rules, Æsthetic empowers developers to fine-tune the code expression while retaining the essential details that might be lost with a strict approach. While recognizing the value of opinionated formatters with small surface APIs, Æsthetic also acknowledges that they may not cover all the intricacies and nuances of a complex codebase. With a more extensive and adaptable set of formatting options, Æsthetic allows developers to craft code that remains visually appealing and true to their original intent.

In conclusion, Æsthetic stands as a powerful ally for developers, offering a balanced approach that respects coding preferences while promoting consistency and maintainability. Developers can embrace Æsthetic as a tool to enhance their coding journey, creating codebases that reflect their unique artistry without having to involve a linter.
