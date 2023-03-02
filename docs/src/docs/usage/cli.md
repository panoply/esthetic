---
title: 'CLI'
layout: base
permalink: '/usage/cli/index.html'
---

# CLI

Æsthetic provides CLI support via the `esthetic` command and assumes configuration has defined within your projects `package.json` file on the `esthetic` property. CLI usage requires a paths/patterns be provided which will resolve from the path location the command was invoked. By default, Æsthetic will print formatted code to `stdout` unless the `-f` or `--format` flag was passed.

::: note

The `-` or `--format` flag will overwrite files matching the path pattern provided. You can have Æsthetic output to a different location using the `-o` or `--output` flag.

:::

### Configuration Files

When using the CLI you can define configuration using an external file. By default, Æsthetic will assume rules are defined in the projects root directory `package.json` file on the `esthetic` property unless one the following config files exists in the root of your project:

- `.esthetic`
- `.esthetic.json`
- `.esthetic.ts `
- `.esthetic.js `

Refer to [Config File](/usage/config-file/) for more information

# Commands

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
