import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('attributeGlue: true', async t => {

  const { source } = await samples.get('attributes/attribute-chain');

  const output = await prettify.format(source, {
    language: 'html',
    lexer: 'markup',
    wrap: 80,
    markup: {
      // forceAttribute: 2,
      attributeChain: 'inline'
    }

  });

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
    markup: {
      attributeValues: 'wrap'
    }
  }).then(v => {

    return prettify.format(v, {
      wrap: 80,
      markup: {
        attributeValueNewlines: 'align'
      }
    }).then(v => {

      t.log(v);
      t.pass();

    }).catch(t.log);

  }).catch(t.log);

});
