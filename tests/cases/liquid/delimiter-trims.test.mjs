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

    const actual = esthetic.format(source, {
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
        liquid`{%- singleton_1 -%}`,
        liquid`{%- singleton_1 -%}`
      ],
      [
        liquid`{%-singleton_2-%}`,
        liquid`{%- singleton_2 -%}`
      ],
      [
        liquid`{%-singleton_3%}`,
        liquid`{%- singleton_3 -%}`
      ],
      [
        liquid`{%singleton_4-%}`,
        liquid`{%- singleton_4 -%}`
      ],
      [
        liquid`{%- singleton_5%}`,
        liquid`{%- singleton_5 -%}`
      ],
      [
        liquid`{%singleton_6-%}`,
        liquid`{%- singleton_6 -%}`
      ],
      [
        liquid`{%singleton_7%}`,
        liquid`{%- singleton_7 -%}`
      ],
      [
        liquid`{%singleton_8 %}`,
        liquid`{%- singleton_8 -%}`
      ],
      [
        liquid`{% singleton_9%}`,
        liquid`{%- singleton_9 -%}`
      ],
      [
        liquid`{% singleton_10 %}`,
        liquid`{%- singleton_10 -%}`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'tags'
      }
    });

    t.is(actual, expect);

  });
});

test('Liquid Delimiter Trims (never): Stripping from tokens', t => {

  forAssert(
    [
      [
        liquid`{{- output_strip_1 -}}`,
        liquid`{{ output_strip_1 }}`
      ],
      [
        liquid`{{-output_strip_2-}}`,
        liquid`{{ output_strip_2 }}`
      ],
      [
        liquid`{{-output_strip_3}}`,
        liquid`{{ output_strip_3 }}`
      ],
      [
        liquid`{{- output_strip_4}}`,
        liquid`{{ output_strip_4 }}`
      ],
      [
        liquid`{{-output_strip_5 }}`,
        liquid`{{ output_strip_5 }}`
      ],
      [
        liquid`{{- output_strip_6 }}`,
        liquid`{{ output_strip_6 }}`
      ],
      [
        liquid`{{output_strip_7-}}`,
        liquid`{{ output_strip_7 }}`
      ],
      [
        liquid`{{ output_strip_8-}}`,
        liquid`{{ output_strip_8 }}`
      ],
      [
        liquid`{{ output_strip_9 }}`,
        liquid`{{ output_strip_9 }}`
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

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'never'
      }
    });

    t.is(actual, expect);

  });
});

test('Liquid Delimiter Trims (always): Forcing trims on all tokens', t => {

  forAssert(
    [
      [
        liquid`{{- output_force_1 -}}`,
        liquid`{{- output_force_1 -}}`
      ],
      [
        liquid`{{-output_force_2-}}`,
        liquid`{{- output_force_2 -}}`
      ],
      [
        liquid`{{-output_force_3}}`,
        liquid`{{- output_force_3 -}}`
      ],
      [
        liquid`{{- output_force_4}}`,
        liquid`{{- output_force_4 -}}`
      ],
      [
        liquid`{{-output_force_5 }}`,
        liquid`{{- output_force_5 -}}`
      ],
      [
        liquid`{{- output_force_6 }}`,
        liquid`{{- output_force_6 -}}`
      ],
      [
        liquid`{{output_force_7-}}`,
        liquid`{{- output_force_7 -}}`
      ],
      [
        liquid`{{ output_force_8-}}`,
        liquid`{{- output_force_8 -}}`
      ],
      [
        liquid`{{output_force_9}}`,
        liquid`{{- output_force_9 -}}`
      ],
      [
        liquid`{{ output_force_ten }}`,
        liquid`{{- output_force_ten -}}`
      ],
      [
        liquid`{{ output_force_eleven}}`,
        liquid`{{- output_force_eleven -}}`
      ],
      [
        liquid`{%- singleton_force_1 -%}`,
        liquid`{%- singleton_force_1 -%}`
      ],
      [
        liquid`{%-singleton_force_2-%}`,
        liquid`{%- singleton_force_2 -%}`
      ],
      [
        liquid`{%-singleton_force_3%}`,
        liquid`{%- singleton_force_3 -%}`
      ],
      [
        liquid`{%-singleton_force_4 %}`,
        liquid`{%- singleton_force_4 -%}`
      ],
      [
        liquid`{%- singleton_force_5%}`,
        liquid`{%- singleton_force_5 -%}`
      ],
      [
        liquid`{%-singleton_force_6%}`,
        liquid`{%- singleton_force_6 -%}`
      ],
      [
        liquid`{%singleton_force_7-%}`,
        liquid`{%- singleton_force_7 -%}`
      ],
      [
        liquid`{%singleton_force_8 -%}`,
        liquid`{%- singleton_force_8 -%}`
      ],
      [
        liquid`{% singleton_force_9-%}`,
        liquid`{%- singleton_force_9 -%}`
      ],
      [
        liquid`{%singleton_force_10%}`,
        liquid`{%- singleton_force_10 -%}`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'always'
      }
    });

    t.is(actual, expect);

  });
});
