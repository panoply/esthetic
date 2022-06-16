import test from 'ava';
import { samples } from '@liquify/test-utils';
import { language } from '@liquify/prettify';

test('HTML automatic detection', async t => {

  const { source } = await samples.get('languages/html');

  t.deepEqual(language.auto(source), {
    language: 'html',
    lexer: 'markup',
    languageName: 'HTML'
  });

});

test('Liquid automatic detection', async t => {

  const { source } = await samples.get('languages/liquid');

  t.deepEqual(language.auto(source), {
    language: 'liquid',
    lexer: 'markup',
    languageName: 'Liquid'
  });

});

test('CSS automatic detection', async t => {

  const { source } = await samples.get('languages/css');

  t.deepEqual(language.auto(source), {
    language: 'css',
    lexer: 'style',
    languageName: 'CSS'
  });

});

test.skip('SCSS automatic detection', async t => {

  const { source } = await samples.get('languages/scss');

  language.auto(source);

  t.log(language.auto(input.nospace));

});

test('JSON automatic detection', async t => {

  const { source } = await samples.get('languages/json');

  t.deepEqual(language.auto(source), {
    language: 'json',
    lexer: 'script',
    languageName: 'JSON'
  });

});

test('JavaScript automatic detection', async t => {

  const { source } = await samples.get('languages/javascript');

  t.deepEqual(language.auto(source), {
    language: 'javascript',
    lexer: 'script',
    languageName: 'JavaScript'
  });

});

test('TypeScript automatic detection', async t => {

  const { source } = await samples.get('languages/typescript');

  t.deepEqual(language.auto(source), {
    language: 'typescript',
    lexer: 'script',
    languageName: 'TypeScript'
  });

});
