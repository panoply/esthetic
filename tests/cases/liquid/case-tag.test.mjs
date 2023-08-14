import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Case tag dedentation (dedentTagList) - Structure and nesting expressions', t => {

  forAssert(
    [
      [
        liquid`{% # HTML Expression %}
        {% case 'xxx' %}
        {% when void %}
        <meta id="example" content="foo and bar">
        {% when liquid_condition %}
        <section id="foo" class="bar">
        {% if condition == assertion -%}
        {{ 'Indentation Level 4' }}
        {% elsif 'singleton' %}
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 4' }}
        {%- endif -%}
        </section>
        {% when 'Dedentation 1' %}
        <main>
        <div>
         {{ 'Indentation 2' }}
        </div>
        </main>
        {% else %}
        {% render 'filename' %}
        {% endcase %}
        `,
        liquid`{% # HTML Expression %}
        {% case 'xxx' %}
        {% when void %}
          <meta id="example" content="foo and bar">
        {% when liquid_condition %}
          <section id="foo" class="bar">
            {% if condition == assertion -%}
              {{ 'Indentation Level 4' }}
            {% elsif 'singleton' %}
              {% assign foo = 'bar' %}
            {% else %}
              {{ 'Indentation Level 4' }}
            {%- endif -%}
          </section>
        {% when 'Dedentation 1' %}
          <main>
            <div>
              {{ 'Indentation 2' }}
            </div>
          </main>
        {% else %}
          {% render 'filename' %}
        {% endcase %}
        `
      ],
      [
        liquid`
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        {% when liquid_condition %}
        {% if condition == assertion -%}
        {{ 'Indentation Level 3' }}
        {% elsif 'singleton' %}
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 3' }}
        {%- endif -%}
        {% when 'Dedentation 1' %}
         {{ 'Indentation 2' }}
        {% else %}
        {{ 'Indentation 2' }}
        {% endcase %}
        `,
        liquid`
        {% case 'xxx' %}
        {% when singleton %}
          {% render 'filename' %}
        {% when liquid_condition %}
          {% if condition == assertion -%}
            {{ 'Indentation Level 3' }}
          {% elsif 'singleton' %}
            {% assign foo = 'bar' %}
          {% else %}
            {{ 'Indentation Level 3' }}
          {%- endif -%}
        {% when 'Dedentation 1' %}
          {{ 'Indentation 2' }}
        {% else %}
          {{ 'Indentation 2' }}
        {% endcase %}
        `
      ]
      ,
      [
        liquid`
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        {% when foo_1 %}
        {% when foo_2 %}
        {% when foo_3 %}
        {% when liquid_condition %}
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
        {% when singleton %}
          {% render 'filename' %}
        {% when foo_1 %}
        {% when foo_2 %}
        {% when foo_3 %}
        {% when liquid_condition %}
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
      ],
      [
        liquid`
        <section id="foo" class="bar" data-id="bax quux">
        <main id="foo" class="bar" data-id="bax quux">
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        <meta id="example" content="foo and bar">
        <meta id="example-2" content="foo and bar">
        {% when liquid_condition %}
        {% if condition == assertion -%}
        {{ 'Indentation Level 4' }}
        {% elsif 'singleton' %}
        <main>
        <div>
        {{ 'Indentation 3' }}
        </div>
        </main>
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 5' }}
        {%- endif -%}
        {% when 'Dedentation 1' %}
         {{ 'Indentation 2' }}
        {% else %}
        <main>
        <div>
        {{ 'Indentation 2' }}
        </div>
        </main>
        {% endcase %}
        </main>
        </section>
        `,
        liquid`
        <section id="foo" class="bar" data-id="bax quux">
          <main id="foo" class="bar" data-id="bax quux">
            {% case 'xxx' %}
            {% when singleton %}
              {% render 'filename' %}
              <meta id="example" content="foo and bar">
              <meta id="example-2" content="foo and bar">
            {% when liquid_condition %}
              {% if condition == assertion -%}
                {{ 'Indentation Level 4' }}
              {% elsif 'singleton' %}
                <main>
                  <div>
                    {{ 'Indentation 3' }}
                  </div>
                </main>
                {% assign foo = 'bar' %}
              {% else %}
                {{ 'Indentation Level 5' }}
              {%- endif -%}
            {% when 'Dedentation 1' %}
              {{ 'Indentation 2' }}
            {% else %}
              <main>
                <div>
                  {{ 'Indentation 2' }}
                </div>
              </main>
            {% endcase %}
          </main>
        </section>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: [
          'case'
        ]
      },
      markup: {
        forceAttribute: false,
        forceIndent: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag indentation (default) - Structure and nesting expressions', t => {

  forAssert(
    [
      [
        liquid`{% # HTML Expression %}
        {% case 'xxx' %}
        {% when void %}
        <meta id="example" content="foo and bar">
        {% when liquid_condition %}
        <section id="foo" class="bar">
        {% if condition == assertion -%}
        {{ 'Indentation Level 4' }}
        {% elsif 'singleton' %}
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 4' }}
        {%- endif -%}
        </section>
        {% when 'Dedentation 1' %}
        <main>
        <div>
         {{ 'Indentation 2' }}
        </div>
        </main>
        {% else %}
        {% render 'filename' %}
        {% endcase %}
        `,
        liquid`{% # HTML Expression %}
        {% case 'xxx' %}
          {% when void %}
            <meta id="example" content="foo and bar">
          {% when liquid_condition %}
            <section id="foo" class="bar">
              {% if condition == assertion -%}
                {{ 'Indentation Level 4' }}
              {% elsif 'singleton' %}
                {% assign foo = 'bar' %}
              {% else %}
                {{ 'Indentation Level 4' }}
              {%- endif -%}
            </section>
          {% when 'Dedentation 1' %}
            <main>
              <div>
                {{ 'Indentation 2' }}
              </div>
            </main>
          {% else %}
            {% render 'filename' %}
        {% endcase %}
        `
      ],
      [
        liquid`
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        {% when liquid_condition %}
        {% if condition == assertion -%}
        {{ 'Indentation Level 3' }}
        {% elsif 'singleton' %}
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 3' }}
        {%- endif -%}
        {% when 'Dedentation 1' %}
         {{ 'Indentation 2' }}
        {% else %}
        {{ 'Indentation 2' }}
        {% endcase %}
        `,
        liquid`
        {% case 'xxx' %}
          {% when singleton %}
            {% render 'filename' %}
          {% when liquid_condition %}
            {% if condition == assertion -%}
              {{ 'Indentation Level 3' }}
            {% elsif 'singleton' %}
              {% assign foo = 'bar' %}
            {% else %}
              {{ 'Indentation Level 3' }}
            {%- endif -%}
          {% when 'Dedentation 1' %}
            {{ 'Indentation 2' }}
          {% else %}
            {{ 'Indentation 2' }}
        {% endcase %}
        `
      ]
      ,
      [
        liquid`
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        {% when foo_1 %}
        {% when foo_2 %}
        {% when foo_3 %}
        {% when liquid_condition %}
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
          {% when singleton %}
            {% render 'filename' %}
          {% when foo_1 %}
          {% when foo_2 %}
          {% when foo_3 %}
          {% when liquid_condition %}
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
      ],
      [
        liquid`
        <section id="foo" class="bar" data-id="bax quux">
        <main id="foo" class="bar" data-id="bax quux">
        {% case 'xxx' %}
        {% when singleton %}
        {% render 'filename' %}
        <meta id="example" content="foo and bar">
        <meta id="example-2" content="foo and bar">
        {% when liquid_condition %}
        {% if condition == assertion -%}
        {{ 'Indentation Level 4' }}
        {% elsif 'singleton' %}
        <main>
        <div>
        {{ 'Indentation 3' }}
        </div>
        </main>
        {% assign foo = 'bar' %}
        {% else %}
        {{ 'Indentation Level 5' }}
        {%- endif -%}
        {% when 'Dedentation 1' %}
         {{ 'Indentation 2' }}
        {% else %}
        <main>
        <div>
        {{ 'Indentation 2' }}
        </div>
        </main>
        {% endcase %}
        </main>
        </section>
        `,
        liquid`
        <section id="foo" class="bar" data-id="bax quux">
          <main id="foo" class="bar" data-id="bax quux">
            {% case 'xxx' %}
              {% when singleton %}
                {% render 'filename' %}
                <meta id="example" content="foo and bar">
                <meta id="example-2" content="foo and bar">
              {% when liquid_condition %}
                {% if condition == assertion -%}
                  {{ 'Indentation Level 4' }}
                {% elsif 'singleton' %}
                  <main>
                    <div>
                      {{ 'Indentation 3' }}
                    </div>
                  </main>
                  {% assign foo = 'bar' %}
                {% else %}
                  {{ 'Indentation Level 5' }}
                {%- endif -%}
              {% when 'Dedentation 1' %}
                {{ 'Indentation 2' }}
              {% else %}
                <main>
                  <div>
                    {{ 'Indentation 2' }}
                  </div>
                </main>
            {% endcase %}
          </main>
        </section>
        `
      ]
    ]
  )(function (source, expect) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: []
      },
      markup: {
        forceIndent: false,
        forceAttribute: false
      }
    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (dedentTagList) - forceIndent: false, forceAttribute: true', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
        <meta
          id="example"
          content="foo and bar">
      {% when liquid_condition %}
        <section
          id="foo"
          class="bar">
          {% if condition == assertion -%}
            {{ 'Indentation Level 4' }}
          {% elsif 'singleton' %}
            {% assign foo = 'bar' %}
          {% else %}
            {{ 'Indentation Level 4' }}
          {%- endif -%}
        </section>
      {% when 'Dedentation 1' %}
        <main>
          <div>
            {{ 'Indentation 2' }}
          </div>
        </main>
      {% else %}
        {% render 'filename' %}
      {% endcase %}
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: [
          'case'
        ]
      },
      markup: {
        forceAttribute: true,
        forceIndent: false
      }

    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (dedentTagList) - forceIndent: true, forceAttribute: false', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
        <meta id="example" content="foo and bar">
      {% when liquid_condition %}
        <section id="foo" class="bar">
          {% if condition == assertion -%}
            {{ 'Indentation Level 4' }}
          {% elsif 'singleton' %}
            {% assign foo = 'bar' %}
          {% else %}
            {{ 'Indentation Level 4' }}
          {%- endif -%}
        </section>
      {% when 'Dedentation 1' %}
        <main>
          <div>
            {{ 'Indentation 2' }}
          </div>
        </main>
      {% else %}
        {% render 'filename' %}
      {% endcase %}
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: [
          'case'
        ]
      },
      markup: {
        forceAttribute: false,
        forceIndent: true
      }

    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (default) - forceIndent: false, forceAttribute: true', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
        {% when void %}
          <meta
            id="example"
            content="foo and bar">
        {% when liquid_condition %}
          <section
            id="foo"
            class="bar">
            {% if condition == assertion -%}
              {{ 'Indentation Level 4' }}
            {% elsif 'singleton' %}
              {% assign foo = 'bar' %}
            {% else %}
              {{ 'Indentation Level 4' }}
            {%- endif -%}
          </section>
        {% when 'Dedentation 1' %}
          <main>
            <div>
              {{ 'Indentation 2' }}
            </div>
          </main>
        {% else %}
          {% render 'filename' %}
      {% endcase %}
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: []
      },
      markup: {
        forceAttribute: true,
        forceIndent: false
      }

    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (default) - forceIndent: true, forceAttribute: false', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
        {% when void %}
          <meta id="example" content="foo and bar">
        {% when liquid_condition %}
          <section id="foo" class="bar">
            {% if condition == assertion -%}
              {{ 'Indentation Level 4' }}
            {% elsif 'singleton' %}
              {% assign foo = 'bar' %}
            {% else %}
              {{ 'Indentation Level 4' }}
            {%- endif -%}
          </section>
        {% when 'Dedentation 1' %}
          <main>
            <div>
              {{ 'Indentation 2' }}
            </div>
          </main>
        {% else %}
          {% render 'filename' %}
      {% endcase %}
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: []
      },
      markup: {
        forceAttribute: false,
        forceIndent: true
      }

    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (dedentTagList) - forceIndent: true, forceAttribute: true', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      {% case variable %}
      {% when first_value %}
      first_expression
      {% when second_value %}
      second_expression
      {% else %}
      third_expression
      {% endcase %}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
        <meta
          id="example"
          content="foo and bar">
      {% when liquid_condition %}
        <section
          id="foo"
          class="bar">
          {% if condition == assertion -%}
            {{ 'Indentation Level 4' }}
          {% elsif 'singleton' %}
            {% assign foo = 'bar' %}
          {% else %}
            {{ 'Indentation Level 4' }}
          {%- endif -%}
          {% case variable %}
          {% when first_value %}
            first_expression
          {% when second_value %}
            second_expression
          {% else %}
            third_expression
          {% endcase %}
        </section>
      {% when 'Dedentation 1' %}
        <main>
          <div>
            {{ 'Indentation 2' }}
          </div>
        </main>
      {% else %}
        {% render 'filename' %}
      {% endcase %}
      `
    ]
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: [
          'case'
        ]
      },
      markup: {
        forceAttribute: true,
        forceIndent: true
      }

    });

    t.deepEqual(actual, expect);

  });

});

