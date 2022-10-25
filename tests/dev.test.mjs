import test from 'ava';
import util from '@prettify/tests';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await util.dev(t)(async (source, highlight) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      wrap: 0,
      markup: {
      //  delimiterTrims: 'tags',
        preserveText: true,
        forceIndent: false,
        forceAttribute: 3
      },
      json: {
        braceAllman: true,
        objectSort: true
      }
    });

    return {
      repeat: 4,
      source: output,
      logger: false,
      finish: () => t.log(output)
    };

  });

});
