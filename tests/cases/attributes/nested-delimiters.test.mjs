import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Liquid delimiter handling', t => {

  forAssert(
    [
      [
        liquid`
        <div

        data-a="a > b"
        data-b="c < d"
        data-c="e f > g < h"
        data-d="j < k > l"

        >

        </div>
        `
        ,
        liquid`
        <div
          data-a="a > b"
          data-b="c < d"
          data-c="e f > g < h"
          data-d="j < k > l"></div>
        `
      ],
      [
        liquid`
        <div

        {% if a > b %} data-a {% endif %}
        {% if c < d %} data-b {% endif %}
        {% unless e > f and g < h %} data-c="a > b" {% elsif i > j %} data-d="a > b"{% endunless %}
        {% if  < k and l > m %}
        {{ output_1 | filter: '>' | filter: '<' }}
        {% else %}
        {{ output_2 | filter: '<' | filter: '>' }}
        {% endif %}

        >

        </div>
        `
        ,

        liquid`
        <div
          {% if a > b %}
            data-a
          {% endif %}
          {% if c < d %}
            data-b
          {% endif %}
          {% unless e > f and g < h %}
            data-c="a > b"
          {% elsif i > j %}
            data-d="a > b"
          {% endunless %}
          {% if < k and l > m %}
            {{ output_1 | filter: '>' | filter: '<' }}
          {% else %}
            {{ output_2 | filter: '<' | filter: '>' }}
          {% endif %}>

        </div>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        attributeLineBreak: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
