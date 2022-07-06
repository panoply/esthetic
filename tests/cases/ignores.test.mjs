import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Ignore file using Liquid comment', async t => {

  // t.log('{% comment %} @prettify-ignore {% endcomment %}');

  const { source } = await samples.get('liquid/ignore-file');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  t.snapshot(output);

});

test.serial('Ignore file using HTML comment', async t => {

  // t.log('<!-- @prettify-ignore -->');

  const { source } = await samples.get('markup/html-ignore-file');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial('Ignore code regions using Liquid comments ', async t => {

  // t.log('{% comment %} @prettify-ignore-start {% endcomment %}');
  // t.log('{% comment %} @prettify-ignore-end {% endcomment %}');

  const { source } = await samples.get('markup/liquid-ignore-region');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial('Ignore code regions using HTML comments', async t => {

  // t.log('<!-- @prettify-ignore-start -->');
  // t.log('<!-- @prettify-ignore-end -->');

  const { source } = await samples.get('markup/html-ignore-region');

  const output = await prettify.format(source, {
    markup: {
      forceIndent: true
    }
  });

  //  t.log(output);
  t.snapshot(output);

});

test.serial('Ignore file using line comment', async t => {

  // t.log('// @prettify-ignore');

  const { source } = await samples.get('javascript/ignore-file-inline');

  const output = await prettify.format(source, {
    lexer: 'script',
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial('Ignore file using line block comment', async t => {

  // t.log('/* @prettify-ignore */');

  const { source } = await samples.get('javascript/ignore-file-inline');

  const output = await prettify.format(source, {
    lexer: 'script',
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial.skip('Ignore code regions using JS/TS/CSS block comments', async t => {

  // t.log('/* @prettify-ignore-start */');
  // t.log('/* @prettify-ignore-end */');

  const { source } = await samples.get('javascript/ignore-region-block');

  const output = await prettify.format(source, {
    lexer: 'script',
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial.skip('Ignore code regions using JS/TS/SCSS line comments', async t => {

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
