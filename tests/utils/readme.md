# @prettify/test-utils

Test utilities for [Prettify](https://prettify.dev). This module exports trivial or otherwise frivolous helpers which make writing tests for Prettify an easier operation. Prettify uses the powerful [AVA](https://github.com/avajs) test runner and as such this module is developed for usage within that tool.

Prettify exists as part of the [Liquify](https://liquify.dev) project.

### Use Case

There is very little reason you'd want to use this module in your project. It is developed for usage with [Prettify](https://github.com/panoply/prettify). It is distributed under the [@prettify](https://www.npmjs.com/org/prettify) organization on NPM and available for consumption for those who want to contribute to and/or play with the Prettify beautification tool.

### Install

The module has a peer dependency on [AVA](https://github.com/avajs) and [Prettify](https://github.com/panoply/prettify)

```bash
pnpm add @prettify/test ava -D
```

# Usage

Use in `*.test.mjs` files contained in the Prettify `tests` directory. The module has a default export which exposes several methods. The main usage is for resolving samples and enhancing AVA's snapshot assertion reports.

# Samples

The "samples" used in Prettify tests are code snippets. Every sample is written within `.txt` files. The `.txt` files contain descriptions and code samples which Prettify will use to test various edge cases that would otherwise be considered invalid if relative file extensions were used. The samples are organized in manner that these utilities not only expect but require.

### Writing a sample

The samples accept descriptions that can be written at the very beginning of the file/s before the code snippet starts. Description should be encapsulated between triple dashed characters. The dashes inform upon where the description ends and the code sample begins. The test utilities will check for descriptions when reading files and use the descriptions in the markdown reports that AVA generates.

```txt
---
Test description which will be passed in as the snapshot label. Accepts markdown
---

// code sample goes here
```

# Utilities

The module exports several utilities, each of which you'll find being used in tests.

## getSample

The `getSample` utility resolves a sample file and returns it's source. Take a look at `tests/dev.test.mjs` file located in the root of the `tests` directory in the Prettify repository. It is a simple and trivial helper which merely resolves the `tests/dev.txt` by default and prints the output to terminal console. An addition `highlight` parameter function which will provide syntax highlighting in the CLI.

<!--prettier-ignore-->
```js
import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('x', async t => {

  await util.getSample('path/to/sample', async (source, highlight) => {

    const output = await prettify.format(source,{
      language: 'liquid',
      markup: {
        attributeCasing: 'preserve'
      }
    });

    t.log(output)

    // optionally highlight output
    t.log(highlight(output, { /* highlight options */ }))

  });

});

```

## forRule

The `forTest` utility can be used to resolve samples and pass different beautification rules use in tests. This utility exposes several features for working with code snippets. The function is curried, the first caller expects the sample directory relative path to be provided and also accepts a 2nd parameter that can infer a `lexer` target. The returning caller expects 2 parameters. The first parameter can be either an _array_ list of options or _object_ type map who's `keys` are the sample filenames contained in the directory provided in the first argument and the value an _array_ list of lexer of options to run on each sample. The second parameter is a function callback that will be invoked for each rule (option) provided by the first argument.

### Callback

The callback function returns 3 parameters and is called in an iterable manner. The first parameter is the content contained in the sample file provided as a _string_ type that you can pass to Prettify. The second is the rule value and the third parameter is a label generator for AVA snapshot reports that will stringify the rule options that the assertion ran and inject them into the markdown reports.

<!--prettier-ignore-->
```js
import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('x', async t => {

  await util.forRule('cases/directory', { lexer: 'markup' })({
    'casing-1': [
      {
        wrap: 80,
        attributeCasing: 'lowercase',
        forceAttribute: true
      }
    ],
    'casing-2': [
      {
        attributeCasing: 'preserve',
        attributeSorting: true,
        forceAttribute: true
      }
    ]
  }, async function (source, rule, label) {

    const output = await prettify.format(source, rule);

    t.snapshot(output, label.description);

  });

});

test('x', async t => {

  await util.forRule('markup/attribute-sort')([
    {
      attributeSort: true
    },
    {
      attributeSort: false
    },
  ], async function (source, markup, label) {

    const output = await prettify.format(source, { markup });

    t.snapshot(output, label({ markup }));

  });

});

test('x', async t => {

  await util.forRule('markup/attribute-casing')([
    'preserve',
    'lowercase',
    'lowercase-name',
    'lowercase-value'
  ], async function (source, attributeCasing, label) {

    const output = await prettify.format(source, { markup: { attributeCasing }});

    t.snapshot(output, label({ markup: { attributeCasing } }));

  });

});
```

## forSample

The `forSample` will read each sample file provided and return the code snippet and description in the callback function hook. This utility is great for running repeated test cases with a persisted set of rules to ensure the output is the same.

### Callback

The callback function returns 3 parameters and is called in an iterable manner. The first parameter is the content contained in the sample file provided as a _string_ type that you can pass to Prettify. The second is label generator for AVA snapshot reports that will stringify the rule options that the assertion ran and inject them into the markdown reports. The label parameter is a function that contains a getter, so you can optionally pass in the rules you've tested against.

<!--prettier-ignore-->
```js
import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('x', async t => {

  await util.forSample('cases/attributes')([
    'case-1',
    'case-2',
    'case-3',
    'case-4'
  ], async function (source, label) {

      const rules = {
        language: 'liquid',
        markup: {
          attributeCasing: 'preserve'
        }
      }

      const output = await prettify.format(source, rules);

      // Target the description contained the sample
      t.snapshot(output, label.description);

      // Optionally pass rules to be injected
      t.snapshot(output, label(rules))
    }
  );

});
```

### Author

🥛 <small>[Νίκος Σαβίδης](mailto:nicos@gmx.com)</small> <img align="right" src="https://img.shields.io/badge/-@sisselsiv-1DA1F2?logo=twitter&logoColor=fff" />
