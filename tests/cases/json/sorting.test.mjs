import test from 'ava';
import { forAssert, json } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Sorting object properties alphabetically', t => {

  forAssert(
    [
      [
        json`
          {
            "r": "eighteen",
            "o": "fifteen",
            "c": "three",
            "s": "nineteen",
            "a": "one",
            "f": "six",
            "4": "d",
            "g": "seven",
            "h": "eight",
            "8": "h",
            "j": "ten",
            "k": "eleven",
            "6": "f",
            "l": "twelve",
            "y": "twenty-five",
            "m": "thirteen",
            "2": "b",
            "w": "twenty-three",
            "p": "sixteen",
            "x": "twenty-four",
            "q": "seventeen",
            "9": "i",
            "e": "five",
            "v": "twenty-two",
            "d": "four",
            "n": "fourteen",
            "z": "twenty-six",
            "1": "a",
            "u": "twenty-one",
            "3": "c",
            "5": "e",
            "b": "two",
            "7": "g",
            "i": "nine",
            "t": "twenty",
          }
        `,
        json`
          {
            "1": "a",
            "2": "b",
            "3": "c",
            "4": "d",
            "5": "e",
            "6": "f",
            "7": "g",
            "8": "h",
            "9": "i",
            "a": "one",
            "b": "two",
            "c": "three",
            "d": "four",
            "e": "five",
            "f": "six",
            "g": "seven",
            "h": "eight",
            "i": "nine",
            "j": "ten",
            "k": "eleven",
            "l": "twelve",
            "m": "thirteen",
            "n": "fourteen",
            "o": "fifteen",
            "p": "sixteen",
            "q": "seventeen",
            "r": "eighteen",
            "s": "nineteen",
            "t": "twenty",
            "u": "twenty-one",
            "v": "twenty-two",
            "w": "twenty-three",
            "x": "twenty-four",
            "y": "twenty-five",
            "z": "twenty-six"
          }
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.json.sync(source, {
      preserveLine: 0,
      json: {
        objectSort: true,
        arrayFormat: 'indent',
        bracePadding: false,
        objectIndent: 'indent',
        braceAllman: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
