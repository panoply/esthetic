import test from 'ava';
import { forRules, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test.skip('Indenting attributes contained in Liquid block tags', t => {

  forRules(
    [
      liquid`

      {% # Indenting controls %}

      <div>

      <main

      class="x"
      id="indentation"

      {% if condition_1 %}
      data-a="1"
      data-b="2"
      {% else %}
      data-c="3"
      data-d="4"
      {% endif %}
      data-e="5"
      data-f="6"

      {% unless xxx %}
      data-g="7"
      data-h="8"
      {% endunless %}

      >

      Hello World

      </main>

      </div>`
      ,

      liquid`

      {% # Deeply nested indentations %}

      <div>

      <main

      class="x"
      id="indentation"

      {% if level_1 %}
      data-a="1"
      data-b="2"
      {% else %}

      data-c="3"
      data-d="4"

      {% if level_2 %}
      data-e="5"
      data-f="6"

      {% unless level_3 %}
      data-g="7"
      data-h="8"

      {% for i in level_4 %}

      data-i="{{ i }}"

      {% endfor %}

      {% endunless %}

      {% endif %}

      {% endif %}



      >

      Hello World

      </main>

      </div>`
    ]
  )(
    [
      {
        language: 'liquid',
        liquid: {
          indentAttributes: true
        },
        markup: {
          forceAttribute: true
        }
      }

    ]
  )(function (source, rules, label) {

    const snapshot = esthetic.format.sync(source, rules);

    // t.log(snapshot);

    t.snapshot(snapshot, label);

  });
});
