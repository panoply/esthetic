import test from 'ava';
import { liquid, forAssert, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test.skip('Liquid Tag: Normalising spacing of Liquid Tag internal expressions', t => {

  forAssert(
    [
      [
        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}



          {% liquid
            if x==foo .   property [   0   ]  .   xxx  and bar   !=   baz  or 5000<   2000
              unless   y ==x
            assign   var    =   xxx |filter : ' preserve-string '|filter:100|filter   :true
            echo 'foo' | filter | filter: 'bar'  ,  300 | append: 'from'  , 'to'  , something  , 1000
            echo 'foo' |filter|filter:'bar',300 | append:'from' ,'to',something  ,   1000
              endunless
            endif
          %}

          {% if x==foo and bar   !=   baz  or 5000<   2000 %}
          {% endif %}

        `,
        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}

          {% liquid

            if x == foo and bar != baz or 5000 < 2000
              unless y == x
                assign var = xxx | filter: ' preserve-string ' | filter: 100 | filter: true
              endunless
            endif
          %}

        `
      ]
    ]
  )(function (source, expected) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: 2,
        normalizeSpacing: true
      }
    });

    // console.log(actual);
    t.deepEqual(actual, expected);

  });
});

test('Structure Test: Indentation depth levels encapsulated by markup', t => {

  forSample(
    [

      liquid`{% # Nested liquid tag newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          {% liquid
            if x == foo
              unless y == x
                for i in array
                  if bar
                    echo 'foo'
                  endif
                endfor
              endunless
            endif
          %}
        </div>

        <!-- DEEPLY NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <main>
            <div>
              <ul>
                <li>
                  <aside>
                    {% liquid
                      if x == foo
                        unless y == x
                          for i in array
                            if bar
                              echo 'foo'
                            endif
                          endfor
                        endunless
                      endif
                    %}
                  </aside>
                </li>
              </ul>
            </div>
          </main>
        </div>

      `
    ]
  )(
    {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'default'
      },
      markup: {
        forceAttribute: 2
      }
    }
  )(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });
});
