import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Conditional Structures', async t => {

  const { source } = await samples.cases('liquid/conditional-structure');

  const output = await prettify.format(source, {
    language: 'liquid',
    wrap: 80,
    markup: {
      forceAttribute: true,
      attributeChain: 'collapse',
      attributeValues: 'preserve'
    }
  });

  t.log(output);
  t.pass();

});

test.serial.skip('Liquid doctype', async t => {

  const { source } = await samples.cases('liquid/document-sample');

  const output = await prettify.format(source, {
    language: 'liquid'
  });

  t.log(output);
  t.pass();

});
