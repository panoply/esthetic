---
title: 'Global Rules - Language'
layout: base
permalink: '/rules/language/index.html'
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

:: col-8 p-100

# Language

The `language` rule is used to inform Æsthetic on the type of input that has been provided. By default, Æsthetic will attempt to detect the language of content provided. It is discouraged to omit this rule and rely upon the automatic detection of languages based on input because the internal detection logic may not always be correct.

> The language reference is used to determine the lexical process operation code is to be handled.

::

---

:: row
:: col-12 col-md-9

## liquid

The `liquid` option refers to the **[Liquid Template Language](https://shopify.github.io/liquid/)** and uses the **markup** lexer.

::
::

```json:rules
{
  "language": "liquid",
  "wordWrap": 50
}
```

```liquid:before
{% if condition %}
  <div class="xxx" id="some-id">
    <ul>
      {%- unless condition == something %}
        {% for i in list %}
          <li data-attr="{{ i.xxx }}">
            {{
              i.something
              | filter: 'some-filter'
              | append: 'some-append'
              | prepend: 'some-prepend'
              | example: one: 1, two: 2, three: 3, four: 4
            }}
          </li>
        {% endfor %}
      {% endunless %}
    </ul>
  </div>
{% endif %}
```

```liquid:after
{% if condition %}
  <div class="xxx" id="some-id">
    <ul>
      {%- unless condition == something %}
        {% for i in list %}
          <li data-attr="{{ i.xxx }}">
            {{
              i.something
              | filter: 'some-filter'
              | append: 'some-append'
              | prepend: 'some-prepend'
              | example: one: 1, two: 2, three: 3, four: 4
            }}
          </li>
        {% endfor %}
      {% endunless %}
    </ul>
  </div>
{% endif %}
```

---

:: row
:: col-12 col-md-9

## html

The `html` option refers to the **[Hyper Text Markup Language](https://en.wikipedia.org/wiki/HTML)** and uses the **markup** lexer.

::
::

```json:rules
{
  "language": "html",
  "wordWrap": 50
}
```

```html:before
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"><meta
      http-equiv="X-UA-Compatible"
      content="IE=edge">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <main
      id="xxx"
      class="foo bar baz"
      data-one="1"
      data-two="2"></main>
  </body>
</html>
```

```html:after
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"><meta
      http-equiv="X-UA-Compatible"
      content="IE=edge">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <main
      id="xxx"
      class="foo bar baz"
      data-one="1"
      data-two="2"></main>
  </body>
</html>
```

---

:: row
:: col-12 col-md-9

## xml

The `xml` options refers to the **[Extensible Markup Language](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)** and uses the **markup** lexer.

::
::

```json:rules
{
  "language": "xml",
  "attributeLineBreak": 3,
  "selfCloseSpace": true,
  "forceIndent": true
}
```

<!-- prettier-ignore -->
```xml:before
<?xml version="1.0" encoding="UTF-8"?>
<table summary="Product Sales Summary" border="1">
  <!-- list products -->
  <tr align="center">
    <xsl:for-each select="//product">
      <th>
        <b>
          <xsl:value-of select="." />
        </b>
      </th>
    </xsl:for-each>
  </tr>
  <!-- list customers -->
  <xsl:for-each select="/sales/record/customers">
    <xsl:variable name="customer" select="." />
    <tr align="right">
      <td>
        <xsl:value-of select="@num" />
      </td>
      <xsl:for-each select="//product">
        <!-- each product -->
        <td>
          <xsl:value-of select="$customer" />
        </td>
      </xsl:for-each>
    </tr>
  </xsl:for-each>
</table>
```

```xml:after
<?xml version="1.0" encoding="UTF-8"?>
<table summary="Product Sales Summary" border="1">
  <!-- list products -->
  <tr align="center">
    <xsl:for-each select="//product">
      <th>
        <b>
          <xsl:value-of select="." />
        </b>
      </th>
    </xsl:for-each>
  </tr>
  <!-- list customers -->
  <xsl:for-each select="/sales/record/customers">
    <xsl:variable name="customer" select="." />
    <tr align="right">
      <td>
        <xsl:value-of select="@num" />
      </td>
      <xsl:for-each select="//product">
        <!-- each product -->
        <td>
          <xsl:value-of select="$customer" />
        </td>
      </xsl:for-each>
    </tr>
  </xsl:for-each>
</table>
```

---

:: row
:: col-12 col-md-9

#### css

The `css` options refers to **[Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/XML/XML_introduction)** and uses the **style** lexer.

::
::

```json:rules
{
  "language": "json"
}
```

<!-- prettier-ignore -->
```json:before
{
  "name": "John",
  "age": 45,
  "city": "New York",
  "hobbies": ["reading", "hiking"],
  "active": true,
  "family": [
    {
      "child": {
        "name": "Jess",
        "age": 20,
        "gender": "Female"
      },
      "sister": {
        "name": "Sasha",
        "age": 42,
        "married": true
      }
    }
  ]
}
```

```json:after
{
  "name": "John",
  "age": 45,
  "city": "New York",
  "hobbies": [
    "reading",
    "hiking"
  ],
  "active": true,
  "family": [
    {
      "child": {
        "name": "Jess",
        "age": 20,
        "gender": "Female"
      },
      "sister": {
        "name": "Sasha",
        "age": 42,
        "married": true
      }
    }
  ]
}
```
