import test from 'ava';
import * as prettify from '../index.mjs';
import * as mocks from './mocks/export.mjs';

test('Example Snap', t => {

  const snap = 'xxx';

  t.snapshot(snap);

});

test('Example Snapsss', t => {

  const snap = `<div id="{{ first }}">
<div
  id="ssss" {{ second.attr }} class="xxxxxx {{- within.value -}}"
        data-x="zzzz" {{ last.attr }}
  >

  <div data-attr="{{ within.value }}"  class={{ no.quotations }}
  id="{%if x == xx%} {{ condition.in_value -}} {% endif -%}">

  <div id={{ no.quotations }} class="xxx"
  {% unless x %} data-{{ attr_between | filter: 'xxx' }}-xxx="ssss"
  {% endunless %}>

  </div>
  </div>
  </div>
</div>`;

  t.snapshot(snap);
  t.snapshot(snap);

});

test.skip('test', t => {

  const opts = {
    forceAttribute: false,
    wrap: 80,
    attributeGlue: true
  };

  prettify.options({
    markup: opts
  });

  t.log('\n', opts, '\n');

  prettify
    .markup(mocks.markup.markup_example)
    .then(value => {

      t.log(value);

    })
    .catch(e => t.log(e));

  t.pass('Test passed');
});

test.skip('test re-runs', t => {

  /* prettify.options({
    markup: {
      forceAttribute: false,
      wrap: 90
    }
  }); */

  prettify
    .markup(mocks.markup.markup_play)
    .then(value => {

      // t.log(value);
      prettify
        .markup(value)
        .then(v => {

          //  t.log(v);

          prettify
            .markup(v)
            .then(x => {
              t.log(x);
            });
        });
    })
    .catch(e => t.log(e));

  t.pass('Test passed');
});
