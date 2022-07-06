import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('sortSelector: true', async t => {

  const { source } = await samples.get('css/basic-styles');

  const basic = await prettify.format(source).catch(e => console.error(e));

  t.log(basic);

  t.pass();

});

test.serial.skip('Liquid in CSS', async t => {

  const { source } = await samples.get('css/css-with-liquid');

  const liquidInCSS = await prettify.format(source, {
    language: 'css',
    lexer: 'style'
  });

  // t.snapshot(sortPropertiesFalse);

  t.log(liquidInCSS);

});

/* -------------------------------------------- */
/* RULES                                        */
/* -------------------------------------------- */

test.serial.skip('sortSelector: true', async t => {

  const { source } = await samples.get('css/sort-selectors');

  const sortSelectorsTrue = await prettify.format(source, {
    style: {
      sortSelectors: true
    }
  });

  t.snapshot(sortSelectorsTrue);

});

test.serial.skip('sortSelector: false', async t => {

  const { source } = await samples.get('css/sort-selectors');

  const sortSelectorsFalse = await prettify.format(source, {
    style: {
      sortSelectors: false
    }
  });

  t.snapshot(sortSelectorsFalse);

});

test.serial.skip('sortProperties: true', async t => {

  const { source } = await samples.get('css/sort-properties');

  const sortPropertiesTrue = await prettify.format(source, {
    style: {
      sortProperties: true
    }
  });

  t.snapshot(sortPropertiesTrue);

});

test.serial.skip('sortProperties: false', async t => {

  const { source } = await samples.get('css/sort-properties');

  const sortPropertiesFalse = await prettify.format(source, {
    style: {
      sortProperties: false
    }
  });

  t.snapshot(sortPropertiesFalse);

});
