import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Single Depth Indentation', t => {

  forAssert(
    [
      [
        liquid`
        {%- if condition -%}
        <div>
        {%- endif -%}

        {%- if condition -%}
        </div>
        {%- endif -%}
        `,
        liquid`
        {%- if condition -%}
          <div>
        {%- endif -%}

        {%- if condition -%}
          </div>
        {%- endif -%}
        `
      ],
      [
        liquid`
        {%- unless condition -%}
        <div>
        {%- endunless -%}

        {%- unless condition -%}
        </div>
        {%- endunless -%}
        `,
        liquid`
        {%- unless condition -%}
          <div>
        {%- endunless -%}

        {%- unless condition -%}
          </div>
        {%- endunless -%}
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, { language: 'html' });

    t.deepEqual(actual, expect);

  });

});

test('Multiple Depth Indentation', t => {

  forAssert(
    [
      [
        liquid`
        {%- if condition_1 -%}
        {%- if condition_2 -%}
        <div>
        {%- endif -%}
        {%- endif -%}

        {%- if condition_1 -%}
        {%- if condition_2 -%}
        </div>
        {%- endif -%}
        {%- endif -%}
        `,
        liquid`
        {%- if condition_1 -%}
          {%- if condition_2 -%}
            <div>
          {%- endif -%}
        {%- endif -%}

        {%- if condition_1 -%}
          {%- if condition_2 -%}
            </div>
          {%- endif -%}
        {%- endif -%}
        `
      ],
      [
        liquid`
        {%- unless condition_1 -%}
        {%- unless condition_2 -%}
        <div>
        {%- endunless -%}
        {%- endunless -%}

        {%- unless condition_1 -%}
        {%- unless condition_2 -%}
        </div>
        {%- endunless -%}
        {%- endunless -%}
        `,
        liquid`
        {%- unless condition_1 -%}
          {%- unless condition_2 -%}
            <div>
          {%- endunless -%}
        {%- endunless -%}

        {%- unless condition_1 -%}
          {%- unless condition_2 -%}
            </div>
          {%- endunless -%}
        {%- endunless -%}
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, { language: 'html' });

    t.deepEqual(actual, expect);

  });

});

