import { prettify } from '@liquify/test-utils';

export const forceAttribute = prettify.cases('markup', 'force-attribute', [
  {
    name: 'forceAttribute: true',
    rules: {
      forceAttribute: true
    },
    cases: [
      {
        file: 'true/liquid-values.txt',
        describe: 'Attribute values containing Liquid tags',
        examples: [
          '<div id="{{ x }}" class="{% if %}x{% endif %}">'
        ]
      },
      {
        file: 'true/liquid-attrs.txt',
        describe: 'Force HTML attributes with liquid values to new lines'
      }
    ]
  },
  {
    name: 'forceAttribute: false',
    rules: {
      forceAttribute: false
    },
    cases: [
      {
        file: 'false/liquid-values.txt',
        describe: 'Force HTML attributes with liquid values to single line'
      }
    ]
  }
]);
