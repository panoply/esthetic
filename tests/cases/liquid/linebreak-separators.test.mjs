import test from 'ava';
import { forSample, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Line Break Separator (after): ', t => {

  forSample(
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
