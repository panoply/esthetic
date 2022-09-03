import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Comment Preservation', async t => {

  const source = await util.getSample('cases/liquid/comment-preserve');

  await prettify.format(source, {
    language: 'liquid'
  });

  // t.log(output);
  t.pass();

});

test.serial.skip('Conditional Structures', async t => {

  const source = await util.getSample('cases/liquid/conditional-structure');

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

  const source = await util.getSample('cases/liquid/document-sample');

  const output = await prettify.format(source, {
    language: 'liquid'
  });

  t.log(output);
  t.pass();

});
