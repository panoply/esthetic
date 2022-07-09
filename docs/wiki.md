# Wiki

Prettify is built atop of the Sparser lexing algorithm and PrettyDiff parser. The original algorithm written by the talented Austin Cheney has been refactored in order to provide a more refined data structure wheres the the parser (PrettyDiff) and be overhauled and improved upon for usage within Prettify. Prettify focuses largely on supporting the Liquid template language and as such the data types and various processes handled by the lexers produce different output from that users may be accustomed to they've used the original version of these tools. In addition to the various bug fixes, improvements and new features the tools are no longer language aware and only support the following languages:

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

# Markup

The markup lexer of Sparser in Prettify's implementation is no longer language aware and only supports HTML and Liquid, which means it cannot handle additional template languages other than Liquid. The lexer was overhauled and while the original algorithm and approach remains mostly intact there are notable differences when it is compared to the original.

### Major Refactors / Changes

- Renamed formatting rules and option stores
- Applied a less verbose design pattern
- Improved type support and use esbuild for distribution
- Employed a different test approach
- Annotated various logic with JSDoc comments
- Integer optimizations applied for character specific conditionals
- Removed support for additional template languages
- Changed handling process for inline comment ignores
- Objects are generated with null prototypes
- Extended support for additional embedded code blocks, ie: `{% javascript %}` etc
- Refactored how the token stack handles template start and end tags
- Improved support for comment processing
- Changed various naming conventions used
- Refactored tag evaluation algorithm
- Imposed a strict array type data structure
- Exposed tag mapped references and allow users to extend internal logic
- Overhauled attribute lexing and introduced new type values
- Fixed various defects and bugs

# Type Values

Prettify has introduced new type values for better handling when applying beautification. In addition to pre-existing type values the resulting data structure produced infers a couple of new token types. Below is a list the finalized and current list of refined changes in this area.

### `doctype`

The `<!DOCTYPE>` declaration which is used at the start of HTML documents

### `attribute_template`

A tag attribute contained within a template attribute and surrounded by whitespace character or newlines. This is different from `attribute_template_start` and `attribute_template_end` in the sense that the token is expressed in an isolated manner. The reason for inferring a unique type value allows us to apply different indentation in the beautification process.

##### Example

The `data-attr="x"` token in the below example would be marked as a `attribute_template` because it is surrounded by whitespace characters and contained within an template expression.

```html
<div {% if x %} data-attr="x" {% endif %}></div>
```

### `attribute_template_start`

A tag attribute preceded by a template attribute but not contained within a template expression.

##### Example

The `{{ x }}-attr` and `{% endif %}-attr="x"` tokens in the below example would be marked as a `attribute_template_start` because no whitespace or newlines exist as separators, instead the attribute token is expressed inline inferring a relation to the attribute.

<!-- prettier-ignore -->
```html
<div
 id="foo"
 {{ x }}-attr
 class="bar"
 data-{% if x %}foo{% else %}bar{% endif %}-attr="x"></div>
```

> The sequence starting at the end of `{% if x %}` and before `{% endif %}` will be marked as a `template_attribute` because no whitespace or newline characters are expressed.

### `attribute_template_end`

A tag attribute followed by a template attribute but not contained within a template expression.

##### Example

The `data-{{ x }}` and `data-{% if x %}` tokens in the below example would be marked as a `attribute_template_end` because no whitespace or newlines exist as separators, instead the attribute token is expressed inline inferring a relation to the attribute.

<!-- prettier-ignore -->
```html
<div
 id="foo"
 data-{{ x }}
 class="bar"
 data-{% if x %}foo{% else %}bar{% endif %}-attr="x"></div>
```

> The sequence of `foo{% else %}bar` which begins at the end of `{% if x %}` but before `{% endif %}` will be marked as a `template_attribute` because no whitespace or newline characters are expressed.

### `template_attribute`

The `template_attribute` type infers a new definition reference when present in data structures. Originally, this type value described any template language token contained within a HTML attribute but this has changed in Prettify. The `template_attribute` type value depending on the defined rules and/or input source character sequence means it reference differs.

