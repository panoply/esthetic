import test from 'ava';
import { forRule, forSample } from '@liquify/ava/prettify';
import prettify from '@liquify/prettify';

test.serial('Attribute casing', async t => {

  await forRule('cases/attributes', { lexer: 'markup' })({
    'casing-1': [
      { attributeCasing: 'preserve' },
      { attributeCasing: 'lowercase' },
      { attributeCasing: 'lowercase-name' },
      { attributeCasing: 'lowercase-value' }
    ],
    'casing-2': [
      { attributeCasing: 'preserve' },
      { attributeCasing: 'lowercase' },
      { attributeCasing: 'lowercase-name' },
      { attributeCasing: 'lowercase-value' }
    ]
  }
  , async function (source, rule, label) {

    const output = await prettify.format(source, rule);

    t.snapshot(output, label(rule));

    // t.log(output);

  });

  prettify.options({ markup: { attributeCasing: 'preserve' } });

});

test.serial('Quote handling', async t => {

  await forSample('cases/attributes')(
    [
      'quote-handling-1',
      'quote-handling-2'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});

test.serial('Preserve attribute structures', async t => {

  await forSample('cases/attributes')(
    [
      'structure-preserve-1',
      'structure-preserve-2',
      'structure-preserve-3',
      'structure-preserve-4',
      'structure-preserve-5',
      'structure-preserve-6',
      'structure-preserve-7'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});

test.serial('Force attributes', async t => {

  await forSample('cases/attributes')(
    [
      'force-attributes-1',
      'force-attributes-2',
      'force-attributes-3',
      'force-attributes-4',
      'force-attributes-5'
    ]
    , async function (source, label) {

      const output = await prettify.format(source, {
        language: 'liquid',
        preserveLine: 2,
        wrap: 0,
        markup: {
          forceLeadAttribute: false,
          forceAttribute: true,
          preserveText: true
        }
      });

      t.snapshot(output, label.description);

      // t.log(output);

    }
  );

});
