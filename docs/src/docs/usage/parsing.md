---
title: 'Parsing'
layout: base
permalink: '/usage/parsing/index.html'
anchors:
  - Parsing
---

# Parsing

The `parse` method can be used to inspect the data structures that Æsthetic constructs.

<!-- prettier-ignore -->
```js
import esthetic from "esthetic";

const sample = `

<div class="block" id="esthetic-example">

{% if x %} Hello World {%  endif %}

</div>

`;

try {

  const data = esthetic.parse(sample)

  console.log(data)

} catch(e) {

  console.error(e)

}

```
