---
title: 'Æsthetic CLI'
layout: base
permalink: '/usage/esthetic-cli/index.html'
anchors:
  - Æsthetic CLI
  - Configuration Files
  - Commands
  - Example
  - Formatting Files
  - Watching Files
---

# Æsthetic CLI

Æsthetic provides basic CLI support via the `esthetic` command and assumes configuration is defined within a projects `package.json` file via an `esthetic` key property. CLI usage requires a path/pattern match be passed and will resolve files from the location provided. By default, Æsthetic will print formatted code to **stdout** and requires an `{bash} -f` or `{bash} --format` flag for file overwrites.

> The `{bash} -f` (or `{bash} --format`) flag will overwrite files matching the path pattern passed from command line. If you'd like to have Æsthetic output files to a different location then use the `{bash} -o` (or `{bash} --output`) flag.

# Commands

Below is the available list of commands for CLI usage of Æsthetic:

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
  --json                    # JSON language formatting
```

---

# Example

Æsthetic will format all files matched by the glob `*` path pattern passed. As aforementioned, Æsthetic will not overwrite files unless the `-f` or `--format` flag is passed, this is intentional and required for write operations. Below we have an example project and a couple of commands:

:: row
:: col-7

```treeview
src/
├── package.json   # Contains Æsthetic formatting rules
├── templates/
│   ├── file-1.liquid
│   ├── file-2.liquid
│   └── file-3.liquid
├── statics/
│   ├── file-1.html
│   ├── file-2.html
│   └── file-3.html
└── data/
    ├── file-1.json
    ├── file-2.json
    └── file-3.json

```

::
:: col-5

###### Format All

```bash
esthetic src/** --format
```

###### Format Liquid

```bash
esthetic src/** -f --liquid
```

###### Format HTML

```bash
esthetic src/** -f --html
```

###### Format JSON

```bash
esthetic src/** -f --json
```

::
::

<br>

#### Breakdown

The CLI uses the file extension suffixes to determine formatting languages supported. Running the above commands would result in Æsthetic looking for files matching the in the glob pattern, the language identifier flags instruct Æsthetic to apply beautifcation only on files matching the language flag. You can perform more advanced operations and even watch + overwrites files upon change using the CLI.

```bash
# Format all files in the templates directory and print the output
$ esthetic src/templates/*

# Format and overwrite all files in the statics directory
$ esthetic src/statics/* --format

# Format all files in the data directory but output them to a new directory
$ esthetic src/data/* --output some-dir

# Format and overwrite all .liquid and .css files
$ esthetic src/**/** --format --liquid --json

# Watch files in the templates directory, format changed files and print output to the CLI
$ esthetic src/liquid/* --watch
```
