import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Wrap Test - Plain text structure ', t => {

  forAssert(
    [
      [
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98 100
        `,
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . .
        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50
        53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98
        100
        `
      ],
      [
        liquid`
            . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
            2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98 100
        `,
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . .
        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50
        53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98
        100
        `
      ],
      [
        liquid`
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
          2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98 100
        `,
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . .
        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50
        53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98
        100
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      wrap: 50,
      preserveLine: 2,
      markup: {
        stripTextWrapLines: false
      }
    });

    // The beautified result must match index[1] in the
    // samples array list.
    t.deepEqual(actual, expect);

  });

});

test('Wrap Test - Plain text structure respect newlines', t => {

  forAssert(
    [
      [
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50 53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98 100
        `,
        liquid`
        . . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . . .


        2 4 6 8 11 14 17 20 23 26 29 32 35 38 41 44 47 50
        53 56 59 62 65 68 71 74 77 80 83 86 89 92 95 98
        100
        `
      ]

    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      wrap: 50,
      preserveLine: 2,
      markup: {
        stripTextWrapLines: false
      }
    });

    // The beautified result must match index[1] in the
    // samples array list.
    t.deepEqual(actual, expect);

  });

});
