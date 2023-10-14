---
title: 'Format'
layout: base
permalink: '/usage/format/index.html'
anchors:
  - Format
  - Language Specific
  - HTML
  - Liquid
  - XML
  - CSS
  - JSON
  - JavaScript
prev:
  label: 'Rules'
  uri: '/usage/rules'
next:
  label: 'Inline Control'
  uri: '/usage/inline-control'
---

# Format

Using Æsthetic in your project is straightforward: simply use the `format` method to beautify code. This method takes a `string` or `Buffer` type argument as its first parameter. You also have the option to provide an additional `rules` argument, which allows you to customize the beautification process using the passed ruleset. When you provide rules, the beautification ruleset is updated, and code will be parsed and formatted accordingly.

> Rules apply immutable merges. The `esthetic.rules()` method can be used if executing consecutive formats with a ruleset that is identical for each run.

#### Basic Usage

Below we are formatting code using the `format` method and leveraging try/catch to control potential parse errors. Using try/catch is optional (see [error handling](/parser/error-handling)) but typically the best way to perform beautification.

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const input = `.class { font-size: 0.95rem; background-color: pink; }`

try {

  const output = esthetic.format(input, {
    language: 'css',
    style: {
      noLeadZero: true
    }
  })

  console.log(output)

} catch (e) {

  console.error(e)
}
```

## Using Language Specifics

Language specific formatting methods work the same as `esthetic.format` but are refined to operate on a language specific level. These methods accept only relative rules as a second parameter as the `language` option is inferred. Language specific format methods are perfect in cases where you are performing beautification to single language.

> Currently, only stable language specific methods are made available. Use the `esthetic.format` method to apply beautification on unstable languages and pass the `language` identifier via `rules`.

#### Examples

```js
import esthetic from "esthetic";

 // HTML Formatting
esthetic.html('..'): string;

// Liquid Formatting
esthetic.liquid('..'): string;

// XML Formatting
esthetic.xml('..'): string;

// CSS Formatting
esthetic.css('..'): string;

// JSON Formatting
esthetic.json('..'): string;

// JavaScript Formatting
esthetic.js('..'): string;
```

## The Format Process

The formatting process in Æsthetic is **synchronous** and executed in a modest two-cycle process. The first cycle involves the parse operation, this is where Æsthetic generates a data structure based on the provided code input. This first cycle can also be generated using the `esthetic.parse()` method, if cases where you only require the parse table (see [parsing](/usage/parsing)). In the second cycle, beautification takes place, this is where Æsthetic traverses the data structure generated in the first cycle to produce the final formatted output.

The 2 cycle process is a fast operation and subsequent calls apply incremental traversal and updates. Æsthetic analyzes code in a performant manner because the parse table is a uniform array that uses an index based approach. There is no circular references, so re-parsing input with minimal diffs incurred will conclude 20x faster than that of an initial run.
