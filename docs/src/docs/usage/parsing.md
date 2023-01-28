---
title: 'Parsing'
layout: base
permalink: '/usage/parsing/index.html'
---

# Parsing

The `parse` method can be used to inspect the data structures that Æsthetic constructs. Æsthetic is using the Sparser lexing algorithm under the hood the generated parse tree returned is representative of sparser's data structures. Similar to `Æsthetic.format` you can also invoke this both asynchronously and synchronously.

### Asynchronous

<!-- prettier-ignore -->
```js
import { parse } from "esthetic";

const sample = `

<div class="block" id="esthetic-example">

{% if x %} Hello World {%  endif %}

</div>

`;

// The generated sparser data structure
parse(sample).then(data => {

  console.log(data);

}).catch(error => {

  console.log(error);

})

// The generated sparser data structure
parse.sync('...'): Data;
```

### Synchronous

<!-- prettier-ignore -->
```js
import { parse } from 'esthetic';

const sample = `

<div class="block" id="esthetic-example">

{% if x %} Hello World {%  endif %}

</div>

`;

try {

  // The generated sparser data structure
  const data = parse(sample);

  console.log(data);
} catch (error) {

  console.log(error);
}

```
