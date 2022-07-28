import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

/* -------------------------------------------- */
/* STYL RULE TESTS                              */
/* -------------------------------------------- */

// ALL PRETTIFY OPTIONS MUST END WITH THE DEFAULTS
// BECAUSE OPTIONS ARE PERSISTED WHEN CHANGED.

/* -------------------------------------------- */
/* TESTS                                        */
/* -------------------------------------------- */

test.serial('Class Padding', async t => {

  prettify.options({
    language: 'css'
  });

  await samples.getRule('style/class-padding')(
    [
      true,
      false
    ]
    , async function (source, classPadding, label) {

      const output = await prettify.format(source, { style: { classPadding } });

      t.snapshot(output, label({ style: { classPadding } }));

      // t.log(output);
    }
  );

});

test.serial('Correct', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/correct')(
    [
      true,
      false
    ]
    , async function (source, correct, label) {

      const output = await prettify.format(source, { style: { correct } });

      t.snapshot(output, label({ style: { correct } }));

      // t.log(output);
    }
  );

  prettify.options({ language: 'css', style: { correct: false } });
});

test.serial('No Leading Zero', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/no-lead-zero')(
    [
      true,
      false
    ]
    , async function (source, noLeadZero, label) {

      const output = await prettify.format(source, { style: { noLeadZero } });

      t.snapshot(output, label({ style: { noLeadZero } }));

      // t.log(output);
    }
  );

  prettify.options({ language: 'css', style: { noLeadZero: false } });
});

test.serial('Quotation Conversion', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/quote-convert')(
    [
      'single',
      'double',
      'none'
    ]
    , async function (source, quoteConvert, label) {

      const output = await prettify.format(source, { style: { quoteConvert } });

      t.snapshot(output, label({ style: { quoteConvert } }));

      // t.log(output);
    }
  );

  prettify.options({ language: 'css', style: { correct: false } });
});

test.serial('Sort Selectors (Alphabetical)', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/sort-selectors')(
    [
      true,
      false
    ]
    , async function (source, sortSelectors, label) {

      const output = await prettify.format(source, { style: { sortSelectors } });

      t.snapshot(output, label({ style: { sortSelectors } }));

      // t.log(output);
    }
  );

  prettify.options({ language: 'css', style: { sortProperties: false, sortSelectors: false } });
});

test.serial('Sort Properties (Alphabetical)', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/sort-properties')(
    [
      true,
      false
    ]
    , async function (source, sortProperties, label) {

      const output = await prettify.format(source, { style: { sortProperties } });

      t.snapshot(output, label({ style: { sortProperties } }));

      // t.log(output);
    }
  );

  prettify.options({ language: 'css', style: { sortProperties: false } });
});

test.serial('Compress CSS', async t => {

  prettify.options({ language: 'css' });

  await samples.getRule('style/compress-css')(
    [
      true,
      false
    ]
    , async function (source, compressCSS, label) {

      const output = await prettify.format(source, { style: { compressCSS } });

      t.snapshot(output, label({ style: { compressCSS } }));

      // t.log(output);
    }
  );

});
