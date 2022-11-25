import test from 'ava';
import { dev } from '@liquify/ava/prettify';
import prettify from '@liquify/prettify';

test('develop', async t => {

  await dev(t)(async (source) => {

    const output = await prettify.format(source, {
      language: 'liquid',
      wrap: 0,
      markup: {
      //  delimiterTrims: 'tags',
        preserveText: true,
        forceIndent: false,
        lineBreakOperator: 'after',
        forceAttribute: 3,
        ignoreScripts: true,
        ignoreStyles: true
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
