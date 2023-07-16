import { liquid } from 'language-literals';

export default [
  [
    'Whitespace & Newlines'
    ,
    liquid`
    <ul>
      <li>Foo</li>
      <li>Bar</li>
      <li>Baz</li>
    </ul>
    `
  ],
  [
    'Objects & Properties'
    ,
    liquid`
    {% for item in array %}
      <ul>
        <li>{{ item.foo }}</li>
        <li>{{ item.bar }}</li>
        <li>{{ item.baz }}</li>
        <li>{{ item.qux }}</li>
      </ul>
    {% endfor %}
    `
  ],
  [
    'Filter Expressions'
    ,
    json`
    {
      "property": [
        {
          "string": "Hello World",
          "boolean": true,
          "number": 1000
        }
      ],
      "array": [
        "Foo",
        "Bar",
        "Baz"
      ]
    }
    `
  ],
  [
    'Tag Arguments'
    ,
    json`
    {
      "property": [
        {
          "string": "Hello World",
          "boolean": true,
          "number": 1000
        }
      ],
      "array": [
        "Foo",
        "Bar",
        "Baz"
      ]
    }
    `
  ]
];
