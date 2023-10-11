import test from 'ava';
import { forAssert, liquid, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Empty style tags', t => {

  forAssert(
    [

      [
        liquid`{% # Empty Style tag %}

          {% style %}

          {% endstyle%}
        `,
        liquid`{% # Empty Style tag %}

          {% style %}

          {% endstyle %}
        `
      ],
      [
        liquid`{% # Empty Style tag with trims %}

          {%- style -%}

          {%- endstyle -%}
        `,
        liquid`{% # Empty Style tag with trims %}

          {%- style -%}

          {%- endstyle -%}

        `
      ],
      [
        liquid`{% # Multiple empty style tag sequences %}

          {% style %}     {% endstyle %}

          {% style %}

          {% endstyle -%}

          {%- style %}



          {% endstyle -%}


          {%- style %}
          {% endstyle%}

        `,
        liquid`{% # Multiple empty style tag sequences %}

          {% style %}
          {% endstyle %}

          {% style %}

          {% endstyle -%}

          {%- style %}


          {% endstyle -%}


          {%- style %}
          {% endstyle %}

        `
      ],
      [
        liquid`{% # Empty style tag nested within HTML tags %}

          <main>

          {% style %}


          {% endstyle %}

          </main>
          <div>
          <ul>
          <li>
          {% style %}



          {% endstyle %}
          </li>
          <li>
          {% style %}



          {% endstyle %}
          </li>
          <li>
          {% style %}



          {% endstyle %}
          </li>
          <li>
          {% style %}



          {% endstyle %}
          </li>
          </ul>
          </div>

        `,
        liquid`{% # Empty style tag nested within HTML tags %}

          <main>

            {% style %}


            {% endstyle %}

          </main>
          <div>
            <ul>
              <li>
                {% style %}


                {% endstyle %}
              </li>
              <li>
                {% style %}


                {% endstyle %}
              </li>
              <li>
                {% style %}


                {% endstyle %}
              </li>
              <li>
                {% style %}


                {% endstyle %}
              </li>
            </ul>
          </div>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid'

    });

    t.deepEqual(actual, expect);

  });
});

test('Structure Test: Newline Preservation and indentation levels', t => {

  forSample(
    [

      liquid`{% # Global placed scripts newline and indentation %}

        <!-- NO LINES -->
        {% style %}
          .class {
            font-size: 20px;
            background: pink;
          }
        {% endstyle %}


        <!-- 1 LINE TOP AND BOTTOM -->
        {% style %}

          .class {
            font-size: 20px;
            background: pink;
          }

        {% endstyle %}

        <!-- 2 LINES TOP AND BOTTOM -->
        {% style %}


          .class {
            font-size: 20px;
            background: pink;
          }


        {% endstyle %}

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        {% style %}


          .class {
            font-size: 20px;
            background: pink;
          }
        {% endstyle %}

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        {% style %}
          .class {
            font-size: 20px;
            background: pink;
          }


        {% endstyle %}

      `,
      liquid`{% # Nested scripts newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          {% style %}

            .class {
              font-size: 20px;
              background: pink;
            }

            .foo {
              padding: 10px 20px 15px 25px;
              margin: 20px 50px;
            }

          {% endstyle %}
        </div>

        <!-- DEEPLY NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <main>
            <div>
              <ul>
                <li>
                  <aside>
                    {% style %}

                      .class {
                        font-size: 20px;
                        background: pink;
                        line-height: 1rem;
                        background: pink;
                      }

                      .foo {
                        padding: 10px 20px 15px 25px;
                        margin: 20px 50px;
                      }

                    {% endstyle %}
                  </aside>
                </li>
              </ul>
            </div>
          </main>
        </div>

      `
    ]
  )({
    language: 'liquid',
    markup: {
      forceAttribute: 2,
      ignoreJS: false,
      ignoreJSON: false
    }
  })(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });
});
