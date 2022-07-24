import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Embedded JSX Expressions', async t => {

  const source = await samples.cases('jsx/embedded-expressions');

  const output = await prettify.format(source, {
    language: 'jsx',
    wrap: 80
  });

  // t.log(output);
  t.snapshot(output, 'Embedded Expression');

});

test.serial('Apply markup rules to content', async t => {

  const source = await samples.cases('jsx/embedded-expressions');

  const output = await prettify.format(source, {
    language: 'jsx',
    markup: {
      forceAttribute: true
    },
    script: {
      objectIndent: true,
      ternaryLine: true
    }

  });

  // t.log(output);

  t.log('{ markup: { forceAttribute: true }}');
  t.snapshot(output, '{ markup: { forceAttribute: true }}');

});
