import test from 'ava';

import * as prettify from '../package/index.mjs';
import * as mocks from './mocks/export.mjs';

test.skip('test', t => {

  const opts = {
    forceAttribute: false,
    wrap: 80,
    attributeGlue: true
  };

  prettify.options({
    markup: opts
  });

  t.log('\n', opts, '\n');

  prettify
    .markup(mocks.markup.markup_example)
    .then(value => {

      t.log(value);

    })
    .catch(e => t.log(e));

  t.pass('Test passed');
});

test('test re-runs', t => {

  /* prettify.options({
    markup: {
      forceAttribute: false,
      wrap: 90
    }
  }); */

  prettify
    .markup(mocks.markup.markup_play)
    .then(value => {

      // t.log(value);
      prettify
        .markup(value)
        .then(v => {

          //  t.log(v);

          prettify
            .markup(v)
            .then(x => {
              t.log(x);
            });
        });
    })
    .catch(e => t.log(e));

  t.pass('Test passed');
});
