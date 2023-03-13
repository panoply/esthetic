---
title: 'Parse Architecture'
layout: base
permalink: '/parse/architecture/index.html'
anchors:
  - 'Algorithm'
  - 'Lexical Context'
  - 'Terminology'
---

# Algorithm

The lexing algorithm and parse approach used by Æsthetic is an original strategic concept created by [Austin Cheney](https://github.com/prettydiff) and was first introduced in his project [Sparser](https://sparser.io/). The parse table produced by Sparser provides a simple data format that can accurately describe any language. Before sparser's re-application into Æsthetic, it was used by the language aware diffing and beautification tool [PrettyDiff](https://prettydiff.com/).

While most parsers typically produce an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (abstract syntax tree) this is not the case with Æsthetic. Its implementation of Sparser will produce a uniformed table like structure and though many different algorithms can be made to achieve the same result they all come with tradeoffs relative to one another. Most parse tools in the nexus seem to be using some variant of [ANTLR](https://en.wikipedia.org/wiki/ANTLR), [PEG](https://en.wikipedia.org/wiki/Parsing_expression_grammar) or leverage the brilliant incremental [Tree Sitter](https://tree-sitter.github.io).

Generators like ANTLR and Tree Sitter require grammars and leave users at the behest of steep learning curves whereas PEG parsers have less ambiguity than LR parsers but may produce worse error messages and consume more memory. When we look at hand-rolled recursive-descent parsers, these may be slower than the ones produced by generators but are unambiguous overall. Because the task of Æsthetic more often than not involves making sense of combined language formations the data structure (i.e: parse table) is flexible, easy to reason with and extensible.

# Parse Table

Consider the following code sample. The HTML (markup) consists of Liquid, CSS, JavaScript and JSON. All languages in the sample are encapsulated within the appropriate regional based denominated tags but more importantly, Liquid token expressions exist within the CSS, JavaScript and HTML.

<!-- prettier-ignore -->
```html
<style>
  .list {
    background-color: {{ bg.color }};
  }
</style>

<script>
  {% if condition %}
    console.log('hello world!')
  {% endif %}
</script>

<main id="{{ object.prop }}">
  <ul class="list">
    {% for item in arr %}
      <li>{{ item }}</li>
    {% endfor %}
  </ul>
</main>

{% schema %}
  {
    "prop": []
  }
{% endschema %}
```

There is no "right way" or consensus on how a parser should make sense of this lexical anomaly and achieving lexical context and nor it seem to have been studied much in academia given the edge case realm it exists within The originality of the Sparser language parsing algorithm allows for these otherwise complex structures to be traversed and interpreted for handling without having to bend, augmented or reach for additional resourced to address weaknesses.

# Parse Table

Object trees are painful to traverse and hard to analyze from single global perspective which is why the uniformed data structure that Æsthetic is working with in the beautification cycle is a table like structure. The table can actually represent an AST shape and points code token starting structures using reference location entries (array index). The table can infer identification in other parsing considerations using this otherwise modest approach.

Below is a table representation of above structure which Æsthetic generators during the parse cycle. Each column name in the table is representative on an object property key value in and each row is representative of an item within an array. The table is used in the beautification cycle.

| index | begin | ender | lexer  | lines | stack       | types         | token                    |
| ----- | ----- | ----- | ------ | ----- | ----------- | ------------- | ------------------------ |
| 0     | -1    | 8     | markup | 0     | global      | start         | `<style>`                |
| 1     | 0     | 8     | style  | 0     | style       | selector      | `.list`                  |
| 2     | 0     | 7     | style  | 1     | style       | start         | `{`                      |
| 3     | 2     | 7     | style  | 2     | .list       | property      | `background-color`       |
| 4     | 2     | 7     | style  | 0     | .list       | colon         | `:`                      |
| 5     | 2     | 7     | style  | 1     | .list       | liquid_output | `{{ bg.color }}`         |
| 6     | 2     | 7     | style  | 0     | .list       | separator     | `;`                      |
| 7     | 2     | 7     | style  | 2     | .list       | end           | `}`                      |
| 8     | 0     | 8     | markup | 0     | style       | end           | `</style>`               |
| 9     | 1     | 25    | markup | 0     | global      | start         | `<script>`               |
| 10    | 9     | 17    | script | 0     | script      | liquid_start  | `{% if condition %}`     |
| 11    | 10    | 17    | script | 2     | liquid_if   | word          | `window`                 |
| 12    | 10    | 17    | script | 0     | liquid_if   | separator     | `.`                      |
| 13    | 10    | 17    | script | 0     | liquid_if   | word          | `foo`                    |
| 14    | 10    | 17    | script | 1     | liquid_if   | operator      | `=`                      |
| 15    | 10    | 17    | script | 1     | liquid_if   | liquid        | `{{ foo }}`              |
| 16    | 10    | 17    | script | 0     | liquid_if   | separator     | `;`                      |
| 17    | 10    | 24    | script | 2     | liquid_if   | liquid_else   | `{% else %}`             |
| 18    | 17    | 24    | script | 2     | liquid_else | word          | `window`                 |
| 19    | 17    | 24    | script | 0     | liquid_else | separator     | `.`                      |
| 20    | 17    | 24    | script | 0     | liquid_else | word          | `foo`                    |
| 21    | 17    | 24    | script | 1     | liquid_else | operator      | `=`                      |
| 22    | 17    | 24    | script | 1     | liquid_else | liquid        | `{{ bar }}`              |
| 23    | 17    | 24    | script | 0     | liquid_else | separator     | `;`                      |
| 24    | 17    | 24    | script | 2     | liquid_else | liquid_end    | `{% endif %}`            |
| 25    | 9     | 25    | markup | 0     | script      | end           | `</script>`              |
| 26    | 1     | 36    | markup | 0     | global      | start         | `<main>`                 |
| 27    | 26    | 36    | markup | 0     | main        | attribute     | `id="{{ object.prop }}"` |
| 28    | 26    | 35    | markup | 0     | main        | start         | `<ul>`                   |
| 29    | 28    | 35    | markup | 0     | ul          | attribute     | `class="list"`           |
| 30    | 28    | 34    | markup | 0     | ul          | liquid_start  | `{% for i in arr %}`     |
| 31    | 30    | 33    | markup | 0     | for         | start         | `<li>`                   |
| 32    | 31    | 33    | markup | 0     | li          | liquid        | `{{ i.prop }}`           |
| 33    | 31    | 33    | markup | 0     | li          | end           | `</li>`                  |
| 34    | 30    | 34    | markup | 0     | for         | liquid_end    | `{% endfor %}`           |
| 35    | 28    | 35    | markup | 0     | ul          | end           | `</ul>`                  |
| 36    | 26    | 36    | markup | 0     | main        | end           | `</main>`                |
