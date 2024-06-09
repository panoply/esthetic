import test from 'ava';
import { forAssert, json } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Tests - Liquid condition properties', t => {

  forAssert(
    [
      [
        json`
        {
        "one": "before",
        {% if product.selected_or_first_available_variant.sku != blank -%}
          "two": "within"",
        {%- endif %}
        "three": "after",
        }
        `,
        json`
        {
          "one": "before",
          {% if some_condition != blank -%}
            "two": "within"",
          {%- endif %}
          "three": "after"
        }
        `
      ],
      [
        json`
        {"prop": {% if foo %} {{ object.prop }} {% else %}  {{ object.prop }} {% endif %} }
        `,
        json`
        {
          "prop": {% if foo %} {{ object.prop }} {% else %} {{ object.prop }} {% endif %}
        }
        `
      ],
      [
        json`
        // comment
        [
          {
            "foo": 100
          },

          {% for i in array %}
          {
            "prop": {{ i }}
          }{% unless i.last %},{% endunless %}
          {% endfor %}
        ]
        `,
        json`
        // comment
        [
          {
            "foo": 100
          },
          {% for i in array %}
            {
              "prop": {{ i }}
            }{% unless i.last %},{% endunless %}
          {% endfor %}
        ]
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.json(source, {
      preserveLine: 0,
      json: {
        objectSort: true,
        arrayFormat: 'indent',
        bracePadding: false,
        objectIndent: 'indent',
        braceAllman: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Structure Tests - Liquid as values', t => {

  forAssert(
    [
      [
        json`
        {"prop":
        {{ object.prop }}}
        `,
        json`
        {
          "prop": {{ object.prop }}
        }
        `
      ],
      [
        json`
        {"prop": {% if foo %} {{ object.prop }} {% else %}  {{ object.prop }} {% endif %} }
        `,
        json`
        {
          "prop": {% if foo %} {{ object.prop }} {% else %} {{ object.prop }} {% endif %}
        }
        `
      ],
      [
        json`
        // comment
        [
          {
            "foo": 100
          },

          {% for i in array %}
          {
            "prop": {{ i }}
          }{% unless i.last %},{% endunless %}
          {% endfor %}
        ]
        `,
        json`
        // comment
        [
          {
            "foo": 100
          },
          {% for i in array %}
            {
              "prop": {{ i }}
            }{% unless i.last %},{% endunless %}
          {% endfor %}
        ]
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.json(source, {
      preserveLine: 0,
      json: {
        objectSort: true,
        arrayFormat: 'indent',
        bracePadding: false,
        objectIndent: 'indent',
        braceAllman: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
