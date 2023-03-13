---
title: 'Installation'
layout: base
permalink: '/introduction/installation/index.html'
prev:
  label: 'What is Æsthetic'
  uri: '/introduction/what-is-esthetic'
next:
  label: 'CLI'
  uri: '/usage/cli'
anchors:
  - Installation
  - CDN
  - Schema Store
  - Getting Started
  - CLI
  - API
---

# Installation

Æsthetic can be consumed via the NPM registry and supports both ESM and CJS, in browser/node environments. It is recommended to avoid installing the project globally and instead install it as a dev-dependency.

##### PNPM

Æsthetic recommends developers choose [pnpm](https://pnpm.js.org/en/cli/install) as their package manager.

```
$ pnpm add esthetic
```

##### CDN

Use the [unpkg](https://unpkg.com/estheitc) CDN for quick usage in web browser.

```
https://unpkg.com/esthetic
```

# Schema Store

The module also provided JSON Schema Store reference for usage in JSON files via `$schema` properties or within text editors like [VSCode](https://code.visualstudio.com/) which support store digestion.

```
https://unpkg.com/esthetic/schema.json
```

You can provide the schema store reference a couple of different ways. For developers who use the **VSCode** text editor can either install the [Æsthetic Extension](#) or alternatively you can provide the schema store to your workspace settings:

```js
{
  "json.schemas": [
    {
      "url": "https://unpkg.com/esthetic/schema.json",
      "fileMatch": [
        "package.json",
        ".esthetic.json",
        ".esthetic"
      ]
    }
  ]
}
```

You may optionally choose to provide the schema store directly within JSON configuration files.

```js
{
  "$schema": "https://unpkg.com/esthetic/schema.json"
}
```
