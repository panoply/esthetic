### v0.1.0-beta.1

_This module is in its infancy and working towards an official release candidate. Refer to the [Language Support](#language-support) before using the module._

# Prettify 🎀

The new generation code beautification tool for formatting HTML, Liquid, JavaScript, TypeScript, CSS/SCSS and more! Prettify is built atop of the Sparser lexing algorithm and its parse approach was adapted from the distributed source code of the late and powerful PrettyDiff.

Visit the [Playground](https://liquify.dev/prettify)

### Features

- Fast, performant and lightweight (40kb gzip).
- Cross platform support. Browser and Node environments.
- Language aware. Automatically infers handling.
- Provides a granular set of formatting rules.
- Uniformed array data structures
- Drop-in solution with no complexities (boomer friendly)

### Why Prettify?

Prettify is mostly geared towards web projects and exists an alternative to [Prettier](https://prettier.io/) and [JS Beautify](https://beautifier.io/). It's the perfect choice for projects that leverage the [Liquid](https://shopify.github.io/liquid/) template language and was developed for usage in the [Liquify](https://liquify.dev) text editor extension/plugin. Prettify allows developers to comfortably infuse Liquid into different languages without sacrificing beautification support, it intends to be the solution you'd employ when working with the template language.

### Language Support

Below is current support list of languages, their completion status and whether you can run Prettify for beautification. You can leverage on languages above 80% completion, anything below that is not yet ready for the big time.

| Language            | Status       | Operational |
| ------------------- | ------------ | ----------- |
| XML                 | 96% Complete | ✓           |
| HTML                | 96% Complete | ✓           |
| Liquid + HTML       | 96% Complete | ✓           |
| Liquid + CSS        | 91% Complete | ✓           |
| Liquid + JSON       | 95% Complete | ✓           |
| Liquid + JavaScript | 80% Complete | ✓           |
| CSS                 | 95% Complete | ✓           |
| SCSS                | 75% Complete | 𐄂           |
| LESS                | 60% Complete | 𐄂           |
| JSX                 | 70% Complete | 𐄂           |
| TSX                 | 40% Complete | 𐄂           |
| JavaScript          | 85% Complete | ✓           |
| TypeScript          | 70% Complete | 𐄂           |
| JSON                | 95% Complete | ✓           |
| YAML                | 50% Complete | 𐄂           |

> Please report any bugs or defects you encounter.

# Installation

This module is used by the [Liquify IDE](https://liquify.dev) extension.

```bash
pnpm add @liquify/prettify -D
```

_Because [pnpm](https://pnpm.js.org/en/cli/install) is dope and does dope shit_

# Usage

The tool provides a granular set of beautification rules. Each supported language exposes different formatting options and keeping the PrettyDiff logic 3 lexer modes are supplied `markup`, `style` and `script`. Each mode can be used to beautify languages within a matching nexus. Prettify will automatically detect the language and forward input to the appropriate lexer for handling but it is recommended that you provide `lexer` and/or `language` values.

<!-- prettier-ignore -->
```typescript
import prettify from '@liquify/prettify';

const code = '<div class="example">{% if x %} {{ x }} {% endif %}</div>';

prettify.format(code, {
  language: 'liquid',
  indentSize: 2
}).then(output => {

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

The format method returns a promise and is exposed on the default export. The function requires a `string` parameter be passed and accepts an optional second `rules` parameter. The format method also exposes 2 additional _hook_ methods that can be invoked before or after beautification. An additional `stats` getter is also available which will return some execution information.

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

The options methods will augment formatting options (rules). Formatting options are persisted, so when you apply changes they are used for every beautification process thereafter. The `prettify.options(rules)` method also exposes 2 _hook_ methods. The `prettify.options.listen` method allows you to listen for changes applied to options and the `prettify.options.rules` getter returns a **readonly** reference of the current formatting options.

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

The parse method can be used to inspect the data structures the Prettify constructs. Prettify is using the sparser lexing algorithm under the hood, the generated parse tree returned by this method is representative of sparser's data structures. The method also exposes an additional `stats` getter which returns some execution information pertaining to the parse process.

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

The definitions is a named export that exposes a definition list of the available formatting options. The definitions are used when validating rules. This is just an object, nothing really special.

```typescript
import { definitions } from '@liquify/prettify';

// Print the definitions to console
console.log(definitions);
```

# Options

Prettify provides a granular set of beautification options (rules). The projects [Typings](https://github.com/panoply/prettify/tree/pre-release/types/rules) explains in good detail the effect each available rule has on code. You can also checkout the [Playground](https://liquify.dev/prettify) to get a better idea of how code will be beautified.

```typescript
{
  grammar: {},
  language: 'auto',
  lexer: 'auto',
  indentSize: 2,
  indentChar: ' ',
  wrap: 0,
  crlf: false,
  endNewline: false,
  commentIndent: false,
  markup: {
    correct: false,
    attributeCasing: 'preserve',
    attributeSort: false,
    attributeSortList: [],
    attributeValues: 'align',
    delimiterSpacing: true,
    commentNewline: false,
    forceAttribute: false,
    forceLeadAttribute: false,
    forceIndent: false,
    preserveAttributes: false,
    preserveComment: true,
    preserveLine: 3,
    preserveText: true,
    quoteConvert: 'double',
    selfCloseSpace: false
  },
  style: {
    correct: false,
    classPadding: false,
    noLeadZero: false,
    sortProperties: false,
    sortSelectors: false,
    preserveLine: 3,
    quoteConvert: 'none',
    forceValue: 'preserve'
  },
  script: {
    arrayFormat: 'default',
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    endComma: 'never',
    braceNewline: true,
    correct: false,
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
    styleGuide: 'none'
  },
  json: {
    arrayFormat: 'default',
    braceAllman: true,
    bracePadding: false,
    correct: true,
    objectIndent: 'indent',
    objectSort: false,
    preserveLine: 2
  }
}
```

### Markup Rules

Refer to the [typings](https://github.com/panoply/prettify/blob/pre-release/types/rules/markup.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- Liquid
- HTML
- XHTML
- XML
- JSX
- TSX

```ts
{
  correct: false,
  attributeCasing: 'preserve',
  attributeSort: false,
  attributeSortList: [],
  attributeValues: 'align',
  delimiterSpacing: true,
  commentNewline: false,
  forceAttribute: false,
  forceLeadAttribute: false,
  forceIndent: false,
  preserveValues: true,
  preserveAttributes: false,
  preserveComment: true,
  preserveLine: 3,
  preserveText: true,
  quoteConvert: 'double',
  selfCloseSpace: false
}
```

### Style Rules

Refer to the [typings](https://github.com/panoply/prettify/blob/pre-release/types/rules/style.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- CSS
- SCSS/SASS
- LESS

```ts
{
  correct: false,
  classPadding: false,
  noLeadZero: false,
  sortProperties: false,
  sortSelectors: false,
  forceValue: 'preserve',
  preserveLine: 3,
  quoteConvert: 'none'
}
```

> _Prettify supports Liquid infused style formatting and when encountered it will apply beautification using Markup rules_

### Script Rules

Refer to the [typings](https://github.com/panoply/prettify/blob/pre-release/types/rules/script.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- JavaScript
- TypeScript

```ts
{
  arrayFormat: 'default',
  braceAllman: false,
  bracePadding: false,
  braceStyle: 'none',
  endComma: 'never',
  braceNewline: true,
  correct: false,
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
  styleGuide: 'none'
}
```

> _Prettify supports Liquid infused script formatting and when encountered it will apply beautification using Markup rules_

### JSON Rules

Refer to the [typings](https://github.com/panoply/prettify/blob/pre-release/types/rules/json.d.ts) declaration file for description. Rules will be used when formatting the following languages:

- JSON

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

> _Prettify partially supports Liquid infused JSON formatting, but you should avoid coupling these 2 language together._

# Parse Errors

The `format` method returns a promise, so when beautification fails and a parse error occurs `.catch()` is invoked. The error message will typically inform you of the issue but it's rather blasé and not very informative. There are plans to improve this aspect in future releases.

> It's important to note that Liquify and Prettify are using different Parsers. The Liquify parser constructs an AST that provides diagnostic capabilities (ie: linting) whereas the Prettify parser constructs a data~structure. The errors of these tools will differ dramatically. Liquify will give you far more context opposed to Prettify.

<!-- prettier-ignore -->
```typescript
import prettify from '@liquify/prettify';

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

Inline control is supported and can be applied within comments. Inline control allows your to ignore files, code regions or apply custom formatting options. Comments use the following structures:

- `@prettify-ignore`
- `@prettify-ignore-next`
- `@prettify-ignore-start`
- `@prettify-ignore-end`
- `@prettify: ....`

### Disable Prettify

You can prevent Prettify from formatting a file by placing an inline control comment at the type of the document.

```html
{% # @prettify-ignore %}

<div>
  <ul>
    <li>The entire file will not be formatted</li>
  </ul>
</div>
```

### Inline Formatting

Prettify provides inline formatting support via comments. Inline formatting adopts a similar approach used in linters and other projects. The difference is how inline formats are expressed, in Prettify you express formats using inline annotation at the top of the document with a value of `@prettify` followed by either a space of newline.

#### HTML Comments

```html
<!-- @prettify forceAttribute: true, indentLevel: 4 -->
```

#### Liquid Block Comments

```liquid
{% comment %}
  @prettify forceAttribute: true, indentLevel: 4
{% endcomment %}
```

#### Liquid Line Comments

```liquid
{% # @prettify forceAttribute: true, indentLevel: 4 %}
```

#### Block comment

```css
/* @prettify forceAttribute: true, indentLevel: 4 */
```

#### Line comments

```javascript
// @prettify forceAttribute: true, indentLevel: 4
```

### Ignoring Regions

Lexer modes provide inline comments control and support ignoring regions (blocks) of code. All content contained between the comments will be preserved and unformatted.

#### HTML Comments

- `<!-- @prettify-ignore-start -->`
- `<!-- @prettify-ignore-end -->`

#### Liquid Block Comments

- `{% comment %} @prettify-ignore-start {% endcomment %}`
- `{% comment %} @prettify-ignore-end {% endcomment %}`

#### Liquid Line Comments

- `{% # @prettify-ignore-start %}`
- `{% # @prettify-ignore-end %}`

#### Block Comments

- `/* @prettify-ignore-start */`
- `/* @prettify-ignore-end */`

#### Line Comments

- `// @prettify-ignore-start`
- `// @prettify-ignore-end`

# Caveats

Prettify is comparatively _recluse_ in terms of PnP integrations/extensibility. Depending on your stack and development preferences you may wish to use Prettify together with additional tools like [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) or even [Prettier](https://prettier.io/). There are a few notable caveats you should be aware before running Prettify, most of which are trivial.

### Prettier + Prettify

It is not uncommon for developers to use Prettier in their projects but you avoid executing Prettier along-side Prettify. You can easily prevent issues arising by excluding the files Prettify handles by adding them to a `.prettierignore` file.

### Linters

Prettify can be used together with tools like ESLint and Stylelint without the need to install additional plugins but the caveats come when you introduce Liquid into the code. Prettify can format Liquid contained in JavaScript, TypeScript, JSX and TSX but tools like ESLint are currently unable to process content of that nature and as such without official linting support for Liquid by these tools it is best to only run Prettify with linters on code that does not contain Liquid.

### Shopify Themes

Developers working with straps like [Dawn](https://github.com/Shopify/dawn) should take some consideration before running Prettify on the distributed code contained within the project. Dawn is chaotic, novice and it employs some terrible approaches. Using Prettify blindly on the project may lead to problematic scenarios and readability issues.

# Prettify vs Shopify's Liquid Prettier Plugin

Shopify recently shipped a Liquid prettier plugin but it does not really do much beyond indentation. While it's great to see Shopify begin to bring support for Liquid beautification despite sitting on the issue for nearly a decade, their choice for a Prettier based solution will only ever suffice for a small number of use cases, all of which directly pertain to their theme development ecosystem. Prettier is a great tool but it's extremely opinionated and trying to tame Liquid in Prettier is difficult and restrictive.

Prettify takes a complete different approach and is leveraging the sparser lexing algorithm under the hood (a data structures are generated, not an AST). Sparser along side PrettyDiff at the time I adapted them into Prettify were efficient at handling Liquid and a multitude of other template languages. I chose to build Prettify atop of these projects opposed to developing a Prettier plugin for many reasons but mostly because the sparser lexers understood Liquid infusion within languages other than Markup.

### Comparison

Below is a formatting specific feature comparison as of September 2022 for Markup (Liquid + HTML). This a minimal comparison and I have omitted the cumbersome capabilities, overall Shopify's solution offers 1/10th of what Prettify provides and because its a Prettier plugin it's 7x slower than Prettify.

| Feature                         | Prettify | Liquid Prettier Plugin                |
| ------------------------------- | -------- | ------------------------------------- |
| Tag Indentation                 | ✓        | ✓                                     |
| HTML Attribute Indentation      | ✓        | ✓                                     |
| Comment Formatting              | ✓        | ✓                                     |
| Content Indentation             | ✓        | 𐄂                                     |
| Delimiter Spacing               | ✓        | 𐄂                                     |
| Wrapping Indentation            | ✓        | 𐄂                                     |
| Attribute Casing                | ✓        | 𐄂                                     |
| Attribute Sorting               | ✓        | 𐄂                                     |
| Attribute Indentation (Liquid)  | ✓        | 𐄂                                     |
| Attribute Value Formatting      | ✓        | 𐄂                                     |
| Liquid + CSS/SCSS               | ✓        | 𐄂                                     |
| Liquid + JS/TS                  | ✓        | 𐄂                                     |
| Liquid Newline Filters          | ✓        | 𐄂                                     |
| Frontmatter Support             | ✓        | 𐄂                                     |
| Embedded `{% style %}`          | ✓        | ✓ _does not support contained liquid_ |
| Embedded `{% stylesheet %}`     | ✓        | ✓ _does not support contained liquid_ |
| Embedded `{% javascript %}`     | ✓        | ✓ _does not support contained liquid_ |
| Embedded `{% schema %}`         | ✓        | ✓                                     |
| Embedded CSS + Liquid `<style>` | ✓        | 𐄂 _does not support contained liquid_ |
| Embedded JS + Liquid `<script>` | ✓        | 𐄂 _does not support contained liquid_ |

# Credits

Prettify owes its existence to Sparser and PrettyDiff. This project has been adapted from these 2 brilliant tools and while largely refactored + overhauled the original parse architecture remains intact.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

[Austin Cheney](https://github.com/prettydiff) who is the original author of [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser) created these two projects and this module is only possible because of the work he has done. Austin is one of the great minds in JavaScript and I want to thank him for open sourcing these tools.

Both PrettyDiff and Sparser were abandoned in 2019 after a nearly a decade of production. Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool, please check it out and also have a read of
[wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

## Author 🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com)

<img
  align="right"
  src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff"
/>
