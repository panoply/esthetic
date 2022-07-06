### WIP - RELEASE CANDIDATE ALMOST COMPLETE

_This module is still in development but approaching a stable release. It is not yet available for consumption on the NPM Registry and the the playground is not using the most recent versions, however the cloning the repository will give you the most recent working version_

# Prettify 💅

The new generation code beautification tool for formatting HTML, Liquid, JavaScript, TypeScript, CSS/SCSS and more! Prettify is built atop of the sparser lexing engines and its parse approach was adapted from the distributed source code of the late and powerful PrettyDiff.

### Features

- Fast, performant and lightweight (40kb gzip).
- Language aware. Automatically infers handling.
- Provides a granular set of formatting rules.
- Single parse tree with incremental beautification capabilities
- Drop-in solution with no complexities (boomer friendly)

### Why Prettify?

Prettify is mostly geared towards projects using Liquid as the consumer facing language and exists an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). It's the perfect choice for projects that leverage the [Liquid](https://shopify.github.io/liquid/) template language and was developed for usage in the [Liquify](https://liquify.dev) text editor extension/plugin. Prettify allows developers to comfortably infuse Liquid into different languages without sacrificing beautification support, it intends to be the solution you'd employ when working with the template language.

### Supported Languages

- Liquid + HTML
- Liquid + CSS/SCSS/LESS
- Liquid + JavaScript/TypeScript
- Liquid + JSX/TSX
- HTML
- CSS
- SCSS
- LESS
- JavaScript
- TypeScript
- JSX
- TSX
- JSON
- YAML

# Installation

