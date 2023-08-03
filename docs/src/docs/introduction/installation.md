---
title: 'Installation'
layout: base
permalink: '/introduction/installation/index.html'
prev:
  label: 'Language Support'
  uri: '/introduction/language-support'
next:
  label: 'CLI'
  uri: '/usage/cli'
anchors:
  - Installation
  - PNPM
  - CDN
  - Schema Store
---

# Installation

Æsthetic is available for consumption via the NPM registry and supports both ESM and CJS environments. For the best practice, it is recommended to install Æsthetic on a per-project basis rather than globally. While tree-shaking is not feasible with Æsthetic, developers can rest assured that the module remains relatively small, with a gzipped size of 57.5kb. Additionally, its import bundle is distributed as a single, concise file.

###### PNPM

Æsthetic recommends developers choose [pnpm](https://pnpm.js.org/en/cli/install) as their package manager.

```bash
$ pnpm add esthetic --save-dev
```

###### NPM

```bash
$ npm install esthetic --save-dev
```

###### Yarn

```bash
$ yarn add esthetic
```

---

# CDN Usage

You may optionally prefer to use the [unpkg](https://unpkg.com/estheitc) CDN for quick usage in the web browser. Æsthetic will be exposed in `globalThis` scope when used in browser environments. You can access method via `window.esthetic` (or simply, `esthetic`) anywhere in your application.

```bash
https://unpkg.com/esthetic
```

> You can disable `globalThis` assignment from being applied via `esthetic.settings()` method. See the usage → [settings](/usage/settings) page for more information.

---

# JSON Schema Store

Æsthetic provided JSON Schema Store references for usage in JSON files that contain a `$schema` property or within text editors like [VSCode](https://code.visualstudio.com/) which support external schema store association.

```bash
https://unpkg.com/esthetic/schema.json
```

#### VSCode Usage

You can provide the schema store reference a couple of different ways. Developers using the **VSCode** text editor, can either install the [Æsthetic Extension](#) or alternatively provide the schema store to your workspace settings:

<!-- prettier-ignore -->
```json
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

#### Direct Usage

You may optionally choose to provide the schema store directly within JSON configuration files.

```json
{
  "$schema": "https://unpkg.com/esthetic/schema.json"
}
```
