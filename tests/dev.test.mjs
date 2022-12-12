import test from 'ava';
import { dev } from '@liquify/ava/prettify';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await dev(t)(async (source) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      wrap: 0,
      commentIndent: true,
      crlf: false,
      indentSize: 2,
      preserveLine: 2,
      endNewline: true,
      markup: {
        correct: false,
        quoteConvert: 'none',
        delimiterSpacing: true,
        selfCloseSpace: true,
        commentNewline: true,
        forceIndent: true,
        attributeSort: false,
        attributeSortList: [],
        normalizeSpacing: true,
        valueForce: 'intent',
        attributeCasing: 'preserve',
        lineBreakSeparator: 'before',
        forceAttribute: 3,
        forceLeadAttribute: false,
        preserveAttributes: false,
        preserveText: false
      },
      json: {
        bracePadding: false,
        braceAllman: true,
        arrayFormat: 'indent',
        objectIndent: 'indent',
        objectSort: false
      },
      style: {
        correct: false,
        sortProperties: true,
        sortSelectors: true,
        noLeadZero: true,
        quoteConvert: 'single',
        classPadding: true
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
