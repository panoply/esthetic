import test from 'ava';
import * as mocks from '../mocks/export.mjs';
import * as prettify from '../../package/index.mjs';

test('Markup: Force attribute with liquid values', async t => {

  const mock = /*html*/`
  <div
        id="{{ xxx | filter: 'xxx' }}"       class="{{ foo.bar }}"
     data-x="{{ foo.bar }}"
            data-condition="{% if x %}foo{% else %}{{ x -}}{%endif%}" >
  </div>
  `

  const expect = /*html*/`
  <div
    id="{{ xxx | filter: 'xxx' }}"
    class="{{ foo.bar }}"
    data-x="{{ foo.bar }}"
    data-condition="{% if x %}foo{% else %}{{ x -}}{%endif%}" ></div>`

  const markup = await prettify.markup(mock, { forceAttribute: true });

  t.log('forceAttribute: true');
  t.is(markup, expect)

  t.pass();

});

test('Markup format', async t => {

  const markup = await prettify.markup(mocks.markup_unformatted, {
    forceAttribute: false
  });

  t.log(markup);
  t.pass();

});

test('Markup inline comment ignore', async t => {

  const markup = await prettify.markup(mocks.markup_ignore_inline, {
    forceAttribute: false
  });

  t.log(markup);
  t.pass();

});

test.skip('Markup invalid input passed', async t => {

  await t.throwsAsync(() => prettify.markup(mocks.markup_invalid));

  t.pass();

});
