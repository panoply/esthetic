import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Ignore file using Liquid comment', async t => {

  const source = await samples.cases('ignores/liquid-ignore-file');

  const output = await prettify.format(source, {
    language: 'liquid',
    markup: {
      forceIndent: true
    }
  });

  // t.log(output);

  // t.log('{% comment %} @prettify-ignore {% endcomment %}');
  t.snapshot(output, '{% comment %} @prettify-ignore {% endcomment %}');

});

test.serial('Ignore file using HTML comment', async t => {

  const source = await samples.cases('ignores/html-ignore-file');

  const output = await prettify.format(source, {
    language: 'liquid',
    markup: {
      forceIndent: true
    }
  });

  // t.log(output);

  t.snapshot(output, '<!-- @prettify-ignore -->');

});

test.serial('Ignore file using line comment', async t => {

  const source = await samples.cases('ignores/javascript-ignore-file-2');
  const output = await prettify.format(source, {
    lexer: 'script',
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);

  t.snapshot(output, '// @prettify-ignore');

});

test.serial('Ignore file using line block comment', async t => {

  const source = await samples.cases('ignores/javascript-ignore-file-1');

  const output = await prettify.format(source, {
    lexer: 'script',
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);

  t.snapshot(output, '/* @prettify-ignore */');

});

test.serial('Ignore code regions using Liquid comments ', async t => {

  const source = await samples.cases('ignores/liquid-ignore-region');

  const output = await prettify.format(source, {
    language: 'liquid',
    markup: {
      forceIndent: true
    }
  });

  // t.log(output);

  t.snapshot(output, '{% comment %} @prettify-ignore-* {% endcomment %}');

});

test.serial('Ignore code regions using HTML comments', async t => {

  const source = await samples.cases('ignores/html-ignore-region');

  const output = await prettify.format(source, {
    language: 'liquid',
    markup: {
      forceIndent: true
    }
  });

  //  t.log(output);

  t.snapshot(output, '<!-- @prettify-ignore-* -->');

});

test.todo('Ignores: Block and Line inline region ignores are not respected');

test.serial.skip('Ignore code regions using JS/TS/CSS block comments', async t => {

  const source = await samples.cases('ignores/javascript-ignore-region-1');

  const output = await prettify.format(source, {
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);

  t.snapshot(output, '/* @prettify-ignore-* */');

});

test.serial.skip('Ignore code regions using JS/TS/SCSS line comments', async t => {

  const source = await samples.cases('ignores/javascript-ignore-region-2');

  const output = await prettify.format(source, {
    language: 'javascript',
    script: {
      arrayFormat: 'inline'
    }
  });

  // t.log(output);

  t.snapshot(output, '// @prettify-ignore-start');

});
