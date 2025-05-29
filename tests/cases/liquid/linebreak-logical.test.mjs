import { forAssert, forSample, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Line Break Logical (after): ', t => {

  forAssert(
    [
      [
        liquid`
        {% if foo == bar or foo != baz or baz <= bar or foo < bar %}

        {% endif %}
        `,
        liquid`
        {% if foo == bar or
          foo != baz or
          baz <= bar or
          foo < bar %}

        {% endif %}
        `
      ],
      [
        liquid`
        {%
          if foo <= bar or foo <= baz or
          baz <= bar
          or foo <= bar
        %}

        {% endif %}
        `,
        liquid`
        {%
          if foo <= bar or
          foo <= baz or
          baz <= bar or
          foo <= bar
        %}

        {% endif %}
        `
      ],
      [
        liquid`
        {%
          unless a == b and b == c and
          c == d
          and d == e
        %}

        {% endunless %}
        `,
        liquid`
        {%
          unless a == b and
          b == c and
          c == d and
          d == e
        %}

        {% endunless %}
        `
      ],
      [
        liquid`
        {%
          if x > y or y > z or
          z > x
          or x == y
        %}
          Hello
        {%
          elsif a < b and b < c and
          c < d
          and d < e
        %}
          World
        {% endif %}
        `,
        liquid`
        {%
          if x > y or
          y > z or
          z > x or
          x == y
        %}
          Hello
        {%
          elsif a < b and
          b < c and
          c < d and
          d < e
        %}
          World
        {% endif %}
        `
      ]

    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wordWrap: 40,
      lineBreakLogical: 'after'

    });

    t.is(actual, expect);

  });
});

test('Line Break Logical (before):', t => {

  forAssert(
    [
      [
        liquid`
        {%
          if foo <= bar or foo <= baz or
          baz <= bar
          or foo <= bar
        %}

        {% endif %}
        `,
        liquid`
        {%
          if foo <= bar
          or foo <= baz
          or baz <= bar
          or foo <= bar
        %}

        {% endif %}
        `
      ],
      [
        liquid`
        {%
          unless a == b and b == c and
          c == d
          and d == e
        %}

        {% endunless %}
        `,
        liquid`
        {%
          unless a == b
          and b == c
          and c == d
          and d == e
        %}

        {% endunless %}
        `
      ],
      [
        liquid`
        {%
          if x > y or y > z or
          z > x
          or x == y
        %}
          Hello
        {%
          elsif a < b and b < c and
          c < d
          and d < e
        %}
          World
        {% endif %}
        `,
        liquid`
        {%
          if x > y
          or y > z
          or z > x
          or x == y
        %}
          Hello
        {%
          elsif a < b
          and b < c
          and c < d
          and d < e
        %}
          World
        {% endif %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wordWrap: 40,
      lineBreakLogical: 'before'
    });

    t.is(actual, expect);

  });

});

test('Line Break Logical (preserve):', t => {

  forAssert(
    [
      [
        liquid`
        {%
          if foo <= bar or foo <= baz or
          baz <= bar
          or foo <= bar
        %}

        {% endif %}
        `,
        liquid`
        {%
          if foo <= bar or
          foo <= baz or
          baz <= bar
          or foo <= bar
        %}

        {% endif %}
        `
      ],
      [
        liquid`
        {%
          unless a == b and b == c and
          c == d
          and d == e
        %}

        {% endunless %}
        `,
        liquid`
        {%
          unless a == b and
          b == c and
          c == d
          and d == e
        %}

        {% endunless %}
        `
      ],
      [
        liquid`
        {%
          if x > y or y > z or
          z > x
          or x == y
        %}
          Hello
        {%
          elsif a < b and b < c and
          c < d
          and d < e
        %}
          World
        {% endif %}
        `,
        liquid`
        {%
          if x > y or
          y > z or
          z > x
          or x == y
        %}
          Hello
        {%
          elsif a < b and
          b < c and
          c < d
          and d < e
        %}
          World
        {% endif %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wordWrap: 40,
      lineBreakLogical: 'preserve'
    });

    t.is(actual, expect);

  });
});
