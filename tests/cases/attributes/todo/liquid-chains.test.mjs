import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test.skip('Chaining Liquid Attributes: Liquid structure variations', t => {

  forAssert(
    [
      [
        liquid`<div {{ output }}></div>`,
        liquid`<div {{ output }}></div>`
      ],
      [
        liquid`<div {% singleton %}></div>`,
        liquid`<div {% singleton %}></div>`
      ],
      [
        liquid`<div {% if condition %}id="xx"{% endif %}></div>`,
        liquid`<div {% if condition %}id="xx"{% endif %}></div>`
      ],
      [
        liquid`<div {% if condition %}id={{ class }}{% endif %}></div>`,
        liquid`<div {% if condition %}id={{ class }}{% endif %}></div>`
      ],
      [
        liquid`<div {% singleton_attribute %}="liquid-tag-attr"></div>`,
        liquid`<div {% singleton_attribute %}="liquid-tag-attr"></div>`
      ],
      [
        liquid`<div {% singleton_attribute %}={% singleton_value_no_quotes %}></div>`,
        liquid`<div {% singleton_attribute %}={% singleton_value_no_quotes %}></div>`
      ],
      [
        liquid`<div data-x{% if chain %}-id{% else %}="xx"{% endif %}></div>`,
        liquid`<div data-x{% if chain %}-id{% else %}="xx"{% endif %}></div>`
      ],
      [
        liquid`<div data-x{% if chain %}-id{% else %}="xx"{% endif %}></div>`,
        liquid`<div data-x{% if chain %}-id{% else %}="xx"{% endif %}></div>`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, { language: 'liquid' });

    t.is(actual, expect);

  });
});

test.skip('Liquid chaining and whitespace breaks', t => {

  forAssert(
    [
      [
        liquid`<div {% space_respect %} {{ stimulates_attribute }}></div>`,
        liquid`<div {% space_respect %} {{ stimulates_attribute }}></div>`
      ],
      [
        liquid`<div {% if space_start %} id="space-around"{% endif %}></div>`,
        liquid`<div {% if space_start %}id="space-around"{% endif %}></div>`
      ],
      [
        liquid`<div {% if space_end %}id="space-strip" {% endif %}></div>`,
        liquid`<div {% if space_end %}id="space-strip"{% endif %}></div>`
      ],
      [
        liquid`<div {% if keep_chain %}id={{ no_space }}{% else %}data-x{% endif %}></div>`,
        liquid`<div {% if keep_chain %}id={{ no_space }}{% else %}data-x{% endif %}></div>`
      ],
      [
        liquid`<div {% if no_chain %}id={{ next_space }} {% else %}stripped{% endif %}></div>`,
        liquid`<div {% if no_chain %}id={{ next_space }}{% else %}stripped{% endif %}></div>`
      ],
      [
        liquid`<div {% if unchain %} id={{ space_start }}{% else %}space-around{% endif %}></div>`,
        liquid`<div {% if unchain %}id={{ space_start }}{% else %}space-around{% endif %}></div>`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'liquid',
      markup: {
        forceAttribute: false,
        indentAttributes: false
      }
    });

    t.is(actual, expect);

  });
});

test.skip('Liquid structure preservation', t => {

  forRule(
    [
      liquid`

      {% # The entire structure will chain starting at the if condition %}

      <div

      id="foo"

      {% if x  %}data-attr="x"{% elsif %}data-id="x"{% endif %}

      ></div>

      `
      ,
      liquid`

      {% # Chained edge case, attributes will connect (boolean structure) %}

      <div

      data-{% if x %}id="foo"{% else %} name {% endif %}>

      </div>`

      ,

      liquid`

      {% # Preservation edge case, structure will be preserved and liquid tokens normalized %}

      <div

      id="foo"
      data-bar

      {{ output.attr | filter: 'xxx' }}

      data-id="foo"

      {% if x  %}
      {{ attr.2 }}
      {% endif %}
      {% if x  %}data-x={{ foo }}{% else %}{{ attr.3 }}{% endif %}>

      </div>`

      ,

      // liquid`

      // {% # Preservation edge case, structure will be preserved %}

      // <div
      // data{% if x %}-foo{% else %}-bar{% endif %}={{ x }}
      // {% tag %}={% if x %}"foo"{% else %}{{ bar }}{% endif %}
      // >
      // </div>`

      // ,

      liquid`

      {% # Preservation edge case, testing a multitude of expressions %}

      <div

      aria-label={{ label }}
      class="x"
      data-attr

      {{ output.attribute }}
      {{ output.attribute | filter: 'foo' }}

      id={{ unquoted.value }}
      data-dq="{{ dq.value }}"
      data-sq='{{ sq.value }}'

      {{ attr }}="liquid-output-attr"
      {% tag %}="liquid-tag-attr"
      {% if x %}data-if{% elsif x > 0 %}data-elsif{% else %}data-else{% endif %}={{ value }}

      data-{% if x %}id="foo"{% else %}name{% endif %}>

      </div>`

      ,

      liquid`

      {% # Preservation edge case, testing a multitude of expressions (child nesting) %}

      <div id={{ no.quotes }} {{ output.attribute }}>
      <div

      id="x"
      class="xxx xxx xxx"

      {% if x == 100 %}
      data-{% if x %}{{ x }}{%- else -%}foo{%- endif %}-id="xxx"
      {% elsif x != 200 %}

      {% unless u == 'foo' and x == 'bar' %}
      data-{{ object.prop | filter }}
      {% endunless %}

      {% endif %}

      aria-x="foo"
      style="background-color: {{ bg.color }}; font-size: 20px;">

      </div>
      </div>
      `

    ]
  )(
    {
      wrap: 0,
      language: 'liquid',
      markup: {
        forceAttribute: 2
      }
    }
  )(function (source, rules, label) {

    const snapshot = esthetic.format(source, rules);

    t.snapshot(snapshot, label);

  });

});