test('Case tag with rules (default) - forceIndent: true, forceAttribute: true', t => {

  forAssert([
    [
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
      {% when void %}
      <meta id="example" content="foo and bar">
      {% when liquid_condition %}
      <section id="foo" class="bar">
      {% if condition == assertion -%}
      {{ 'Indentation Level 4' }}
      {% elsif 'singleton' %}
      {% assign foo = 'bar' %}
      {% else %}
      {{ 'Indentation Level 4' }}
      {%- endif -%}
      {% case variable %}
      {% when first_value %}
      first_expression
      {% when second_value %}
      second_expression
      {% else %}
      third_expression
      {% endcase %}
      </section>
      {% when 'Dedentation 1' %}
      <main>
      <div>
       {{ 'Indentation 2' }}
      </div>
      </main>
      {% else %}
      {% render 'filename' %}
      {% endcase %}
      {% case variable %}
      {% when first_value %}
      first_expression
      {% when second_value %}
      second_expression
      {% else %}
      third_expression
      {% endcase %}
      `,
      liquid`{% # HTML Expression %}
      {% case 'xxx' %}
        {% when void %}
          <meta
            id="example"
            content="foo and bar">
        {% when liquid_condition %}
          <section
            id="foo"
            class="bar">
            {% if condition == assertion -%}
              {{ 'Indentation Level 4' }}
            {% elsif 'singleton' %}
              {% assign foo = 'bar' %}
            {% else %}
              {{ 'Indentation Level 4' }}
            {%- endif -%}
            {% case variable %}
              {% when first_value %}
                first_expression
              {% when second_value %}
                second_expression
              {% else %}
                third_expression
            {% endcase %}
          </section>
        {% when 'Dedentation 1' %}
          <main>
            <div>
              {{ 'Indentation 2' }}
            </div>
          </main>
        {% else %}
          {% render 'filename' %}
      {% endcase %}
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
  ])(function (source, expect) {

    const actual = esthetic.format(source, {

      language: 'liquid',
      wrap: 0,
      indentSize: 2,
      liquid: {
        normalizeSpacing: true,
        dedentTagList: []
      },
      markup: {
        forceAttribute: true,
        forceIndent: true
      }

    });

    t.deepEqual(actual, expect);

  });

});
