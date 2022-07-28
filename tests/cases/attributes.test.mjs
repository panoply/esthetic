import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test('Delimiter handling', async t => {

  await samples.forTest('cases')(
    [
      'attributes/delimiter-handling-1',
      'attributes/delimiter-handling-2',
      'attributes/delimiter-handling-3'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});

test('Quote handling', async t => {

  await samples.forTest('cases')(
    [
      'attributes/quote-handling-1',
      'attributes/quote-handling-2'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});

test('Preserve attribute structures', async t => {

  await samples.forTest('cases')(
    [
      'attributes/structure-preserve-1',
      'attributes/structure-preserve-2',
      'attributes/structure-preserve-3',
      'attributes/structure-preserve-4',
      'attributes/structure-preserve-5',
      'attributes/structure-preserve-6',
      'attributes/structure-preserve-7'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});

test('Force attributes', async t => {

  await samples.forTest('cases')(
    [
      'attributes/force-attributes-1',
      'attributes/force-attributes-2',
      'attributes/force-attributes-3',
      'attributes/force-attributes-4',
      'attributes/force-attributes-5'
    ]
    , async function (description, source) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, description);

      // t.log(output);

    }
  );

});
