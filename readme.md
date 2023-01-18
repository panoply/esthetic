### v0.4.4-beta.1

_This module is in its infancy and working towards an official release candidate. Refer to the [Language Support](#language-support) before using the module and please note that this readme will be subject to change._

# Æsthetic

Code beautification tool for formatting HTML, Liquid, CSS/SCSS, JavaScript, TypeScript and more! Æsthetic is built atop of the original [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and its parse approach has been repurposed from the distributed source of the late and powerful [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

- [playground](https://liquify.dev/Æsthetic)
- [vscode-liquid](https://github.com/panoply/vscode-liquid)

### Features

- Fast, performant and lightweight (50kb gzip).
- Language aware. Automatically infers handling.
- Provides a granular set of formatting rules.
- Uniformed (parse table) data structures with incremental traversal.
- Drop-in solution with no complexities.
- 15 different languages supported

### Documentation

Currently working on documentation to better inform upon rules and overall architecture. Below are the descriptions used in the Schema Stores and does a great job at explaining each rule.

- [Global](https://github.com/panoply/liquify-schema/tree/master/stores/descriptions/format/global)
- [Liquid](https://github.com/panoply/liquify-schema/tree/master/stores/descriptions/format/liquid)
- [Markup](https://github.com/panoply/liquify-schema/tree/master/stores/descriptions/format/markup)
- [Json](https://github.com/panoply/liquify-schema/tree/master/stores/descriptions/format/json)
- [Style](https://github.com/panoply/liquify-schema/tree/master/stores/descriptions/format/style)

> **Note**&nbsp;
> Script mode documentation is still being worked on.

## What is Æsthetic?

Æsthetic is a lightweight, fast and extensible code beautification tool. It currently provides formatting support for 15 different languages and is used by the [Liquify](https://liquify.dev) text editor extension/plugin. Æsthetic implements a variation of the universal [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and was originally adapted from the distributed source of [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md). The module has been refined for usage in projects working with client side and consumer facing languages and exists as an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/).

## Motivation / Backstory

Æsthetic was developed to handle chaotic and unpredictable Liquid + HTML markup structures. Before creating Æsthetic, alternative solutions did not support Liquid infused syntax and thus developers using this template language were not able to leverage beautifiers. I learned of Sparser and PrettyDiff while seeking a solution to this problem and discovered that both these tools supported Liquid and several additional template language infused beautification. Sparser and PrettyDiff had unfortunately fallen into disarray and were no longer being _actively_ maintained as of 2019 so I began sifting through the code and was fascinated with the original universal parse algorithm that author [Austin Cheney](https://github.com/prettydiff) created and employed.

Given that these tools had extended support for style and script language beautification there was endless potential and not only was it possible to bring support for Liquid in HTML and markup but I could also leverage the existing logic to extend support into in all common client side and consumer facing languages while still facilitating features without its Liquid containment.

## Purpose

The main purpose of Æsthetic is to take code input of a language, restructure formations expressed within the code and return a more refined output. The tool is not a linter, and it is not designed to correct invalid syntax, it's developed for code beautification of client side consumer facing languages.

### Why Æsthetic?

The reapplication of Sparser and PrettyDiff into Æsthetic is an example of evolutionary open source. Æsthetic provides developers with a granular set of beautification rules that allow for customized output allows developers to comfortably infuse Liquid into different languages without sacrificing beautification support, it intends to be the solution you'd employ when working with the template language.

The lexing algorithm and parse approach employed in Æsthetic is an original strategic concept. Parsers typically produce an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (abstract syntax tree) Æsthetic implementation of Sparser will produces a uniformed table like structure.

### Language Support

Below is a current support list of languages, their completion status and whether you can run Æsthetic for beautification. You can leverage on languages above 90% completion, anything below that is not yet ready for the big time. Languages with an above 80% completion status will work with basic structures, but may not be viable in some cases and can be problematic.

| Language            | Status       | Operational | Usage                           |
| ------------------- | ------------ | ----------- | ------------------------------- |
| XML                 | 92% Complete | ✓           | _Safe enough to use_            |
| HTML                | 94% Complete | ✓           | _Safe enough to use_            |
| Liquid + HTML       | 92% Complete | ✓           | _Safe enough to use_            |
| Liquid + CSS        | 87% Complete | ✓           | _Safe enough to use_            |
| JSON                | 88% Complete | ✓           | _Safe enough to use_            |
| CSS                 | 92% Complete | ✓           | _Safe enough to use_            |
| SCSS                | 82% Complete | ✓           | _Use with caution_              |
| Liquid + JSON       | 80% Complete | ✓           | _Use with caution_              |
| Liquid + JavaScript | 80% Complete | ✓           | _Use with caution_              |
| JavaScript          | 78% Complete | 𐄂           | _Use with caution_              |
| TypeScript          | 70% Complete | 𐄂           | _Avoid using, many defects_     |
| JSX                 | 70% Complete | 𐄂           | _Avoid using, many defects_     |
| LESS                | 60% Complete | 𐄂           | _Avoid using, many defects_     |
| TSX                 | 40% Complete | 𐄂           | _Avoid using, many defects_     |
| YAML                | 50% Complete | 𐄂           | _Do not use, not yet supported_ |

_Those wonderful individuals who come across any bugs or defects. Please inform about them. Edge cases are very important and submitting an issue is a huge help for me and the project._

# Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [AST](#ast)
  - [Rules](#rules)
  - [Format](#format)
  - [Parse](#parse)
  - [Grammar](#grammar)
  - [Language](#language)
  - [Definitions](#definitions)
- [Rule Options](#rule-options)
  - [Global Rules](#global-rules)
  - [Liquid Rules](#liquid-rules)
  - [Markup Rules](#markup-rules)
  - [Style Rules](#style-rules)
  - [JSON Rules](#json-rules)
  - [Script Rules](#script-rules)
- [Parse Errors](#parse-errors)
  - [Asynchronous](#asynchronous)
  - [Synchronous](#synchronous)
- [Inline Control](#inline-control)
  - [Disable Æsthetic](#disable-Æsthetic)
  - [Inline Rules](#inline-rules)
  - [Ignoring Regions](#ignoring-regions)
- [Caveats](#caveats)
  - [Prettier + Æsthetic](#prettier--Æsthetic)
  - [Linters](#linters)
  - [Shopify Themes](#shopify-themes)
  - [Jekyll and 11ty](#jekyll-and-11ty)
- [Æsthetic vs Shopify's Liquid Prettier Plugin](#Æsthetic-vs-shopifys-liquid-prettier-plugin)
  - [Intention vs Impedance](#intention-vs-impedance)
  - [Standard Markup Comparison](#standard-markup-comparison)
  - [Embedded Languages Comparison](#embedded-languages-comparison)
- [Credits](#credits)

# Installation

This module is currently used by the [vscode-liquid](https://github.com/panoply/vscode-liquid)] extension.

```bash
pnpm add esthetic -D
```

_Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit_

# Usage

The tool provides a granular set of beautification rules. Each supported language exposes different formatting rules. You can either use the `Æsthetic.format` method to beautify all languages within a matching nexus or alternatively you can use [language specific](#language-specific) methods. Æsthetic will attempt to automatically detect the language you've provided and from here forward input to an appropriate lexer for handling when using `Æsthetic.format` but it is recommended that your specify a `language` value.

<!-- prettier-ignore -->
```typescript
import { format } from 'esthetic';

const code = '<div class="example">{% if x %} {{ x }} {% endif %}</div>';

format(code, {
  language: 'liquid',
  indentSize: 2,
  markup: {
    forceAttribute: true
  }
}).then(output => {

  // Do something with the beautified output
  console.log(output)

}).catch(error => {

  // Print the error
  console.error(error);

  // Return the original input
  return code;

});
```

# API

Æsthetic does not yet provide CLI support but will in future releases. The API exports several methods on the default and intends to make usage as simple as possible with respect to extendability for more advanced use cases. The `Æsthetic` instance is exported on the default and all methods can be called from its import.

- [Rules](#rules)
- [Format](#format)
- [Parse](#parse)
- [Grammar](#grammar)
- [Language](#language)
- [Events](#events)
- [Hooks](#hooks)

The `rules` method is completely optional and helpful when you are making repeated calls to the `Æsthetic.format()` or wish to control rules at a different point within your application. When calling the `p`Return the current rules being used by invoking `Æsthetic.rules()`

## Format

There format method can be used to beautify code and accepts either a string or buffer type argument. An optional `rules` parameter can also be passed for setting beautification options. By default the method resolves to a promise but you can also invoke this in a synchronous manner using `Æsthetic.format.sync()`.

> When an error occurs the `Æsthetic.format.sync` method throws an instance of an Error.

<!-- prettier-ignore -->
```typescript
import { format } from "esthetic";

// Async formatting
format('.class { font-size: 0.95rem; }', {
  language: 'css',
  style: {
    noLeadZero: true
  }
}).then(output => {

  console.log(output)

});


// Sync formatting
const output = Æsthetic.format.sync('.class { font-size: 0.95rem; }', {
  language: 'css',
  style: {
    noLeadZero: true
  }
})

console.log(output)

```

### Language Specific

Language specific formatting methods work the same as `Æsthetic.format` but are refined to operate on a language specific level. These methods accept only relative rules as a second parameter as the `language` option is inferred.

> Currently, only stable language specific methods are made available.

```ts
import { format } from "esthetic";

// Liquid
//
format.liquid('..'): Promise<string>;
format.liquid.sync('..'): string;

// HTML
//s
format.html('..'): Promise<string>;
format.html.sync('..'): string;

// HTML
//
format.xml('..'): Promise<string>;
format.xml.sync('..'): string;

// CSS
//
format.css('..'): Promise<string>;
format.css.sync('..'): string;

// JSON
//
format.json('..'): Promise<string>;
format.json.sync('..'): string;
```

## Parse

The `parse` method can be used to inspect the data structures that Æsthetic constructs. Æsthetic is using the Sparser lexing algorithm under the hood the generated parse tree returned is representative of sparser's data structures. Similar to `Æsthetic.format` you can also invoke this both asynchronously and synchronously.

```typescript
import { parse } from "esthetic";

// The generated sparser data structure
parse('...'): Promise<Data>;

// The generated sparser data structure
parse.sync('...'): Data;
```

## Grammar

The `grammar` method allows you to extend beautification to support custom tags and provide Æsthetic with additional context about certain keywords and structures. This is a great feature for folks using custom Liquid variations or those who require some special behavior from the beautification cycle.

```typescript
import { grammar } from "esthetic";

// Detects a language from a string sample
grammar({
  html: {
    // Extend void tag handling
    voids: [
      // Tags using <icon /> will be treated as voids
      'icon'
    ]
  },
  liquid: {
    // Extend tag block handling
    tags: [
      // Content within {% random %} and {% endrandom %} should indent
      'random',
      // Content within {% custom %} and {% endcustom %} should indent
      'custom',
    ],
    // Extend embedded language implementation
    embedded: {
      // Target the capture tag, e.g: {% capture %}
      capture: [
        {
          // The language the contents of the tag contains
          language: 'json',
          // The capture argument to match, e.g: {% capture json %}
          argument: [
            'json'
          ]
        },
        {
          // Here we inform the contents of this match is CSS
          language: 'css',
          // The capture argument matches ANY these values,
          // e.g: {% capture css %} or {% capture style %}
          argument: [
            'css',
            'style'
          ]
        }
      ],
      // Target a tag block named code, e.g: {% code %}
      code: [
        {
          // The language the contents of the tag contains
          language: 'javascript',
          // The capture argument to match, e.g: {% code js %}
          argument: [
            'js'
          ]
        },
      ]
    }
  }
}): void

```

## Language

The `language` method is a utility method that Æsthetic uses under the hood in the beautification process. The method is not _perfect_ but can detect and determine the language from the sample string provided.

```typescript
import Æsthetic from "esthetic";

// Detects a language from a string sample
Æsthetic.language(sample: string)

```

> You can augment the language reference detected in the `Æsthetic.language.listen` event.

## Rules

The `rules` methods will augment formatting options (rules). Formatting options are persisted so when you apply changes they are used for every beautification process thereafter. This method can be used to define rules and preset the configuration logic to be used for every call you invoke relating to beautification or parsing.

<!-- prettier-ignore -->
```typescript
import { rules, format } from 'esthetic';

// Define rules to be used when formatting
rules({
  language: 'html',
  indentSize: 4,
  markup: {
    attributeSort: true,
    forceAttribute: true
    // etc etc
  },
  style: {
    noLeadZero: true
    // etc etc
  },
  script: {
    noSemicolon: true,
    vertical: true
    // etc etc
  }
});

// When calling format, the rules will be used.
format('<div id="x" class="x"> etc etc </div>').then(output => {

  console.log(output);

});

```

## Events

Æsthetic provides event dispatching. Events are invoked at different stages of the beautification cycle and can also inform upon changes occurring in rules.

> When listening to the `Æsthetic.on('format')` event you cancel out of formatting by returning `false` in the event.

<!-- prettier-ignore -->
```typescript
import * as esthetic from 'esthetic';

// Formatting Event
//
esthetic.on('format', function (output) {

  // Access formatting rules in the "this" context
  console.log(this.rules);

  // Access the uniformed data structure in the "this" context
  console.log(this.data);

  // Access information stats in the "this" context
  console.log(this.stats);

  // The beautified output result
  console.log(output);

});

// Rules Event
//
esthetic.on('rules', function (changes, rules) {

  // Informs upon changed rules
  console.log(changes);

  // The current rules being used
  console.log(rules);

});

// Parse Event
//
esthetic.on('parse', function (data) {

  // The generated data structure
  console.log(data);

  // The current rules being used
  console.log(this.rules);

});
```

## Hooks

Æsthetic hooks are similar to events but will fire during the parse cycle. Hooks can be used to augment the data structure and will be called for every record pushed into the generated uniform.

> Currently only `parse` hooks are available.

<!-- prettier-ignore -->
```typescript
import * as esthetic from 'esthetic';

esthetic.hook('parse', function(record, index) {

  // The current line number in which parse is running.
  console.log(this.line);

  // The current stack tracked reference which parse scope uses
  console.log(this.stack);

  // The current language, helpful when working with embedded regions
  console.log(this.language);

  // The data record describing a node
  console.log(record);

  // Optionally return a new record augmentation
  return {
    begin: 1,
    ender: 1,
    lexer: 'markup',
    types: 'start',
    lines: 1,
    stack: 'div',
    token: '<div>'
  }
})

```

## Definitions

The definitions is a named export that exposes a definition list of the available formatting options. The is an internally used method and holds no real virtue.

<!-- prettier-ignore -->
```typescript
import * as esthetic from 'esthetic';

// Print the definitions to console
console.log(esthetic.definitions);

```

# Rule Options

Æsthetic provides a granular set of beautification options (rules). The projects [Typings](https://github.com/panoply/Æsthetic/tree/pre-release/types/rules) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/Æsthetic) to get a better idea of how code will be beautified.

```typescript
{
  language: 'auto',
  indentSize: 2,
  indentChar: ' ',
  wrap: 0,
  crlf: false,
  endNewline: false,
  preserveLine: 3,
  liquid: {
    commentIndent: false,
    commentNewline: false,
    correct: true,
    delimiterTrims: 'preserve',
    ignoreTagList: [],
    indentAttributes: false,
    lineBreakSeparator: 'default',
    normalizeSpacing: true,
    preserveComment: true,
    quoteConvert: 'double'
  },
  markup: {
    attributeCasing: 'preserve',
    attributeSort: false,
    attributeSortList: [],
    commentIndent: false,
    commentNewline: false,
    correct: true,
    delimiterForce: false,
    forceAttribute: false,
    forceLeadAttribute: false,
    forceIndent: false,
    ignoreCSS: false,
    ignoreJS: false,
    ignoreJSON: false,
    preserveAttributes: false,
    preserveComment: true,
    preserveText: true,
    selfCloseSpace: false,
    selfCloseSVG: true,
    stripAttributeLines: false,
    quoteConvert: 'double',
  },
  style: {
    atRuleSpace: false,
    commentIndent: false,
    commentNewline: false,
    correct: false,
    classPadding: false,
    noLeadZero: false,
    preserveComment: true,
    sortProperties: false,
    sortSelectors: false,
    quoteConvert: 'none',
  },
  json: {
    allowComments: false,
    arrayFormat: 'default',
    braceAllman: true,
    bracePadding: false,
    objectIndent: 'indent',
    objectSort: false
  },
  script: {
    commentIndent: false,
    commentNewline: false,
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    endComma: 'never',
    braceNewline: true,
    correct: false,
    caseSpace: false,
    elseNewline: true,
    functionNameSpace: true,
    functionSpace: false,
    methodChain: 0,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveComment: true,
    preserveText: true,
    quoteConvert: 'single',
    ternaryLine: false,
    variableList: 'none',
    vertical: false,
    styleGuide: 'none'
  }
}
```

### Global Rules

Global rules will be applied to all lexer modes. You cannot override globals on a per lexer basis. Globals are exposed as first level properties.

```ts
{
  language: 'auto',
  indentSize: 2,
  indentChar: ' ',
  wrap: 0,
  crlf: false,
  endNewline: false,
  preserveLine: 3
}
```

### Liquid Rules

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/liquid.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- Liquid

```ts
{
  liquid: {
    commentIndent: false,
    commentNewline: false,
    correct: true,
    delimiterTrims: 'preserve',
    ignoreTagList: [],
    indentAttributes: false,
    lineBreakSeparator: 'default',
    normalizeSpacing: true,
    preserveComment: true,
    quoteConvert: 'double'
  }
}
```

### Markup Rules

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/markup.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- Liquid
- HTML
- XHTML
- XML
- JSX
- TSX

```ts
{
  markup: {
    attributeCasing: 'preserve',
    attributeSort: false,
    attributeSortList: [],
    commentIndent: false,
    commentNewline: false,
    correct: true,
    delimiterForce: false,
    forceAttribute: false,
    forceLeadAttribute: false,
    forceIndent: false,
    ignoreCSS: false,
    ignoreJS: false,
    ignoreJSON: false,
    preserveAttributes: false,
    preserveComment: true,
    preserveText: true,
    selfCloseSpace: false,
    selfCloseSVG: true,
    stripAttributeLines: false,
    quoteConvert: 'double',
  }
}
```

### Style Rules

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/style.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- CSS
- SCSS/SASS
- LESS

```ts
{
  style: {
    atRuleSpace: false,
    commentIndent: false,
    commentNewline: false,
    correct: false,
    classPadding: false,
    noLeadZero: false,
    preserveComment: true,
    sortProperties: false,
    sortSelectors: false,
    quoteConvert: 'none'
  }
}
```

> _Æsthetic supports Liquid infused style formatting and when encountered it will apply beautification using Markup rules_

### Script Rules

Refer to the [typings](https://github.com/panoply/Æsthetic/blob/pre-release/types/rules/script.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- JavaScript
- TypeScript
- JSX
- TSX

```ts
{
  script: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    commentIndent: false,
    commentNewline: false,
    endComma: 'never',
    braceNewline: true,
    correct: false,
    caseSpace: false,
    elseNewline: true,
    functionNameSpace: true,
    functionSpace: false,
    methodChain: 0,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveComment: true,
    preserveText: true,
    quoteConvert: 'single',
    ternaryLine: false,
    variableList: 'none',
    vertical: false,
    styleGuide: 'none'
  }
}
```

> _Æsthetic supports Liquid infused script formatting and when encountered it will apply beautification using Markup rules_

### JSON Rules

Refer to the [JSON](/docs/rules/json.md) declaration file for description. Rules will be used when formatting the following languages:

- JSON
- JSONC

```ts
{
  arrayFormat: 'default',
  braceAllman: true,
  bracePadding: false,
  objectIndent: 'indent',
  objectSort: false
}
```

> _Æsthetic partially supports Liquid infused JSON formatting, but you should avoid coupling these 2 language together._

# Parse Errors

The `format` method returns a promise, so when beautification fails and a parse error occurs `.catch()` is invoked. The error message will typically inform you of the issue, the line number which the error was detected and relative information pertaining to how you can resolve the issue.

### Asynchronous

<!-- prettier-ignore -->
```typescript
import Æsthetic from 'esthetic';

// Invalid code
const code = '{% if x %} {{ x }} {% endless %}';

Æsthetic.format(code).then(output => console.log(output)).catch(error => {

  // Print the PrettyDiff error
  console.error(error);

  // Return the original input
  return code;

});
```

### Synchronous

<!-- prettier-ignore -->
```typescript
import Æsthetic from 'esthetic';

// Invalid code
const code = '{% if x %} {{ x }} {% endless %}';

try {

  const output = Æsthetic.formatSync(code)

} catch (error) {

  // Print the PrettyDiff error
  console.error(error.message);

  // Return the original input
  return code;

}
```

# Comment Ignored

Inline control is supported and can be applied within comments. Inline control allows your to ignore files, code regions or apply custom formatting options. Comments use the following structures:

- `@Æsthetic-ignore`
- `@Æsthetic-ignore-next`
- `@Æsthetic-ignore-start`
- `@Æsthetic-ignore-end`

## Disable Æsthetic

You can prevent Æsthetic from formatting a file by placing an inline control comment at the type of the document.

```liquid
{% # @Æsthetic-ignore %}

<div>
  <ul>
    <li>The entire file will not be formatted</li>
  </ul>
</div>
```

## Ignore Regions

Lexer modes provide comment ignore control and support ignoring regions (blocks) of code. All content contained between the comments will be preserved and unformatted.

### HTML Comments

- `<!-- @Æsthetic-ignore-start -->`
- `<!-- @Æsthetic-ignore-end -->`

### Liquid Block Comments

- `{% comment %} @Æsthetic-ignore-start {% endcomment %}`
- `{% comment %} @Æsthetic-ignore-end {% endcomment %}`

### Liquid Line Comments

- `{% # @Æsthetic-ignore-start %}`
- `{% # @Æsthetic-ignore-end %}`

### Block Comments

- `/* @Æsthetic-ignore-start */`
- `/* @Æsthetic-ignore-end */`

### Line Comments

- `// @Æsthetic-ignore-start`
- `// @Æsthetic-ignore-end`

## Ignore Next

Similar to region ignores, you can instead have Æsthetic ignore the next known line. This comment ignore will span multiple lines when it is annotated about a tag block start/end token structure.

### HTML Comments

- `<!-- @Æsthetic-ignore-next -->`

### Liquid Block Comments

- `{% comment %} @Æsthetic-ignore-next {% endcomment %}`

### Liquid Line Comments

- `{% # @Æsthetic-ignore-next %}`

### Block Comments

- `/* @Æsthetic-ignore-next */`

### Line Comments

- `// @Æsthetic-ignore-next`

# Comment Rules

Æsthetic provides inline formatting support via comments. Inline formatting adopts a similar approach used in linters and other projects. The difference is how inline formats are expressed, in Æsthetic you express formats using inline annotation at the top of the document with a value of `@Æsthetic` followed by either a space of newline.

**Not all inline ignore capabilities are operational**

#### HTML Comments

```html
<!-- @Æsthetic forceAttribute: true indentLevel: 4 -->
```

#### Liquid Block Comments

```liquid
{% comment %}
  @Æsthetic forceAttribute: true indentLevel: 4
{% endcomment %}
```

#### Liquid Line Comments

```liquid
{% # @Æsthetic forceAttribute: true indentLevel: 4 %}
```

#### Block comment

```css
/* @Æsthetic forceAttribute: true indentLevel: 4 */
```

### Line comments

```javascript
// @Æsthetic forceAttribute: true indentLevel: 4
```

# Caveats

Æsthetic is comparatively _recluse_ in terms of PnP integrations/extensibility. Depending on your stack and development preferences you may wish to use Æsthetic together with additional tools like [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) or even [Prettier](https://prettier.io/). There are a few notable caveats you should be aware before running Æsthetic, most of which are trivial.

### Æsthetic vs Prettier

It is not uncommon for developers to use Prettier in their projects but you should avoid executing Æsthetic alongside Prettier in code editor environments. You can easily prevent issues from arising by excluding the files Æsthetic handles by adding them to a `.prettierignore` file. More on this [below](#intention-vs-inference).

### Linters

Æsthetic can be used together with tools like ESLint and StyleLint without the need to install additional plugins but the caveats come when you introduce Liquid into the code. Æsthetic can format Liquid contained in JavaScript, TypeScript, JSX and TSX but tools like ESLint are currently unable to process content of that nature and as such without official linting support for Liquid by these tools it is best to only run Æsthetic with linters on code that does not contain Liquid.

### Shopify Themes

Developers working with straps like [Dawn](https://github.com/Shopify/dawn) should take some consideration before running Æsthetic on the distributed code contained within the project. Dawn is chaotic, novice and it employs some terrible approaches. Using Æsthetic blindly on the project may lead to problematic scenarios and readability issues.

# Æsthetic vs Liquid Prettier Plugin

Shopify recently shipped a Liquid prettier plugin. It does not really do much beyond basic level indentation but regardless it is great to see Shopify bring support for Liquid beautification and developers who prefer the Prettier style should indeed choose that solution.

Æsthetic is cut from a different cloth and takes a complete different approach when compared to the Liquid Prettier Plugin. In Æsthetic, the generated data structure (parse table) it produces has refined context that is specifically designed for beautification usage which allows it to perform incremental traversals that result in faster and more customized beautification results.

### Parse Algorithm

The parse algorithm and lexing approach employed in Æsthetic is an original strategic concept created by [Austin Cheney](https://github.com/prettydiff). It was first introduced in [Sparser](https://sparser.io/) to provide a simple data format that can accurately describe any language. Parsers typically produce an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (abstract syntax tree) whereas Æsthetic and its implementation of Sparser produces a uniformed table like structure.

Many different algorithms can be made to work and achieve the same result produced by the Sparser table structure, but they all come with tradeoffs relative to the others. Most tools in this nexus seem to be using some variant of [ANTLR](https://en.wikipedia.org/wiki/ANTLR) or [PEG](https://en.wikipedia.org/wiki/Parsing_expression_grammar) which has less ambiguity than LR parsers but may produce worse error messages for users and consume more memory. When the task involves making sense of combined language formations (ie: Liquid inside of JavaScript inside HTML) there is no "right way" or consensus on how it should be done nor does it seem to have been studied much in academia due to the edge case of the topic.

Looking at the Liquid Prettier Plugin there no _real_ parse algorithm employed and like most Prettier plugins it is merely hooking into a traversal operation which it has little control over to produce the desired results and while the approach suffices it is extraneous. The originality of the Sparser algorithm allows for otherwise complex structures to be traversed and interpreted for handling without having to bend and augment when addressing weaknesses. The table structure it produces allows for basic reasoning during the beautification cycle with controlled results and extensibility options.

### Intention vs Inference.

The Liquid Prettier Plugin appropriates the opinionated conventions of Prettier so when producing output the solution is indirectly impeding itself into your workflow. The restrictions of Prettier can be great in some cases but when you need refined results you'll be met with heavy restrictions. This is a double edged sword and problematic when working with a template language like Liquid due to the manner in which developers infuse and express the syntax with other languages.

Æsthetic uses the developers intent and refines its result in accordance, this allows you to determine what works best for a project at hand. The granular set of beautification rules exposed by Æsthetic enables developers to progressively adapt the tool to their preferred code style and it can even replicate beautification styles that both Prettier and its Liquid Prettier Plugin are capable of producing.

### Standard Markup Comparison

Below is a formatting specific feature comparison as of January 2023 for Markup (Liquid + HTML). This a minimal comparison and I have omitted the cumbersome capabilities, overall Shopify's Prettier based solution offers 1/10th of what Æsthetic currently provides.

| Feature                             | Liquid Prettier Plugin | Æsthetic |
| ----------------------------------- | ---------------------- | -------- |
| Tag Indentation                     | ✓                      | ✓        |
| HTML Attribute Indentation          | ✓                      | ✓        |
| Comment Formatting                  | ✓                      | ✓        |
| Delimiter Spacing                   | ✓                      | ✓        |
| Delimiter Trims                     | 𐄂                      | ✓        |
| HTML Delimiter Force Control        | 𐄂                      | ✓        |
| Content Controlled Indentation      | 𐄂                      | ✓        |
| Controlled Liquid Value Indentation | 𐄂                      | ✓        |
| Wrap Level Attributed Indentation   | 𐄂                      | ✓        |
| Attribute Casing                    | 𐄂                      | ✓        |
| Attribute Sorting                   | 𐄂                      | ✓        |
| Liquid Attribute Indentations       | 𐄂                      | ✓        |
| Liquid Newline Filters              | 𐄂                      | ✓        |
| Frontmatter                         | 𐄂                      | ✓        |
| Extend Custom Tags                  | 𐄂                      | ✓        |
| Liquid Line Break Separators        | 𐄂                      | ✓        |
| Liquid in CSS                       | 𐄂                      | ✓        |
| Liquid in JavaScript                | 𐄂                      | ✓        |
| Liquid in JSON                      | 𐄂                      | ✓        |

### Embedded Languages Comparison

Below is the embedded language support comparison. Shopify's solution employs Prettier native formatters when handling regions that contain external languages. Given Æsthetic is still under heavy development, Shopify's Liquid Prettier Plugin may suffice here but it does not support Liquid infused within the languages whereas Æsthetic does.

| Feature               | Tag                | Liquid Prettier Plugin | Æsthetic |
| --------------------- | ------------------ | ---------------------- | -------- |
| Embedded CSS          | `<style>`          | ✓                      | ✓        |
| Embedded JS           | `<script>`         | ✓                      | ✓        |
| Embedded CSS          | `{% style %}`      | ✓                      | ✓        |
| Embedded CSS          | `{% stylesheet %}` | ✓                      | ✓        |
| Embedded JS           | `{% javascript %}` | ✓                      | ✓        |
| Embedded JSON         | `{% schema %}`     | ✓                      | ✓        |
| Embedded CSS + Liquid | `{% style %}`      | 𐄂                      | ✓        |
| Embedded CSS + Liquid | `<style>`          | 𐄂                      | ✓        |
| Embedded JS + Liquid  | `<script>`         | 𐄂                      | ✓        |

# Credits

Æsthetic owes its existence to Sparser and PrettyDiff. This project has been adapted from these 2 brilliant tools and while largely refactored + overhauled the original parse architecture remains intact.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

[Austin Cheney](https://github.com/prettydiff) who is the original author of [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser) created these two projects and this module is only possible because of the work he has done. Austin is one of the great minds in JavaScript and I want to thank him for open sourcing these tools.

Both PrettyDiff and Sparser were abandoned in 2019 after a nearly a decade of production. Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool, please check it out and also have a read of
[wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

## Author 🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com)

<img
  align="right"
  src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff"
/>
