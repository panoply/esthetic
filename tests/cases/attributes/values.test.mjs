import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Attribute Values: Preserving value contents', t => {

  forAssert(
    [
      [
        liquid`
        <div id="
          foo
        "></div>
        `,
        liquid`
        <div id="
          foo
        "></div>
        `
      ],
      [
        liquid`
        <div class="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus culpa itaque nulla quisquam distinctio
          eveniet odio sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic"></div>
        `,
        liquid`
        <div class="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
          eveniet odio, sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic"></div>
        `
      ],
      [
        liquid`
        <div class="
                                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
                                      eveniet odio, sit exercitationem perferendis!


                                      Beatae nostrum non a
          labore impedit expedita hic


        "></div>
        `,
        liquid`
        <div class="
                                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
                                      eveniet odio, sit exercitationem perferendis!


                                      Beatae nostrum non a
          labore impedit expedita hic


        "></div>
        `
      ],
      [
        liquid`
        <div id="foo" {% if condition %}data-id="xx"{% endif %} class="foo bar baz"></div>
        `,
        liquid`
        <div
          id="foo"
          {% if condition %}
          data-id="xx"
          {% endif %}
          class="foo bar baz"></div>
        `
      ],
      [
        liquid`
        <div id="foo" {{ object.prop }} class="foo bar baz">
          <div id="foo"
            {% if condition %}
            data-id="xx"
            {% endif %}class="foo bar baz"></div>
        </div>
        `,
        liquid`
        <div
          id="foo"
          {{ object.prop }}
          class="foo bar baz">
          <div
            id="foo"
            {% if condition %}
            data-id="xx"
            {% endif %}
            class="foo bar baz"></div>
        </div>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Limit Attribute Force: Forcing attributes onto newlines when limit is exceeded', t => {

  forAssert(
    [
      [
        liquid`
        <div id="foo" class="foo bar baz"></div>
        `,
        liquid`
        <div id="foo" class="foo bar baz"></div>
        `
      ],
      [
        liquid`
        <div
          id="foo"
          data-id="xx"
          class="foo bar baz"></div>
        `,
        liquid`
        <div id="foo" data-id="xx" class="foo bar baz"></div>
        `
      ],
      [
        liquid`
        <div id="foo" {% if condition %}data-id="xx"{% endif %} class="foo bar baz"></div>
        `,
        liquid`
        <div
          id="foo"
          {% if condition %}
          data-id="xx"
          {% endif %} class="foo bar baz"></div>
        `
      ],
      [
        liquid`
        <div id="foo" {{ object.prop }} class="foo bar baz">
          <div id="foo" {% if condition %}data-id="xx"{% endif %}class="foo bar baz"></div>
        </div>
        `,
        liquid`
        <div id="foo" {{ object.prop }} class="foo bar baz">
          <div
            id="foo"
            {% if condition %}
            data-id="xx"
            {% endif %} class="foo bar baz"></div>
        </div>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        indentAttribute: true
      },
      markup: {
        forceAttribute: 4
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Wrap Attribute Force: Forcing attributes in accordance with wrap limit', t => {

  forAssert(
    [
      [
        liquid`

          {% # Indenting controls %}

          <div>

          <main

          class="x"
          id="indentation"
          data-a="1"
          data-b="2"
          data-c="3"
          data-d="4"

          >

          Hello World

          </main>

          </div>
        `
        ,

        liquid`

          {% # Indenting controls %}

          <div>

            <main class="x" id="indentation" data-a="1" data-b="2" data-c="3" data-d="4">

              Hello World

            </main>

          </div>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: false
      }
    });

    t.deepEqual(actual, expect);

  });

});
