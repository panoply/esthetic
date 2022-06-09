import test from 'ava';
import { play } from '@liquify/test-utils';
import prettify from '../package/index.mjs';
import * as mocks from './mocks/export.mjs';

test('PLAY', t => {

  prettify.markup(mocks.markup.markup_play, {
    attemptCorrection: true,
    forceIndent: true,
    indentSize: 2
  }).then(value => {

    return t.log(play('\n\n' + value));

  }).catch(console.error);

});
