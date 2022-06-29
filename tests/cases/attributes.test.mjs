import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('preserveAttributes: true', async t => {

  const { source } = await samples.get('markup/preserve-attributes');

  const output = await prettify.format(source, {
    markup: {
      preserveAttributes: true
    }
  });

  t.snapshot(output);

});

test.serial('attributeValueNewlines: "force"', async t => {

  const { source } = await samples.get('markup/attribute-value-newlines');

  return prettify.format(source, {

    markup: {
      attributeValueNewlines: 'force'
    }
  }).then(v => {

    return prettify.format(v, {
      wrap: 80,
      markup: {
        attributeValueNewlines: 'force'
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

    t.log(v);
    t.pass();

  }).catch(t.log);

});
