# Prettify Tests

This directory contains the test suite for Prettify. Prettify leverages the powerful [AVA](https://github.com/avajs/ava) test runner and employs a simple and productive approach in order to provide quality assurance for the tools given capabilities. The tests are split up into 4 different categories:

- [Cases](#Cases)
- [Rules](#Rules)
- [Units](#Units)
- [Bench](#Bench)

### Snapshot Assertions

Prettify uses [Snapshot Testing](https://github.com/avajs/ava/blob/main/docs/04-snapshot-testing.md) for assertion differences when comparing unformatted and formatted code samples. Sample contents are provided within Plain Text files and can include descriptions which will be passed to AVA's snapshot reports.

### Test Utilities

A little utility module is included to help normalize a couple of operations in the test suite. The module exists as part of the [Liquify](https://github.com/panoply/liquify) monorepo as `@liquify/test-utils` and provide some very basic capabilities which help automate various tasks.

### Writing Samples

You can pass in snapshot assertion descriptions at the top of code sample files. Append a triple tilde `~~~` to inform where the snapshot code sample begins and the description ends.

```txt
---
Test description which will be passed in as the snapshot label
---

// code sample goes here

```

# Cases

The [cases](/cases) directory contains beautification edge cases. In the context of Prettify, edge cases refer to various code structures that Prettify understands and can reason about with. The [cases/samples](/cases/samples) directory is where the assertions exist and the [cases/snapshots](cases/snapshots) directory is where you can find the snapshot reports.

[Test File](/cases/html.test.mjs)<br>
[Code Samples](/cases/samples/html)<br>
[Snapshot Report](/cases/snapshots/html.test.mjs.md)<br>

### Command

```bin
pnpm test:cases
pnpm test:cases --watch
```

## Attributes

Test cases for beautification of Markup attributes. Attributes apply to languages like HTML and Liquid.

- [Test File](/cases/attributes.test.mjs)
- [Code Samples](/cases/samples/attributes)
- [Snapshot Report](/cases/snapshots/attributes.test.mjs.md)

### Command

```bin
pnpm test:attributes
pnpm test:attributes --watch
```

## CSS

Test cases for beautification of the CSS _style_ language.

- [Test File](/cases/css.test.mjs)
- [Code Samples](/cases/samples/css)
- [Snapshot Report](/cases/snapshots/css.test.mjs.md)

### Command

```bin
pnpm test:css
pnpm test:css --watch
```

## Embedded

Test cases for markup embedded code regions. This applies to tags like `<script>`, `<style>` and also Liquid embedded code blocks.

- [Test File](/cases/embedded.test.mjs)
- [Code Samples](/cases/samples/embedded)
- [Snapshot Report](/cases/snapshots/embedded.test.mjs.md)

### Command

```bin
pnpm test:embedded
pnpm test:embedded --watch
```

## HTML

TODO

- [Test File](/cases/html.test.mjs)
- [Code Samples](/cases/samples/html)
- [Snapshot Report](/cases/snapshots/html.test.mjs.md)

### Command

```bin
pnpm test:html
pnpm test:html --watch
```

## Ignores

TODO

- [Test File](/cases/ignores.test.mjs)
- [Code Samples](/cases/samples/ignores)
- [Snapshot Report](/cases/snapshots/ignores.test.mjs.md)

### Command

```bin
pnpm test:ignores
pnpm test:ignores --watch
```

## JavaScript

TODO

- [Test File](/cases/javascript.test.mjs)
- [Code Samples](/cases/samples/javascript)
- [Snapshot Report](/cases/snapshots/javascript.test.mjs.md)

### Command

```bin
pnpm test:javascript
pnpm test:javascript --watch
```

## JSON

TODO

- [Test File](/cases/json.test.mjs)
- [Code Samples](/cases/samples/json)
- [Snapshot Report](/cases/snapshots/json.test.mjs.md)

### Command

```bin
pnpm test:json
pnpm test:json --watch
```

## JSX

TODO

- [Test File](/cases/jsx.test.mjs)
- [Code Samples](/cases/samples/jsx)
- [Snapshot Report](/cases/snapshots/jsx.test.mjs.md)

### Command

```bin
pnpm test:jsx
pnpm test:jsx --watch
```

## Liquid

TODO

- [Test File](/cases/liquid.test.mjs)
- [Code Samples](/cases/samples/liquid)
- [Snapshot Report](/cases/snapshots/liquid.test.mjs.md)

### Command

```bin
pnpm test:liquid
pnpm test:liquid --watch
```

## TypeScript

TODO

- [Test File](/cases/typescript.test.mjs)
- [Code Samples](/cases/samples/typescript)
- [Snapshot Report](/cases/snapshots/typescript.test.mjs.md)

### Command

```bin
pnpm test:typescript
pnpm test:typescript --watch
```

# Rules

## Global

TODO

- [Test File](/rules/globals.test.mjs)
- [Code Samples](/rules/samples/globals)
- [Snapshot Report](/rules/snapshots/globals.test.mjs.md)

### Command

```bin
pnpm test:global
pnpm test:global --watch
```

## Markup

TODO

- [Test File](/rules/markup.test.mjs)
- [Code Samples](/rules/samples/markup)
- [Snapshot Report](/rules/snapshots/markup.test.mjs.md)

### Command

```bin
pnpm test:markup
pnpm test:markup --watch
```

## Script

TODO

- [Test File](/rules/script.test.mjs)
- [Code Samples](/rules/samples/script)
- [Snapshot Report](/rules/snapshots/script.test.mjs.md)

### Command

```bin
pnpm test:script
pnpm test:script --watch
```

## Style

TODO

- [Test File](/rules/style.test.mjs)
- [Code Samples](/rules/samples/style)
- [Snapshot Report](/rules/snapshots/style.test.mjs.md)

### Command

```bin
pnpm test:style
pnpm test:style --watch
```

# Units

### Chars

### Errors

### Grammar

### Hooks

### Options

### Stats

# Benchmark

The benchmark directory contains various performance tests and comparison benchmarks. Prettify compares itself against other wonderful open source projects which exist in the beautification nexus.
