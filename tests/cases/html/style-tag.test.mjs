import test from 'ava';
import { forAssert, liquid, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Empty <style> tags', t => {

  forAssert(
    [

      [
        liquid`{% # Empty Style tag %}

          <style>

          </style>
        `,
        liquid`{% # Empty Style tag %}

          <style></style>

        `
      ],
      [
        liquid`{% # Empty Style tag with attributes %}

          <style data-id="some-id" data-attribute="value" id="some-id">

          </style>
        `,
        liquid`{% # Empty Style tag with attributes %}

          <style
            data-id="some-id"
            data-attribute="value"
            id="some-id"></style>

        `
      ],
      [
        liquid`{% # Multiple Empty Style tag sequences %}

          <style>     </style>

          <style>

          </style>

          <style data-attribute="value" id="some-id">



          </style>
        `,
        liquid`{% # Multiple Empty Style tag sequences %}

          <style></style>

          <style></style>

          <style
            data-attribute="value"
            id="some-id"></style>

        `
      ],
      [
        liquid`{% # Empty Style tag nested within tags %}

          <main>

          <style>


          </style>

          </main>
          <div>
          <ul>
          <li>
          <style>



          </style>
          </li>
          <li>
          <style>



          </style>
          </li>
          <li>
          <style id="some-id" data-attribute="value">



          </style>
          </li>
          <li>
          <style data-attribute="value" id="some-id" data-x="foo">



          </style>
          </li>
          </ul>
          </div>

        `,
        liquid`{% # Empty Style tag nested within tags %}

          <main>

            <style></style>

          </main>
          <div>
            <ul>
              <li>
                <style></style>
              </li>
              <li>
                <style></style>
              </li>
              <li>
                <style
                  id="some-id"
                  data-attribute="value"></style>
              </li>
              <li>
                <style
                  data-attribute="value"
                  id="some-id"
                  data-x="foo"></style>
              </li>
            </ul>
          </div>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: 2,
        ignoreJS: false,
        ignoreJSON: false
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('Structure Test: Newline Preservation and indentation levels', t => {

  forSample(
    [

      liquid`{% # Global placed scripts newline and indentation %}

        <!-- NO LINES -->
        <style>
          .class {
            color: white;
          }
        </style>

        <!-- 1 LINE TOP AND BOTTOM -->
        <style>

          .class {
            color: white;
            font-size: pink;
          }

        </style>

        <!-- 2 LINES TOP AND BOTTOM -->
        <style>


          .class {
            color: white;
            font-size: pink;
          }


        </style>

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        <style>


          .class {
            color: white;
            font-size: pink;
          }
        </style>

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        <style>
          .class {
            color: white;
            font-size: pink;
          }


        </style>

        <!-- 1 LINES TOP AND 1 LINE BOTTOM WITH JSON -->
        <style>

          .class-1 {
            color: white;
            font-size: pink;
          }

          .class-2 {
            color: white;
            font-size: pink;
          }

        </style>

      `,
      liquid`{% # Nested styles newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <style>

            .class-1 {
              color: white;
              font-size: pink;
            }

            .class-2 {
              color: white;
              font-size: pink;
            }

          </style>
        </div>

        <!-- DEEPLY NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <main>
            <div>
              <ul>
                <li>
                  <aside>
                    <style>

                      .class-1 {
                        color: white;
                        font-size: pink;
                      }

                      .class-2 {
                        color: white;
                        font-size: pink;
                      }

                    </style>
                  </aside>
                </li>
              </ul>
            </div>
          </main>
        </div>

      `
    ]
  )({
    language: 'liquid',
    style: {
      classPadding: true
    },
    markup: {
      forceAttribute: 2,
      ignoreCSS: false
    }
  })(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });
});
