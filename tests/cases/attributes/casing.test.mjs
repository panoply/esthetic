import { forAssert, liquid } from '@liquify/ava/esthetic';
import test from 'ava';
import esthetic from 'esthetic';

test('Attribute casing tule: preserve', t => {

  forAssert(
    [
      [
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>
        `,
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      attributeCasing: 'preserve'
    });

    t.deepEqual(actual, expect);

  });

});

test('Attribute casing tule: lowercase', t => {

  forAssert(
    [
      [
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>
        `,
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div id="foo" class="helloworld" data-value="example" data-boolean></div>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      attributeCasing: 'lowercase'
    });

    t.deepEqual(actual, expect);

  });

});

test('Attribute casing rule: lowercase-value', t => {

  forAssert(
    [
      [
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>
        `,
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="foo" class="helloworld" data-VaLuE="example" DATA-BOOLEAN></div>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      attributeCasing: 'lowercase-value'
    });

    t.deepEqual(actual, expect);

  });

});

test('Attribute casing rule: lowercase-name', t => {

  forAssert(
    [
      [
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div ID="FOO" class="HelloWorld" data-VaLuE="eXampLE" DATA-BOOLEAN></div>
        `,
        liquid`
        {% # Testing HTML "attributeCasing" rule. This case tests HTML attributes only. %}
        <div id="FOO" class="HelloWorld" data-value="eXampLE" data-boolean></div>
        `
      ]
    ]
  )(function (input, expect) {

    const actual = esthetic.format(input, {
      language: 'html',
      attributeCasing: 'lowercase-name'
    });

    t.deepEqual(actual, expect);

  });

});
