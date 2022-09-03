import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await util.dev(async (source, highlight) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      markup: {
        attributeCasing: 'lowercase-value'
      }
    });

    t.log(highlight(output));

  });

});
