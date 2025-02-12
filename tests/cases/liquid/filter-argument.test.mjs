import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test.skip('Filter Argument Preserve with linebreak after', t => {

  forAssert(
    [
      [
        liquid`
          {{ object.prop
             | filter: arg_1:
              foo
              , bar ,
              bar, qux
          }}
        `,
        liquid`
          {{ object.prop
            | filter: arg_1:
              foo
              , bar
              , bar, qux
          }}
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
        argumentLineBreak: 2
      }
    });

    t.is(actual, expect);

  });
});
