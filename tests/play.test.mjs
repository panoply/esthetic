import test from 'ava';
import { play, samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test('PLAY', async t => {

  const { source } = await samples.get('liquid/javascript');

  prettify.format(source, {
    attemptCorrection: false,
    indentSize: 2,
    script: {
      objectSort: true,
      objectIndent: 'indent'
    },
    style: {
      sortProperties: true
    }
  }).then(value => {

    return t.log(play('\n\n' + value));

  }).catch(console.error);

});
