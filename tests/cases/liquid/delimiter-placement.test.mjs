import test from 'ava';
import { forSample, liquid, forAssert } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Preserve: Delimiters are preserved according to input', t => {

  forSample(
    [
      liquid`
        {{
          output_1 }}
        {{-
          output_2 }}
        {{-
          output_3 -}}
        {{
          output_4 -}}
      `,
      liquid`
        {{ output_5
        }}
        {{- output_6
        }}
        {{- output_7
        -}}
        {{ output_8
        -}}
      `,
      liquid`
        {{
          output_9
        }}
        {{-
          output_10
        }}
        {{-
          output_11
        -}}
        {{
          output_12
        -}}
      `,
      liquid`
        {{ output_13 }}
        {{- output_14 }}
        {{- output_15 -}}
        {{ output_16 -}}
      `,
      liquid`
        {%
          if x == 'empty-tag-left-force' %}
        {% endif %}
        {%-
          if x == 'empty-tag-left-force trim-left' %}
        {% endif %}
        {%-
          if x == 'empty-tag-left-force trims' -%}
        {% endif %}
        {%
          if x == 'empty-tag-left-force trims-right' -%}
        {% endif %}
       `,
      liquid`
        {%
          if x == 'empty-tag-with-content' %}

          {% # contained content %}

        {% endif %},
        {%-
          if x == 'empty-tag-with-content trim-left' %}

          {% # contained content %}

        {% endif %}
        {%-
          if x == 'empty-tag-with-content trims' -%}

          {% # contained content %}

        {% endif %}
        {%
          if x == 'empty-tag-with-content trim-right' -%}

          {% # contained content %}

        {% endif %}
      `,
      liquid`
      {% if x == 'empty-tag-right-force'
      %}
      {% endif %}
      {%- if x == 'empty-tag-right-force trim-left'
      %}
      {% endif %}
      {%- if x == 'empty-tag-right-force trim'
      -%}
      {% endif %}
      {% if x == 'empty-tag-right-force trim-right'
      -%}
      {% endif %}
       `,

      liquid`
        {% if x == 'empty-tag-right-force-content'
        %}

          {% # contained content %}

        {% endif %}
        {%- if x == 'empty-tag-right-force-content trim-left'
        %}

          {% # contained content %}

        {% endif %}
        {%- if x == 'empty-tag-right-force-content trims'
        -%}

          {% # contained content %}

        {% endif %}
        {% if x == 'empty-tag-right-force-content trim-right'
        -%}

          {% # contained content %}

        {% endif %}
      `,
      liquid`
      {%
        if x == 'empty-tag-force-left-and-right'
      %}
      {% endif %}
      {%-
        if x == 'empty-tag-force-left-and-right trim-left'
      %}
      {% endif %}
      {%-
        if x == 'empty-tag-force-left-and-right trims'
      -%}
      {% endif %}
      {%
        if x == 'empty-tag-force-left-and-right trim-right'
      -%}
      {% endif %}
      `,
      liquid`
        {%
          if x == 'empty-tag-content-force-left-and-right'
        %}

          {% # preserved delimiter structure %}

        {% endif %}
        {%-
          if x == 'empty-tag-content-force-left-and-right trim-left'
        %}

          {% # preserved delimiter structure %}

        {% endif %}
        {%-
          if x == 'empty-tag-content-force-left-and-right trims'
        -%}

          {% # preserved delimiter structure %}

        {% endif %}
        {%
          if x == 'empty-tag-content-force-left-and-right trim-right'
        -%}

          {% # preserved delimiter structure %}

        {% endif %}
      `,
      liquid`
      {% if x == 'no-content-no-force' %}
      {% endif %}
      {%- if x == 'no-content-no-force trim-left' %}
      {% endif %}
      {%- if x == 'no-content-no-force trims' -%}
      {% endif %}
      {% if x == 'no-content-no-force trim-right' -%}
      {% endif %}
      `,
      liquid`
        {% if x == 'content-no-force' %}

          {% # preserved delimiter structure %}

        {% endif %}
        {%- if x == 'content-no-force trim-left' %}

          {% # preserved delimiter structure %}

        {% endif %}
        {%- if x == 'content-no-force trims' -%}

          {% # preserved delimiter structure %}

        {% endif %}
        {% if x == 'content-no-force trim-right' -%}

          {% # preserved delimiter structure %}

        {% endif %}
      `,
      liquid`
        <main
          id="some-id">
          <ul
            class="class-name"
            data-attr-1="one"
            data-attr-2="two"
            data-attr-3="three">
            <li
              data-attr-1="one"
              data-attr-2="two"
              data-attr-3="three">
              <div
                data-attr-1="one"
                data-attr-2="two"
                data-attr-3="three"
                data-attr-4="four">

                {{
                  object.prop
                }}

                {%
                  if x == 'condition'
                %}

                  {{ object.prop }}
                  {{-
                    will_force
                    | arguments:
                       one: 'foo',
                       two: 'bar',
                       three: 'baz',
                       four: 1
                    | filter: 'using wrap fraction'
                  }}

                  {%
                    for i in arr
                  %}

                    {{ i.prop }}

                  {% endfor %}

                {% endif %}

              </div>
            </li>
          </ul>
        </main>
      `
    ]
  )(
    {
      language: 'liquid',
      liquid: {
        delimiterTrims: 'preserve',
        delimiterPlacement: 'preserve',
        forceFilter: 1,
        forceArgument: 3,
        lineBreakSeparator: 'after'
      },
      markup: {
        forceAttribute: true
      }
    }
  )(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });

});

