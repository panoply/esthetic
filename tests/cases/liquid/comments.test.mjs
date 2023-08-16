import test from 'ava';
import { liquid, forAssert, forRule } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test.todo('Liquid Comment with preserveComment set to true');
test.todo('HTML Comment with preserveComment set to true');

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

test('Liquid block comment wrapping', t => {

  forRule(
    [
      liquid`
      {% comment %}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.

        Molestie nunc non blandit massa enim nec dui nunc. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Magna sit amet purus gravida quis blandit turpis cursus. Purus viverra accumsan in nisl nisi scelerisque eu ultrices. Ut lectus arcu bibendum at varius vel pharetra vel. Amet nisl purus in mollis nunc sed id semper risus. Varius morbi enim nunc faucibus a pellentesque sit.
      {% endcomment %}
      `,
      liquid`
      <div>
        <main>
          <section>
          {% comment %}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

            Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

            Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.

            Molestie nunc non blandit massa enim nec dui nunc. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Magna sit amet purus gravida quis blandit turpis cursus. Purus viverra accumsan in nisl nisi scelerisque eu ultrices. Ut lectus arcu bibendum at varius vel pharetra vel. Amet nisl purus in mollis nunc sed id semper risus. Varius morbi enim nunc faucibus a pellentesque sit.
          {% endcomment %}
          <div>
          {% comment %} Lorem ipsum dolor sit amet, consectetur adipiscing elit {% endcomment%}
          </div>
          </section>
        </main>
      </div>
      `
    ]
  )(
    [
      {
        language: 'liquid',
        wrap: 0,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 50,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 30,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 80,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      }

    ]
  )(function (sample, rules, label) {

    const result = esthetic.format(sample, rules);

    t.snapshot(result, label);

  });

});

test.skip('Liquid line comment wrapping with auto hashing prefix', t => {

  forRule(
    [
      `
      {%
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
      `,
      `
      {%
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
      `,
      liquid`
      <div>
        <main>
          <section>
          {% #
        # Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet. Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.
       %}
          <div>
          {% # Lorem ipsum dolor sit amet, consectetur adipiscing elit %}
          </div>
          </section>
        </main>
      </div>
      `
    ]
  )(
    [
      {
        language: 'liquid',
        wrap: 0,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 50,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 30,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      },
      {
        language: 'liquid',
        wrap: 80,
        liquid: {
          commentIndent: true,
          commentNewline: false
        }
      }

    ]
  )(function (sample, rules, label) {

    const result = esthetic.format(sample, rules);

    t.snapshot(result, label);

  });

});
