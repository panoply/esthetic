import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Liquid doctype', async t => {

  const { source } = await samples.get('liquid/document-sample');

  const output = await prettify.format(source, {
    language: 'html',
    languageName: 'HTML',
    mode: 'beautify',
    wrap: 0,
    markup: {
      forceAttribute: true
    }
  });

  t.log(output);
  t.pass();

});
