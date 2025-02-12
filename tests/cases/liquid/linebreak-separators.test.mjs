import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test.skip('Line Break Separator (after): ', t => {

  forAssert(
    [

      liquid`{{- output -}}`

    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'outputs'
      }
    });

    t.is(actual, expect);

  });
});
