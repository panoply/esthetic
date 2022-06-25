import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Liquid embedded JavaScript tag', async t => {

  const { source } = await samples.get('liquid/javascript');

  prettify.format(source, {

  });

  t.log();

  t.pass();

});
