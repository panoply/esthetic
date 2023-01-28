import test from 'ava';
import { forRule, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Quote conversion within values', t => {

  forRule(
    [
      liquid`

      {% # single quotation "'" characters nesting in HTML attribute values. %}

      <div

      id="{{ 'single' | single: 'double' }}"
      class="{% if 'single' %} {{ x | filter: 'quotes' }} {% endif %}"

      >

      </div>`
      ,
      liquid`

      {% # double quotation '"' characters nesting in HTML attribute values %}

      <div

      id="{{ "double" | double: "double" }}"
      class="{% if "double" %} {{ x | filter: "double" }} {% endif %}"

      >

      </div>`
      ,
      liquid`

      {% # mixture of double and single quotations nesting in HTML attribute values %}

      <div

      id='{{ "double" | single: 'single' | double: "quotes" }}'
      class="{% if 'single' %} {{ "double" | filter: 'single' }} {% endif %}"

      >

      </div>

      `
    ]
  )(
    [
      {
        language: 'liquid',
        markup: { quoteConvert: 'none' }
      },
      {
        language: 'liquid',
        markup: { quoteConvert: 'double' }
      },
      {
        language: 'liquid',
        markup: { quoteConvert: 'single' }
      },
      {
        language: 'liquid',
        markup: { quoteConvert: 'none' }
      }
    ]
  )(function (source, rules, label) {

    const snapshot = esthetic.format.sync(source, rules);

    t.snapshot(snapshot, label);

  });

});
