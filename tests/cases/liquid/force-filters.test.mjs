import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Force Tag Arguments (Line Break - After)', t => {

  forAssert(
    [
      [
        liquid`
          {% render 'snippet', param_1: true, param_2: 1000, param_3: 'string', param_4: nil %}
        `,
        liquid`
          {% render 'snippet',
            param_1: true,
            param_2: 1000,
            param_3: 'string',
            param_4: nil %}
        `
      ],
      [
        liquid`
          {% render 'snippet'
          , param_1: true
          , param_2: 1000
          , param_3: 'string'
          , param_4: nil %}
        `,
        liquid`
          {% render 'snippet',
            param_1: true,
            param_2: 1000,
            param_3: 'string',
            param_4: nil %}
        `
      ],
      [
        liquid`
          {% render 'snippet', param_1: true, param_2: 1000
          , param_3: 'string', param_4: nil %}
        `,
        liquid`
          {% render 'snippet',
            param_1: true,
            param_2: 1000,
            param_3: 'string',
            param_4: nil %}
        `
      ],
      [
        liquid`
          {% render 'snippet'
          ,
          param_1: true    , param_2: 1000
          ,
           param_3: 'string'
          , param_4: nil, %}
        `,
        liquid`
          {% render 'snippet',
            param_1: true,
            param_2: 1000,
            param_3: 'string',
            param_4: nil %}
        `
      ]

    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        forceArgument: 2
      }
    });

    t.is(actual, expect);

  });
});
