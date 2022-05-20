import test from 'ava';
import * as prettify from '../package/index.mjs';
import * as mocks from './mocks/export.mjs';

test('test', t => {

  prettify.options({
    markup: {
      forceAttribute: false
    }
  });

  prettify
    .markup(mocks.comment.liquid_comment_formatting, {
      forceAttribute: false,
      wrap: 50

    })
    .then(value => t.log(value))
    .catch(e => t.log(e));

  t.pass();
});
