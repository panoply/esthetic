import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

/* -------------------------------------------- */
/* MARKUP RULE TESTS                            */
/* -------------------------------------------- */

// ALL PRETTIFY OPTIONS MUST END WITH THE DEFAULTS
// BECAUSE OPTIONS ARE PERSISTED WHEN CHANGED.

/* -------------------------------------------- */
/* TESTS                                        */
/* -------------------------------------------- */

test.todo('TODO: Attribute Sorting with Liquid Attributes');
test.todo('TODO: Force Attribute Indentation Limits');

test.serial('Attribute Sorting (Alphanumeric)', async t => {

  console.log('\n');

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'liquid', markup: { forceAttribute: true, forceIndent: true } });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/attribute-sort');

  /* RULES -------------------------------------- */

  const attributeSortTrue = await prettify.format(source, { markup: { attributeSort: true } });

  t.log('{ markup: { attributeSort: true } }');
  t.snapshot(attributeSortTrue, '{ markup: { attributeSort: true } }');

  const attributeSortFalse = await prettify.format(source, { markup: { attributeSort: false } });

  t.log('{ markup: { attributeSort: false } }');
  t.snapshot(attributeSortFalse, '{ markup: { attributeSort: false } }');

});

test.serial('Attribute Sort List', async t => {

  /* OPTIONS ------------------------------------ */

  prettify.options({ language: 'liquid', markup: { forceAttribute: true, forceIndent: true } });

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/attribute-sort-list');

  /* RULES -------------------------------------- */

  const attributeSortList = await prettify.format(source, {
    markup: {
      attributeSort: true,
      attributeSortList: [ 'class', 'data-b', 'data-a', 'data-c', 'data-e' ]
    }
  });

  const option = `{
    markup: {
      attributeSort: true,
      attributeSortList: [
        'class',
        'data-b',
        'data-a',
        'data-c',
        'data-e'
      ]
    }
  }`;

  t.log(option.replace(/\n/g, '').replace(/\s+/g, ' '));
  t.snapshot(attributeSortList, option);

  const attributeSortFalse = await prettify.format(source, { markup: { attributeSort: false } });

  t.log('{ markup: { attributeSort: false } }');
  t.snapshot(attributeSortFalse, '{ markup: { attributeSort: false } } (default)');

});

test.serial('Force Attribute Indentation', async t => {

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/force-attribute');

  /* RULES -------------------------------------- */

  for (const forceAttribute of [ true, false ]) {

    const output = await prettify.format(source, { markup: { forceAttribute } });

    t.log(`{ markup: { forceAttribute: ${forceAttribute} } }`);
    t.snapshot(
      output,
      `{ markup: { forceAttribute: ${forceAttribute} } } ${forceAttribute === false ? '(default)' : ''}`
    );

  };

});

test.serial('Force Content Indentation', async t => {

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/force-indent');

  /* RULES -------------------------------------- */

  for (const forceIndent of [ false, true ]) {

    const output = await prettify.format(source, { markup: { forceIndent } });

    t.log(`{ markup: { forceIndent: ${forceIndent} } }`);
    t.snapshot(
      output,
      `{ markup: { forceIndent: ${forceIndent} } } ${forceIndent === true ? '(default)' : ''}`
    );

  };

});

test.serial('Delimiter Spacing', async t => {

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/delimiter-spacing');

  /* RULES -------------------------------------- */

  for (const delimiterSpacing of [ false, true ]) {

    const output = await prettify.format(source, { markup: { delimiterSpacing } });

    t.log(`{ markup: { delimiterSpacing: ${delimiterSpacing} } }`);
    t.snapshot(
      output,
      `{ markup: { delimiterSpacing: ${delimiterSpacing} } } ${delimiterSpacing === true ? '(default)' : ''}`
    );

  };

});

test.serial('Quote Convert', async t => {

  /* SAMPLE ------------------------------------- */

  const source = await samples.rules('markup/quote-convert');

  /* RULES -------------------------------------- */

  for (const quoteConvert of [ 'single', 'double', 'none' ]) {

    const output = await prettify.format(source, { markup: { quoteConvert } });

    t.log(`{ markup: { quoteConvert: "${quoteConvert}" } }`);
    t.snapshot(
      output,
      `{ markup: { quoteConvert: "${quoteConvert}" } } ${quoteConvert === 'none' ? '(default)' : ''}`
    );

  };

});
