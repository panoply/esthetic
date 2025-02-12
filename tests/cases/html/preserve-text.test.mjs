import { forAssert, forRule, html } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('HTML Preserve Text - Free range structures', t => {

  forAssert(
    [
      [
        html`<!-- Text will not be touched 1 -->
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
        ,
        html`<!-- Text will not be touched 1 -->
          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
        `
      ],
      [
        html`<!-- Text will not be touched but lines will be respected 2 -->


          Lorem ipsum dolor sit amet,      consectetur adipiscing elit,   sed do
              eiusmod tempor incididunt ut



              labore et dolore magna aliqua.



        `
        ,
        html`<!-- Text will not be touched but lines will be respected 2 -->


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
      preserveLine: 3,
      markup: {
        commentNewline: false,
        preserveText: true

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Preserve Text - Nested within tags', t => {

  forAssert(
    [
      [
        html`
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
        </div>`,
        html`
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
      ],
      [
        html`
        <main>
        <div>
        <nav id="menu">
        <ul>
          <li>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
          eveniet odio, sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic?
          </li>
          <li>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
          eveniet odio, sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic?
          </li>
        </ul>
        </nav>
        </div>
        </main>
        `,
        html`
        <main>
          <div>
            <nav id="menu">
              <ul>
                <li>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
          eveniet odio, sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic?
                </li>
                <li>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Ipsum alias iste accusamus, culpa itaque nulla quisquam distinctio
          eveniet odio, sit exercitationem perferendis! Beatae nostrum non a
          labore impedit expedita hic?
                </li>
              </ul>
            </nav>
          </div>
        </main>
        `
      ]
    ]
  )(function (input, expect, label) {

    // t.log(this.size); // number of inputs
    // t.log(this.indexinput); // the index reference of input running
    // t.log(this.indexRule); // the index reference of ruleset

    const actual = esthetic.format(input, {
      language: 'html',
      preserveLine: 3,
      markup: {
        textPreserve: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
