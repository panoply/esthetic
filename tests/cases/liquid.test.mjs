import test from 'ava';
import util from '@prettify/test-utils';
import prettify from '@liquify/prettify';

test.serial('Delimiter Trims Cases', async t => {

  await util.forRule('cases/liquid')(
    {
      'delimiter-trims-force': [
        {
          language: 'liquid',
          markup: {
            delimiterTrims: 'force'
          }
        }
      ],
      'delimiter-trims-strip': [
        {
          language: 'liquid',
          markup: {
            delimiterTrims: 'strip'
          }
        }
      ],
      'delimiter-trims-tags': [
        {
          language: 'liquid',
          markup: {
            delimiterTrims: 'tags'
          }
        }
      ],
      'delimiter-trims-outputs': [
        {
          language: 'liquid',
          markup: {
            delimiterTrims: 'outputs'
          }
        }
      ],
      'delimiter-trims-preserve': [
        {
          language: 'liquid',
          markup: {
            delimiterTrims: 'preserve'
          }
        }
      ]
    }
    , async function (source, rule, label) {

      const input = await prettify.format(source, rule);

      t.snapshot(input, label.description);

      // t.log(input);

    }
  );

  t.pass();

});

test.serial.skip('Comment Preservation', async t => {

  const source = await util.getSample('cases/liquid/comment-preserve');

  const output = await prettify.format(source, {
    language: 'liquid'
  });

  t.log(output);
  t.pass();

});

test.serial.skip('Conditional Structures', async t => {

  const source = await util.getSample('cases/liquid/conditional-structure');

  const output = await prettify.format(source, {
    language: 'liquid',
    wrap: 80,
    markup: {
      forceAttribute: true,
      attributeChain: 'collapse',
      attributeValues: 'preserve'
    }
  });

  t.log(output);
  t.pass();

});

test.serial.skip('Liquid doctype', async t => {

  const source = await util.getSample('cases/liquid/document-sample');

  const output = await prettify.format(source, {
    language: 'liquid'
  });

  t.log(output);
  t.pass();

});
