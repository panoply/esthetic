import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.todo('Pseudo Selectors: This rule is error prone and needs fixing');

test.serial.skip('Global Pseudo selector', async t => {

  const source = await samples.cases('css/pseudo-selectors');

  const pseudoSelectors = await prettify.format(source, {
    language: 'css'
  }).catch(e => console.error(e));

  t.snapshot(pseudoSelectors);

});

test.serial('CSS Variables', async t => {

  const source = await samples.cases('css/css-vars');

  const cssVars = await prettify.format(source, {
    language: 'css'
  }).catch(e => console.error(e));

  t.snapshot(cssVars);

  // t.log(cssVars);

});

test.serial.skip('play', async t => {

  const source = await samples.cases('css/basic-styles');

  const basic = await prettify.format(source, {
    language: 'css'
  }).catch(e => console.error(e));

  t.log(basic);

});

test.serial.skip('Liquid in CSS', async t => {

  const source = await samples.cases('liquid/document-sample');

  const liquidInCSS = await prettify.format(source, {
    language: 'css',
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

test.serial('sortSelector: true', async t => {

  const source = await samples.cases('css/sort-selectors');

  const sortSelectorsTrue = await prettify.format(source, {
    language: 'css',
    style: {
      sortSelectors: true
    }
  });

  t.snapshot(sortSelectorsTrue);

});

test.serial('sortSelector: false', async t => {

  const source = await samples.cases('css/sort-selectors');

  const sortSelectorsFalse = await prettify.format(source, {
    language: 'css',
    style: {
      sortSelectors: false
    }
  });

  t.snapshot(sortSelectorsFalse);

});

test.serial('sortProperties: true', async t => {

  const source = await samples.cases('css/sort-properties');

  const sortPropertiesTrue = await prettify.format(source, {
    language: 'css',
    style: {
      sortProperties: true
    }
  });

  t.snapshot(sortPropertiesTrue);

});

test.serial('sortProperties: false', async t => {

  const source = await samples.cases('css/sort-properties');

  const sortPropertiesFalse = await prettify.format(source, {
    language: 'css',
    style: {
      sortProperties: false
    }
  });

  t.snapshot(sortPropertiesFalse);

});
