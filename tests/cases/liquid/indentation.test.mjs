import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Structure Test: Single Depth block tag indentations', t => {

  forAssert(
    [

      [
        liquid`
        {% some_tag %}
        {{ 'this will be indented' }}
        {% endsome_tag %}
        `,
        liquid`
        {% some_tag %}
          {{ 'this will be indented' }}
        {% endsome_tag %}
        `
      ]
      ,
      [
        liquid`
        {% if condition %}
        {{ 'Indentation of if tag' }}
        {% endif%}
        `,
        liquid`
        {% if condition %}
          {{ 'Indentation of if tag' }}
        {% endif %}
        `
      ],
      [
        liquid`
        {% unless condition %}
        {{ 'Indentation of unless tag' }}
        {% endunless %}
        `,
        liquid`
        {% unless condition %}
          {{ 'Indentation of unless tag' }}
        {% endunless %}
        `
      ],
      [
        liquid`
        {% for item in numbers limit:2 -%}
        {{ item | filter: 'Indentation of for loop tag' }}
        {%- endfor %}
        `,
        liquid`
        {% for item in numbers limit: 2 -%}
          {{ item | filter: 'Indentation of for loop tag' }}
        {%- endfor %}
        `
      ],
      [
        liquid`
        {% case variable %}
        {% when first_value %}
        first_expression
        {% when second_value %}
        second_expression
        {% else %}
        third_expression
        {% endcase %}
        `,
        liquid`
        {% case variable %}
          {% when first_value %}
            first_expression
          {% when second_value %}
            second_expression
          {% else %}
            third_expression
        {% endcase %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        normalizeSpacing: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Structure Test: Nested block tag indentations', t => {

  forAssert(
    [
      [
        liquid`
        {% tag %}
        {% if condition == assertion -%}
        {{ 'Indentation 2' }}
        {% elsif 'Dedentation 1' %}
        {{ 'Indentation' }}
        {% elsif 'Dedentation 1' %}
        {{ 'Indentation 2' }}
        {% else %}
        {{ 'Indentation 2' }}
        {% endif %}
        {% endtag %}
        `,
        liquid`
        {% tag %}
          {% if condition == assertion -%}
            {{ 'Indentation 2' }}
          {% elsif 'Dedentation 1' %}
            {{ 'Indentation' }}
          {% elsif 'Dedentation 1' %}
            {{ 'Indentation 2' }}
          {% else %}
            {{ 'Indentation 2' }}
          {% endif %}
        {% endtag %}
        `
      ],
      [
        liquid`
        {% case 'xxx' %}
        {% when foo %}
        {% if condition == assertion -%}
        {{ 'Indentation Level 4' }}
        {% elsif 'Dedentation 3' %}
        {% for item in numbers -%}
        {{ 'Indentation Level 5' }}
        {% case 'Indentation Level 5' %}
        {% when level['6']%}
          {{ 'Indentation Level 7' }}
        {% when level[6] %}
              {{ 'Indentation Level 7' }}
        {% else %}
        {{ 'Indentation Level 7' }}
        {% endcase %}
        {% else %}
        {{ 'Indentation Level 5' }}
        {%- endfor %}
        {% else %}
        {{ 'Indentation Level 5' }}
        {%- endif -%}
        {% when 'Dedentation 1' %}
         {{ 'Indentation 2' }}
        {% else %}
        {{ 'Indentation 2' }}
        {% endcase %}
        `,
        liquid`
        {% case 'xxx' %}
          {% when foo %}
            {% if condition == assertion -%}
              {{ 'Indentation Level 4' }}
            {% elsif 'Dedentation 3' %}
              {% for item in numbers -%}
                {{ 'Indentation Level 5' }}
                {% case 'Indentation Level 5' %}
                  {% when level['6'] %}
                    {{ 'Indentation Level 7' }}
                  {% when level[6] %}
                    {{ 'Indentation Level 7' }}
                  {% else %}
                    {{ 'Indentation Level 7' }}
                {% endcase %}
              {% else %}
                {{ 'Indentation Level 5' }}
              {%- endfor %}
            {% else %}
              {{ 'Indentation Level 5' }}
            {%- endif -%}
          {% when 'Dedentation 1' %}
            {{ 'Indentation 2' }}
          {% else %}
            {{ 'Indentation 2' }}
        {% endcase %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      liquid: {
        normalizeSpacing: true
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Structure Test: Indentation and Dedentation', t => {

  forAssert(
    [
      [
        liquid`
        {% some_tag %}
        {{ 'Indentation Level 1' }}
        {% some_tag %}
        {{ 'Indentation Level 2' }}
        {% if condition %}
        {{ 'Indentation Level 3' }}
        {% foo %}
        {{ 'Indentation Level 4' }}
        {% endfoo %}
        {% endif%}
        {% endsome_tag %}
        {% endsome_tag %}
        `,
        liquid`
        {% some_tag %}
          {{ 'Indentation Level 1' }}
          {% some_tag %}
            {{ 'Indentation Level 2' }}
            {% if condition %}
              {{ 'Indentation Level 3' }}
              {% foo %}
                {{ 'Indentation Level 4' }}
              {% endfoo %}
            {% endif %}
          {% endsome_tag %}
        {% endsome_tag %}
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        normalizeSpacing: true
      }
    });

    t.deepEqual(actual, expect);

  });

});
