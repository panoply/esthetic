---
title: 'CLI'
layout: base
permalink: '/usage/cli/index.html'
prev:
  label: 'Installation'
  uri: '/introduction/installation'
next:
  label: 'Config Files'
  uri: '/usage/config-files'
anchors:
  - CLI
  - Configuration Files
  - Commands
  - Example
  - Formatting Files
  - Watching Files
---

# CLI

Æsthetic provides basic CLI support via the `esthetic` command and assumes configuration is defined within a projects `package.json` file via an `esthetic` key property. CLI usage requires a path/pattern match be passed and will resolve files for from the location provided. Æsthetic will print formatted code to `stdout` and requires an `-f` or `--format` flag for file overwrites.

> The `-` or `--format` flag will overwrite files matching the path pattern provided. If you'd like to have Æsthetic output files to a different location then use the `-o` or `--output` flag.

# Configuration Files

When using the CLI you can define configuration using an external file. By default, Æsthetic will assume rules/settings are defined in the projects `package.json` file via the `esthetic` property. Æsthetic also supports external config files for settings and defining beautification rules. The following files will take precedence if contained in root of your project:

- `.esthetic`
- `.esthetic.json`

Refer to [Config File](/usage/config-file/) for more information

# Commands

```bash

# Default:
  esthetic                  # command executable

# Commands:
  esthetic                  # Starts interactive CLI command prompt
  esthetic <path> --flags   # Glob path of files to format and flags

# Resource:
  -f, --format              # Overwrite matched files
  -w, --watch               # Watch and format files when documents are changed
  -o, --output <path>       # Optional output path to write formatted files
  -c, --config <file>       # Provide a configuration file
  -h, --help,               # Prints command list and some help information

# Settings:
  --no-color                # Disable standard log colors
  --no-syntax               # Disable syntax highlighting in logs
  --silent                  # Silence the CLI logs and only print errors
  --rules                   # Prints Æsthetic formatting rules

# Language:
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

# Example

Æsthetic will format all files matched by the glob `*` path pattern provided. As aforementioned, Æsthetic will not overwrite files unless explicitly instructed to using the `-f` or `--format` flag. Let's assume we have a project using the following directory structure:

```treeview
src/
├── stylesheets/
│   ├── file-1.css
│   ├── file-2.css
│   └── file-3.css
├── templates/
│   ├── file-1.liquid
│   ├── file-2.liquid
│   └── file-3.liquid
├── statics/
│   ├── file-1.html
│   ├── file-2.html
│   └── file-3.html
├── data/
│   ├── file-1.json
│   └── file-2.json
└── package.json
```

The CLI uses the file extensions suffixes to determine formatting languages but also accepts language identifier flags. Using or example project, let's leverage the language identifier flags to target certain files within the glob `*` pattern match:

```bash
$ esthetic src/** --liquid --css
```

Running the above command would result in Æsthetic formatting all files contained in the `src/templates` and `src/stylesheets` directories. Our language identifier flags would exclude formatting files located in `src/statics` and `src/data` directories. Running run the same command without any language identifiers would result in all files contained in the `src` directory to be formatted. Below is various command examples the CLI accepts:

```bash
# Format all files in the templates directory and print the output
$ esthetic src/templates/*

# Format and overwrite all files in the statics directory
$ esthetic src/statics/* --format

# Format all files in the data directory but output them to a new directory
$ esthetic src/data/* --output some-dir

# Format and overwrite all .liquid and .css files
$ esthetic src/**/** --format --liquid --css

# Watch files in the templates directory, format changed files and print output to the CLI
$ esthetic src/liquid/* --watch
```
