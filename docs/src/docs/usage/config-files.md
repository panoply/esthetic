---
title: 'Config File'
layout: base
permalink: '/usage/config-files/index.html'
anchors:
  - Config Files
  - Supported Files
  - Ignoring Files
  - Configuration
---

# Config Files

Æsthetic supports configuration files for defining formatting rules, settings, and other options. By default, Æsthetic assumes that configuration is provided within a `package.json` file. This approach allows developers to centralize their project configuration, keeping all settings in one familiar location. To configure Æsthetic using `package.json`, you can add an "esthetic" key to the JSON object:

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "esthetic": {
    // Æsthetic configuration options go here
  }
}
```

> Within the `"esthetic"` object, you can specify various formatting rules and options that will be applied to your project. This method of configuration is convenient as it doesn't require maintaining a separate configuration file, and it keeps all project-related settings together.

---

# Supported Files

Æsthetic offers flexibility in how you can specify formatting rules and settings. While the default method uses the `package.json` file, you may prefer to keep formatting rules in a separate external file for better organization or easier version control. Æsthetic supports the following external configuration file formats:

:: row mb-5
:: col-12

| Filename          | Language       | Information                      |     |
| :---------------- | -------------- | -------------------------------- | --- |
| `.esthetic`       | **JSONC**      | _Safe enough to use in projects_ | ✓   |
| `.esthetic.json`  | **JSONC**      | _Safe enough to use in projects_ | ✓   |
| `.estheticignore` | **Plain Text** | _Safe enough to use in projects_ | ✓   |

::
::

These standalone configuration files allow you to isolate Æsthetic-specific settings from your project's general package information. This can be particularly useful in larger projects or when you want to share formatting configurations across multiple projects. To use an external configuration file, simply create one of these files in your project's root directory and add your Æsthetic configuration options to it.

#### Example

An example of `.esthetic.json` config file:

<!--prettier-ignore-->
```json
{
  "$schema": "https://unpkg.com/esthetic/schema.json",
  "include": [],
  "exclude": [],
  "settings": {},
  "rules": {
    "language": "auto"
  }
}
```

<br>
<br>

#### Using Custom File

For added flexibility, Æsthetic's CLI tool provides options to specify a custom configuration file and/or path location. You can use the following flags:

```bash
esthetic --config <path>
esthetic -c <path> # alias shorthand
```

> This feature allows you to maintain different configuration files for various scenarios or environments, and easily switch between them using the CLI.

---

# Ignoring Files

Ignoring files/directories from formatting is made possible using the `exclude[]` property within configuration files. Though discouraged, you may prefer to define exclusion patterns within an `.estheticignore` file.

- `.estheticignore`
