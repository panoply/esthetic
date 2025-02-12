import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test.skip('Structure Tests - Liquid condition properties', t => {

  forAssert(
    [
      [
        liquid`
        {
        "one": "before",
        {% if product.selected_or_first_available_variant.sku != blank -%}
          "two": "within",
        {%- endif %}
        "three": "after",
        }
        `,
        liquid`
        {
          "one": "before",
          {% if product.selected_or_first_available_variant.sku != blank -%}
            "two" : "within",
          {%- endif %}
          "three": "after"
        }
        `
      ],
      [
        liquid`
        {"prop": {% if foo %} {{ object.prop }} {% else %}  {{ object.prop }} {% endif %} }
        `,
        liquid`
        {
          "prop": {% if foo %} {{ object.prop }} {% else %} {{ object.prop }} {% endif %}
        }
        `
      ],
      [
        liquid`
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
        liquid`
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
        objectSort: false,
        arrayFormat: 'indent',
        bracePadding: true,
        objectIndent: 'default',
        braceAllman: false
      }
    });

    t.log(actual);
    t.deepEqual(actual, expect);

  });

});

test.skip('Structure Tests - Liquid as values', t => {

  forAssert(
    [
      [
        liquid`
        {"prop":
        {{ object.prop }}}
        `,
        liquid`
        {
          "prop": {{ object.prop }}
        }
        `
      ],
      [
        liquid`
        {"prop": {% if foo %} {{ object.prop }} {% else %}  {{ object.prop }} {% endif %} }
        `,
        liquid`
        {
          "prop": {% if foo %} {{ object.prop }} {% else %} {{ object.prop }} {% endif %}
        }
        `
      ],
      [
        liquid`
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
        liquid`
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

    t.log(actual);
    t.deepEqual(actual, expect);

  });

});
