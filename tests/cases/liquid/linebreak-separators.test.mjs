import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid Line Break Separator Structures', t => {

  forAssert(
    [
      [
        liquid`{{- output -}}`,
        liquid`{{- output -}}`
      ],
      [
        liquid`{{-output-}}`,
        liquid`{{- output -}}`
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
