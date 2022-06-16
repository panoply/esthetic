import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '../../index.mjs';

const sample = samples.get('attributes');

test.skip('Conditional attributes', async t => {

  const { input } = await sample('conditional-attributes');

  return prettify.format(input.nolines).then(v => {

    t.log(v);

  }).catch(t.log);

});
