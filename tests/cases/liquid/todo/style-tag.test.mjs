import test from 'ava';
import { forAssert, liquid, forRules } from '@liquify/ava/esthetic';
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

          {% style %}{% endstyle %}

        `
      ],
      [
        liquid`{% # Empty Style tag with trims %}

          {%- style -%}

          {%- endstyle -%}
        `,
        liquid`{% # Empty Style tag with trims %}

          {% style %}{% endstyle %}

        `
      ],
      [
        liquid`{% # Multiple empty style tag sequences %}

          {% style %}     {% endstyle %}

          {% style %}

          {% endstyle -%}

          {%- style %}



          {% endstyle -%}



          {% endstyle%}
        `,
        liquid`{% # Multiple empty style tag sequences %}

          {% style %}{% endstyle %}

          {% style %}{% endstyle %}

          {% style %}{% endstyle %}

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

            {% style %}{% endstyle %}

          </main>
          <div>
            <ul>
              <li>
              {% style %}{% endstyle %}
              </li>
              <li>
                {% style %}{% endstyle%}
              </li>
              <li>
                {% style %}{% endstyle %}
              </li>
              <li>
                {% style %}{% endstyle %}
              </li>
            </ul>
          </div>

        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format.sync(source, {
      language: 'liquid',
      markup: {
        forceAttribute: 2,
        ignoreJS: false,
        ignoreJSON: false
      }
    });

    t.deepEqual(actual, expect);

  });
});

test.skip('Structure Test: Newline Preservation and indentation levels', t => {

  forRules(
    [

      liquid`{% # Global placed scripts newline and indentation %}

        <!-- NO LINES -->
        {% style %}
          console.log(window.example);
        {% endstyle%}

        <!-- 1 LINE TOP AND BOTTOM -->
        {% style %}

          console.log(window.example);

        {% endstyle%}

        <!-- 2 LINES TOP AND BOTTOM -->
        {% style %}


          console.log(window.example);


        {% endstyle%}

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        {% style %}


          console.log(window.example);
        {% endstyle%}

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        {% style %}
          console.log(window.example);


        {% endstyle%}

        <!-- 1 LINES TOP AND 1 LINE BOTTOM WITH JSON -->
        <script type="application/json">

          {
            "string": "value",
            "number": 1000,
            "object": {
              "array": [
                {
                  "string": "item",
                  "boolean": false,
                  "object": {
                    "number": 2000
                  }
                }
              ]
            }
          }

        {% endstyle%}

      `,
      liquid`{% # Nested scripts newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <script type="application/json">

            {
              "string": "value",
              "number": 1000,
              "object": {
                "array": [
                  {
                    "string": "item",
                    "boolean": false,
                    "object": {
                      "number": 2000
                    }
                  }
                ]
              }
            }

          {% endstyle%}
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
                    <script type="application/json">

                      {
                        "string": "value",
                        "number": 1000,
                        "object": {
                          "array": [
                            {
                              "string": "item",
                              "boolean": false,
                              "object": {
                                "number": 2000
                              }
                            }
                          ]
                        }
                      }

                    {% endstyle%}
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

    const actual = esthetic.format.sync(source, rules);

    t.deepEqual(actual, source);

  });
});
