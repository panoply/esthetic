import { forAssert, html } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('HTML Indentation: Implied basic structures', t => {

  forAssert(
    [

      [
        html`
        <div>
        <p>Text Inline</p>
        </div>
        `,
        html`
        <div>
          <p>Text Inline</p>
        </div>
        `
      ]
      ,
      [
        html`
        <main>
        <div>Text Inline</div>
        <p>Paragraph Inline</p>
        <section>
          Newline Indentation
        </section>
        </main>
        `,
        html`
        <main>
          <div>Text Inline</div>
          <p>Paragraph Inline</p>
          <section>
            Newline Indentation
          </section>
        </main>
        `
      ],
      [
        html`
        <main>
        <div>
        Text Indent
        </div>
        <p>
        Paragraph Indent
        </p>
        <section>
        Newline Indentation
        </section>
        </main>
        `,
        html`
        <main>
          <div>
            Text Indent
          </div>
          <p>
            Paragraph Indent
          </p>
          <section>
            Newline Indentation
          </section>
        </main>
        `
      ],
      [
        html`
        <aside>
        <div>
        Text Indent
        </div>
        <p>
        Paragraph Indent
        </p>
        <section>
          <h1>LIST ITEMS INLINE</h1>
        <ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li>Baz Inline</li>
        <li>Qux Inline</li>
        </ul>
        <h1>LIST ITEMS INDENT</h1>
        <ul>
          <li>
        Foo Indent
              </li>
          <li>
        Bar Indent
          </li>
        <li>
        Baz Indent
        </li>
        <li>
                Qux Indent
        </li>
        </ul>
        </section>
        </aside>
        `,
        html`
        <aside>
          <div>
            Text Indent
          </div>
          <p>
            Paragraph Indent
          </p>
          <section>
            <h1>LIST ITEMS INLINE</h1>
            <ul>
              <li>Foo Inline</li>
              <li>Bar Inline</li>
              <li>Baz Inline</li>
              <li>Qux Inline</li>
            </ul>
            <h1>LIST ITEMS INDENT</h1>
            <ul>
              <li>
                Foo Indent
              </li>
              <li>
                Bar Indent
              </li>
              <li>
                Baz Indent
              </li>
              <li>
                Qux Indent
              </li>
            </ul>
          </section>
        </aside>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, { language: 'html' });

    t.deepEqual(actual, expect);

  });

});

test('HTML Indentation: Nested list structures', t => {

  forAssert(
    [
      [
        html`
        <ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li>Baz Inline</li>
        <li>Qux Inline</li>
        <li><ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li>Baz Inline</li>
        <li><ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li>Baz Inline</li>
        <li><ul>
        <li>Foo Inline</li>
        <li><ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li><ul>
        <li>Foo Inline</li>
        <li>Bar Inline</li>
        <li>Baz Inline</li>
        <li>Qux Inline</li>
        </ul></li>
        <li>Qux Inline</li>
        </ul></li>
        <li>Baz Inline</li>
        <li>Qux Inline</li>
        </ul></li>
        </ul></li>
        </ul></li>
        </ul>
      `,
        html`
        <ul>
          <li>Foo Inline</li>
          <li>Bar Inline</li>
          <li>Baz Inline</li>
          <li>Qux Inline</li>
          <li><ul>
              <li>Foo Inline</li>
              <li>Bar Inline</li>
              <li>Baz Inline</li>
              <li><ul>
                  <li>Foo Inline</li>
                  <li>Bar Inline</li>
                  <li>Baz Inline</li>
                  <li><ul>
                      <li>Foo Inline</li>
                      <li><ul>
                          <li>Foo Inline</li>
                          <li>Bar Inline</li>
                          <li><ul>
                              <li>Foo Inline</li>
                              <li>Bar Inline</li>
                              <li>Baz Inline</li>
                              <li>Qux Inline</li>
                            </ul></li>
                          <li>Qux Inline</li>
                        </ul></li>
                      <li>Baz Inline</li>
                      <li>Qux Inline</li>
                    </ul></li>
                </ul></li>
            </ul></li>
        </ul>
      `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source);

    t.deepEqual(actual, expect);

  });

});

test('HTML Indentation: Implied complex structures', t => {

  forAssert(
    [
      [
        html`

        <section>
        <div>
        <p id="foo bar baz qux xxx foo bar baz xxx qux" class="xxx">
        Lorem ipsum, dolor sit amet consectet adipisicing elit. Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat! repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!
        </p>
        <main>
        <ul>
        <li>
        Hello World
        </li>
        <li></li>
        </ul>
        <div>
        <div>
        <section>

        <hr>
        <hr>
        <br>
        <br>
        <br>


        Lorem ipsum, dolor sit amet consectet adipisicing elit. Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!




        </section>
        </div>
        <div>
        <ul>
        <li></li>
        </ul>
        </div>
        </div>
        </main>
        </div>
        </section>
        `,
        html`
        <section>
          <div>
            <p id="foo bar baz qux xxx foo bar baz xxx qux" class="xxx">
              Lorem ipsum, dolor sit amet consectet adipisicing elit. Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat! repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!
            </p>
            <main>
              <ul>
                <li>
                  Hello World
                </li>
                <li></li>
              </ul>
              <div>
                <div>
                  <section>

                    <hr>
                    <hr>
                    <br>
                    <br>
                    <br>


                    Lorem ipsum, dolor sit amet consectet adipisicing elit. Facilis quasi corrupti ipsam impedit nostrum odio, nulla accusantium repellat officiis voluptate similique aut sint reiciendis totam, aliquid, voluptatum qui consequuntur placeat!


                  </section>
                </div>
                <div>
                  <ul>
                    <li></li>
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </section>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'html'
    });

    t.deepEqual(actual, expect);

  });

});
