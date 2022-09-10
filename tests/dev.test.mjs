import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await util.dev(t)(async (source, highlight) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      markup: {
        forceIndent: false,
        forceAttribute: 3
      }

    });

    t.log(highlight(output));

  });

});
