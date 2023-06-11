import test from 'ava';
import { liquid, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid comment indentation with commentNewline disabled', t => {

  forAssert(
    [
      [
        liquid`
          <div>
          {% comment %}
          Lorem ipsum dolor sit amet {% endcomment %}
          </div>
        `,
        liquid`
        <div>
          {% comment %}
            Lorem ipsum dolor sit amet
          {% endcomment %}
        </div>
      `
      ],
      [
        liquid`
          <div>
          {% comment %}
        Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor
         incididunt ut labore et dolore magna aliqua.
          {% endcomment %}
          </div>
        `,
        liquid`
        <div>
          {% comment %}
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          {% endcomment %}
        </div>
      `
      ],
      [
        liquid`
        <h1>
          SKIP INDENTATION BECAUSE CONTENT IS INLINE
        </h1>
        <div>
          {% comment %} Lorem ipsum dolor sit amet, sed do eiusmod tempor {% endcomment %}
        </div>
        `,
        liquid`
        <h1>
          SKIP INDENTATION BECAUSE CONTENT IS INLINE
        </h1>
        <div>
          {% comment %} Lorem ipsum dolor sit amet, sed do eiusmod tempor {% endcomment %}
        </div>
      `
      ],
      [
        liquid`
          <div>
            <ul>
          <li>
            {% # Lorem ipsum dolor sit amet, sed do eiusmod %}</li></ul>
          </div>
        `,
        liquid`
        <div>
          <ul>
            <li>
              {% # Lorem ipsum dolor sit amet, sed do eiusmod %}
            </li>
          </ul>
        </div>
      `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',

      crlf: false,
      indentSize: 2,

      liquid: {
        commentIndent: true,
        commentNewline: false

      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid comment else tag alignment', t => {

  forAssert(
    [
      [
        liquid`
          {% if condition %}
          <div>
            <ul><li>
            {% comment %}
                Lorem ipsum dolor sit amet {% endcomment %}
            <h1>COMMENT WILL INDENT</h1>
              </li>
            </ul>
            </div>

          {% # comment will align the else opening delimiter %}
          {% else %}
            <span>
            <!-- comment -->
            </span>
          {% endif %}
        `,
        liquid`
        {% if condition %}
          <div>
            <ul>
              <li>
                {% comment %}
                  Lorem ipsum dolor sit amet
                {% endcomment %}
                <h1>COMMENT WILL INDENT</h1>
              </li>
            </ul>
          </div>

        {% # comment will align the else opening delimiter %}
        {% else %}
          <span>
            <!-- comment -->
          </span>
        {% endif %}
      `
      ],
      [
        liquid`
          {% if condition %}
          <div>
            {% comment %}
                Lorem ipsum dolor sit amet {% endcomment %}
            <h1>COMMENT WILL INDENT</h1>
              </div>

            {% # comment will align the else opening delimiter %}
              {% elsif condition == bar %}

          <ul>
            {% # comment will align the else opening delimiter %}
            <li>Foo Bar</li>
          </ul>

          {% # comment will align the else opening delimiter %}
          {% else %}
            <span>
            <!-- comment -->
            </span>
          {% endif %}
        `,
        liquid`
        {% if condition %}
          <div>
            {% comment %}
              Lorem ipsum dolor sit amet
            {% endcomment %}
            <h1>COMMENT WILL INDENT</h1>
          </div>

        {% # comment will align the else opening delimiter %}
        {% elsif condition == bar %}

          <ul>
            {% # comment will align the else opening delimiter %}
            <li>Foo Bar</li>
          </ul>

        {% # comment will align the else opening delimiter %}
        {% else %}
          <span>
            <!-- comment -->
          </span>
        {% endif %}
      `
      ],
      [
        liquid`{% # Testing deeply nested structures %}

          <main>
          <section>
          {% if condition %}
          <div>
            <ul><li>
            {% comment %}
                Lorem ipsum dolor sit amet {% endcomment %}
            <h1>COMMENT WILL INDENT</h1>
              </li>
            </ul>
            </div>

          {% # comment will align the else opening delimiter %}
          {% else %}
            <span>
            <!-- comment -->
            </span>
          {% endif %}
          </section>
          </main>
        `,
        liquid`{% # Testing deeply nested structures %}

        <main>
          <section>
            {% if condition %}
              <div>
                <ul>
                  <li>
                    {% comment %}
                      Lorem ipsum dolor sit amet
                    {% endcomment %}
                    <h1>COMMENT WILL INDENT</h1>
                  </li>
                </ul>
              </div>

            {% # comment will align the else opening delimiter %}
            {% else %}
              <span>
                <!-- comment -->
              </span>
            {% endif %}
          </section>
        </main>
      `
      ]

    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',

      crlf: false,
      indentSize: 2,

      liquid: {
        commentIndent: true,
        commentNewline: false

      },
      markup: {

      }
    });

    t.deepEqual(actual, expect);

  });

});
