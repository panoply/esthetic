import test from 'ava';
import { forSample, forRule, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Preserved delimiter placements', t => {

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
          if x == 'empty-tag-left-force' %}{% endif %}
        {%-
          if x == 'empty-tag-left-force trim-left' %}{% endif %}
        {%-
          if x == 'empty-tag-left-force trims' -%}{% endif %}
        {%
          if x == 'empty-tag-left-force trims-right' -%}{% endif %}
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
         %}{% endif %}
         {%- if x == 'empty-tag-right-force trim-left'
         %}{% endif %}
         {%- if x == 'empty-tag-right-force trim'
         -%}{% endif %}
         {% if x == 'empty-tag-right-force trim-right'
         -%}{% endif %}
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
      %}{% endif %}
      {%-
        if x == 'empty-tag-force-left-and-right trim-left'
      %}{% endif %}
      {%-
        if x == 'empty-tag-force-left-and-right trims'
      -%}{% endif %}
      {%
        if x == 'empty-tag-force-left-and-right trim-right'
      -%}{% endif %}
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
      {% if x == 'no-content-no-force' %}{% endif %}
      {%- if x == 'no-content-no-force trim-left' %}{% endif %}
      {%- if x == 'no-content-no-force trims' -%}{% endif %}
      {% if x == 'no-content-no-force trim-right' -%}{% endif %}
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
      `
    ]
  )(
    {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'preserve'
      }
    }
  )(function (source, rules) {

    const actual = esthetic.format.sync(source, rules);

    t.deepEqual(actual, source);

  });

});

test.skip('Structure Test: Various rules against samples', t => {

  forRule(
    [
      liquid`
        {{no_space}}
        {{
          left_forced }}
        {{
          left_force_right_no_space}}
        {{left_no_force_right_space }}
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
        {%
          if x == 'empty-tag-left-force' %}{% endif %}
        {%
        if x == 'empty-tag-left-force'%}{% endif %}
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
       `
    ]
  )(
    [
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'preserve'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'inline'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'force-inline'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'consistent'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'default'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'force-multiline'
        }
      }
    ]
  )(function (sample, rule, label) {

    const output = esthetic.format.sync(sample, rule);

    // console.log(output);
    // t.snapshot(output, label);
    t.pass();
    // t.deepEqual(actual, source);

  });

});

test.skip('Structure Test: Nested delimiter structures', t => {

  forRule(
    [
      liquid`
        <main id="some-id">
          <ul class="class-name" data-attr-1="one" data-attr-2="two" data-attr-3="three">
            <li data-attr-1="one" data-attr-2="two" data-attr-3="three">
              <div data-attr-1="one" data-attr-2="two" data-attr-3="three" data-attr-4="four">

                {{ object.prop }}

                {% if x == 'condition' %}

                  {{ object.prop }}

                  {%
                    for i in arr
                  %}

                    {{ i.prop }}

                  {% endif %}

                {% endif %}

              </div>
            </li>
          </ul>
        </main>
      `
    ]
  )(
    [
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'default'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'consistent'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'inline'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'preserve'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'force-inline'
        }
      },
      {
        language: 'liquid',
        liquid: {
          delimiterPlacement: 'force-multiline'
        }
      }
    ]
  )(function (sample, rule, label) {

    const output = esthetic.format.sync(sample, rule);

    t.pass();
    // t.log(output);

  });

});
