---
title: 'Config File'
layout: base
permalink: '/usage/config-files/index.html'
prev:
  label: 'CLI'
  uri: '/usage/cli'
next:
  label: 'Rules'
  uri: '/usage/rules'
anchors:
  - Config Files
  - Supported Files
  - Ignoring Files
  - Configuration
---

# Config Files

Æsthetic supports configuration files for defining formatting rules, settings and other options. By default, Æsthetic assumes that configuration is provided within a `package.json` file.

# Supported Files

You may prefer to keep formatting rules in an external file opposed using the default `package.json` method. Æsthetic provides support for the following external config files.

- `.esthetic`
- `.esthetic.json`

> You can also use the CLI `-c` or `--config` flag to provide a custom configuration file and/or path location reference.

# Ignoring Files

Ignoring files/directories from formatting is made possible using the `exclude[]` property within configuration files. Though discouraged, you may prefer to define exclusion patterns within an `.estheticignore` file.

- `.estheticignore`

# Configuration

The CLI will check for existence of supported files before assuming `package.json` definitions to determine its point of control. Developers who are using **JSON** file configurations should consider providing the [`$schema`](#) store reference to files.

:::: grid row

::: grid col-6

##### package.json

```json
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

:::

::: grid col-6

##### .esthetic.json

<!--prettier-ignore-->
```json
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

:::

::::
