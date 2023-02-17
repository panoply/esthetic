import test from 'ava';
import { forAssert, liquid } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test.todo('Write Force Tests');

test.skip('Forcing Filters: Newlined filters and filter arguments', t => {

  forAssert(
    [
      [
        liquid`
        {% assign x = settings.logo
          | image_url: width: 500
          | image_tag: class: 'header__heading-logo motion-reduce'
            , widths: '50, 100, 150, 200, 250, 300, 400, 500'
            , height: logo_height
            , width: settings.logo_width
            , alt: logo_alt
          | replace: ',' , 'foo'
          | font_family: 'bold', '300', 'exec' %}

        `
      ]
    ]
  );
});

test.skip('Forcing Conditions: Newlined control conditions', t => {

  forAssert(
    [
      [
        liquid`
          {% unless product.metafields.data.material_shell.value == nil
        and product.metafields.data.material_lining.value == nil
        and product.metafields.data.material_padding.value == nil
        and product.metafields.data.material_piping.value == nil
        and product.metafields.data.material_webbing.value == nil %}

        {% form 'some-form', id: 'some-long-id', attr-1: 'foo', attr-2: 'bar', attr-3: 'baz', attr-4: 'xxx' %}

        {% endform %}

        hello world
        {% endunless %}

        `
      ]
    ]
  );
});
