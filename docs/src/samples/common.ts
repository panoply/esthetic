import { html, liquid, json } from 'language-literals';

export default [
  [
    'HTML UL > LI'
    ,
    html`
    <ul>
      <li>Foo</li>
      <li>Bar</li>
      <li>Baz</li>
    </ul>
    `
  ],
  [
    'Liquid For Loop'
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
    'JSON Object'
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
