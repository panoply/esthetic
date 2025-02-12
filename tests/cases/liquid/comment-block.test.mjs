import { forAssert, forRule, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Liquid Block Comment: Tag structures (using defaults)', t => {

  forAssert(
    [
      [
        liquid`
        {% comment %}inline comment no leading or ending whitespace{% endcomment %}
        `
        ,
        liquid`
        {% comment %}inline comment no leading or ending whitespace{% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %} inline comment leading whitespace no ending whitespace{% endcomment %}
        `
        ,
        liquid`
        {% comment %} inline comment leading whitespace no ending whitespace{% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}inline comment no leading whitespace but ending whitespace {% endcomment %}
        `
        ,
        liquid`
        {% comment %}inline comment no leading whitespace but ending whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %} inline comment leading whitespace ending whitespace {% endcomment %}
        `
        ,
        liquid`
        {% comment %} inline comment leading whitespace ending whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}     extraneous leading whitespace converted to single whitespace {% endcomment %}
        `
        ,
        liquid`
        {% comment %} extraneous leading whitespace converted to single whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %} extraneous ending whitespace converted to single whitespace          {% endcomment %}
        `
        ,
        liquid`
        {% comment %} extraneous ending whitespace converted to single whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}    extraneous ending and leading whitespace converted to single whitespace    {% endcomment %}
        `
        ,
        liquid`
        {% comment %} extraneous ending and leading whitespace converted to single whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}
        newline leading with no ending whitespace{% endcomment %}
        `
        ,
        liquid`
        {% comment %}
        newline leading with no ending whitespace{% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}
        newline leading with ending whitespace {% endcomment %}
        `
        ,
        liquid`
        {% comment %}
        newline leading with ending whitespace {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}newline ending with no leading whitespace
        {% endcomment %}
        `
        ,
        liquid`
        {% comment %}newline ending with no leading whitespace
        {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %} newline ending with leading whitespace
        {% endcomment %}
        `
        ,
        liquid`
        {% comment %} newline ending with leading whitespace
        {% endcomment %}
        `
      ],
      [
        liquid`
        {% comment %}
        newline leading and newline ending
        {% endcomment %}
        `
        ,
        liquid`
        {% comment %}
        newline leading and newline ending
        {% endcomment %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        commentIndent: false,
        commentPreserve: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Block Comment: Content preservation { commentPreserve: true }', t => {

  forAssert(
    [
      [
        liquid`
        <div>
                  <section>
                                  {% comment %}
                                  Lorem ipsum dolor sit amet
                                {% endcomment %}
        </section>
        </div>
        `
        ,
        liquid`
        <div>
          <section>
            {% comment %}
                                  Lorem ipsum dolor sit amet
            {% endcomment %}
          </section>
        </div>
        `
      ],
      [
        liquid`
        <div>
                  <section>
                                  {% comment %}      Lorem ipsum dolor sit amet
                                {% endcomment %}
        </section>
        </div>
        `
        ,
        liquid`
        <div>
          <section>
            {% comment %}      Lorem ipsum dolor sit amet
            {% endcomment %}
          </section>
        </div>
        `
      ],
      [
        liquid`
        <div>
                  <section>
                                  {% comment %}
                                  Lorem ipsum dolor sit amet{% endcomment %}
        </section>
        </div>
        `
        ,
        liquid`
        <div>
          <section>
            {% comment %}
                                  Lorem ipsum dolor sit amet{% endcomment %}
          </section>
        </div>
        `
      ],
      [
        liquid`
        <div>
                             <div id ="foo">
                   {% comment %}
        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
                      {% endcomment %}
                    </div>
        </div>
        `
        ,
        liquid`
        <div>
          <div id="foo">
            {% comment %}
        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.
            {% endcomment %}
          </div>
        </div>
        `
      ],
      [
        liquid`
        <div>
                             <div id ="foo">
                   {% comment %}




        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.





                      {% endcomment %}
                    </div>
        </div>
        `
        ,
        liquid`
        <div>
          <div id="foo">
            {% comment %}


        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit, sed do eiusmod tempor
                                  incididunt ut labore et dolore magna aliqua.


            {% endcomment %}
          </div>
        </div>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      preserveLine: 2,
      liquid: {
        commentPreserve: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Block Comment: Content indentation { commentIndent: true }', t => {

  forAssert(
    [
      [
        liquid`
        <div>
          {% comment %}
          Lorem ipsum dolor sit amet {% endcomment %}
        </div>
        `
        ,
        liquid`
        <div>
          {% comment %}
            Lorem ipsum dolor sit amet {% endcomment %}
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
        `
        ,
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
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      liquid: {
        commentIndent: true,
        commentPreserve: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Liquid Block Comment: Alignment with logical tag token {% else %}', t => {

  forAssert(
    [
      [
        liquid`
          {% if condition %}
          <div>
            <ul>
          <li>
            {% comment %}
                Lorem ipsum dolor sit amet {% endcomment %}
            <h1>COMMENT WILL INDENT</h1>
              </li>
            </ul>
            </div>

          {% comment %}
            comment will align the else opening delimiter {% endcomment %}
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
                  Lorem ipsum dolor sit amet {% endcomment %}
                <h1>COMMENT WILL INDENT</h1>
              </li>
            </ul>
          </div>

        {% comment %}
          comment will align the else opening delimiter {% endcomment %}
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
            <ul>
              <li>
            {% comment %} Lorem ipsum dolor sit amet {% endcomment %}
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
                    {% comment %} Lorem ipsum dolor sit amet {% endcomment %}
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

test('Liquid Block Comment: Word wrap rule on inner contents { wrap }', t => {

  forRule(
    [
      liquid`
      {% comment %}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et leo duis ut diam quam nulla porttitor massa id. Nullam eget felis eget nunc lobortis mattis aliquam faucibus purus. In est ante in nibh. Dolor sed viverra ipsum nunc. A lacus vestibulum sed arcu non. Vitae semper quis lectus nulla at volutpat. Lorem mollis aliquam ut porttitor leo a. Enim ut sem viverra aliquet eget sit amet Congue eu consequat ac felis donec et odio pellentesque.

        Quisque egestas diam in arcu. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Egestas sed sed risus pretium quam vulputate. Faucibus vitae aliquet nec ullamcorper sit amet risus. Gravida arcu ac tortor dignissim convallis aenean et tortor. Dui id ornare arcu odio ut. Ornare quam viverra orci sagittis eu volutpat.

        Tellus molestie nunc non blandit massa enim nec. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Praesent elementum facilisis leo vel fringilla est ullamcorper.

        Molestie nunc non blandit massa enim nec dui nunc. Massa placerat duis ultricies lacus sed turpis tincidunt id aliquet. Magna sit amet purus gravida quis blandit turpis cursus. Purus viverra accumsan in nisl nisi scelerisque eu ultrices. Ut lectus arcu bibendum at varius vel pharetra vel. Amet nisl purus in mollis nunc sed id semper risus. Varius morbi enim nunc faucibus a pellentesque sit.
      {% endcomment %}
      `
    ]
  )(
    [
      {
        language: 'liquid',
        wrap: 50,
        liquid: {
          commentIndent: true
        }
      },
      {
        language: 'liquid',
        wrap: 80,
        liquid: {
          commentIndent: true
        }
      },
      {
        language: 'liquid',
        wrap: 25,
        liquid: {
          commentIndent: true
        }
      },
      {
        language: 'liquid',
        wrap: 100,
        liquid: {
          commentIndent: true
        }
      },
      {
        language: 'liquid',
        wrap: 0,
        liquid: {
          commentIndent: true
        }
      }
    ]
  )(function (sample, rules, label) {

    const actual = esthetic.format(sample, rules);

    t.snapshot(actual, label);

  });

});
