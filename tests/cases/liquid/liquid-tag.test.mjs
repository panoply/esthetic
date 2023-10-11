import test from 'ava';
import { liquid, forAssert, forSample } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('Liquid Tag - Structural tests and syntactical formations', t => {

  forAssert(
    [
      [
        liquid`{% # Capture Indentation %}

          {% liquid
            capture foo
            echo 'string 1'
            endcapture

            # comment
            capture foo
            echo 'string 1'
            endcapture
          %}

        `,
        liquid`{% # Capture Indentation %}

          {% liquid
            capture foo
              echo 'string 1'
            endcapture

            # comment
            capture foo
              echo 'string 1'
            endcapture
          %}
        `
      ],
      [
        liquid`{% # Filter ending assignments encapsulated within tag blocks %}

          {% liquid

            assign foo = object['prop'] | filter: 'foo'

            if condition and assertion
            assign ENDING_RSB = object['prop'][0]
            elsif
            assign ENDING_WORD = object['prop'].value
            elsif
            assign ENDING_QUOTE = 'string'
            elsif
            assign ENDING_NUMBER = 1000
            else
            assign ENDING_NIL = nil
            endif

            if product.selected_or_first_available_variant.featured_media
            assign seo_media = product.selected_or_first_available_variant.featured_media
            else
            assign seo_media = product.featured_media
            endif

            assign x = product.selected_or_first_available_variant.quantity_price_breaks | sort: 'quantity' | reverse
            assign current_qty = cart_qty | plus: product.selected_or_first_available_variant.quantity_rule.min
            if cart_qty > 0
            assign current_qty_for_volume_pricing = cart_qty | plus: product.selected_or_first_available_variant.quantity_rule.increment
            endif
          %}

        `,
        liquid`{% # Filter ending assignments encapsulated within tag blocks %}

          {% liquid

            assign foo = object['prop'] | filter: 'foo'

            if condition and assertion
              assign ENDING_RSB = object['prop'][0]
            elsif
              assign ENDING_WORD = object['prop'].value
            elsif
              assign ENDING_QUOTE = 'string'
            elsif
              assign ENDING_NUMBER = 1000
            else
              assign ENDING_NIL = nil
            endif

            if product.selected_or_first_available_variant.featured_media
              assign seo_media = product.selected_or_first_available_variant.featured_media
            else
              assign seo_media = product.featured_media
            endif

            assign x = product.selected_or_first_available_variant.quantity_price_breaks | sort: 'quantity' | reverse
            assign current_qty = cart_qty | plus: product.selected_or_first_available_variant.quantity_rule.min
            if cart_qty > 0
              assign current_qty_for_volume_pricing = cart_qty | plus: product.selected_or_first_available_variant.quantity_rule.increment
            endif
          %}
        `
      ],
      [
        liquid`{% # Forloop enders %}

          {% liquid

            for item in array limit: 200

            echo item.prop | filter: 1000

            for range in (1..1000)
              echo range
            endfor
            endfor

          %}

        `,
        liquid`{% # Forloop enders %}

          {% liquid

            for item in array limit: 200

              echo item.prop | filter: 1000

              for range in (1..1000)
                echo range
              endfor
            endfor
          %}
        `
      ],
      [
        liquid`{% # Case Structures and deep nesting %}

        {%- liquid

          case section.settings.sort
          when 'products_high', 'products_low'
          assign collections = collections.vendors | sort: 'all_products_count'
          when 'date', 'date_reversed'
          assign collections = collections.vendors | sort: 'published_at'
          else
          case section.settings.sort
          when 'products_high', 'products_low'
          assign collections = collections.vendors | sort: 'all_products_count'
          when 'date', 'date_reversed'
          assign collections = collections.vendors | sort: 'published_at'
          endcase
          endcase

        -%}
        `,
        liquid`{% # Case Structures and deep nesting %}

        {%- liquid

          case section.settings.sort
            when 'products_high', 'products_low'
              assign collections = collections.vendors | sort: 'all_products_count'
            when 'date', 'date_reversed'
              assign collections = collections.vendors | sort: 'published_at'
            else
              case section.settings.sort
                when 'products_high', 'products_low'
                  assign collections = collections.vendors | sort: 'all_products_count'
                when 'date', 'date_reversed'
                  assign collections = collections.vendors | sort: 'published_at'
              endcase
          endcase
        -%}
        `
      ],
      [
        liquid`{% # Conditional Structures %}
        {% liquid
          assign rating_decimal = 0
          assign decimal = product.metafields.reviews.rating.value.rating | modulo: 1
          if decimal >= 0.3 and decimal <= 0.7
          assign rating_decimal = 0.5
          elsif decimal > 0.7
          assign rating_decimal = 1
          endif
        %}
        `,
        liquid`{% # Conditional Structures %}
        {% liquid
          assign rating_decimal = 0
          assign decimal = product.metafields.reviews.rating.value.rating | modulo: 1
          if decimal >= 0.3 and decimal <= 0.7
            assign rating_decimal = 0.5
          elsif decimal > 0.7
            assign rating_decimal = 1
          endif
        %}
        `
      ]
    ]
  )(function (source, expected) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      liquid: {
        dedentTagList: []
      },
      markup: {
        forceAttribute: 2,
        normalizeSpacing: true
      }
    });

    // console.log(actual);
    t.deepEqual(actual, expected);

  });
});

