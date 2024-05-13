import test from 'ava';
import { forAssert, html } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML Preserve Text - Free range structures', t => {

  forAssert(
    [
      [
        html`<!-- Text will not be touched -->
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
        ,
        html`<!-- Text will not be touched -->
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
      ],
      [
        html`<!-- Text will not be touched but lines will be respected -->



          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut



              labore et dolore magna aliqua.



        `
        ,
        html`<!-- Text will not be touched but lines will be respected -->


          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut



              labore et dolore magna aliqua.
        `
      ],
      [
        html`<!-- Text will not be touched -->
        Lorem
                ipsum       dolor         sit
                                                      amet      consectetur
                                                      adipiscing
                                                      elit
                               incididunt             sed do
        eiusmod
                tempor
                            incididunt ut

                                                labore et dolore magna aliqua.
        `
        ,
        html`<!-- Text will not be touched -->
        Lorem
                ipsum       dolor         sit
                                                      amet      consectetur
                                                      adipiscing
                                                      elit
                               incididunt             sed do
        eiusmod
                tempor
                            incididunt ut

                                                labore et dolore magna aliqua.
        `

      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentNewline: false,
        preserveText: true

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Preserve Text - Inside Tags with preserveLine: 0', t => {

  forAssert(
    [
      [
        html`<!-- Text will not be touched -->
        <div>
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>`
        ,
        html`<!-- Text will not be touched -->
        <div>
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>`
      ],
      [
        html`<!-- Text will not be touched but preserveLine will be respected -->
        <div>
          <section>



          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.


          <p>


          Lorem
                ipsum       dolor         sit
                                                      amet      consectetur
                                                      adipiscing
                                                      elit
                               incididunt             sed do
        eiusmod
                tempor
                            incididunt ut

                                                labore et dolore magna aliqua.


          </p>


                </section>
        </div>`
        ,
        html`<!-- Text will not be touched but preserveLine will be respected -->
        <div>
          <section>
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            <p>
          Lorem
                ipsum       dolor         sit
                                                      amet      consectetur
                                                      adipiscing
                                                      elit
                               incididunt             sed do
        eiusmod
                tempor
                            incididunt ut

                                                labore et dolore magna aliqua.
            </p>
          </section>
        </div>`
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      preserveLine: 0,
      markup: {
        commentNewline: false,
        preserveText: true

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Preserve Text - Text Content Contains Tags', t => {

  forAssert(
    [
      [
        html`<!-- Text will not be touched -->
          Lorem ipsum dolor sit amet,   <strong>consectetur</strong> adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
        ,
        html`<!-- Text will not be touched -->
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentNewline: false,
        preserveText: true

      }
    });

    t.deepEqual(actual, expect);

  });

});
