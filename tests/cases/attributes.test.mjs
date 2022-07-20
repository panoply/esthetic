import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('attributeSort: true', async t => {

  const { source } = await samples.get('attributes/attribute-sorting');

  const output = await prettify.format(source, {
    language: 'html',
    markup: {
      forceAttribute: 2,
      attributeSort: true
    },
    script: {
      objectSort: true
    }
  });

  // t.log(prettify.format.stats);
  // t.log(output);
  t.snapshot(output);

});

test.serial.skip('attributeGlue: true', async t => {

  const { source } = await samples.get('attributes/attribute-chain');

  const output = await prettify.format(source, {
    language: 'html',
    lexer: 'markup',
    // wrap: 80,
    markup: {
      forceAttribute: 2,
      attributeChain: 'preserve'
    }

  });

  t.log(prettify.format.stats);
  t.log(output);
  // t.snapshot(output);

});

test.serial.skip('forceAttribute: 2', async t => {

  const { source } = await samples.get('attributes/force-limits');

  const output = await prettify.format(source, {
    language: 'html',
    lexer: 'markup',
    markup: {
      forceAttribute: 3
    }
  });

  t.snapshot(output);

});

test.serial.skip('preserveAttributes: true', async t => {

  const { source } = await samples.get('attributes/preserve-attributes');

  const output = await prettify.format(source, {
    markup: {
      preserveAttributes: true
    }
  });

  // t.log(output);

  t.snapshot(output);

});

test.serial('attributeValueNewlines: "force"', async t => {

  const { source } = await samples.get('attributes/attribute-values');

  return prettify.format(source, {
    wrap: 80,
    language: 'liquid',
    markup: {
      attributeValues: 'collapse',
      forceAttribute: true
    }
  }).then(v => {

    t.log(prettify.format.stats);

    t.log(v);
    t.pass();

  }).catch(t.log);

});
