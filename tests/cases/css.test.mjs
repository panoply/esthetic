import test from 'ava';
import { forSample } from '@liquify/ava/prettify';
import prettify from '@liquify/prettify';

test.skip('Code corrections applied to CSS', async t => {

  await forSample('cases/css')(
    [
      'correct-1'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2

      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});

test.skip('CSS variable expressions', async t => {

  await forSample('cases/css')(
    [
      'css-vars-1',
      'css-vars-2'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});

test.skip('Sorting selector class names', async t => {

  await forSample('cases/css')(
    [
      'sort-selectors'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2,
        style: {
          sortSelectors: true
        }
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

  prettify.options({ style: { sortSelectors: false } });

});

test('Sorting selector properties', async t => {

  await forSample('cases/css')(
    [
      'sort-properties'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2,
        style: {
          sortProperties: true
        }
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

  prettify.options({ style: { sortProperties: false } });
});

test.skip('Pseudo selector properties', async t => {

  await forSample('cases/css')(
    [
      'pseudo-selector-1',
      'pseudo-selector-2',
      'pseudo-selector-3'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'css',
        preserveLine: 2

      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});
