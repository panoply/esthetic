import test from 'ava';
import prettify from '@liquify/prettify';
import { samples } from '@liquify/test-utils';

test('Develop', async t => {

  const source = await samples.dev();
  const output = await prettify.format(source, {
    language: 'liquid'
  });

  t.log(output);
});
