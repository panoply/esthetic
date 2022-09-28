import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await util.dev(t)(async (source, highlight) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      preserveLine: 0,
      markup: {
        quoteConvert: 'double',
        forceIndent: false,
        forceAttribute: 3,
        attributeSort: true
      },
      json: {
        braceAllman: true,
        objectIndent: 'indent',
        arrayFormat: 'indent'
      }
    });

    t.log(highlight(output));

  });

});
