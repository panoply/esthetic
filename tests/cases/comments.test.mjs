import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Markup ignore file Liquid comment', async t => {

  // t.log('{% comment %} @prettify-ignore {% endcomment %}');

  const { source } = await samples.get('liquid/ignore-file');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Markup ignore file HTML comment', async t => {

  // t.log('<!-- @prettify-ignore -->');

  const { source } = await samples.get('markup/html-ignore-file');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Markup ignored regions Liquid comments ', async t => {

  // t.log('{% comment %} @prettify-ignore-start {% endcomment %}');
  // t.log('{% comment %} @prettify-ignore-end {% endcomment %}');

  const { source } = await samples.get('markup/liquid-ignore-region');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Markup ignored regions HTML comments', async t => {

  // t.log('<!-- @prettify-ignore-start -->');
  // t.log('<!-- @prettify-ignore-end -->');

  const { source } = await samples.get('markup/html-ignore-region');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Script ignore file line comment', async t => {

  // t.log('// @prettify-ignore');

  const { source } = await samples.get('javascript/ignore-file-inline');

  const output = await prettify.format(source, {
    script: {
      arrayFormat: 'inline'
    }
  });

  t.snapshot(output);

});

test.serial('Script ignore file block comment', async t => {

  // t.log('/* @prettify-ignore */');

  const { source } = await samples.get('javascript/ignore-file-inline');

  const output = await prettify.format(source, {
    script: {
      arrayFormat: 'inline'
    }
  });

  t.snapshot(output);

});

test.serial('Script ignored regions block comments ', async t => {

  // t.log('/* @prettify-ignore-start */');
  // t.log('/* @prettify-ignore-end */');

  const { source } = await samples.get('javascript/ignore-region-block');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Script ignored regions inline comments ', async t => {

  // t.log('// @prettify-ignore-start');
  // t.log('// @prettify-ignore-end');

  const { source } = await samples.get('javascript/ignore-region-block');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});
