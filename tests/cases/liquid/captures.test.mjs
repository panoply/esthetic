import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Capture nested within capature occurances', t => {

  forAssert(
    [

      [
        liquid`
        {% capture first %}
        foo
        {% capture second %}nested{% endcapture %}
        {% capture third %}
        nested
        {% endcapture %}
        {% endcapture %}
        `,
        liquid`
        {% capture first %}
        foo
        {% capture second %}nested{% endcapture %}
        {% capture third %}
        nested
        {% endcapture %}
        {% endcapture %}
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

test('Capture start tag indentation and preservation', t => {

  forAssert(
    [

      [
        liquid`
        <main>
          <div>
            <div class="xxx">

        {% capture sizes %}(max-width: {{ settings.logo_width | times: 2 }}px){% endcapture %}
        {% capture widths %}{{ settings.logo_width }}, {{ settings.logo_width | times: 2 }}{% endcapture %}

        <section>
          <div>
            <div class="xxx">
        {% capture test %}something{% endcapture %}

        {% capture test %}
        something

        {% endcapture %}
            </div>
          </div>
        </section>
        </div>
          </div>
        </main>
        `,
        liquid`
        <main>
          <div>
            <div class="xxx">

              {% capture sizes %}(max-width: {{ settings.logo_width | times: 2 }}px){% endcapture %}
              {% capture widths %}{{ settings.logo_width }}, {{ settings.logo_width | times: 2 }}{% endcapture %}
              <section>
                <div>
                  <div class="xxx">
                    {% capture test %}something{% endcapture %}
                    {% capture test %}
        something

        {% endcapture %}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
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