A singleton template tag contained within a template tag expression or a singleton template tag expressed as a HTML attribute in an isolated manner that is surrounding be either whitespace or newline characters would hold a `template_attribute` type value. In addition a `template_attribute` type may also be used to describe a sequence of either HTML, Liquid or both Liquid and HTML tokens that are contained contained within a template tag expression but without any whitespace or newline characters. Depending on the the defined formatting options this type value is used to inform on how beautification and specifically indentation should be handled.

##### Example

The `{% tag %}` token and the sequence of `foo{% else %}bar` which begins at the end of `{% if x %}` but before `{% endif %}` will be both marked as a `template_attribute`.

<!-- prettier-ignore -->
```html
<div
 id="foo"
 {% tag %}
 data-{{ x }}
 class="bar"
 data-{% if x %}foo{% else %}bar{% endif %}-attr="x"></div>
```

This example it is assumed that `forceAttribute` is enabled and as such the type value `template_attribute` will not be used and instead the `foo` and `bar` tokens will have a type value of `attribute` and the `{% else %}` token will use `template_attribute_else`.

<!-- prettier-ignore -->
```html
<div
 class="bar"
 data-{% if x %}foo{% else %}bar{% endif %}-attr="x"></div>
```

The same logic would be applied is `forceAttribute` was disabled and an input source string applied whitespace/newline characters between the template expression. Again, the `foo` and `bar` tokens will have a type value of `attribute` and the `{% else %}` token will use `template_attribute_else`.

<!-- prettier-ignore -->
```html
<div
 class="bar"
 data-{% if x %} foo {% else %} bar {% endif %}-attr="x"></div>
```

### `template_attribute_start`

A template tag within a HTML attribute that is not a singleton. When the `attributeChain` option is enabled and Prettify executes the beautification process this type value is used as a stack reference point to produce a chained result.

