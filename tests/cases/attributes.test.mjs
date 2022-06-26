import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '../../index.mjs';

test.serial('Conditional attributes', async t => {

  const { source } = await samples.get('markup/attribute-value-newlines');

  return prettify.format(source).then(v => {

    t.log((v).split('\n'));
    t.pass();

  }).catch(t.log);

});
