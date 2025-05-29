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
  - NPM
  - Yarn
  - CDN Usage
  - Schema Store
  - JSON Schema Store
  - VSCode Usage
  - Direct Usage
---

# Installation

Æsthetic is available for consumption via the NPM registry and supports both ESM (ECMAScript Modules) and CJS (CommonJS) environments. Best practice recommends installing Æsthetic on a per-project basis rather than globally. This approach ensures version consistency across different projects and avoids potential conflicts with global installations. While Æsthetic does not support tree-shaking due to its architecture.

> Æsthetic recommends developers use [pnpm](https://pnpm.js.org/en/cli/install) as their package manager. pnpm offers several advantages over traditional package managers like npm or Yarn, including improved performance and stricter dependency resolution.

:: row g-5
:: col-6

#### PNPM

```bash
pnpm add esthetic --save-dev
```

::
:: col-6

#### NPM

```bash
npm install esthetic --save-dev
```

::
:: col-6

#### Yarn

```bash
yarn add esthetic --save-dev
```

::
:: col-6

#### Bun

```bash
bun add esthetic --save-dev
```

::
::

---

# CDN Usage

You may optionally prefer to use the [unpkg](https://unpkg.com/estheitc) CDN for quick usage in the web browser. Æsthetic will be exposed in `globalThis` scope when used in browser environments. You can access method via `window.esthetic` (or simply, `esthetic`) anywhere in your application.

```bash
https://unpkg.com/esthetic
```

> You can disable `globalThis` assignment from being applied via `{ts} esthetic.settings()` method. See the usage → [settings](/usage/settings) page for more information.

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
