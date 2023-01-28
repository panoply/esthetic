---
title: 'Introduction - What is Æsthetic?'
layout: base
permalink: '/introduction/what-is-esthetic/index.html'
---

# What is Æsthetic?

Æsthetic is a lightweight, fast and extensible code beautification tool that exists as an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). It currently provides formatting support for 15 different client side languages and is used by the [vscode-liquid](https://liquify.dev) text editor extension/plugin. Æsthetic implements a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and has been adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

### Purpose

The main purpose of Æsthetic is to beautify code input by restructuring formations expressed within syntax. The tool is not a linter and it is not designed to correct invalid syntax, it's developed for code formatting of client side languages.

### Why Æsthetic?

Æsthetic implements an original parser approach and provides developers with a granular set of beautification rules resulting in user refined output. Preferred syntax style quirks and aestheticals are core to the programming experience. Æsthetic offers scaled control at the formatting level and does not impose opinionated conventions.

The most noteable selling point and aspect of the project is that the lexing algorithm and parse approach is an original strategic concept. Parsers typically produce an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (abstract syntax tree) whereas given that Æesthetic is built atop of an implementation of Sparser, it produces a uniformed table like structure resulting in fast traversal operations.

# Goals

Æsthetic has modest goals and despite running atop of Sparser which is universal and language aware it is not focused on supporting additional languages or exposing diff alogirthms. The focal point for Æesthetic is client side (front-end) flavoured languages with the extended support for beautificaiton of the Liquid template language. Overall, the goals of Æsthetic are align with goals specified in PrettyDiff:

#### Portability

The project should be immediately available cross platform, across various interfaces, and without a build process.

#### Productivity

The project should save a developer substantial time by making code easier to read against a variety of settings and reduce the steps to complete a given code analysis task.

#### Reproducibility

Code pushed through the project in any one mode should be equally restorable to its previous state using a different mode.

#### Simplicity

The project should do more with less code. The intended audience of this project are software developers, who may need to modify the project code to fit custom needs. Less code means increased portability. Clearer simple code allows separation of concerns, and cleaner organization.
