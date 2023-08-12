import test from 'ava';
import { html, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('HTML Comment Delimiters (no newlines) - Preserve option', t => {

  forAssert(
    [
      [
        html`
        <!-- Lorem ipsum dolor sit amet -->
        `
        ,
        html`
        <!-- Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!--
          Force Start - Lorem ipsum dolor sit amet -->
        `
        ,
        html`
        <!--
          Force Start - Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!--
          Force Start + End - Lorem ipsum dolor sit amet
        -->
        `
        ,
        html`
        <!--
          Force Start + End - Lorem ipsum dolor sit amet
        -->
        `
      ],
      [
        html`
        <!-- Force End - Lorem ipsum dolor sit amet
        -->
        `
        ,
        html`
        <!-- Force End - Lorem ipsum dolor sit amet
        -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'preserve',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (no newlines) - Force option', t => {

  forAssert(
    [
      [
        html`
        <!-- Lorem ipsum dolor sit amet -->
        `
        ,
        html`
        <!--
          Lorem ipsum dolor sit amet
        -->
        `
      ],
      [
        html`
        <!--
          Force Start - Lorem ipsum dolor sit amet -->
        `
        ,
        html`
        <!--
          Force Start - Lorem ipsum dolor sit amet
        -->
        `
      ],
      [
        html`
        <!-- Force Start + End - Lorem ipsum dolor sit amet
        -->
        `
        ,
        html`
        <!--
          Force Start + End - Lorem ipsum dolor sit amet
        -->
        `
      ],
      [
        html`
        <!--
          Force End - Lorem ipsum dolor sit amet
        -->
        `
        ,
        html`
        <!--
          Force End - Lorem ipsum dolor sit amet
        -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'force',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (no newlines) - Inline option', t => {

  forAssert(
    [
      [
        html`
        <!--
          Lorem ipsum dolor sit amet -->
        `,
        html`
        <!-- Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!--
          Force Start - Lorem ipsum dolor sit amet
        -->
        `,
        html`
        <!-- Force Start - Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!-- Force Start + End - Lorem ipsum dolor sit amet
        -->
        `,
        html`
        <!-- Force Start + End - Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!-- Inlined - Lorem ipsum dolor sit amet -->
        `,
        html`
        <!-- Inlined - Lorem ipsum dolor sit amet -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'inline',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (no newlines) - Consistent option', t => {

  forAssert(
    [
      [
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet -->
        `,
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet
        -->
        `
      ],
      [
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet
        -->
        `,
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!-- Will Inline + End - Lorem ipsum dolor sit amet -->
        `,
        html`
        <!-- Will Inline + End - Lorem ipsum dolor sit amet -->
        `
      ],
      [
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet
        -->
        `,
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet
        -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'consistent',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (multiline) - Consistent option', t => {

  forAssert(
    [
      [
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `,
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ],
      [
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `,
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `
      ],
      [
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `,
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `
      ],
      [
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `,
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'consistent',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (multiline) - Force option', t => {

  forAssert(
    [
      [
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `,
        html`
        <!--
          Will Force - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ],
      [
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `,
        html`
        <!--
          Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ],
      [
        html`
        <!-- Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `,
        html`
        <!--
          Will Inline - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ],
      [
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `,
        html`
        <!--
          Forced - Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'force',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('HTML Comment Delimiters (multiline) - Inline Align option', t => {

  forAssert(
    [
      [
        html`
        <!--
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. -->
        `,
        html`
        <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit,
             sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. -->
        `
      ],
      [
        html`
        <!--
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        -->
        `,
        html`
        <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit,
             sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
             Lorem ipsum dolor sit amet,
             consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. -->
        `
      ]

    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      markup: {
        commentDelimiters: 'inline-align',
        commentNewline: false
      }
    });

    t.deepEqual(actual, expect);

  });

});
