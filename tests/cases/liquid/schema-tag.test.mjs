import test from 'ava';
import { forAssert, liquid, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Empty schema tags', t => {

  forAssert(
    [

      [
        liquid`{% # Empty Style tag %}

          {% schema %}

          {% endschema%}
        `,
        liquid`{% # Empty Style tag %}

          {% schema %}{% endschema %}

        `
      ],
      [
        liquid`{% # Empty Style tag with trims %}

          {%- schema -%}

          {%- endschema -%}
        `,
        liquid`{% # Empty Style tag with trims %}

          {%- schema -%}{%- endschema -%}

        `
      ],
      [
        liquid`{% # Multiple empty schema tag sequences %}

          {% schema %}     {% endschema %}

          {% schema %}

          {% endschema -%}

          {%- schema %}



          {% endschema -%}


          {%- schema %}
          {% endschema%}
        `,
        liquid`{% # Multiple empty schema tag sequences %}

          {% schema %}{% endschema %}

          {% schema %}{% endschema -%}

          {%- schema %}{% endschema -%}


          {%- schema %}{% endschema %}

        `
      ],
      [
        liquid`{% # Empty schema tag nested within HTML tags %}

          <main>

          {% schema %}


          {% endschema %}

          </main>
          <div>
          <ul>
          <li>
          {% schema %}



          {% endschema %}
          </li>
          <li>
          {% schema %}



          {% endschema %}
          </li>
          <li>
          {% schema %}



          {% endschema %}
          </li>
          <li>
          {% schema %}



          {% endschema %}
          </li>
          </ul>
          </div>

        `,
        liquid`{% # Empty schema tag nested within HTML tags %}

          <main>

            {% schema %}{% endschema %}

          </main>
          <div>
            <ul>
              <li>
                {% schema %}{% endschema %}
              </li>
              <li>
                {% schema %}{% endschema %}
              </li>
              <li>
                {% schema %}{% endschema %}
              </li>
              <li>
                {% schema %}{% endschema %}
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
        forceIndent: true
      }
    });

    t.deepEqual(actual, expect);

  });
});

test('Structure Test: Newline Preservation and indentation levels', t => {

  forSample(
    [

      liquid`{% # Global placed scripts newline and indentation %}

        <!-- NO LINES -->
        {% schema %}
          {
            "string": "value",
            "boolean": true,
            "number": 2000,
            "array": [
              {
                "object": {
                  "string": "value",
                  "boolean": false,
                  "number": 10.45,
                  "array": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                }
              },
              {
                "object_1": {
                  "object_2": {
                    "object_3": {
                      "array": [
                        [
                          [
                            {
                              "object_4": "Deeply Nested"
                            }
                          ]
                        ]
                      ]
                    }
                  }
                }
              }
            ]
          }
        {% endschema %}


        <!-- 1 LINE TOP AND BOTTOM -->
        {% schema %}

          {
            "string": "value",
            "boolean": true,
            "number": 2000,
            "array": [
              {
                "object": {
                  "string": "value",
                  "boolean": false,
                  "number": 10.45,
                  "array": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                }
              },
              {
                "object_1": {
                  "object_2": {
                    "object_3": {
                      "array": [
                        [
                          [
                            {
                              "object_4": "Deeply Nested"
                            }
                          ]
                        ]
                      ]
                    }
                  }
                }
              }
            ]
          }

        {% endschema %}

        <!-- 2 LINES TOP AND BOTTOM -->
        {% schema %}


          {
            "string": "value",
            "boolean": true,
            "number": 2000,
            "array": [
              {
                "object": {
                  "string": "value",
                  "boolean": false,
                  "number": 10.45,
                  "array": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                }
              },
              {
                "object_1": {
                  "object_2": {
                    "object_3": {
                      "array": [
                        [
                          [
                            {
                              "object_4": "Deeply Nested"
                            }
                          ]
                        ]
                      ]
                    }
                  }
                }
              }
            ]
          }


        {% endschema %}

        <!-- 2 LINES TOP AND 0 LINES BOTTOM -->
        {% schema %}


          {
            "string": "value",
            "boolean": true,
            "number": 2000,
            "array": [
              {
                "object": {
                  "string": "value",
                  "boolean": false,
                  "number": 10.45,
                  "array": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                }
              },
              {
                "object_1": {
                  "object_2": {
                    "object_3": {
                      "array": [
                        [
                          [
                            {
                              "object_4": "Deeply Nested"
                            }
                          ]
                        ]
                      ]
                    }
                  }
                }
              }
            ]
          }
        {% endschema %}

        <!-- 0 LINES TOP AND 2 LINES BOTTOM -->
        {% schema %}
          {
            "string": "value",
            "boolean": true,
            "number": 2000,
            "array": [
              {
                "object": {
                  "string": "value",
                  "boolean": false,
                  "number": 10.45,
                  "array": [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ]
                }
              },
              {
                "object_1": {
                  "object_2": {
                    "object_3": {
                      "array": [
                        [
                          [
                            {
                              "object_4": "Deeply Nested"
                            }
                          ]
                        ]
                      ]
                    }
                  }
                }
              }
            ]
          }


        {% endschema %}

      `,
      liquid`{% # Nested scripts newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          {% schema %}

            {
              "string": "value",
              "boolean": true,
              "number": 2000,
              "array": [
                {
                  "object": {
                    "string": "value",
                    "boolean": false,
                    "number": 10.45,
                    "array": [
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7
                    ]
                  }
                },
                {
                  "object_1": {
                    "object_2": {
                      "object_3": {
                        "array": [
                          [
                            [
                              {
                                "object_4": "Deeply Nested"
                              }
                            ]
                          ]
                        ]
                      }
                    }
                  }
                }
              ]
            }

          {% endschema %}
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
                    {% schema %}

                      {
                        "string": "value",
                        "boolean": true,
                        "number": 2000,
                        "array": [
                          {
                            "object": {
                              "string": "value",
                              "boolean": false,
                              "number": 10.45,
                              "array": [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7
                              ]
                            }
                          },
                          {
                            "object_1": {
                              "object_2": {
                                "object_3": {
                                  "array": [
                                    [
                                      [
                                        {
                                          "object_4": "Deeply Nested"
                                        }
                                      ]
                                    ]
                                  ]
                                }
                              }
                            }
                          }
                        ]
                      }

                    {% endschema %}
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
    json: {
      braceAllman: true
    },
    markup: {
      forceAttribute: 2,
      ignoreJSON: false
    }
  })(function (source, rules) {

    const actual = esthetic.format.sync(source, rules);

    t.deepEqual(actual, source);

  });
});
