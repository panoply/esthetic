import test from 'ava';
import { forAssert, html } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Ending text content following tag structure', t => {

  forAssert([
    [
      html`
      <!-- preserve the provided structure but eliminate space before "xxx" -->
      <div> bar </div> baz
      <div> bar</div> baz
      <div>bar </div>    xxx
      `
      ,
      html`
      <!-- preserve the provided structure but eliminate space before "xxx" -->
     <div> bar </div> baz
     <div> bar</div> baz
     <div>bar </div> baz
      `
    ],
    [
      html`
      <!-- force onto newline because "bar" has linebreak -->
      <div id="a"class="b">
        bar</div> qux
      `
      ,
      html`
      <!-- force onto newline because "bar" has linebreak -->
      <div id="a" class="b">
        bar
      </div> qux
      `
    ],
    [
      html`
      <!--
        force tag onto newline because attributes have linebreak
        but inline content of the tag as no leading newline at ">bar"
      -->
      <div
      id="a"class="b">bar
      </div> qux
      `
      ,
      html`
      <!--
        force tag onto newline because attributes have linebreak
        but inline content of the tag as no leading newline at ">bar"
      -->
      <div
        id="a"
        class="b">bar</div> qux
      `
    ],
    [
      html`
      <!-- preserve attributes but force child text content onto newline -->
      <div id="a"class="b">
        bar</div> qux
      `
      ,
      html`
      <!-- preserve attributes but force child text content onto newline -->
      <div id="a" class="b">
        bar
      </div> qux
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'html',
      markup: {
        forceIndent: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Tag surrounded with text content', t => {

  forAssert([
    [
      html`
      <!-- preserve the provided structure but eliminate space before "qux" -->
      foo <div> bar </div> baz
      foo <div> bar</div> baz
      foo <div>bar </div>    qux
      `
      ,
      html`
      <!-- preserve the provided structure but eliminate space before "qux" -->
      foo <div> bar </div> baz
      foo <div> bar</div> baz
      foo <div>bar </div> qux
      `
    ],
    [
      html`
      <!-- force onto newline because "bar" has linebreak -->
      hello world lorem ipsum <div id="a"class="b">
        bar</div> qux
      `
      ,
      html`
      <!-- force onto newline because "bar" has linebreak -->
      hello world lorem ipsum
      <div id="a" class="b">
        bar
      </div> qux
      `
    ],
    [
      html`
      <!--
        force tag onto newline because attributes have linebreak
        but inline content of the tag as no leading newline at ">bar"
      -->
      hello world lorem ipsum <div
      id="a"class="b">bar
      </div> qux
      `
      ,
      html`
      <!--
        force tag onto newline because attributes have linebreak
        but inline content of the tag as no leading newline at ">bar"
      -->
      hello world lorem ipsum
      <div
        id="a"
        class="b">bar</div> qux
      `
    ],
    [
      html`
      <!-- preserve attributes but force tag and tag content onto newline -->
      hello world lorem ipsum <div id="a"class="b">
      bar</div> qux
      `
      ,
      html`
      <!-- preserve attributes but force tag and tag content onto newline -->
      hello world lorem ipsum
      <div id="a" class="b">
        bar
      </div> qux
      `
    ],
    [
      html`
      hello world lorem ipsum
      <div id="r"class="v">
      bar <span id="c"class="d"> baz hello world</span> lorem ipsum <div id="a"class="b">yoo </div> qux
      </div>
      qux <div
      id="r"class="v">
      hello
      </div>

      foo <span> bar </span> baz
      <header>
      <h1>Hello World</h1>
      <p>
        A newline will be inserted at the bottom of this sample
      </p>
      </header>
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'html',
      markup: {
        forceIndent: false,
        textBoundInline: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
