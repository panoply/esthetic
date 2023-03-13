---
title: 'Config File'
layout: base
permalink: '/usage/config-files/index.html'
anchors:
  - Config Files
  - Supported Files
  - Ignoring Files
  - Configuration
  - JSON Files
  - TS/JS Files
---

# Config Files

Æsthetic supports configuration files for defining formatting rules, settings and other options. By default, Æsthetic assumes that configuration is provided within a projects `package.json` file on an `esthetic` (or `aesthetic`) property. If you are using the [CLI](/usage/cli/) this key is the **rc** (remote control) reference point.

::: note

Despite the package name shipping under the U.S spelt variation the naming convention of files supports both U.S or U.K variations.

:::

# Supported Files

You may prefer to keep formatting rules in an external file opposed using the default `package.json` method. Æsthetic provides support for the following external config files.

- `.esthetic`
- `.aesthetic`
- `.esthetic.json`
- `.aesthetic.json`
- `.esthetic.ts`
- `.aesthetic.ts`
- `.esthetic.js`
- `.aesthetic.js`

::: note

You can also use the CLI `-c` or `--config` flag to provide a custom config file and/or path location reference.

:::

# Ignoring Files

Ignoring files/directories from formatting is made possible using the `exclude[]` property within configuration files. Though discouraged, you may prefer to define exclusion patterns within a `.estheticignore` file.

- `.estheticignore`
- `.aestheticignore`

# Configuration

As aforementioned, Æsthetic assumes formatting configuration is defined within a `package.json` file. The CLI will check for existence of supported files before assuming `package.json` definitions to determine its point of control. Developers who are using **JSON** file configurations should consider providing the [`$schema`](#) store reference to files.

# JSON Files

JSON file configurations can be provided within an `.esthetic`, `esthetic.json` or `package.json` file.

### `package.json`

```js
{
  "esthetic": {
    "include": [],
    "exclude": [],
    "settings": {},
    "rules": {
      "preset": "default",
      "liquid": {},
      "html": {},
      "xml": {},
      "css": {},
      "scss": {},
      "json": {},
      "jsx": {},
      "javascript": {},
      "tsx": {},
      "typescript": {}
    }
  }
}
```

### `.esthetic` OR `.esthetic.json`

```js
{
  "include": [],
  "exclude": [],
  "settings": {},
  "rules": {
    "preset": "default",
    "liquid": {},
    "html": {},
    "xml": {},
    "css": {},
    "scss": {},
    "json": {},
    "jsx": {},
    "javascript": {},
    "tsx": {},
    "typescript": {}
  }
}
```

# TS/JS Files

TypeScript or JavaScript configuration files are required to provide options via `default export` or `module.exports`.

```js
import { defineConfig } from 'esthetic';

export default defineConfig({
  include: [],
  exclude: [],
  settings: {},
  rules: {
    preset: 'default',
    liquid: {},
    html: {},
    xml: {},
    css: {},
    scss: {},
    json: {},
    jsx: {},
    javascript: {},
    tsx: {},
    typescript: {}
  }
});
```
