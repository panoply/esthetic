import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('CSS Variables', async t => {

  const { source } = await samples.get('css/css-vars');

  const cssVars = await prettify.format(source, {
    language: 'css'
  }).catch(e => console.error(e));

  t.snapshot(cssVars);

  // t.log(cssVars);

  t.pass();

});

test.serial.skip('Global Pseudo selector', async t => {

  const { source } = await samples.get('css/pseudo-selectors');

  const pseudoSelectors = await prettify.format(source, {
    language: 'css'
  }).catch(e => console.error(e));

  t.snapshot(pseudoSelectors);

  t.pass();

});

test.serial.skip('play', async t => {

  const { source } = await samples.get('css/basic-styles');

  const basic = await prettify.format(source).catch(e => console.error(e));

  t.log(basic);

  t.pass();

});

test.serial('Liquid in CSS', async t => {

  const { source } = await samples.get('liquid/document-sample');

  const liquidInCSS = await prettify.format(source, {
    language: 'liquid',
    wrap: 50,
    style: {
      forceValue: 'collapse'
    }
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
    language: 'css',
    style: {
      sortSelectors: true
    }
  });

  t.snapshot(sortSelectorsTrue);

});

test.serial.skip('sortSelector: false', async t => {

  const { source } = await samples.get('css/sort-selectors');

  const sortSelectorsFalse = await prettify.format(source, {
    language: 'css',
    style: {
      sortSelectors: false
    }
  });

  t.snapshot(sortSelectorsFalse);

});

test.serial.skip('sortProperties: true', async t => {

  const { source } = await samples.get('css/sort-properties');

  const sortPropertiesTrue = await prettify.format(source, {
    language: 'css',
    style: {
      sortProperties: true
    }
  });

  t.snapshot(sortPropertiesTrue);

});

test.serial.skip('sortProperties: false', async t => {

  const { source } = await samples.get('css/sort-properties');

  const sortPropertiesFalse = await prettify.format(source, {
    language: 'css',
    style: {
      sortProperties: false
    }
  });

  t.snapshot(sortPropertiesFalse);

});
