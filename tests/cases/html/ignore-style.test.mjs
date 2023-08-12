import test from 'ava';
import { html, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML <style> ignoreCSS Rule - Forced Structures', t => {

  forAssert(
    [
      [
        html`
        <style>.class-1 {
          color: white;
          font-size: pink;
        }

        .class-2 {
          color: white;
          font-size: pink;
        }</style>
        `
        ,
        html`
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
        `
      ],
      [
        html`
        <style>
        .class-1 {
          color: white;
          font-size: pink;
        }

        .class-2 {
          color: white;
          font-size: pink;
        }</style>
        `
        ,
        html`
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
        `
      ],
      [
        html`
        <style>.class { color: pink; }</style>
        `
        ,
        html`
        <style>
          .class { color: pink; }
        </style>
        `
      ],
      [
        html`
        <div>
        <main>
          <style>.class {
            color: pink;
          }</style>
        </main>
        </div>
        `
        ,
        html`
        <div>
          <main>
            <style>
              .class {
                  color: pink;
                }
            </style>
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
        ignoreJS: true,
        ignoreCSS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <style> ignoreCSS Rule - Forced when inline', t => {

  forAssert([
    [
      html`<!-- Inline style ignore will be forced -->
      <style>
      .class {     color:   pink;        }
      </style>
      `
      ,
      html`<!-- Inline style ignore will be forced -->
      <style>
        .class {     color:   pink;        }
      </style>
      `
    ],
    [
      html`<!-- Forced start and inline end will be forced with indentation -->
      <style>
      .class {     color:   pink;        }</style>
      `
      ,
      html`<!-- Forced start and inline end will be forced with indentation -->
      <style>
        .class {     color:   pink;        }
      </style>
      `
    ],
    [
      html`<!-- Global placed scripts newline and indentation -->

        <!-- NO LINES -->
        <style>
          .class {     color:   pink;        }
        </style>

        <!-- 1 LINE TOP AND BOTTOM -->
        <style>

          .class {     color:   pink;        }

        </style>

        <!-- 2 LINES TOP AND BOTTOM -->
        <style>


          .class {     color:   pink;        }


        </style>

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        <style>


          .class {     color:   pink;        }
        </style>

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        <style>
          .class {     color:   pink;        }


        </style>
      `
      ,
      html`<!-- Global placed scripts newline and indentation -->

        <!-- NO LINES -->
        <style>
          .class {     color:   pink;        }
        </style>

        <!-- 1 LINE TOP AND BOTTOM -->
        <style>

          .class {     color:   pink;        }

        </style>

        <!-- 2 LINES TOP AND BOTTOM -->
        <style>


          .class {     color:   pink;        }


        </style>

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        <style>


          .class {     color:   pink;        }
        </style>

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        <style>
          .class {     color:   pink;        }


        </style>
      `
    ]
  ])(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreCSS: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML <style> ignoreCSS Rule - Handle attributes, forcing when inline', t => {

  forAssert(
    [
      [
        html`<!-- Inline style ignore will be forced also attributes -->
        <style data-id="foo" id="bar">.class {     color:   pink;        }</style>
        `
        ,
        html`<!-- Inline style ignore will be forced also attributes -->
        <style
          data-id="foo"
          id="bar">
          .class {     color:   pink;        }
        </style>
        `
      ],
      [
        html`<!-- Chaotic Inline style attributes will be forced -->
        <style data-id="foo" data-long-attribute-something = "quux"
          id="bar">.class {     color:   pink;        }
        </style>
        `
        ,
        html`<!-- Chaotic Inline style attributes will be forced -->
        <style
          data-id="foo"
          data-long-attribute-something="quux"
          id="bar">
          .class {     color:   pink;        }
        </style>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      indentSize: 2,
      markup: {
        forceAttribute: true,
        ignoreCSS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('HTML <style> ignoreCSS Rule - Different structures, newlines and nesting', t => {

  forAssert([
    [
      html`<!-- style tag newline occurances -->

        <style data-src="/xxx/file.js"
          data-attribute="value"
          id="some-id">

          .class-2 {  color: white;       }

        </style>
      `
      ,
      html`<!-- style tag newline occurances -->

      <style
        data-src="/xxx/file.js"
        data-attribute="value"
        id="some-id">

        .class-2 {  color: white;       }

      </style>
    `
    ],
    [
      html`<!-- style tag ignored but with indentation respected -->
      <body>
      <main>
      <div>
      <style
        data-src="/xxx/file.js"
        data-attribute="value"
        id="some-id">

        .class-2 {  color: white;       }

      </style>
      </div>
      </main>
      </body>
      `
      ,
      html`<!-- style tag ignored but with indentation respected -->
      <body>
        <main>
          <div>
            <style
              data-src="/xxx/file.js"
              data-attribute="value"
              id="some-id">

                .class-2 {  color: white;       }

            </style>
          </div>
        </main>
      </body>
      `
    ],
    [
      html`<!-- style tag ignored but with indentation respected -->
      <body>
      <main>
      <div>
      <style
      data-src="/xxx/file.js"
      data-attribute="value"
      id="some-id">

            .class-2 {  color: white;       }

      </style>
      </div>
      </main>
      </body>
      `
      ,
      html`<!-- style tag ignored but with indentation respected -->
      <body>
        <main>
          <div>
            <style
              data-src="/xxx/file.js"
              data-attribute="value"
              id="some-id">

                    .class-2 {  color: white;       }

            </style>
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
        ignoreCSS: true
      }
    });

    t.deepEqual(actual, expect);

  });
});
