import test from 'ava';
import { dev } from '@liquify/ava/prettify';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await dev(t)(async (source) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      wrap: 0,
      preserveLine: 0,
      preserveComment: false,
      commentIndent: true,
      style: {
        classPadding: true
      },
      markup: {
        correct: false,
        commentNewline: true,
        normalizeSpacing: true,
        delimiterTrims: 'strip',
        lineBreakSeparator: 'before',
        valueForce: 'always',
        forceLeadAttribute: false,
        forceAttribute: false,
        forceIndent: true,
        quoteConvert: 'none'
      },

      json: {
        braceAllman: false,
        bracePadding: false,
        objectSort: false,
        arrayFormat: 'inline',
        objectIndent: 'indent'
      }
    });

    return {
      repeat: 0,
      source: output,
      logger: false,
      finish: () => t.log(output)
    };

  });

});
