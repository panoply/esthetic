import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid delimiter trims strip', t => {

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
