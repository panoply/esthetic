import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('HTML language detection', async t => {

  const { source } = await samples.get('languages/html');

  t.deepEqual(prettify.language(source), {
    language: 'html',
    lexer: 'markup',
    languageName: 'HTML'
  });

});

test.serial('Liquid language detection', async t => {

  const { source } = await samples.get('languages/liquid');

  t.deepEqual(prettify.language(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test.serial('Liquid embedded region {% style %}', async t => {

  const { source } = await samples.get('liquid/style');

  t.deepEqual(prettify.language(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test.serial('Liquid embedded region {% stylesheet %}', async t => {

  const { source } = await samples.get('liquid/style');

  t.deepEqual(prettify.language(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test.serial('Liquid embedded region {% schema %}', async t => {

  const { source } = await samples.get('liquid/schema');

  t.deepEqual(prettify.language(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test.serial('Liquid embedded region {% javascript %}', async t => {

  const { source } = await samples.get('liquid/javascript');

  t.deepEqual(prettify.language(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test.serial('CSS language detection', async t => {

  const { source } = await samples.get('languages/css');

  t.deepEqual(prettify.language(source), {
    language: 'css',
    lexer: 'style',
    languageName: 'CSS'
  });

});

test.serial.skip('SCSS language detection', async t => {

  const { source } = await samples.get('languages/scss');

  prettify.language(source);

  t.log(prettify.language(input.nospace));

});

test.serial('JSON language detection', async t => {

  const { source } = await samples.get('languages/json');

  t.deepEqual(prettify.language(source), {
    language: 'json',
    lexer: 'script',
    languageName: 'JSON'
  });

});

test.serial('JavaScript language detection', async t => {

  const { source } = await samples.get('languages/javascript');

  t.deepEqual(prettify.language(source), {
    language: 'javascript',
    lexer: 'script',
    languageName: 'JavaScript'
  });

});

test.serial('TypeScript language detection', async t => {

  const { source } = await samples.get('languages/typescript');

  t.deepEqual(prettify.language(source), {
    language: 'typescript',
    lexer: 'script',
    languageName: 'TypeScript'
  });

});

test.serial('Language Detection hooks', async t => {

  const { source } = await samples.get('languages/liquid');

  prettify.language.listen(({ language, languageName, lexer }) => {

    t.is(language, 'liquid');
    t.is(languageName, 'Liquid');
    t.is(lexer, 'markup');

  });

  prettify.language.listen(() => {

    return {
      language: 'typescript',
      lexer: 'script',
      languageName: 'TypeScript'
    };

  });

  t.deepEqual(prettify.language(source), {
    language: 'typescript',
    lexer: 'script',
    languageName: 'TypeScript'
  });

});
