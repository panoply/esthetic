---
title: 'Getting Started'
layout: base
permalink: '/usage/getting-started/index.html'
---

# Installation

Æsthetic can be consumed via the NPM registry and used in both browser and node environments. It provides both ESM and CJS exports.

```bash
pnpm add esthetic
```

#### CDN

Use the [unpkg](https://unpkg.com/@liquify/prettify) CDN for quick usage in web browser.

```bash
https://unpkg.com/@liquify/prettify
```

#### Schema Store

The module also provided JSON Schema Store reference for usage in JSON files via `$schema` properties or within text editors like [VSCode](https://code.visualstudio.com/) which support store digestion.

```bash
https://unpkg.com/@liquify/prettify/schema.json
```

# Format Code

Æsthetic exports several named exports. Below we are using the `format` export to beautify some HTML and Liquid code.

<!-- prettier-ignore -->
```js
import { format } from 'esthetic';

const sample = `

<div class="block" id="esthetic-example">
{% if x   %} Hello World {%  endif %}
</div>

`;

format(sample, {
  language: 'liquid',
  preserveLine: 0,
  markup: {
    forceAttribute: true
  }
}).then(output => {

    console.log(output);

}).catch(e => {

  console.error(e);

});
```
