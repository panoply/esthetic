---
title: 'Format'
layout: base
permalink: '/api/esthetic.format/index.html'
anchors:
  - Format
  - Language Specific
  - HTML
  - Liquid
  - XML
  - CSS
  - JSON
  - JavaScript
---

# Format

The `{js} esthetic.format()` function is the core method for formatting code in Æsthetic. It accepts a `string` or `Buffer` containing the code to be formatted as its first argument. Optionally, you can provide a `rules` object as the second argument to specify custom formatting rules. When rules are provided, the beautification ruleset is updated, and the code is parsed and formatted according to these specifications.

> Rules are applied using immutable merges, ensuring that the original ruleset remains unchanged. For scenarios where you're executing consecutive format operations with identical rule-sets, it's more efficient to use the [`{js} esthetic.rules()`](/api/esthetic.rules/) method to set the rules once before running multiple format operations.

### Basic Usage

The `format` method is used to beautify code in Æsthetic. While error handling is optional, using a try/catch block is typically the best approach to manage potential parse errors (see [error handling](/parser/error-handling/)) during the beautification process. This method allows for better control and graceful handling of exceptions that may occur during formatting.

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const input = `<div id="foo" class="bar"> Hello World! </div>`

try {
  const output = esthetic.format(input, { language: 'html' })
  console.log(output)
} catch (e) {
  console.error(e);
}
```

> This above approach ensures that any parsing or formatting errors are caught and can be handled appropriately, preventing unexpected crashes in your application. You can use use `{js} esthetic.error` property to check for parse errors.

---

### Language Specifics

Æsthetic provides language-specific formatting methods that function similarly to `{js} esthetic.format()` but are tailored for specific languages, which prvents you having to apply `language` assignment. Like the general format method, these methods accept the code to be formatted as the first parameter and also take an optional second parameter for rules, with the difference being that these rules are relative to the specific language.

```js
import esthetic from 'esthetic';

// HTML Formatting
esthetic.html('..'); // -> string;

// Liquid Formatting
esthetic.liquid('..'); // -> string;

// JSON Formatting
esthetic.json('..'); // -> string;
```

> It's important to note that currently, only stable language-specific methods are made available. For unstable or less common languages, you should use the `{js} esthetic.format()` method and pass the appropriate `language` identifier within the `rules` parameter.

---

# The Format Process

The formatting process in Æsthetic is **synchronous** and executed in a modest two-cycle process. The first cycle involves the parse operation, this is where Æsthetic generates a data structure based on the provided code input. This first cycle can also be generated using the `{js} esthetic.parse()` method or in cases where you only require the parse table (see [parsing](/usage/parsing)). In the second cycle, beautification will take place, this is where Æsthetic traverses the data structure generated in the first cycle to produce the final formatted output.

The 2 cycle process is a fast operation and subsequent calls apply incremental traversal and updates. Æsthetic analyzes code in a performant manner because the parse table is a uniform array that uses an index based approach. There is no circular references, so re-parsing input with minimal diffs incurred will conclude up to 20x faster than that of an initial run.