This module is used by the [Liquify IDE](https://liquify.dev) extension.

```bash
pnpm add @liquify/prettify -D
```

# Usage

The tool provides a granular set of beautification rules. Each supported language exposes different formatting options and keeping the PrettyDiff logic 3 lexer modes are supplied `markup`, `style` and `script`. Each mode can be used to beautify languages within a matching nexus. Prettify will automatically detect the language and forward input to the appropriate lexer for handling.

<!-- prettier-ignore -->
```typescript
import prettify from '@liquify/prettify';

const code = '<div class="example">{% if x %} {{ x }} {% endif %}</div>';

prettify.format(code, { indentSize: 2 }).then(output => {

  console.log(output)

  // Do something with the beautified output

}).catch(error => {

  // Print the error
  console.error(error);

  // Return the original input
  return code;

});
```

# API

Prettify does not yet provide CLI support but will in future releases. The API exports several methods on the default and intends to make usage as simple as possible with respect to extendability for more advanced use cases.

### Format

The format method returns a promise and is export on the default export. The function requires a `string` parameter be provided and accepts an optional second `rules` parameter. The format method also exposes 2 additional hook methods that will be invoked either before or after beautification and an additional `stats` getter which returns some execution information pertaining to the process.

```typescript
import prettify from "@liquify/prettify";

// Formatting Code
prettify.format(source: string, rules?: Options): Promise<string>;

// Hook that will be invoked before formatting
prettify.format.before((rules: Options, input: string) => void | false)

// Hook that will be invoked after formatting
prettify.format.after((output: string, rules: Options) => void | false)

// Returns some statistical information related to the operation
prettify.format.stats: Stats
```

> Returning `false` in either the `prettify.format.before` or `prettify.format.after` will cancel beautification.

### Options

The options methods will augment formatting options (rules). Formatting options are persisted, so when you apply changes they are used on every beautification process thereafter. The `prettify.options(rules)` method also exposes hook and getter methods. The `prettify.options.updated` method allows you to listen in on option changes and the `prettify.options.rules` getter returns a **readonly** reference of the current formatting options.

```typescript
import prettify from "@liquify/prettify";

// Change formatting rules
prettify.options(rules?: Options): Rules;

// Hook listener that will be invoked when options change
prettify.options.listen((rules: Options) => void)

// Returns the current formatting options Prettify is using
prettify.options.rules: Rules
```

### Parse

The parse method can be used to inspect the data structures the Prettify constructs. Prettify is using the Sparser lexing engines under the hood and the generated parse tree returned by this method is representative of its structure. The method also provides an additional `stats` getter which returns some execution information pertaining to the process.

```typescript
import prettify from "@liquify/prettify";

// The generated sparser data structure
prettify.parse(source: string): ParseTree

// Returns some statistical information related to the parse
prettify.parse.stats: Stats
```

### Language

The `language` method is a utility method that Prettify uses in the beautification process. It's typically used for language detection and its how Prettify determines the lexing engine to be used on provided source string input.

```typescript
import prettify from "@liquify/prettify";

// Detects a language from a string sample
prettify.language(sample: string): Language

// Hook listener which is invoked after language detection
prettify.language.listen((language: Language) => void | Language)
```

> You can augment the language reference detected in the `prettify.language.listen` hook.

### Definitions

The definitions is a named export that exposes a definition list of the available formatting options. The definitions are used when validating rules and referencing. This is just an object, nothing really special.

```typescript
import { definitions } from '@liquify/prettify';

// Print the definitions to console
console.log(definitions);
```

# Options

Prettify provides a granular set of beautification rules (options). The projects [Typings](#) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/prettify) to get a better idea of how code will be beautified.

```typescript
{
  language: 'auto',
  indentSize: 2,
  indentChar: ' ',
  wrap: 0,
  crlf: false,
  endNewline: false,
  commentIndent: false,
  attemptCorrection: false,
  markup: {
    attributeSort: false,
    attributeSortList: [],
    attributeGlue: false,
    delimiterSpacing: true,
    commentNewline: false,
    forceAttribute: false,
    forceIndent: false,
    preserveAttributes: false,
    preserveComment: true,
    preserveLine: 3,
    preserveText: true,
    quoteConvert: 'double',
    selfCloseSpace: false
  },
  style: {
    classPadding: false,
    noLeadZero: false,
    sortProperties: false,
    sortSelectors: false,
    preserveLine: 3,
    quoteConvert: 'none',
    associate: []
  },
  script: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    endComma: 'never',
    braceNewline: true,
    caseSpace: false,
    elseNewline: true,
    inlineReturn: false,
    functionNameSpace: true,
    functionSpace: false,
    methodChain: 0,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveComment: true,
    preserveLine: 3,
    preserveText: true,
    quoteConvert: 'single',
    ternaryLine: false,
    variableList: 'none',
    vertical: false,
    styleGuide: 'none',
    associate: []
  },
  json: {
    arrayFormat: 'default',
    braceAllman: true,
    bracePadding: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveLine: 2,
    associate: []
  }
}
```

### Markup Rules

Refer to the [typings](#) declaration file for description.

```ts
{
  attemptCorrection: false,
  attributeGlue: true,
  attributeSort: false,
  attributeSortList: [],
  commentNewline: false,
  commentIndent: false,
  crlf: false,
  delimiterSpacing: false,
  forceAttribute: false,
  forceIndent: false,
  indentLevel: 0,
  indentSize: 2,
  indentChar: ' ',
  newlineEnd: true,
  selfCloseSpace: false,
  preserveAttributes: false,
  preserveComment: true,
  preserveLine: 3,
  preserveText: false,
  quoteConvert: 'double',
  wrap: 0
}
```

### Style Rules

Refer to the [typings](#) declaration file for description.

```ts
{
  attemptCorrection: false,
  bracesAllman: false,
  classPadding: false,
  crlf: false,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  preserveLines: 3,
  propertySort: false,
  newLine: true,
  newlineEnd: true,
  noLeadZero: false,
  selectorList: false,
  quoteConvert: 'single'
}
```

### JSON Rules

Refer to the [typings](#) declaration file for description.

```ts
{
  arrayFormat: 'default',
  bracesAllman: false,
  bracePadding: false,
  indentSize: 2,
  indentLevel: 0,
  newLineEnd: true,
  objectSort: false,
  objectArrays: 'default',
  preserveLines: 3
}
```

### Script Rules

Refer to the [typings](#) declaration file for description.

```ts
{
  attemptCorrection: false,
  braceNewline: false,
  bracePadding: false,
  braceStyle: 'none',
  braceAllman: false,
  caseSpace: false,
  crlf: false,
  commentNewline: false,
  commentIndent: false,
  endNewline: true,
  elseNewline: false,
  endComma: 'never',
  arrayFormat: 'default',
  objectIndent: 'default',
  functionNameSpace: true,
  functionSpace: true,
  indentChar: ' ',
  indentLevel: 0,
  indentSize: 2,
  methodChain: false,
  neverFlatten: false,
  noCaseIndent: false,
  noSemicolon: false,
  objectSort: false,
  preserveLine: 2,
  preserveComment: false,
  quoteConvert: 'none',
  semicolon: true,
  ternaryLine: false,
  variableList: 'none',
  vertical: false
}
```

# Parse Errors

The `format` method returns a promise, so when beautification fails and a parse error occurs the `.catch()` is invoked. The error message will typically inform you of the issue but it's rather blasé and not very informative. There are plans to improve this aspect in future releases.

> It's important to note that Liquify and Prettify are using different Parsers. The Liquify parser constructs an AST that provides diagnostic capabilities (ie: linting) whereas the Prettify parser constructs a data~structure. The errors of these tools will differ dramatically. Liquify will give you far more context opposed to Prettify.

<!-- prettier-ignore -->
```typescript
import * as prettify from '@liquify/prettify';

// Invalid code
const code = '{% if x %} {{ x }} {% endunless %}';

prettify.format(code).then(output => console.log(output)).catch(error => {

  // Print the PrettyDiff error
  console.error(error);

  // Return the original input
  return code;

});
```

# Inline Control

Inline control is supported and can be applied within comments. There are 3 operations available (`disable`, `format` and `ignore`) each of which is expressed as follows:

- `@prettify-ignore`
- `@prettify-ignore-start`
- `@prettify-ignore-end`
- `@format: ....`

### Disable Prettify

You can disable Prettify from formatting a file by placing an inline control comment at the type of the file:

```html
{% comment %} @prettify-ignore {% endcomment %}

<div>
  <ul>
    <li>The entire file will not be formatted</li>
  </ul>
</div>
```

### Inline Formatting

Prettify provides inline formatting support via comments. Inline formatting adopts a similar approach used in linters and other projects. The difference is how inline formats are expressed, in Prettify you express formats using inline annotation at the top of the document.

#### HTML Comments

```html
<!-- @format: forceAttribute: true, indentLevel: 4 -->
```

#### CSS, SCSS or LESS Comments

```css
/* @format: forceAttribute: true, indentLevel: 4 */
```

#### JavaScript/TypeScript Comments

```javascript
// @format: forceAttribute: true, indentLevel: 4
```

#### Liquid Comments

```liquid
{% comment %}
  @format:
   forceAttribute: true,
   indentLevel: 4
{% endcomment %}
```

### Ignoring Code

Lexer modes provide inline comments control and support ignoring regions of code. This logic is mostly lifted from within PrettyDiff and supports Liquid comments:

#### HTML Comments

- `<!-- @prettify-ignore-start -->`
- `<!-- @prettify-ignore-end -->`

#### CSS, SCSS or LESS Comments

- `/* @prettify-ignore-start */`
- `/* @prettify-ignore-end */`

#### JavaScript/TypeScript Comments

- `// @prettify-ignore-start`
- `// @prettify-ignore-end`

#### Liquid Comments

- `{% comment %} @prettify-ignore-start {% endcomment %}`
- `{% comment %} @prettify-ignore-end {% endcomment %}`

# Examples

Prettify exposes direct access to different methods on the default export. Passing a string and an optional set of beautification options/rules . Though Prettify uses PrettyDiff and Sparser internally, it is important to note that both the lexers and parsers have been largely refactored. As such, Prettify operates rather effectively and can interpret otherwise unpredictable or chaotic code:

### Demonstration

Take the following (markup) code. This example is doing everything wrong. You'd actually be surprised how many folks would commit code like this when working with Liquid. This is actually because it's novice appealing in nature.

<!-- prettier-ignore -->
```liquid

<div id="x"
  class
="xxx xxx xxx"   data-
{% if x %} {{ x }}
         {%- else -%}foo{%- endif %}-id   ="within"
  aria-x =  "foo">

Hello world!

<div {{ attr }}="example"   {% if xx -%}data-{{ xx }}{%- else -%}
id{%- endif %}="prepended"
   aria-x="foo"           class={{ no_quotations }}
>

I am using Prettify! </div></div>
```

The above code is some wild stuff. It is using Liquid to output HTML attributes (conditionally), it is using output tags as attributes/values and infuses tags between attribute definitions. Prettify is able to handle this and can quickly reason about what and how the intended structure should be output. The above would format as follows:

<!-- prettier-ignore -->
```liquid

<div
  id="x"
  class="xxx xxx xxx"
  data-{% if x %}{{ x }}{%- else -%}foo{%- endif %}-id="xxx"
  aria-x="foo">

  Hello world!

  <div
    {{ attr }}="example"
    {% if xx -%}data-{{ xx }}{%- else -%}id="xxx"{%- endif %}
    aria-x="foo"
    class="{{ no_quotations }}">

    I am using Prettify!
    </div>
</div>
```

As you can see, the utter fucking insanity has been reasoned with. Code is beautified and structure is applied. Prettify even handles infusion within attributes and understands the intention of the developer.

# Caveats

Prettify is comparatively _recluse_ in terms of PnP integrations/extensibility. Depending on your stack and development preferences you may wish to use Prettify together with additional tools like [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) or even [Prettier](https://prettier.io/). There are a few notable caveats you should be aware before running Prettify, most of which are trivial.

### Prettier + Prettify

It is not uncommon for developers to use Prettier in their projects but you avoid executing Prettier along-side Prettify. You can easily prevent issues arising by excluding the files Prettify handles by adding them to a `.prettierignore` file.

### Linters

Prettify can be used together with tools like ESLint and Stylelint without the need to install additional plugins but the caveats come when you introduce Liquid into the code. Prettify can format Liquid contained in JavaScript, TypeScript, JSX and TSX but tools like ESLint are currently unable to process content of that nature.

### Shopify Themes

Developers working with straps like [Dawn](https://github.com/Shopify/dawn) should take some consideration before running Prettify on the distributed code contained within the project. Dawn is chaotic and it employs some terrible approaches that may lead to problematic scenarios and readability issues upon formatting.

# Prettify vs Shopify's Prettier Plugin

Shopify recently shipped a liquid prettier plugin but the plugin does not really do much beyond indentation. While it's great to see Shopify begin to bring support for Liquid beautification despite sitting on the issue for nearly a decade, their choice for a Prettier based solution will only ever suffice for a small number of use cases when it comes to Liquid, all of which directly pertain to their theme development ecosystem. Prettier is a great tool but it's extremely opinionated and trying to tame Liquid in Prettier is difficult and restrictive.

Prettify is leveraging the sparser lexing engines under the hood. Sparser along side PrettyDiff at the time I adapted them into Prettify were efficient at handling Liquid and a multitude of other template languages. I chose to build Prettify atop of sparser and prettydiff opposed to developing a Prettier plugin for a number of reasons but mostly because these lexers understood Liquid infusion within languages other than HTML.

Below is a formatting specific feature comparison as of June 2022 for Markup (Liquid + HTML).

| Feature                          | Prettify | Liquid Prettier Plugin |
| -------------------------------- | -------- | ---------------------- |
| Tag Indentation                  | ✓        | ✓                      |
| Attribute Indentation            | ✓        | ✓                      |
| Comment Formatting               | ✓        | ✓                      |
| Controlled Attribute Indentation | ✓        | 𐄂                      |
| Content Indentation              | ✓        | 𐄂                      |
| Delimiter Spacing                | ✓        | 𐄂                      |
| Wrapping Indentation             | ✓        | 𐄂                      |
| Attribute Sorting                | ✓        | 𐄂                      |
| Liquid + CSS/SCSS                | ✓        | 𐄂                      |
| Liquid + JS/TS                   | ✓        | 𐄂                      |
| Liquid Newline Filters           | ✓        | 𐄂                      |
| Frontmatter Support              | ✓        | 𐄂                      |
| Embedded `{% style %}`           | ✓        | 𐄂                      |
| Embedded `{% stylesheet %}`      | ✓        | 𐄂                      |
| Embedded `{% javascript %}`      | ✓        | 𐄂                      |
| Embedded `{% schema %}`          | ✓        | ✓                      |
| Embedded `<style>`               | ✓        | 𐄂                      |
| Embedded `<script>`              | ✓        | 𐄂                      |

# Credits

Prettify owes its existence to Sparser and PrettyDiff. This project has been adapted from these 2 brilliant tools.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

[Austin Cheney](https://github.com/prettydiff) who is the original author of [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser) created these two projects and this module is only possible because of the work he has done.

PrettyDiff was abandoned in 2019 and Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool, please check it out and also have a read of
[wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

## Author 🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com)

<img
  align="right"
  src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff"
/>
