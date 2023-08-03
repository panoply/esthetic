---
title: 'Parse Table'
layout: base
permalink: '/parser/parse-table/index.html'
anchors:
  - 'Algorithm'
  - 'Parse Table'
  - 'Terminology'
---

# Data Structure

The Sparser approach produces output in the form of parallel arrays instead of an AST format. The idea is that an AST can be created from a parse table provided one of the categories of data is structure and placement information, but a parse table cannot be created from an AST without running another parsing operation. The parse table approach also allows for sorting and analysis by selectively targeting various areas and data types without consideration for the output as a whole.
