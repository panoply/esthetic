---
title: 'Rules'
layout: base
permalink: '/rules/index.html'
anchors:
  - Rules
  - Global
  - Liquid
  - Markup
  - Style
  - JSON
  - Script
---

::: grid col-12 p-100

# Rules

Æsthetic provides a granular set of formatting rules. Rules are a guideline, they control how beautification is to be applied and allow you to structure your code in a uniform way. The default behavior of Æsthetic is to perform beautification in an unobtrusive manner and as such all rules have been pre-defined to produce output which will format in accordance with your provided input. Æsthetic provides several starting-point [preset](/rules/global/preset) style guides. Presets allow you to change the operating defaults that Æsthetic uses.

# Global

Global rules are used are reference point within all supported languages.

- [Correct](/rules/global/correct)
- [Crlf](/rules/global/crlf/)
- [End Newline](/rules/global/endNewline)
- [Indent Char](/rules/global/indentChar/)
- [Indent Size](/rules/global/indentSize/)
- [Indent Level](/rules/global/indentLevel/)
- [Language](/rules/global/language)
- [Preserve Line](/rules/global/preserveLine/)
- [Preset](/rules/global/preset/)
- [Wrap](/rules/global/wrap/)
- [WrapFraction](/rules/global/wrapFraction/)

---

# Liquid

Beautification rules for the [Liquid Template Language](https://shopify.github.io/liquid/). Æsthetic brings an array of beautification rules tailored to its typical usage within Markup languages. These rules are diligently applied in accordance with the specific requirements of Liquid.

#### Extended Behavior

Liquid rules extend beyond Markup languages, supports for Liquid contained within Style, JSON, and Script languages is also provided but the behavior of Liquid beautification in these non-markup contexts differs slightly. To maintain code preservation, Æsthetic adopts a preservation-based approach when dealing with Liquid in non-markup languages. As a result, only a small subset of Liquid-specific rules will be employed in these scenarios.

#### Dynamic Determination

To ensure the most refined outcome, Æsthetic dynamically determines which rules to apply in non-markup languages based on the surrounding syntax structure. Rules are cherry-picked to match the specific context, taking into account token placement, positioning, and character matches. This intelligent inference of control enables Æsthetic to deliver precise and cohesive code formatting, regardless of whether Liquid resides within Markup or other language environments.

#### Ruleset

- [CommentIndent](/rules/liquid/commentIndent)
- [CommentNewline](/rules/liquid/commentNewline)
- [Dedent Tag List](/rules/liquid/dedentTagList)
- [Delimiter Placement](/rules/liquid/delimiterPlacement)
- [Delimiter Trims](/rules/liquid/delimiterTrims)
- [Force Argument](/rules/liquid/forceArgument)
- [Force Filter](/rules/liquid/forceFilter)
- [Ignore Tag List](/rules/liquid/ignoreTagList)
- [Indent Attributes](/rules/liquid/indentAttributes)
- [Line Break Separator](/rules/liquid/lineBreakSeparator)
- [Line Break Style](/rules/liquid/lineBreakSeparator)
- [Normalize Spacing](/rules/liquid/normalizeSpacing)
- [Preserve Comment](/rules/liquid/preserveComment)
- [Preserve Internal](/rules/liquid/preserveInternal)
- [Quote Convert](/rules/liquid/quoteConvert)

---

# Markup

Beautification rules for [HTML](https://en.wikipedia.org/wiki/HTML) and [XML](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction) markup languages. Æsthetic exposes a refined set of formatting options for markup syntax to allow developers to generate both basic and complex output using progressive adaption.

#### Handling

[Liquid](#liquid), [JSX](#jsx) and [TSX](#) languages reference rules defined in markup and will apply mirror depending on structure occurrence.

#### Ruleset

- [Attribute Casing](/rules/markup/attributCasing)
- [Attribute Sort](/rules/markup/attributeSort)
- [CommentIndent](/rules/markup/commentIndent)
- [CommentNewline](/rules/markup/commentNewline)
- [Delimiter Terminus](/rules/markup/delimiterTerminus)
- [Force Attribute](/rules/markup/forceAttribute)
- [Force Indent](/rules/markup/forceIndent)
- [Ignore CSS](/rules/markup/ignoreCSS)
- [Ignore JS](/rules/markup/ignoreJS)
- [Ignore JSON](/rules/markup/ignoreJSON)
- [Line Break Value](/rules/markup/lineBreakValue)
- [Preserve Attribute](/rules/markup/preserveAttribute)
- [Preserve Text](/rules/markup/preserveText)
- [Preserve Comment](/rules/markup/preserveComment)
- [Quote Convert](/rules/markup/quoteConvert)
- [Self Close Space](/rules/markup/selfCloseSpace)
- [Self Close SVG](/rules/markup/selfCloseSVG)
- [Strip Attribute Lines](/rules/markup/stripAttributeLines)

---

# Style

[CSS](https://en.wikipedia.org/wiki/CSS) and [SCSS](https://sass-lang.com).

#### Ruleset

- [At Rule Space](/rules/style/atRuleSpace)
- [Brace Padding](/rules/style/bracePadding)
- [CommentIndent](/rules/style/commentIndent)
- [CommentNewline](/rules/style/commentNewline)
- [No Lead Zero](/rules/style/noLeadZero)
- [Property Sort](/rules/style/propertySort)
- [Quote Convert](/rules/style/quoteConvert)
- [Selector Sort](/rules/style/selectorSort)
- [Shorthand Values](/rules/style/shorthandValues)

---

# JSON

[JSON Language](https://en.wikipedia.org/wiki/JSON).

#### Ruleset

- [Array Format](/rules/json/arrayFormat)
- [Brace Allman](/rules/json/braceAllman)
- [Brace Padding](/rules/json/bracePadding)
- [CommentIndent](/rules/json/commentIndent)
- [CommentNewline](/rules/json/commentNewline)
- [Object Indent](/rules/json/objectIndent)
- [Object Sort](/rules/json/objectSort)
- [Preserve Comment](/rules/json/preserveComment)

:::