test('Preserve Structure Cases: Various samples with normalize spacing enabled', t => {

  forAssert(
    [
      [
        liquid`
        {{no_space}}
        {{
          left_forced }}
        {{
          left_force_right_no_space}}
        {{left_no_force_right_space }}
        {{left_no_force_right_space
        }}
        {{-
        left_force_trims_right_no_space-}}
        {{-
          left_force_space_trims -}}
        {{-no_space_trims-}}
        {{-
          force_trims
        -}}
        {{-
          left_force_left_trim_right_nospace}}
        {{
          left_force_right_trim_right_nospace-}}
      `,
        liquid`
        {{ no_space }}
        {{
          left_forced }}
        {{
          left_force_right_no_space }}
        {{ left_no_force_right_space }}
        {{ left_no_force_right_space
        }}
        {{-
          left_force_trims_right_no_space -}}
        {{-
          left_force_space_trims -}}
        {{- no_space_trims -}}
        {{-
          force_trims
        -}}
        {{-
          left_force_left_trim_right_nospace }}
        {{
          left_force_right_trim_right_nospace -}}
        `
      ]
    ],
    [
      [
        liquid`
        {%
          if x == 'empty-tag-left-force' %}{% endif %}
        {%
        if x == 'empty-tag-left-force'%}{% endif %}
        {%if x == 'empty-tag-right-force'
        %}{% endif %}
        {%if x == 'empty-tag-left-force'%}{% endif %}
        {%-if x == 'empty-tag-left-force trim-left'
        %}{% endif %}
        {%-
          if x == 'empty-tag-left-force trims'-%}{% endif %}
        {%-
          if x == 'empty-tag-left-force trims'
        -%}{% endif %}
        {%
          if x == 'empty-tag-left-force trims-right'
        %}{% endif %}
        {%
          if x == 'empty-tag-left-force trims-right'-%}{% endif %}
        `,
        liquid`
        {%
          if x == 'empty-tag-left-force' %}{% endif %}
        {%
          if x == 'empty-tag-left-force' %}{% endif %}
        {% if x == 'empty-tag-right-force'
        %}{% endif %}
        {% if x == 'empty-tag-left-force' %}{% endif %}
        {%- if x == 'empty-tag-left-force trim-left'
        %}{% endif %}
        {%-
          if x == 'empty-tag-left-force trims' -%}{% endif %}
        {%-
          if x == 'empty-tag-left-force trims'
        -%}{% endif %}
        {%
          if x == 'empty-tag-left-force trims-right'
        %}{% endif %}
        {%
          if x == 'empty-tag-left-force trims-right' -%}{% endif %}
        `
      ]
    ]
  )(function (source, expect) {

    const output = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'preserve'
      }
    });

    t.deepEqual(output, expect);

  });

});