test('Nested Structures Indentation', t => {

  forAssert(
    [
      [
        liquid`
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
        <div>
        {%- endif -%}

        {%- if condition -%}
        </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        `,
        liquid`
        {% if condition %}
          <main>
            <div>
              <section>
                {%- if condition -%}
                  <div>
                {%- endif -%}

                {%- if condition -%}
                  </div>
                {%- endif -%}
              </section>
            </div>
          </main>
        {% endif %}
        `
      ],
      [
        liquid`
        <body>
        {%- unless condition -%}
        <aside>
        {%- endunless -%}
        <div>
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
        <div>
        {%- endif -%}

        {%- if condition -%}
        </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        </div>
        {%- unless condition -%}
        </aside>
        {%- endunless -%}
        </body>
        `,
        liquid`
        <body>
          {%- unless condition -%}
            <aside>
          {%- endunless -%}
          <div>
            {% if condition %}
              <main>
                <div>
                  <section>
                    {%- if condition -%}
                      <div>
                    {%- endif -%}

                    {%- if condition -%}
                      </div>
                    {%- endif -%}
                  </section>
                </div>
              </main>
            {% endif %}
          </div>
          {%- unless condition -%}
            </aside>
          {%- endunless -%}
        </body>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, { language: 'html' });

    t.deepEqual(actual, expect);

  });

});

test('Nested Structures with sibling children Indentation', t => {

  forAssert(
    [
      [
        liquid`
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
        <div>
        {%- endif -%}
        {% if condition %}
          <main>
            <div>
              <section>
                {%- if condition -%}
                  <div>
                {%- endif -%}
                <ul>
                          <li>Foo</li>
                        </ul>
                {%- if condition -%}
                  </div>
                {%- endif -%}
              </section>
            </div>
          </main>
        {% endif %}
        {%- if condition -%}
        </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        `,
        liquid`
        {% if condition %}
          <main>
            <div>
              <section>
                {%- if condition -%}
                  <div>
                {%- endif -%}
                {% if condition %}
                  <main>
                    <div>
                      <section>
                        {%- if condition -%}
                          <div>
                        {%- endif -%}
                        <ul>
                          <li>Foo</li>
                        </ul>
                        {%- if condition -%}
                          </div>
                        {%- endif -%}
                      </section>
                    </div>
                  </main>
                {% endif %}
                {%- if condition -%}
                  </div>
                {%- endif -%}
              </section>
            </div>
          </main>
        {% endif %}
        `
      ],
      [
        liquid`
        <body>
        {%- unless condition -%}
        <aside>
        {%- endunless -%}
        <div>
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
          <div>
        {%- endif -%}

        {% for x in array %}
          {% case 'xxx' %}
          {% when void %}
            <meta id="example" content="foo and bar">
        {% when liquid_condition %}
          <section id="foo" class="bar">
        {%- if condition -%}
          <div>
        {%- endif -%}

        {% if condition == assertion -%}
          {{ 'Indentation Level 4' }}
        {% elsif 'singleton' %}
          {% assign foo = 'bar' %}
        {% else %}
          {{ 'Indentation Level 4' }}
        {%- endif -%}

        {%- if condition -%}
          </div>
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
        {% endfor %}

        {%- if condition -%}
          </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        </div>
        {%- unless condition -%}
        </aside>
        {%- endunless -%}
        </body>
        `,
        liquid`
        <body>
          {%- unless condition -%}
            <aside>
          {%- endunless -%}
          <div>
            {% if condition %}
              <main>
                <div>
                  <section>
                    {%- if condition -%}
                      <div>
                    {%- endif -%}

                    {% for x in array %}
                      {% case 'xxx' %}
                        {% when void %}
                          <meta id="example" content="foo and bar" />
                        {% when liquid_condition %}
                          <section id="foo" class="bar">
                            {%- if condition -%}
                              <div>
                            {%- endif -%}

                            {% if condition == assertion -%}
                              {{ 'Indentation Level 4' }}
                            {% elsif 'singleton' %}
                              {% assign foo = 'bar' %}
                            {% else %}
                              {{ 'Indentation Level 4' }}
                            {%- endif -%}

                            {%- if condition -%}
                              </div>
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
                    {% endfor %}

                    {%- if condition -%}
                      </div>
                    {%- endif -%}
                  </section>
                </div>
              </main>
            {% endif %}
          </div>
          {%- unless condition -%}
            </aside>
          {%- endunless -%}
        </body>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, { language: 'html' });

    t.deepEqual(actual, expect);

  });

});

test('Nested Structures with attributes', t => {

  forAssert(
    [
      [
        liquid`
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
        <div id="foo" class="bar" data-bax="lorem-ipsum">
        {%- endif -%}

        {%- if condition -%}
        </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        `,
        liquid`
        {% if condition %}
          <main>
            <div>
              <section>
                {%- if condition -%}
                  <div
                    id="foo"
                    class="bar"
                    data-bax="lorem-ipsum">
                {%- endif -%}

                {%- if condition -%}
                  </div>
                {%- endif -%}
              </section>
            </div>
          </main>
        {% endif %}
        `
      ],
      [
        liquid`
        <body>
        {%- unless condition -%}
        <aside id="foo" class="bar" data-bax="lorem-ipsum" {{ object.prop }}>
        {%- endunless -%}
        <div       id="foo"
              class="bar"
              data-bax="lorem-ipsum">
        {% if condition %}
        <main>
          <div>
        <section>
        {%- if condition -%}
        <div>
        {%- endif -%}

        {%- if condition -%}
        </div>
        {%- endif -%}
        </section>
        </div>
        </main>
        {% endif %}
        </div>
        {%- unless condition -%}
        </aside>
        {%- endunless -%}
        </body>
        `,
        liquid`
        <body>
          {%- unless condition -%}
            <aside
              id="foo"
              class="bar"
              data-bax="lorem-ipsum"
              {{ object.prop }}>
          {%- endunless -%}
          <div
            id="foo"
            class="bar"
            data-bax="lorem-ipsum">
            {% if condition %}
              <main>
                <div>
                  <section>
                    {%- if condition -%}
                      <div>
                    {%- endif -%}

                    {%- if condition -%}
                      </div>
                    {%- endif -%}
                  </section>
                </div>
              </main>
            {% endif %}
          </div>
          {%- unless condition -%}
            </aside>
          {%- endunless -%}
        </body>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      attributeLineBreak: true
    });

    t.deepEqual(actual, expect);

  });

  esthetic.rules({
    attributeLineBreak: false
  });
});
