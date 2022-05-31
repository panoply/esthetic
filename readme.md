**WIP | DO NOT USE THIS YET**

# @liquify/prettify

Liquid Language formatting support that provides beatification capabilities in various languages. Prettify leverages the [Sparser](https://github.com/unibeautify/sparser) lexers and its parse/beautification approach has been adapted from the distributed source code of [PrettyDiff](https://github.com/prettydiff/prettydiff). In addition, Prettify streamlines some input to [Prettier](https://prettier.io/) when dealing with embedded code regions (like frontmatter) or for handling languages like markdown.

### Supported Languages

Prettify supports beautification of Liquid together with several other languages.

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

### Supported Languages with Liquid

- Liquid + HTML
- Liquid + CSS/SCSS/LESS
- Liquid + JavaScript/TypeScript
- Liquid + JSX/TSX

# Install

This module is used by the [Liquify IDE](https://liquify.dev) extension. The project is available on the public NPM registry and can be consumed by individuals and used by any project which is not maintained, created or shipped by the Shopify organization, its company and/or employees of the platform. Everyone else is free to use as they wish.

```cli
pnpm add @liquify/prettify --save-dev
```

# Usage

The tool provides beautification rules for multiple languages that are infusing Liquid. Each supported language exposes different formatting options. The export accepts a `string` type and second (optional) rules object. There are different modes available, each mode is representative of a single language or multiple languages.

- markup
- style
- script
- json

### Coming Soon

- yaml
- markdown

Keeping the PrettyDiff logic, 3 lexer modes are supplied (`markup`, `style` and `script`) each mode can be used to beautify languages within a matching nexus.

> The `json` and `yaml` modes are used to beautify single languages only. JSON and Yaml are data languages and these modes do not handle Liquid contained within their syntax (yet).

# Formatting

Prettify exposes direct access to methods on the export and can be used when you require per-language beautification. Passing a string and an optional set of beautification options to a language mode. Though Prettify uses PrettyDiff and Sparser internally, it is important to note that both the lexers and parsers have been largely refactored. As such, Prettify operates rather effectively and can interpret otherwise unpredictable or chaotic code:

### Example

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

### Input

```typescript
import * as prettify from "@liquify/prettify";

// Markup = HTML
prettify.markup(source: string, rules?: object): Promise<string>

// Style = CSS, SCSS or LESS
prettify.style(source: string, rules?: object): Promise<string>

// Script = JavaScript, TypeScript or JSX
prettify.script(source: string, rules?: object): Promise<string>
```

Additional `options` method for controlling how internal regions should format when needing control of how contents of embedded regions are beautified within markup:

```typescript
import * as prettify from "@liquify/prettify";

// Addition Method
prettify.options(rules: options, rules?: {
  markup?: MarkupRules,
  style?: StyleRules,
  script?: ScriptRules,
  json?: JsonRules, // NOT YET AVAILABLE
  yaml?: YamlRules // NOT YET AVAILABLE
}): void
```

### Output

<!-- prettier-ignore -->
```typescript
import * as prettify from '@liquify/prettify';

const code = '<div id="x" class="foo">{% if x %} {{ x }} {% endif %}</div>';

prettify.markup(code).then(formatted => {

  console.log(formatted)

})
```

### Parse Errors

Each method returns a promise, so when formatting fails or a parse error occurs, `.catch()` is invoked. The error returns an object. The object contains the provided input (`source`) and the error message.

> It's important to note that Liquify and Prettify are using different Parsers. The Liquify parser constructs an AST that provides diagnostic capabilities (ie: linting), so the errors of these tools will differ dramatically. Liquify will give you far more context opposed to Prettify.

<!-- prettier-ignore -->
```typescript
import * as prettify from '@liquify/prettify';

// Invalid code
const code = '{% if x %} {{ x }} {% endunless %}';

prettify.markup(code).then(formatted => console.log(formatted)).catch(error => {

  // Print the PrettyDiff error
  console.error(error);

  // Return the original input
  return code;

});
```

# Options

Prettify uses a custom set of beautification rules (options). Though input is forwarded to Prettier and internally uses PrettyDiff, options names differ as its combining these 2 tools to generate the output. If you are formatting on a per-language basis, you can simply provide options as a second parameter, but if you are dealing with multiple languages you can preset formatting options.

```typescript
{
  markup: {
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
  },
  style: {
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
    quoteConvert: 'single',
    wrap: 0
  },
  script: {
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
    vertical: false,
    wrap: 0
  },
  json: {
    arrayFormat: 'default',
    bracesAllman: false,
    bracePadding: false,
    indentSize: 2,
    indentLevel: 0,
    newLineEnd: true,
    objectSort: false,
    objectArrays: 'default',
    preserveLines: 3,
    wrap: 0
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
  quoteConvert: 'single',
  wrap: 0
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
  preserveLines: 3,
  wrap: 0
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
  vertical: false,
  wrap: 0
}
```

# Inline Control

Inline control is supported and can be applied by referencing the `@prettify` keyword in a comment followed by the operation. There are 3 operations available, `disable`, `format` and `ignore` each of which can be expressed as follows:

- `@prettify disable`
- `@prettify ignore:start`
- `@prettify ignore:end`
- `@prettify format: ...`

### Disable Prettify

You can disable Prettify from formatting a file by placing an inline control comment at the type of the file:

```html
{% comment %} @prettify disable {% endcomment %}

<div>
  <ul>
    <li>The entire file will not be formatted</li>
  </ul>
</div>
```

# Inline Formatting

Prettify provides inline formatting support via comments. Inline formatting adopts a similar approach used in linters and other projects. The difference is how inline formats are expressed. You can direct Prettify to be apply formatting rules to an entire file by annotation the top of the document with an inline format comment.

### HTML Comments

```html
<!-- @prettify format: forceAttribute: true, indentLevel: 4 -->
```

### CSS, SCSS or LESS Comments

```css
/* @prettify format: forceAttribute: true, indentLevel: 4 */
```

### JavaScript, TypeScript Comments

```javascript
// @prettify format: forceAttribute: true, indentLevel: 4
```

### Liquid Comments

```liquid
{% comment %}
  @prettify format: forceAttribute: true, indentLevel: 4
{% endcomment %}
```

# Ignoring Code

Lexer modes provide inline comments control and support ignoring regions of code. This logic is mostly lifted from within PrettyDiff and supports Liquid comments:

### HTML Comments

- `<!-- @prettify ignore:start -->`
- `<!-- @prettify ignore:end -->`

### CSS, SCSS or LESS Comments

- `/* @prettify ignore:start */`
- `/* @prettify ignore:end */`

### JavaScript, TypeScript Comments

- `// @prettify ignore:start`
- `// @prettify ignore:end`

### Liquid Comments

- `{% comment %} @prettify ignore:start {% endcomment %}`
- `{% comment %} @prettify ignore:end {% endcomment %}`

# Credits

Prettify is made possible by combining 2 beautification tools. Prettier and PrettyDiff. The export is a wrapper around these packages that forwards string input.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

[Austin Cheney](https://github.com/prettydiff) who is the original author of [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser) created these two projects and this module is only possible because of the work he has done. PrettyDiff was abandoned in 2019 and Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool, please check it out and also have a read of [wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

### [Prettier](https://prettier.io/)

Thanks to the maintainers and creators of this beloved and brilliant tool. If you are not working with Liquid, then you will not need Prettify, instead just use Prettier. It is important to reiterate that Prettify is mostly a wrapper, it passes the input of some languages to Prettier.

## Author

🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com) <img align="right" src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff" />
