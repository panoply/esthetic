---
title: 'Parse Architecture'
layout: base
permalink: '/parse/algorithm/index.html'
anchors:
  - 'Algorithm'
  - 'Parse Table'
---

# Algorithm

The lexing algorithm and parse approach used by Æsthetic is an original strategic concept created by [Austin Cheney](https://github.com/prettydiff) and was first introduced in his project [Sparser](https://sparser.io/). The parse table produced by Sparser provides a simple data format that can accurately describe any language. Before sparser's re-application into Æsthetic, it was used by the language aware diffing and beautification tool [PrettyDiff](https://prettydiff.com/).

While most parsers typically produce an [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (abstract syntax tree) this is not the case with Æsthetic. Its implementation of Sparser will produce a uniformed table like structure and though many different algorithms can be made to achieve the same result they all come with tradeoffs relative to one another. Most parse tools in the nexus seem to be using some variant of [ANTLR](https://en.wikipedia.org/wiki/ANTLR), [PEG](https://en.wikipedia.org/wiki/Parsing_expression_grammar) or leverage the brilliant incremental [Tree Sitter](https://tree-sitter.github.io).

Generators like ANTLR and Tree Sitter require grammars and leave users at the behest of steep learning curves whereas PEG parsers have less ambiguity than LR parsers but may produce worse error messages and consume more memory. When we look at hand-rolled recursive-descent parsers, these may be slower than the ones produced by generators but are unambiguous overall. Because the task of Æsthetic more often than not involves making sense of combined language formations the data structure (i.e: parse table) is flexible, easy to reason with and extensible.

# Parse Table

Consider the following code sample. The HTML (markup) consists of Liquid, CSS, JavaScript and JSON. All languages in the sample are encapsulated within the appropriate regional based denominated tags but more importantly, Liquid token expressions exist within the CSS, JavaScript and HTML.

<!-- prettier-ignore -->
```liquid
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