See [Template Attributes](#) for more information.

##### Example

The `{% if x %}` token in the below example would be marked as a `template_attribute_start` because it can be identified as a _start_ type token given an _ender_ exists.

<!-- prettier-ignore -->
```html
<div
 id="foo"
 {% if x %}data-x{% else %}data-y{% endif %}></div>
```

### `template_attribute_else`

A template tag within a HTML attribute that can be identified as an else type conditional.

##### Example

The `{% elsif %}` and `{% else %}` tokens in the below example would be marked as a `template_attribute_else` because they can be identified as a _else_ type tokens given they are contained within conditional types `if` and `unless` tags. This type value is important for beautification handling as depending on defined options like `attributeChain`, `forceAttribute`, `wrap` and/or `correct` then a token type value of `template_attribute_else` may be used to separate contents onto newlines.

<!-- prettier-ignore -->
```html
<div
 {% unless x %}class="foo"{% else %}class="bar"{% endunless %}
 id="some-id"
 {% if x %}data-x{% elsif y %}data-y{% endif %}></div>
```

### `template_attribute_end`

A template tag within a HTML attribute that can be identified as an ender type.

##### Example

The `{% endif %}` token in the below example would be marked as a `template_attribute_end` because it can be identified as a _ender_ type token given that a _start_ type exists.

<!-- prettier-ignore -->
```html
<div
 id="some-id"
 {% if x %}data-x{% endif %}></div>
```

### Original Type Values

For reference, below you will find the original Type Values provided by Sparser. These Type values are still used in Prettify and their definition removed intact.

- **attribute**
  - A tag attribute from a regular _start_ or _singular_ tag type.
- **cdata**
  - An XML/SGML CDATA block. Typically used to allow extraneous string content in an XML document that might otherwise break the XML syntax rules.
- **cdata_end**
  - When a CDATA segment terminates an enclosed grammar parsed with a different lexer.
- **cdata_start**
  - When a CDATA segment starts an enclosed grammar parsed with a different lexer.
- **comment**
  - Comment in XML or supporting template syntax.
- **comment_attribute**
  - JSX allows JavaScript style comments as tag attributes.
- **conditional**
  - Comments used in IE to hack references to CSS by IE version. Follows a SGML square brace convention.
- **content**
  - Regular text nodes, but white space is removed from the front and end of the node as an approximate value is accounted for in the _lines_ data field.
- **content_preserve**
  - A content type that lets consuming applications this token must not be modified.
- **end**
  - An end tag of a tag pair.
- **ignore**
  - These types are used to excuse a structure from deeper evaluation and treats the element as a singleton even if it is part of tag pair and contains descendant nodes.
- **jsx_attribute_end**
  - The end of an curly brace delimited escape, stated as a tag attribute, that allows JavaScript inside the markup tag of a JSX markup element.
- **jsx_attribute_end**
  - The start of an curly brace delimited escape, stated as a tag attribute, that allows JavaScript inside the markup tag of a JSX markup element.
- **script_start**
  - A curly brace indicating the contents that need to be passed to the _script_ lexer for JSX language.
- **script_end**
  - A curly brace indicating a script string has concluded.
- **sgml**
  - SGML type notations, which can be deeply nested using square brace notation.
- **singleton**
  - A self-closing tag.
- **start**
  - A start tag of a tag pair.
- **style**
  - A tag indicating it may contain contents that need to be passed to the style lexer.
- **template**
  - A tag delimited by a known convention of an external template language.
- **xml**
  - XML pragmas. Typically used to declare the document for an XML interpreter, but otherwise not widely used.

# Beautification

Prettify extended upon the pre-existing logic of PrettyDiff and Sparser in order to achieve more intelligent, powerful and customizable beautification results. The granular formatting options that PrettyDiff supported together with the new ones introduced in Prettify might seem like Prettify is executing lint operations but it's important that users understand Prettify is not a linter, nor was PrettyDiff, it is a beautification tool and with parse capabilities and should be treated as exactly that.

Originally, PrettyDiff was responsible for beautification whereas Sparser took care of the composing the data structure that PrettyDiff would used to produce a formatted result. These tools existed separate from one another and served different purposes, Sparser was the language aware parser and PrettyDiff was the code comparison tool responsible for beautification, minification and diffing but in Prettify a lot of those capabilities were purged. Features like the CLI, markdown parsing, diffing (code caparison), minification, documentation generation and reporting are not supported in Prettify.

Prettify implements the lexing and parse algorithm in distributed source of Sparser and PrettyDiff. Austin Cheney, who is the original author created the projects with extensibility in mind and as such they could be leveraged Prettify. Below you will find the most notable changes imposed.

### Attribute Handling

Prettify extended upon the pre-existing logic of PrettyDiff and Sparer in order to achieve more intelligent, powerful and customizable beautification results. The granular formatting options that PrettyDiff supported together with the new ones introduced in Prettify might seem like Prettify is executing linted operations but it's important that users understand Prettify is not a linter, nor was PrettyDiff. Prettify is a beautification tool

The "chained" result will glue attributes contained within the token expression, starting at the point the type `template_attribute_start` exists and ending at `template_attribute_end`. If `attributeChain` is disabled (ie: `false`) then Prettify will process beautification according to the character sequences contained within, and in accordance with any `wrap` and `forceAttribute` options.

In situations where a template expression starting with a type value of `template_attribute_start` contains a newline character then chaining will end at the point the newline exists and from here go about running the next sequence. In some cases depending on defined rules when a `template_attribute_else` type value is encountered then the same logic will be employed if `wrap` limit is exceeded and/or `forceAttribute` is enabled. Lastly, when chaining is defined in the source string passed to Prettify and the `correct` option is enabled but it so happens that `wrap` limit was exceeded and/or `forceAttribute` is enabled then Prettify will split the sequence onto newlines and automatically apply whitespace dashes to the `template_attribute_else` token (eg: `{%- else -%}`) which in-turn preserves the intended structure inferred.
