import test from 'ava';
import { forAssert, json } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Tests - Liquid in JSON string occurances', t => {

  forAssert(
    [
      [
        json`
        {"prop": "Use {{ amount }} for where you want the remaining amount to display"}
        `,
        json`
        {
          "prop": "Use {{ amount }} for where you want the remaining amount to display"
        }
        `
      ],
      [
        json`
        {"prop": "Some text {% if condition %} {{ object }} {% endif %} Some more"}
        `,
        json`
        {
          "prop": "Some text {% if condition %} {{ object }} {% endif %} Some more"
        }
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
