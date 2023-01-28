import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid Delimiter Trims: Output token insertion', t => {

  forAssert(
    [
      [
        liquid`{{- output -}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{-output-}}`,
        liquid`{{-output-}}`
      ],
      [
        liquid`{{-output}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{output-}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{- output}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{output-}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{output}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{output }}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{ output}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{ output }}`,
        liquid`{{- output -}}`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'outputs'
      }
    });

    t.is(actual, expect);

  });
});

test('Liquid Delimiter Trims: Tag token insertion', t => {

  forAssert(
    [
      [
        liquid`{%- singleton -%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%-singleton-%}`,
        liquid`{%-singleton-%}`
      ],
      [
        liquid`{%-singleton%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%singleton-%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%- singleton%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%singleton-%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%singleton%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{%singleton %}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{% singleton%}`,
        liquid`{%- singleton -%}`
      ],
      [
        liquid`{% singleton %}`,
        liquid`{%- singleton -%}`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'tags'
      }
    });

    t.is(actual, expect);

  });
});

test('Liquid Delimiter Trims: Stripping from tokens', t => {

  forAssert(
    [
      [
        liquid`{{- output -}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{-output-}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{-output}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{- output}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{-output }}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{- output }}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{output-}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{{ output-}}`,
        liquid`{{ output }}`
      ],
      [
        liquid`{%- singleton -%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%-singleton-%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%-singleton%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%-singleton %}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%- singleton%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%-singleton%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%singleton-%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{%singleton -%}`,
        liquid`{% singleton %}`
      ],
      [
        liquid`{% singleton-%}`,
        liquid`{% singleton %}`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'strip'
      }
    });

    t.is(actual, expect);

  });
});
