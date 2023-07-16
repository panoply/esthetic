---
title: 'Global Rules - Language'
layout: base
permalink: '/rules/global/language/index.html'
describe:
  - Language
  - Rule Options
options:
  - auto
  - text
  - liquid
  - html
  - xml
  - css
  - scss
  - json
  - javascript
  - typescript
  - jsx
  - tsx
---

# Language

The `language` rule is used to inform Æsthetic on the type of input that has been provided. By default, Æsthetic will attempt to detect the language of content provided. It is discouraged to omit this rule and rely upon the automatic detection of languages based on input because the internal detection logic may not always be correct.

::: note

The language reference is used to determine the lexical process operation code is to be handled.

:::

# Rule Options

The `language` rule is a global setting.

::: rule

#### auto

:::

The `auto` option is used by default and will attempt to automatically detect the language.

---

::: rule

#### text

:::

The `text` option refers to a **Plain Text** document, wherein the content will be formatted according to only a couple of global rules.

```json:rules
{
  "language": "text"
}
```

<!-- prettier-ignore -->
```liquid
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
id est laborum.
```

---

::: rule

#### liquid

:::

The `liquid` option refers to the **[Liquid Template Language](https://shopify.github.io/liquid/)** and uses the **markup** lexer.

```json:rules
{
  "language": "liquid",
  "liquid": {
    "forceFilter": 3,
    "forceArgument": 3,
    "indentAttribute": true
  },
  "markup": {
    "forceAttribute": 2,
    "forceIndent": true
  }
}
```

<!-- prettier-ignore -->
```liquid
{%if condition %}
<div class="xxx" id="some-id">
<ul>
  {%-unless condition ==something%}
<li class="some-class" data-attr ="xxx"
 {% if xxx %}id="{{ object.prop }}"{% endif %}>
{% for i in list%}
<ul>
  <li data-attr="{{ i.xxx }}">
  {{
  i.something|filter:'some-filter'|append:'some-append'|prepend:'some-prepend'
| example: one: 1,two: 2, three: 3,four: 4
}}
</li>
{% endunless%}
</ul>
{% endfor %}
</li>
</ul>
</div>
{% endif %}
```

---

::: rule

#### html

:::

The `html` option refers to the **[Hyper Text Markup Language](https://en.wikipedia.org/wiki/HTML)** and uses the **markup** lexer.

```json:rules
{
  "language": "html",
  "liquid": {
    "forceFilter": 3
  },
  "markup": {
    "forceAttribute": 3
  }
}
```

<!-- prettier-ignore -->
```liquid
<!DOCTYPE html>
<html lang="en">
<head><meta
 charset="UTF-8"><meta
  http-equiv="X-UA-Compatible"     content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>  <main id  ="xxx"
class="foo bar baz"    data-one="1"   data-two="2"
></main></body>
</html>
```

---

::: rule

#### xml

:::

The `xml` options refers to the **[Extensible Markup Language](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)** and uses the **markup** lexer.

```json:rules
{
  "language": "xml",
  "markup": {
    "forceAttribute": 2,
    "selfCloseSpace": true,
    "forceIndent": true
  }
}
```

<!-- prettier-ignore -->
```liquid
<?xml version="1.0" encoding="UTF-8"?>
<table summary="Product Sales Summary" border="1">
  <!--list products-->
      <tr align="center">
          <xsl:for-each select="//product">
            <th><b><xsl:value-of select="."/></b></th>
          </xsl:for-each></tr>
                                            <!--list customers-->
      <xsl:for-each select="/sales/record/customers">
        <xsl:variable name="customer" select="."/>
        <tr align="right"><td><xsl:value-of select="@num"/></td>
          <xsl:for-each select="//product">   <!--each product-->
            <td><xsl:value-of select="$customer"/>
            </td></xsl:for-each>
        </tr>
    </table>
```

---

::: rule

#### css

:::

The `css` options refers to **[Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)** and uses the **style** lexer.

```json:rules
{
  "language": "css",
  "style": {
    "sortProperties": true,
    "sortSelectors": true
  }
}
```

<!-- prettier-ignore -->
```css
.e-class,
.a-class,
.b-class>.foo> .bar,
.d-baz,
.c-something {
  background-image: url("barn.jpg");
  z-index: 999;   font-style: bold; min-inline-size: inherit;
    width: 200px;
  background-repeat  : no-repeat;background-position  : right top;
  color:    #fff;
  background-attachment
  : fixed;
  font-weight: 100;
}

```
