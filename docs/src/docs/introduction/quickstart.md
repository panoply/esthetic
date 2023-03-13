---
title: 'Getting Started'
layout: base
permalink: '/introduction/quickstart/index.html'
anchors:
  - Getting Started
  - CLI
  - API
---

# Getting Started

Below we will describe how to work with the Æsthetic [CLI](/usage/cli/) and [API](/usage/api/). CLI usage requires a [config file](/usage/config-file/) or `esthetic` reference in your projects `package.json`. In most cases, developers may prefer to use the VSCode [extension](#) which provides auto-formatting capabilities.

### CLI

After installing Æsthetic, you will need to define formatting [Rules](/usage/rules/). Æsthetic will assume rules are defined within your projects root `package.json` file on a `esthetic` property.

```js
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
