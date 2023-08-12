import test from 'ava';
import { html, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML <script> ignoreJS Rule - Forced Structures', t => {

  forAssert(
    [
      [
        html`
        <script>console . log (

        'block 1'


        )</script>
        `
        ,
        html`
        <script>
          console . log (

          'block 1'


          )
        </script>
        `
      ],
      [
        html`
        <script>
        console . log (

        'block 2'
        )</script>
        `
        ,
        html`
        <script>
          console . log (

          'block 2'
          )
        </script>
        `
      ],
      [
        html`
        <script>console . log (   'block 3' )</script>
        `
        ,
        html`
        <script>
          console . log (   'block 3' )
        </script>
        `
      ],
      [
        html`
        <div>
        <main>
          <script>console . log (

          'block 4'


          )</script>
        </main>
        </div>
        `
        ,
        html`
        <div>
          <main>
            <script>
              console . log (

                'block 4'


                )
            </script>
          </main>
        </div>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreJS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <script> ignoreJS Rule - Forced when inline', t => {

  forAssert([
    [
      html`<!-- Inline script ignore will be forced -->
      <script>
        console.log(   'content is ignored 1'    );
      </script>
      `
      ,
      html`<!-- Inline script ignore will be forced -->
      <script>
        console.log(   'content is ignored 1'    );
      </script>
      `
    ],
    [
      html`<!-- Inline start and forced end will both be forced -->
      <script>
        console.log(   'content is ignored 2'    );
      </script>
      `
      ,
      html`<!-- Inline start and forced end will both be forced -->
      <script>
        console.log(   'content is ignored 2'    );
      </script>
      `
    ],
    [
      html`<!-- Forced start and inline end will be forced with indentation -->
      <script>
      console.log(   'content is ignored 3'    );</script>
      `
      ,
      html`<!-- Forced start and inline end will be forced with indentation -->
      <script>
        console.log(   'content is ignored 3'    );
      </script>
      `
    ],
    [
      html`<!-- Global placed scripts newline and indentation -->

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
      `
      ,
      html`<!-- Global placed scripts newline and indentation -->

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
      `
    ]
  ])(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreJS: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML <script> ignoreJS Rule - Handle attributes, forcing when inline', t => {

  forAssert(
    [
      [
        html`<!-- Inline script ignore will be forced also attributes -->
        <script data-id="foo" id="bar">console.log(   'content is ignored 1'    );</script>
        `
        ,
        html`<!-- Inline script ignore will be forced also attributes -->
        <script
          data-id="foo"
          id="bar">
          console.log(   'content is ignored 1'    );
        </script>
        `
      ],
      [
        html`<!-- Chaotic Inline script attributes will be forced -->
        <script data-id="foo" data-long-attribute-something = "quux"
          id="bar">console.log(   'content is ignored'    );
        </script>
        `
        ,
        html`<!-- Chaotic Inline script attributes will be forced -->
        <script
          data-id="foo"
          data-long-attribute-something="quux"
          id="bar">
          console.log(   'content is ignored'    );
        </script>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreJS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <script> ignoreJS Rule - Different structures, newlines and nesting', t => {

  forAssert([
    [
      html`<!-- Script tag newline occurances -->

        <script data-src="/xxx/file.js"
          data-attribute="value"
          id="some-id">

          function  () {

                console . log (   'newlines above and below are preserved'  )
          }

        </script>
      `
      ,
      html`<!-- Script tag newline occurances -->

      <script
        data-src="/xxx/file.js"
        data-attribute="value"
        id="some-id">

        function  () {

              console . log (   'newlines above and below are preserved'  )
        }

      </script>
    `
    ],
    [
      html`<!-- Script tag ignored but with indentation respected -->
      <body>
      <main>
      <div>
      <script
        data-src="/xxx/file.js"
        data-attribute="value"
        id="some-id">

          function  () {

              console . log (   'content is ignored and leading space persists'  )
          }

              const foo    =   'foo'

      </script>
      </div>
      </main>
      </body>
      `
      ,
      html`<!-- Script tag ignored but with indentation respected -->
      <body>
        <main>
          <div>
            <script
              data-src="/xxx/file.js"
              data-attribute="value"
              id="some-id">

                  function  () {

              console . log (   'content is ignored and leading space persists'  )
                  }

              const foo    =   'foo'

            </script>
          </div>
        </main>
      </body>
      `
    ],
    [
      html`<!-- Script tag ignored but with indentation respected -->
      <body>
      <main>
      <div>
      <script
      data-src="/xxx/file.js"
      data-attribute="value"
      id="some-id">

                  function  () {

                        console . log (   'content is ignored'  )
                  }

                        const foo    =   'foo'
      const bar    =   'foo'
      </script>
      </div>
      </main>
      </body>
      `
      ,
      html`<!-- Script tag ignored but with indentation respected -->
      <body>
        <main>
          <div>
            <script
              data-src="/xxx/file.js"
              data-attribute="value"
              id="some-id">

                  function  () {

                        console . log (   'content is ignored'  )
                  }

                        const foo    =   'foo'
              const bar    =   'foo'
            </script>
          </div>
        </main>
      </body>
      `
    ]
  ])(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreJS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <script> ignoreJSON Rule - Preserve JSON but format JavaScript', t => {

  forAssert([
    [
      html`<!-- Script tag will format but JSON will be excluded -->

      <script data-attribute="javascript" id="some-id">

        function  () {

              console . log (   'THIS REGION WILL FORMAT'  )
        }

      </script>

      <script type="application/json">

      {
        "string":                              "THIS REGION WILL BE IGNORED",
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
      `
      ,
      html`<!-- Script tag will format but JSON will be excluded -->

      <script
        data-attribute="javascript"
        id="some-id">

        function() {

          console.log('THIS REGION WILL FORMAT')
        }

      </script>

      <script
        type="application/json">

        {
        "string":                              "THIS REGION WILL BE IGNORED",
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
      `
    ]
  ])(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreJS: false,
        ignoreJSON: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <script> ignoreJSON Rule - Preserve JS but format JSON', t => {

  forAssert([
    [
      html`<!-- Script tag will format but JSON will be excluded -->

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

      <script>

      function () {
              return foo                 }

      </script>
      `
      ,
      html`<!-- Script tag will format but JSON will be excluded -->

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

      <script>

        function () {
              return foo                 }

      </script>
      `
    ]
  ])(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: false,
        ignoreJS: true,
        ignoreJSON: false
      }
    });

    t.deepEqual(actual, expect);

  });

});
