import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test.serial.skip('HTML embedded script tag', async t => {

  await util.forRule('cases/embedded', {
    'html-script-js-1': [
      {
        language: 'html'
      },
      {
        language: 'html'
      }
    ],
    'html-script-js-2': [

    ]
  }
  , async function (source, rule, label) {

    const input = await prettify.format(source, rule);

    t.snapshot(input, label.description);

    // t.log(input);

  });

});

test.serial.skip('HTML embedded application/json+ld script tag', async t => {

  await util.forRule('cases/embedded', {
    'html-script-json-1': [
      {
        language: 'html'
      },
      {
        language: 'html'
      }
    ],
    'html-script-json-2': [

    ]
  }
  , async function (source, rule, label) {

    const input = await prettify.format(source, rule);

    t.snapshot(input, label.description);

    // t.log(input);

  });

});

test.serial.skip('Liquid embedded JavaScript tag', async t => {

  await util.forRule('cases/embedded', {
    'liquid-javascript': [
      {
        language: 'html'
      }

    ]
  }
  , async function (source, rule, label) {

    const input = await prettify.format(source, rule);

    t.snapshot(input, label.description);

    // t.log(input);

  });

});
