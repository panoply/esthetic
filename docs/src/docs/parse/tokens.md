---
title: 'Tokens'
layout: base
permalink: '/parse/tokens/index.html'
anchors:
  - 'Algorithm'
  - 'Parse Table'
  - 'Terminology'
---

# Tokens

The sparser algorithm uses a simple and elegant approach for token identification of character types. These character types are used in the beautification cycle to produce the formatted result and provide context to structural formation of the input.

::: note
Refer to [architecture](/parse/architecture/) section to better understand the generated [data structure](/parse/data-structure/) of Sparser.
:::

# Markup

<table>
  <th>
    <tr>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </th>
  <tr>
    <td>
      <code>doctype</code>
    </td>
  </tr>
  <tr>
    <td>
      An HTML document type tag.
      </td>
  </tr>
  <tr>
    <td>
      <code>cdata</code>
    </td>
  </tr>
  <tr>
    <td>
      An XML/SGML CDATA block. Typically used to allow extraneous string content in an XML document.
    </td>
  </tr>
  <tr>
    <td>
      <code>cdata</code>
    </td>
  </tr>
  <tr>
    <td>
      When a CDATA segment starts an enclosed grammar parsed with a different lexer.
    </td>
  </tr>
  <tr>
    <td>
      <code>cdata_start</code>
    </td>
  </tr>
  <tr>
    <td>
      When a CDATA segment terminates an enclosed grammar parsed with a different lexer.
    </td>
  </tr>
  <tr>
    <td>
      <code>cdata_end</code>
    </td>
  </tr>
  <tr>
    <td>
      Comment in XML or supporting template syntax.
    </td>
  </tr>
  <tr>
    <td>
      <code>comment</code>
    </td>
  </tr>
  <tr>
    <td>
      JSX allows JavaScript style comments as tag attributes.
    </td>
  </tr>
  <tr>
    <td>
      <code>comment_attribute</code>
    </td>
  </tr>
  <tr>
    <td>
      Comments used in IE to hack references to CSS by IE version. Follows a SGML square brace convention.
    </td>
  </tr>
  <tr>
    <td>
      <code>conditional</code>
    </td>
  </tr>
  <tr>
    <td>
      Regular text nodes, but white space is removed from the front and end of the node.
    </td>
  </tr>
  <tr>
    <td>
      <code>content_preserve</code>
    </td>
  </tr>
  <tr>
    <td>
      A content type that lets consuming applications this token must not be modified.
    </td>
  </tr>
  <tr>
    <td>
      <code>start</code>
    </td>
  </tr>
  <tr>
    <td>
      A start tag of a tag pair.
    </td>
  </tr>
  <tr>
    <td>
      <code>end</code>
    </td>
  </tr>
  <tr>
    <td>
      An end tag of a tag pair.
    </td>
  </tr>
  <tr>
    <td>
      <code>ignore</code>
    </td>
  </tr>
  <tr>
    <td>
      These types are used to excuse a structure from deeper evaluation and treats the element as a singleton.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_start</code>
    </td>
  </tr>
  <tr>
    <td>
      A start type Liquid tag of a tag pair
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_else</code>
    </td>
  </tr>
  <tr>
    <td>
      A Liquid tag acting as the else block of a condition, must be contained within a liquid_start and liquid_end pair.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_end</code>
    </td>
  </tr>
  <tr>
    <td>
      An end type Liquid tag of a tag pair
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_bad_start</code>
    </td>
  </tr>
  <tr>
    <td>
      A liquid tag or tag sequences used as a HTML start tag type.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_bad_end</code>
    </td>
  </tr>
  <tr>
    <td>
       An end liquid tag sequences used as a HTML start tag type.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_attribute</code>
    </td>
  </tr>
  <tr>
    <td>
      A singleton type Liquid tag being used as an attribute of an HTML or XML start type tag.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_attribute_chain</code>
    </td>
  </tr>
  <tr>
    <td>
      A chained sequences of Liquid and HTML tokens being used together to make up a single attribute.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_attribute_start</code>
    </td>
  </tr>
  <tr>
    <td>
      A start type Liquid tag being used as an attribute of an HTML or XML start type tag.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_attribute_else</code>
    </td>
  </tr>
  <tr>
    <td>
      A else type Liquid tag being used as an attribute of an HTML or XML start type tag.
    </td>
  </tr>
  <tr>
    <td>
      <code>liquid_attribute_end</code>
    </td>
  </tr>
  <tr>
    <td>
      An end type Liquid tag being used as an attribute of an HTML or XML start type tag.
    </td>
  </tr>
  <tr>
    <td>
      <code>xml</code>
    </td>
  </tr>
  <tr>
    <td>
      XML pragmas. Typically used to declare the document for an XML interpreter, but otherwise not widely used."
    </td>
  </tr>
</table>
