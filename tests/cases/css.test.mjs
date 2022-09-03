import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('Code Corrections applied to CSS', async t => {

  await util.forSample('cases/css')(
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

test('CSS variable expressions', async t => {

  await util.forSample('cases/css')(
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

test('Sorting selector class names', async t => {

  await util.forSample('cases/css')(
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

  await util.forSample('cases/css')(
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

/* -------------------------------------------- */
/* RULES                                        */
/* -------------------------------------------- */
