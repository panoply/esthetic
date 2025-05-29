import { forAssert, forRule, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Escaped quotes within', t => {

  forAssert([
    [
      liquid`
      <div
        id="\"foo\""
        class="hello \" world"
        data-sq='"foo" "bar"'></div>
      `,
      liquid`
      <div
        id="\"foo\""
        class="hello \" world"
        data-sq='"foo" "bar"'></div>
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      attributeLineBreak: true
    });

    t.deepEqual(actual, expect);

  });

});
