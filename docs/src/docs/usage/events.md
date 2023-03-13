---
title: 'Events'
layout: base
permalink: '/usage/events/index.html'
---

# Events

Æsthetic provides a very modest event listening API.

# Format

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic'


esthetic.on('format', function({ output, stats, rules }) {

  console.log(this.data)

  console.log(output)

  console.log(stats)

  console.log(rules)

});

```

# Rules

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic'


esthetic.on('rules', function(changed, rules) {

  console.log(changed)

  console.log(rules)

});

```

# Parse

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic'


esthetic.on('parse', function({ data, stats, rules }) {

  console.log(data)

  console.log(stats)

  console.log(rules)

});


```

# Error

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic'


esthetic.on('error', function(error) {

  console.log(error)


});


```
