import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('forceAttributeLimit: 2', async t => {

  const { source } = await samples.get('attributes/force-limits');

  const output = await prettify.format(source, {
    language: 'html',
    lexer: 'markup',
    markup: {
      forceAttribute: 3
    }
  });

  t.log(output);
  // t.snapshot(output);

});

test.serial.skip('preserveAttributes: true', async t => {

  const { source } = await samples.get('markup/preserve-attributes');

  const output = await prettify.format(source, {
    markup: {
      preserveAttributes: true
    }
  });

  // t.log(output);
  t.snapshot(output);

});

test.serial.skip('attributeValueNewlines: "force"', async t => {

  const { source } = await samples.get('markup/attribute-value-newlines');

  return prettify.format(source, {

    markup: {
      attributeValueNewlines: 'collapse'
    }
  }).then(v => {

    console.log(v);
    return;

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

test.serial.skip('attributeValueNewlines: "align"', async t => {

  const { source } = await samples.get('markup/attribute-value-newlines');

  return prettify.format(source, {
    markup: {
      attributeValueNewlines: 'align'
    }
  }).then(v => {

    // t.log(v);
    t.pass();

  }).catch(t.log);

});
