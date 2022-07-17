import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('embedded expression', async t => {

  const { source } = await samples.get('jsx/embedded-expressions');

  const output = await prettify.format(source, {
    language: 'jsx',
    wrap: 80,
    markup: {
      forceAttribute: true
    }
  });

  t.log(prettify.format.stats);
  t.log(output);
  // t.snapshot(output);

});

test.serial.skip('JSX Language', async t => {

  const { source } = await samples.get('languages/jsx');

  const output = await prettify.format(source, {
    language: 'jsx',
    // wrap: 80,
    markup: {
      forceAttribute: true
    },
    script: {
      objectIndent: true,
      ternaryLine: true
    }

  });

  t.log(prettify.format.stats);
  t.log(output);
  // t.snapshot(output);

});
