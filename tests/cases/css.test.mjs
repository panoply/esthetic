import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test('Code Corrections applied to CSS', async t => {

  await samples.forTest('cases')(
    [
      'css/correct-1'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2

      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});

test('CSS variable expressions', async t => {

  await samples.forTest('cases')(
    [
      'css/css-vars-1',
      'css/css-vars-2'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});

test('Sorting selector class names', async t => {

  await samples.forTest('cases')(
    [
      'css/sort-selectors'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2,
        style: {
          sortSelectors: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

  prettify.options({ style: { sortSelectors: false } });

});

test('Sorting selector properties', async t => {

  await samples.forTest('cases')(
    [
      'css/sort-properties'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2,
        style: {
          sortProperties: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

  prettify.options({ style: { sortProperties: false } });
});

/* -------------------------------------------- */
/* RULES                                        */
/* -------------------------------------------- */
