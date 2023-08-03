import test from 'ava';
import { forAssert, forSample, css, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: CSS variable expressions with Liquid infusion', t => {

  forSample([
    liquid`/* Liquid CSS Variables Value */

      :root {
        --font-body-family: {{ settings.type_body_font.family }};
      }

    `
    ,

    liquid`/* Liquid CSS Variables Infused Properties */

      :root {
        --{{ settings.type_body_font.family }}-main: brown;
        --my-background: #fff;
        --my-var-{{ settings.type_body_font.family }}: 0.985rem;
      }
    `
    ,

    liquid`/* Liquid CSS Variables Mixtures */

      :root {
        --{{ settings.type_body_font.family }}-main: brown;
        --my-{{ no.prefix }}: {{ setting.var }};
        --my-var-{{ settings.type_body_font.family }}: 0.985rem;
        {% for vars in settings.arr %}
          --{{ var.prop }}: {{ var.value }};
        {% endfor %}
        {{ no.prefix }}: {{ setting.var }};
      }
    `
  ])(
    {
      language: 'css'
    }
  )(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });

});

test('Selector Test: Liquid infused CSS selectors', t => {

  forAssert([
    [
      css`/* Liquid selector will be glued and extraneous spacing stripped */

        .color-  {{ scheme.id }}    { }
      `
      ,
      css`/* Liquid selector will be glued and extraneous spacing stripped */

      .color-{{ scheme.id }} {}

      `
    ],
    [
      css`/* Liquid output tags as selector */
        {{ some.class }}   {}
      `
      ,
      css`/* Liquid output tags as selector */
        {{ some.class }} {}
      `
    ],
    [
      css`/* Space should be respected at grid */

      .image-grid-{{ respect.spacing }} .grid {
        color: #111;
      }

      `,
      css`/* Space should be respected at grid */

      .image-grid-{{ respect.spacing }} .grid {
        color: #111;
      }

      `
    ],
    [
      css`/* Template infused class should be preserved */

      .image-grid-{{ respect.spacing }}-class {
        color: #111;
      }

      `,
      css`/* Template infused class should be preserved */

      .image-grid-{{ respect.spacing }}-class {
        color: #111;
      }

      `
    ]
  ])(function (input, expect) {

    const output = esthetic.format(input, {
      language: 'css'
    });

    t.deepEqual(output, expect);

  });

});

test('Structure Test: Liquid in CSS Preserved Inline', t => {

  forAssert([
    [
      css`

        /* Liquid expressions will not be forced and pass through */

        {% if settings.some.prop > 100 %}no-break{% else %}no-break{% endif %};

        {% if will.preserve and has.space %} no-break {% endif %}
      `
      ,
      css`

        /* Liquid expressions will not be forced and pass through */

        {% if settings.some.prop > 100 %}no-break{% else %}no-break{% endif %};

        {% if will.preserve and has.space %} no-break {% endif %}

      `
    ],
    [
      css`

      {% if foo %} .class-1 {% else %} .class-2 {% endif %} {}

      `,
      css`

      {% if foo %} .class-1 {% else %} .class-2 {% endif %} {}

      `
    ],
    [
      css`
      /*
        Liquid expressions should apply indentation and retain preservation
      */

      .within-class-selector {

      {% if foo %} font-size {% else %} background {% endif %}: {{ some.value }}
      }

      `,
      css`
      /*
        Liquid expressions should apply indentation and retain preservation
      */

      .within-class-selector {

        {% if foo %} font-size {% else %} background {% endif %}: {{ some.value }}
      }

      `
    ]
  ])(function (input, expect) {

    const output = esthetic.format(input, {
      language: 'css'
    });

    t.deepEqual(output, expect);

  });

});
