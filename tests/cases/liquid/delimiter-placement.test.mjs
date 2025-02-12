import { forAssert, forSample, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Preserve: Delimiters are preserved according to input', t => {

  forAssert(
    [
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
        {{
          output_1 }}
        {{-
          output_2 }}
        {{-
          output_3 -}}
        {{
          output_4 -}}
        `
      ],
      [
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
          {{ output_5
          }}
          {{- output_6
          }}
          {{- output_7
          -}}
          {{ output_8
          -}}
        `
      ],
      [
        liquid`
          {{
            output_13 }}
          {{-

            output_14 }}
          {{- output_15 -}}
          {{
            output_16
            -}}
        `,
        liquid`
          {{
            output_13 }}
          {{-
            output_14 }}
          {{- output_15 -}}
          {{
            output_16
          -}}
        `
      ],
      [
        liquid`
         {%
           if x == 'empty-tag-left-force' %}
           {% # contained content %}
         {% endif %}
        `,
        liquid`
        {%
          if x == 'empty-tag-left-force' %}
          {% # contained content %}
        {% endif %}

       `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      liquid: {
        delimiterTrims: 'preserve',
        delimiterPlacement: 'preserve'
      }
    });

    t.is(actual, expect);

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
          | arguments: one: 'foo', two: 'bar', three: 'baz', four: 1
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
      wrap: 30,
      liquid: {
        forceFilter: 0,
        forceArgument: 0,
        lineBreakSeparator: 'after',
        delimiterPlacement: 'newline-multiline'
      }
    });

    t.is(actual, expect);

  });

});
