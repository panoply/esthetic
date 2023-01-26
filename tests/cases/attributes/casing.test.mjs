import test from 'ava';
import { forRules, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Casing rule cases', t => {

  forRules(
    [
      liquid`

      {% # Testing HTML  "attributeCasing" rule. This case tests HTML attributes only. %}

      <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>

      `,
      liquid`

      {% # Testing HTML (markup) "attributeCasing" rule with Liquid attributes %}

      <div {{ xx }}-ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>

      `
    ]
  )(
    [
      { language: 'liquid', markup: { attributeCasing: 'preserve' } },
      { language: 'liquid', markup: { attributeCasing: 'lowercase' } },
      { language: 'liquid', markup: { attributeCasing: 'lowercase-name' } },
      { language: 'liquid', markup: { attributeCasing: 'lowercase-value' } }
    ]
  )(function (source, rules, label) {

    const snapshot = esthetic.format.sync(source, rules);

    t.snapshot(snapshot, label);

  });

});
