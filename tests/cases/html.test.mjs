import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('attribute keywords', async t => {

  const source = await util.getSample('cases/markup/attribute-keyword');

  const output = await prettify.format(source, {
    language: 'html',
    languageName: 'HTML',
    mode: 'beautify'
  });

  t.log(output);
  t.pass();

});

test.serial.skip('html5 doctype', async t => {

  const source = await util.getSample('cases/markup/html5-doctype');

  const output = await prettify.format(source, {
    language: 'html',
    languageName: 'HTML',
    mode: 'beautify'
  });

  t.log(output);
  t.pass();

});
