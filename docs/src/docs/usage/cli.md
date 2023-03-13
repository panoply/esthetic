---
title: 'CLI'
layout: base
permalink: '/usage/cli/index.html'
anchors:
  - CLI
  - Configuration Files
  - Available Commands
  - Getting Started
  - Formatting Files
  - Watching Files
---

# CLI

Æsthetic provides CLI support via the `esthetic` command and assumes configuration has defined within your projects `package.json` file on the `esthetic` property. CLI usage requires a paths/patterns be provided which will resolve from the path location the command was invoked. By default, Æsthetic will print formatted code to `stdout` and will only overwrite target files when the `-f` or `--format` flag is passed.

::: note

The `-` or `--format` flag will overwrite files matching the path pattern provided. You can have Æsthetic output to a different location using the `-o` or `--output` flag.

:::

# Configuration Files

When using the CLI you can define configuration using an external file. By default, Æsthetic will assume rules/settings are defined in the projects `package.json` file via the `esthetic` property. Æsthetic also support external config files for settings and defining beautification rules. The following files will take precedence if contained in root of your project:

- `.esthetic`
- `.esthetic.json`
- `.esthetic.ts `
- `.esthetic.js `

Refer to [Config File](/usage/config-file/) for more information

# Available Commands

```bash

Default:
  esthetic                  # command executable

Commands:
  esthetic                  # Starts interactive CLI command prompt
  esthetic <path> --flags   # Glob path of files to format and flags

Resource:
  -f, --format              # Overwrite matched files
  -w, --watch               # Watch and format files when documents are changed
  -o, --output <path>       # Optional output path to write formatted files
  -c, --config <file>       # Provide a configuration file
  -h, --help,               # Prints command list and some help information

Settings:
  --no-color                # Disable standard log colors
  --no-syntax               # Disable syntax highlighting in logs
  --silent                  # Silence the CLI logs and only print errors
  --rules                   # Prints Æsthetic formatting rules

Language:
  --liquid                  # Liquid language formatting
  --html                    # HTML language formatting
  --xml                     # XML language formatting
  --css                     # CSS language formatting
  --scss                    # SCSS language formatting
  --json                    # JSON language formatting
  --javascript              # JavaScript language formatting
  --jsx                     # JSX language formatting
  --typescript              # TypeScript language formatting
  --tsx                     # TSX language formatting
```

# Getting Started

Æsthetic will format all files matched by the glob `*` path pattern provided. As aforementioned, Æsthetic will not overwrite files unless explicitly instructed to using the `-f` or `--format` flag. By default, beautified code is printed to the CLI unless the `-f` flag is passed.

##### Example

For the sake of brevity and to best illustrate CLI usage, let's assume a project has define formatting rules within a `package.json` file and is using the following directory structure:

```
src
│
├── css
│   ├── file-1.css
│   ├── file-2.css
│   └── file-3.css
│
├── liquid
│   ├── file-1.liquid
│   ├── file-2.liquid
│   └── file-3.liquid
│
├── html
│   ├── file-1.html
│   ├── file-2.html
│   └── file-3.html
│
├── json
│   ├── file-1.json
│   └── file-2.json
│
└── package.json

```

# Formatting Files

The CLI uses the file extensions suffixes to determine formatting languages but also accepts language identifier flags. You can leverage the language identifier flags to target certain files within the glob `*` pattern match, for example:

```
esthetic src/** --liquid --css
```

Running the above command would result in Æsthetic formatting all files contained in the `liquid` and `css` directories but those which exist in `html` and `json` directories would be excluded. If we were to run the same command without any language identifiers then all files would be formatting within the `src` directory and all containing sub directories.

##### Examples

Format all files in the `liquid` directory and print the output to CLI:

```
esthetic src/liquid/*
```

Format and overwrite all files in the `html` directory:

```
esthetic src/html/* --format
```

Format all files in the `json` directory but output them to a new directory names `some-dir`:

```
esthetic src/json/* --output some-dir
```

Format and overwrite all `liquid` and `css` files:

```
esthetic src/**/** --format --liquid --css
```

# Watching Files

Æsthetic provided watch support using [chokidar](https://github.com/paulmillr/chokidar). When passing the `-w` or `--watch` flag, Æsthetic will apply formatting when a file changes.

::: note

When running the CLI in watch mode, changes applied to [config files](/usage/config-files/) will invoke internal resets to rules.

:::

##### Examples

Watch files in the `liquid` directory. Format changed files and print output to the CLI but disable syntax highlighting:

```
esthetic src/liquid/* --watch --no-syntax
```

Watch files in the `html` directory (using shorthand alias flags). Format and overwrite changed files:

```
esthetic src/html/* -f -w
```

Watch files in `json` directory. Format changed files but output them to the directory path `changed/files`:

```
esthetic src/json/* -w -o changed/files
```

Watch files using a `.liquid`, `.html` and `.json` extension. Format and overwrite changed files:

```
esthetic src/**/** -f --liquid --html --json
```