test('Liquid Tag: Normalize spacing of Liquid Tag internal expressions', t => {

  forAssert(
    [
      [
        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}

          {% liquid
            if x ==foo .   property [   0   ]  .   xxx  and bar   !=   baz  or 5000<   2000
              unless   y ==x
            assign   var    =   xxx |filter : ' preserve-string '|filter:100|filter   :true
            echo 'foo' | filter | filter: 'bar'  ,  300 | append: 'from'  , 'to'  , something  , 1000
            echo 'foo' |filter|filter:'bar',300 | append:'from' ,'to',something  ,   1000
              endunless
            endif
          %}

        `,
        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}

          {% liquid
            if x == foo.property[0].xxx and bar != baz or 5000 < 2000
              unless y == x
                assign var = xxx | filter: ' preserve-string ' | filter: 100 | filter: true
                echo 'foo' | filter | filter: 'bar', 300 | append: 'from', 'to', something, 1000
                echo 'foo' | filter | filter: 'bar', 300 | append: 'from', 'to', something, 1000
              endunless
            endif
          %}
        `
      ],
      [
        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}

        {% liquid

          if x == foo.property[0].xx and bar != baz or 5000 < 2000
            unless y == x
              assign var = xxx | filter: ' preserve-string ' | filter: 100 | filter: true
            endunless
          endif
        %}

      `,

        liquid`{% # Extraneous spacing between characters within a Liquid Tag %}

        {% liquid

          if x == foo.property[0].xx and bar != baz or 5000 < 2000
            unless y == x
              assign var = xxx | filter: ' preserve-string ' | filter: 100 | filter: true
            endunless
          endif
        %}

      `
      ]
    ]
  )(function (source, expected) {

    const actual = esthetic.format(source, {
      language: 'liquid',
      markup: {
        forceAttribute: 2,
        normalizeSpacing: true
      }
    });

    // console.log(actual);
    t.deepEqual(actual, expected);

  });
});

test('Liquid Tag: Indentation depth levels encapsulated by markup', t => {

  forSample(
    [

      liquid`{% # Nested liquid tag newline and indentation %}

        <!-- SINGLE NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          {% liquid
            if x == foo
              unless y == x
                for i in array
                  if bar
                    echo 'foo'
                  endif
                endfor
              endunless
            endif
          %}
        </div>

        <!-- DEEPLY NESTED -->
        <div
          id="attr-1"
          class="some-class"
          data-attr="1"
          data-attr="2">
          <main>
            <div>
              <ul>
                <li>
                  <aside>
                    {% liquid
                      if x == foo
                        unless y == x
                          for i in array
                            if bar
                              echo 'foo'
                            endif
                          endfor
                        endunless
                      endif
                    %}
                  </aside>
                </li>
              </ul>
            </div>
          </main>
        </div>

      `
    ]
  )(
    {
      language: 'liquid',
      liquid: {
        delimiterPlacement: 'default'
      },
      markup: {
        forceAttribute: 2
      }
    }
  )(function (source, rules) {

    const actual = esthetic.format(source, rules);

    t.deepEqual(actual, source);

  });
});
