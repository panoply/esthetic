# Æsthetic Tests

This directory contains the tests for Æsthetic.

### Integrated Modules

- [AVA](https://github.com/avajs/ava)
- [@liquify/ava](https://github.com/panoply/ava)
- [Æsthetic](https://github.com/panoply/esthetic)

# Overview

Æsthetic uses the powerful [AVA](https://github.com/avajs/ava) test runner together with a small helper utility that helps alleviate some of the complexities involved with testing tools of its criteria. Æsthetic's tests are verbose, mostly assertions and are grouped on a per-language basis.

### Commands

Tests are invoked from the projects root (see [package.json](https://github.com/panoply/esthetic/blob/next/package.json) scripts).

```bash

# GLOBALS

pnpm test             # Run all tests
pnpm tests            # Run specific tests

# DEV MODE

pnpm test:dev

# LANGUAGES

pnpm test:liquid      # Run liquid tests
pnpm test:html        # Run HTML tests
pnpm test:css         # Run CSS tests
pnpm test:json        # Run JSON tests
pnpm test:xml         # Run XML tests

# FLAGS

pnpm <cmd>  --watch   # Run in watch mode

```

 `dev.test.mjs` file contained in the root of this directory
