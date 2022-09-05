import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await util.dev(t)(async (source, highlight) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      markup: {
        correct: true,
        attributeCasing: 'lowercase',
        forceAttribute: true
      }

    });

    t.log(highlight(output));

  });

});
