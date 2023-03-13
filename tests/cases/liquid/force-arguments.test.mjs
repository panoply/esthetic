import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Forcing tag arguments', t => {

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
          , param_4: nil %}
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
        lineBreakSeparator: 'after',
        forceArgument: 2
      }
    });

    t.is(actual, expect);

  });
});

test('Structure Test: Force filter tag arguments', t => {

  forAssert(
    [
      [
        liquid`
          {% render 'snippet', param_1: true, param_2: 1000, param_3: 'string', param_4: nil %}
        `,
        liquid`
         {% render 'snippet'
          , param_1: true
          , param_2: 1000
          , param_3: 'string'
          , param_4: nil %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        lineBreakSeparator: 'before',
        forceArgument: 2
      }
    });

    t.is(actual, expect);

  });
});
