import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test('Indent JavaScript block comments', async t => {

  const { source } = await samples.get('javascript/comment-indent');

  const output = await prettify.format(source, {
    preserveComment: false,
    script: {
      braceNewline: false
    }
  });

  t.snapshot(output);

});
