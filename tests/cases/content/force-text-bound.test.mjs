import test from 'ava';
import { forAssert, html } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Text content force structure rulesets', t => {

  forAssert([
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
      `,
      html`
      hello world lorem ipsum
      <div id="r"class="v">
        bar
        <span id="c"class="d">
          baz hello world
        </span>
        lorem ipsum
        <div id="a"class="b">
          yoo
        </div>
        qux
      </div>
      qux
      <div id="r"class="v">
        hello
      </div>

      foo
      <span>
        bar
      </span>
      baz
      <header>
        <h1>
          Hello World
        </h1>
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
        textBoundInline: false,
        forceIndent: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
