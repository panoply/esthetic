import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Sorting alphabetically', t => {

  forAssert(
    [
      [
        liquid`{% # Sorting attributes alphabetically %}

          <main

          id="three"
          class="one"
          data-a="two"

          >

          <div

          data-g="seven"
          data-c="three"
          data-b="two"
          data-d="four"
          data-e="five"
          data-f="six"
          data-a="one"
          id="last"
          class="first"

          >

          </div>

          </main>

        `,

        liquid`{% # Sorting attributes alphabetically %}

          <main
            class="one"
            data-a="two"
            id="three">

            <div
              class="first"
              data-a="one"
              data-b="two"
              data-c="three"
              data-d="four"
              data-e="five"
              data-f="six"
              data-g="seven"
              id="last"></div>

          </main>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: true,
        attributeSort: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Sorting with newline preservation', t => {

  forAssert(
    [
      [
        liquid`{% # Sorting attributes with newline preservation %}

          <!-- THE ATTRIBUTES VALUES INDICATE THE LINES BEING PRESERVED -->

          <main

          id="1"

          class="2"


          data-b="0"
          data-a="0"

          >

          <div

          data-c="3"



          data-b="2"


          data-d="0"
          data-e="1"

          data-f="0"
          data-a="1"

          id="0"

          >

          </div>

          </main>

        `,
        liquid`{% # Sorting attributes with newline preservation %}

          <!-- THE ATTRIBUTES VALUES INDICATE THE LINES BEING PRESERVED -->

          <main
            class="2"
            data-a="0"

            data-b="0"
            id="1">

            <div
              data-a="1"


              data-b="2"

              data-c="3"
              data-d="0"
              data-e="1"
              data-f="0"
              id="0"></div>

          </main>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      preserveLine: 3,
      markup: {
        forceAttribute: true,
        attributeSort: true,
        stripAttributeLines: false

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Sorting using sort list', t => {

  forAssert(
    [
      [
        liquid`{% # Sorting attributes with sort list%}

          <ul>

          <li

          class="third"
          data-d="seventh"
          data-e="second"
          data-b="first"
          data-a="fourth"
          data-c="sixth"
          data-b="fifth"

          >

          </li>

          <li

          class="third {{ will.sort }}"
          data-a="fourth"
          id="second"
          data-c="fifth"
          data-b="first"

          >

          </li>

          </ul>
        `,
        liquid`{% # Sorting attributes with sort list%}

          <ul>

            <li
              data-b="first"
              data-e="second"
              class="third"
              data-a="fourth"
              data-b="fifth"
              data-c="sixth"
              data-d="seventh"></li>

            <li
              data-b="first"
              id="second"
              class="third {{ will.sort }}"
              data-a="fourth"
              data-c="fifth"></li>

          </ul>
          `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: true,
        attributeSort: [
          'data-b',
          'id',
          'data-e',
          'class',
          'data-a'
        ]
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('Sorting excluded when Liquid attributes', t => {

  forAssert(
    [
      [
        liquid`<div data-a="1" data-b="2" class="3" id="4" {{ will.sort }}></div>`,
        liquid`<div class="3" data-a="1" data-b="2" id="4" {{ will.sort }}></div>`
      ],
      [
        liquid`<div data-z="1" {% if x %} {{ no.sort }} {% endif %} class="3" id="4"></div>`,
        liquid`<div data-z="1" {% if x %} {{ no.sort }} {% endif %} class="3" id="4"></div>`
      ],
      [
        liquid`<div data-z="1" data-b="2" class="3" id={{ will.sort }}></div>`,
        liquid`<div class="3" data-b="2" data-z="1" id={{ will.sort }}></div>`
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      markup: {
        forceAttribute: false,
        attributeSort: true
      }
    });

    t.deepEqual(actual, expect);

  });
});
