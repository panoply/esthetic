import test from 'ava';
import { forSample, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid delimiter handling', t => {

  forSample(
    [
      liquid`

      {% # Testing HTML tag delimiter characters ">" and "<" within HTML attribute values. %}

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

      {% # Testing Liquid token containing HTML tag delimiter characters ">" and "<" within attribute values %}

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

      {% # Testing Liquid tokens as attributes and containing HTML tag delimiter characters ">" and "<" %}

      <div

      {% if a > b %} data-a {% endif %}
      {% if c < d %} data-b {% endif %}
      {% unless e > f and g < h %}data-c="a > b"{% elsif i > j %}data-d="a > b"{% endunless %}
      {% if < k and l > m %}
      {{ output_1 | filter: '>' | filter: '<' }}
      {% else %}
      {{ output_2 | filter: '<' | filter: '>' }}
      {% endif %}

      >

      </div>

      `
    ]
  )(
    {
      language: 'liquid',
      liquid: {
        normalizeSpacing: true
      },
      markup: {
        forceAttribute: true
      }
    }
  )(function (source, rules, label) {

    const snapshot = esthetic.format.sync(source, rules);

    //  console.log(snapshot);
    t.snapshot(snapshot, label);

  });

});
