---
title: 'Install'
layout: base
permalink: '/usage/install/index.html'
---

# Installation

Æsthetic can be consumed via the NPM registry and supports both ESM and CJS, in browser/node environments. It is recommended to avoid installing the project globally and instead install it as a dev-dependency.

```
pnpm add esthetic
```

### CDN

Use the [unpkg](https://unpkg.com/estheitc) CDN for quick usage in web browser.

```
https://unpkg.com/esthetic
```

### Schema Store

The module also provided JSON Schema Store reference for usage in JSON files via `$schema` properties or within text editors like [VSCode](https://code.visualstudio.com/) which support store digestion.

```
https://unpkg.com/esthetic/schema.json
```

# Getting Started

Æsthetic uses a single default export from which all methods can be accessed. Below we will describe how to work with the Æsthetic CLI and the API. In most cases, developers may prefer to use the [VSCode Extension](#).

### CLI

After installing Æsthetic, you will need to define formatting [Rules](/usage/rules/). Æsthetic will assume rules are defined within your projects root `package.json` file on a `esthetic` property.

::: note

You may optionally choose to provide formatting rules within a `.esthetic.json` file instead of your projects `package.json` file.

:::

```json
{
  "esthetic": {
    "wrap": 100,
    "preserveLine": 2,
    "liquid": {
      "delimiterTrims": "never"
    },
    "html": {
      "forceAttribute": true
    }
  }
}
```

Above we have provided both [global](/rules/global/wrap/), [html](/rules/html/forceAttribute/) and [liquid](/rules/liquid/delimiterTrims/) formatting rules within a `package.json` file. We can now leverage Æsthetic to beautify documents. The CLI **requires** a path/pattern to files be provided, so for the sake of brevity lets assume we want to format all files contained root directory.

Open up your terminal and run:

```
$ esthetic . --html
```

The above command will apply formatting to all files using a `.html` extension and print the beautified result to `stdout` in your terminal. This is just a **basic** example and for advanced usage with the CLI, take a look at [CLI](/usage/cli/) documentation.

### API

Developers who are implementing Æsthetic into their apps or projects can use the API which exposes most of the core features. Unlike the CLI, you do not need to provide formatting rules in a `package.json` file and instead you can pass them directly via methods or as arguments.

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic';

const input = `
<div class="block" id="esthetic-example">
{%- if condition   -%} Hello World
{%-  endif -%}
</div>
`;

const output = esthetic.format(input, {
  language: 'liquid',
  wrap: 100,
  preserveLine: 2,
  liquid: {
    delimiterTrims: 'never'
  },
  markup: {
    forceAttribute: true
  }
});


console.log(output)

```

In the above example, the `output` result holds the beautified code.
