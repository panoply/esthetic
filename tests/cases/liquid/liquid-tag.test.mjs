import test from 'ava';
import { liquid, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

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
  )({
    language: 'liquid',
    markup: {
      forceAttribute: 2,
      ignoreJS: false,
      ignoreJSON: false
    }
  })(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });
});
