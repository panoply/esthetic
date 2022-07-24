import test from 'ava';
import { samples } from '@liquify/test-utils';
import prettify from '@liquify/prettify';

test.serial('HTML embedded script tag', async t => {

  const source = await samples.cases('embedded/html-script');

  const input = await prettify.format(source, {
    language: 'html'
  });

  t.log(input);

  t.pass();

});

test.serial.skip('HTML embedded application/json+ld script tag', async t => {

  const source = await samples.cases('embedded/html-json-ld');

  const input = await prettify.format(source, {
    language: 'html',
    json: {
      objectSort: true
    }
  });

  t.log(input);

  t.pass();

});

test.serial.skip('Liquid embedded JavaScript tag', async t => {

  const source = await samples.cases('liquid/javascript');

  prettify.format(source, {
    script: {
      objectSort: true
    }
  });

  t.log();

  t.pass();

});
