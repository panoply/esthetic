import test from 'ava';
import { forAssert, liquid, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Empty <script> tags', t => {

  forAssert(
    [

      [
        liquid`{% # Empty Script tag %}

          <script>

          </script>
        `,
        liquid`{% # Empty Script tag %}

          <script></script>

        `
      ],
      [
        liquid`{% # Empty Script tag with attributes %}

          <script type="application/ld+json" data-src="/xxx/file.js" data-attribute="value" id="some-id">

          </script>
        `,
        liquid`{% # Empty Script tag with attributes %}

          <script
            type="application/ld+json"
            data-src="/xxx/file.js"
            data-attribute="value"
            id="some-id"></script>

        `
      ],
      [
        liquid`{% # Multiple Empty Script tag sequences %}

          <script>     </script>

          <script type="application/ld+json">

          </script>

          <script src="/xxx/file.js" data-attribute="value" id="some-id">



          </script>
        `,
        liquid`{% # Multiple Empty Script tag sequences %}

          <script></script>

          <script type="application/ld+json"></script>

          <script
            src="/xxx/file.js"
            data-attribute="value"
            id="some-id"></script>

        `
      ],
      [
        liquid`{% # Empty Script tag nested within tags %}

          <main>

          <script>


          </script>

          </main>
          <div>
          <ul>
          <li>
          <script type="application/ld+json">



          </script>
          </li>
          <li>
          <script>



          </script>
          </li>
          <li>
          <script src="/xxx/file.js" data-attribute="value">



          </script>
          </li>
          <li>
          <script src="/xxx/file.js" data-attribute="value" id="some-id" data-x="foo">



          </script>
          </li>
          </ul>
          </div>

        `,
        liquid`{% # Empty Script tag nested within tags %}

          <main>

            <script></script>

          </main>
          <div>
            <ul>
              <li>
                <script type="application/ld+json"></script>
              </li>
              <li>
                <script></script>
              </li>
              <li>
                <script
                  src="/xxx/file.js"
                  data-attribute="value"></script>
              </li>
              <li>
                <script
                  src="/xxx/file.js"
                  data-attribute="value"
                  id="some-id"
                  data-x="foo"></script>
              </li>
            </ul>
          </div>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
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
        <script>
          console.log(window.example);
        </script>

        <!-- 1 LINE TOP AND BOTTOM -->
        <script>

          console.log(window.example);

        </script>

        <!-- 2 LINES TOP AND BOTTOM -->
        <script>


          console.log(window.example);


        </script>

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        <script>


          console.log(window.example);
        </script>

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        <script>
          console.log(window.example);


        </script>

        <!-- 1 LINES TOP AND 1 LINE BOTTOM WITH JSON -->
        <script type="application/json">

          {
            "string": "value",
            "number": 1000,
            "object": {
              "array": [
                {
                  "string": "item",
                  "boolean": false,
                  "object": {
                    "number": 2000
                  }
                }
              ]
            }
          }

        </script>

      `,
      liquid`{% # Nested scripts newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <script type="application/json">

            {
              "string": "value",
              "number": 1000,
              "object": {
                "array": [
                  {
                    "string": "item",
                    "boolean": false,
                    "object": {
                      "number": 2000
                    }
                  }
                ]
              }
            }

          </script>
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
                    <script type="application/json">

                      {
                        "string": "value",
                        "number": 1000,
                        "object": {
                          "array": [
                            {
                              "string": "item",
                              "boolean": false,
                              "object": {
                                "number": 2000
                              }
                            }
                          ]
                        }
                      }

                    </script>
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
    markup: {
      forceAttribute: 2,
      ignoreJS: false,
      ignoreJSON: false
    }
  })(function (source, rules) {

    const actual = esthetic.format.sync(source, rules);

    t.deepEqual(actual, source);

  });
});
