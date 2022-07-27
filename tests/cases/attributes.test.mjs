import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('Preserve Liquid attribute structures', async t => {

  const source = await samples.cases('attributes/preserve-liquid-attributes');
  const output = await prettify.format(source, {
    language: 'liquid',
    preserveLine: 2,
    wrap: 0,
    markup: {
      forceLeadAttribute: false,
      forceAttribute: false,
      preserveText: true
    }
  });

  // t.log(output);

  t.snapshot(output, 'Rules are using defaults, `forceLeadAttribute`, `forceAttribute` are `false`');

});

test.serial.skip('Force Liquid attribute structures', async t => {

  const source = await samples.cases('attributes/force-attribute');

  const output = await prettify.format(source, {
    language: 'liquid',
    preserveLine: 2,
    markup: {
      forceLeadAttribute: false,
      forceAttribute: true,
      preserveText: true
    }

  });

  // t.log(output);

  t.snapshot(output, 'Forcing all attributes, `{ markup: { forceAttribute: true} }`');

});

test.serial('Handle Liquid attributes with HTML delimiter characters', async t => {

  const source = await samples.cases('attributes/attribute-delimiters');

  const output = await prettify.format(source, {
    language: 'liquid',
    preserveLine: 2,
    markup: {
      forceLeadAttribute: false,
      forceAttribute: true,
      preserveText: true
    }

  });

  t.log(output);

  // t.snapshot(output, 'Forcing all attributes, `{ markup: { forceAttribute: true} }`');

});

test.serial.skip('Force attributes using limit', async t => {

  const source = await samples.cases('attributes/force-using-limit');

  for (const forceAttribute of [ 5, 3, 4, 1, 5 ]) {

    const output = await prettify.format(source, {
      language: 'liquid',
      preserveLine: 2,
      wrap: 0,
      markup: {
        forceLeadAttribute: false,
        forceAttribute,
        preserveText: true
      }

    });

    t.log(output);

    // t.snapshot(output, `Forcing when ${forceAttribute}  or more attributes`);

  }

});

test.serial.skip('Wrap Liquid attribute structures using force', async t => {

  const source = await samples.cases('attributes/force-wrap-attribute');

  const output = await prettify.format(source, {
    language: 'liquid',
    wrap: 50,
    preserveLine: 2,
    markup: {
      forceLeadAttribute: false,
      forceAttribute: false,
      preserveText: true
    }

  });

  // t.log(output);

  t.snapshot(output, 'Forcing based on wrap limits, `{ wrap: 50 }`');

});

test.serial.skip('Wrap Liquid attribute structures using force lead', async t => {

  const source = await samples.cases('attributes/force-wrap-attribute');

  const output = await prettify.format(source, {
    language: 'liquid',
    wrap: 40,
    preserveLine: 2,
    markup: {
      forceLeadAttribute: true,
      forceAttribute: false,
      preserveText: true
    }

  });

  // t.log(output);

  t.snapshot(output, 'Forcing based on wrap limits, including lead attributes');

});

test.serial.skip('Sorting attributes alphanumerically', async t => {

  const source = await samples.cases('attributes/attribute-sorting');

  const output = await prettify.format(source, {
    language: 'html',
    markup: {
      forceAttribute: 2,
      attributeSort: true
    }
  });

  t.snapshot(output, 'Using `{ markup: { attributeSort: true } }`');

});

test.serial.skip('Preserving attributes, leaving input instact', async t => {

  const source = await samples.cases('attributes/preserve-attributes');

  const output = await prettify.format(source, {
    markup: {
      preserveAttributes: true
    }
  });

  // t.log(output);

  t.snapshot(output, 'Attributes are ignored, using `{ markup: { preserveAttributes: true } }`');

  prettify.options({ markup: { preserveAttributes: false, forceAttribute: false } });

});

test.serial.skip('attributeValueNewlines: "force"', async t => {

  const source = await samples.cases('attributes/attribute-values');

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
