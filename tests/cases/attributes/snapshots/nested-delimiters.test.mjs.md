# Snapshot report for `tests/cases/attributes/nested-delimiters.test.mjs`

The actual snapshot is saved in `nested-delimiters.test.mjs.snap`.

Generated by [AVA](https://avajs.dev).

## Liquid delimiter handling

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "liquid": {
>     "normalizeSpacing": true
>   },
>   "markup": {
>     "forceAttribute": true
>   }
> }
> ```

    `{% # Testing HTML tag delimiter characters ">" and "<" within HTML attribute values. %}␊
    ␊
    <div␊
      data-a="a > b"␊
      data-b="c < d"␊
      data-c="e f > g < h"␊
      data-d="j < k > l"></div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "liquid": {
>     "normalizeSpacing": true
>   },
>   "markup": {
>     "forceAttribute": true
>   }
> }
> ```

    `{% # Testing Liquid token containing HTML tag delimiter characters ">" and "<" within attribute values %}␊
    ␊
    <div␊
      {% if a > b %}␊
      data-a␊
      {% endif %}␊
      {% if c < d %}␊
      data-b␊
      {% endif %}␊
      {% unless e > f and g < h %}␊
      data-c="a > b"␊
      {% elsif i > j %}␊
      data-d="a > b"␊
      {% endunless %}␊
      {% if < k and l > m %}␊
      {{ output_1 | filter: '>' | filter: '<' }}␊
      {% else %}␊
      {{ output_2 | filter: '<' | filter: '>' }}␊
      {% endif %}></div>`

> <h3>Rules</h3>
> 
> ```js
> {
>   "language": "liquid",
>   "liquid": {
>     "normalizeSpacing": true
>   },
>   "markup": {
>     "forceAttribute": true
>   }
> }
> ```

    `{% # Testing Liquid tokens as attributes and containing HTML tag delimiter characters ">" and "<" %}␊
    ␊
    <div␊
      {% if a > b %}␊
      data-a␊
      {% endif %}␊
      {% if c < d %}␊
      data-b␊
      {% endif %}␊
      {% unless e > f and g < h %}␊
      data-c="a > b"␊
      {% elsif i > j %}␊
      data-d="a > b"␊
      {% endunless %}␊
      {% if < k and l > m %}␊
      {{ output_1 | filter: '>' | filter: '<' }}␊
      {% else %}␊
      {{ output_2 | filter: '<' | filter: '>' }}␊
      {% endif %}></div>`