test('Inline: Delimiters are inlined', t => {

  forAssert(
    [
      [
        liquid`
        {{
          inline_test
        }}
        `
        ,
        liquid`
        {{ inline_test }}
        `
      ],
      [
        liquid`
        {%
          singleton
        %}
        `
        ,
        liquid`
        {% singleton %}
        `
      ],
      [
        liquid`
        {%
          if xxx
        %}
          {{
            inner_if
          }}
        {% endif %}
        `
        ,
        liquid`
        {% if xxx %}
          {{ inner_if }}
        {% endif %}
        `
      ],
      [
        liquid`
        {%
          block
        %}
          {{
            inner_block
          }}
        {% endblock %}
        `
        ,
        liquid`
        {% block %}
          {{ inner_block }}
        {% endblock %}
        `
      ],
      [
        liquid`
        {%
          for i in array
        %}
          {{
            i.prop
          }}
          {%
            if i.condition == i.assertion
          %}
            {{
              i.something
            }}
            {%-
              unless i.condition == xxx
            %}
              {{-
                i.is.nested
              -}}
            {% endunless %}
          {% endif %}
        {% endfor %}
        `
        ,
        liquid`
        {% for i in array %}
          {{ i.prop }}
          {% if i.condition == i.assertion %}
            {{ i.something }}
            {%- unless i.condition == xxx %}
              {{- i.is.nested -}}
            {% endunless %}
          {% endif %}
        {% endfor %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'inline'
      }
    });

    t.is(actual, expect);

  });

});

test('Consistent: Consistent placement based on opening delimiter', t => {

  forAssert(
    [
      [
        liquid`
        {{
          will_force }}

        {%-
        will_force_singleton %}

        {%
        if will_force != condition %}

        {{
        inner_force_consistent }}

        {% endif %}
        `
        ,
        liquid`
        {{
          will_force
        }}

        {%-
          will_force_singleton
        %}

        {%
          if will_force != condition
        %}

          {{
            inner_force_consistent
          }}

        {% endif %}
        `
      ],
      [
        liquid`
        {% for i in will_inline.consistent
        %}
          {{i.will_inline
          -}}

          {%-if i.will_inline
          %}
            {{
              i.will_force}}
            {%-
            unless i.will_preserve_as_forced
            %}
              {{-i.will_inline
              -}}
            {% endunless %}
        {% endif %}
        {% endfor %}
        `
        ,
        liquid`
        {% for i in will_inline.consistent %}
          {{ i.will_inline -}}

          {%- if i.will_inline %}
            {{
              i.will_force
            }}
            {%-
              unless i.will_preserve_as_forced
            %}
              {{- i.will_inline -}}
            {% endunless %}
          {% endif %}
        {% endfor %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'consistent'
      }
    });

    t.is(actual, expect);

  });

});

test('Force: Delimiter are forced onto newlines', t => {

  forAssert(
    [
      [
        liquid`
        {{ output_1 }}
        `
        ,
        liquid`
        {{
          output_1
        }}
        `
      ],
      [
        liquid`
        {% singleton %}
        `
        ,
        liquid`
        {%
          singleton
        %}
        `
      ],
      [
        liquid`
        {% if xxx %}
          {{ inner_if }}
        {% endif %}
        `
        ,
        liquid`
        {%
          if xxx
        %}
          {{
            inner_if
          }}
        {% endif %}
        `
      ],
      [
        liquid`
        {% block %}
          {{ inner_block }}
        {% endblock %}
        `
        ,
        liquid`
        {%
          block
        %}
          {{
            inner_block
          }}
        {% endblock %}
        `
      ],
      [
        liquid`
        {% for i in array %}
          {{ i.prop }}
          {% if i.condition == i.assertion %}
            {{ i.something }}
            {%- unless i.condition == xxx %}
              {{- i.is.nested -}}
            {% endunless %}
          {% endif %}
        {% endfor %}
        `
        ,
        liquid`
        {%
          for i in array
        %}
          {{
            i.prop
          }}
          {%
            if i.condition == i.assertion
          %}
            {{
              i.something
            }}
            {%-
              unless i.condition == xxx
            %}
              {{-
                i.is.nested
              -}}
            {% endunless %}
          {% endif %}
        {% endfor %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'force'
      }
    });

    t.is(actual, expect);

  });

});

test('Force Multiline: Force delimiters when token spans newlines', t => {

  forAssert(
    [
      [
        liquid`
        {{ will_force
           | append: 'xxx' | filter: 'using wrap fraction' | prepend: 'set to 30' | x: 'for test' }}
        `
        ,
        liquid`
        {{
          will_force
          | append: 'xxx'
          | filter: 'using wrap fraction'
          | prepend: 'set to 30'
          | x: 'for test'
        }}
        `
      ],
      [
        liquid`
        {{ will_force | arguments:one: 'foo', two: 'bar', three: 'baz', four: 1| filter: 'using wrap fraction' }}
        `
        ,
        liquid`
        {{
          will_force
          | arguments:
            one: 'foo',
            two: 'bar',
            three: 'baz',
            four: 1
          | filter: 'using wrap fraction'
        }}
        `
      ],
      [
        liquid`
        {% if condition_1 == assertion_1 and logical_forcing and forced%}

        {{
          will_inline
          | x: 'xxx'
        }}

        {% endif %}
        `
        ,
        liquid`
        {%
          if condition_1 == assertion_1
          and logical_forcing
          and forced
        %}

          {{ will_inline | x: 'xxx' }}

        {% endif %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrapFraction: 30,
      liquid: {
        forceFilter: 0,
        forceArgument: 0,
        lineBreakSeparator: 'after',
        delimiterPlacement: 'force-multiline'
      }
    });

    t.is(actual, expect);

  });

});
