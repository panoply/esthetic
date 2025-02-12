import { forAssert, html } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('HTML Force Indent: Nested ul > li structures', t => {

  forAssert([
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
      `
      ,
      html`
      <ul>
        <li>
          Foo Inline
        </li>
        <li>
          Bar Inline
        </li>
        <li>
          Baz Inline
        </li>
        <li>
          Qux Inline
        </li>
        <li>
          <ul>
            <li>
              Foo Inline
            </li>
            <li>
              Bar Inline
            </li>
            <li>
              Baz Inline
            </li>
            <li>
              <ul>
                <li>
                  Foo Inline
                </li>
                <li>
                  Bar Inline
                </li>
                <li>
                  Baz Inline
                </li>
                <li>
                  <ul>
                    <li>
                      Foo Inline
                    </li>
                    <li>
                      <ul>
                        <li>
                          Foo Inline
                        </li>
                        <li>
                          Bar Inline
                        </li>
                        <li>
                          <ul>
                            <li>
                              Foo Inline
                            </li>
                            <li>
                              Bar Inline
                            </li>
                            <li>
                              Baz Inline
                            </li>
                            <li>
                              Qux Inline
                            </li>
                          </ul>
                        </li>
                        <li>
                          Qux Inline
                        </li>
                      </ul>
                    </li>
                    <li>
                      Baz Inline
                    </li>
                    <li>
                      Qux Inline
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'html',
      markup: {
        forceIndent: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
