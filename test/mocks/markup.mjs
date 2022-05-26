/* -------------------------------------------- */
/* INLINE IGNORES                               */
/* -------------------------------------------- */

export const markup_play = `


<div id="x"
  class
="xxx xxx xxx" data- {% if x %} {{ x }} {%- else -%}foo{%- endif %}-id="within" aria-x="foo">

Hello world!



<div    {% if xx -%}data-{{ xx }}{%- else -%}
id{%- endif %}="prepended"
   aria-x="foo" class="{{ no_quotations }}"
>

hello world!

{%- comment -%}
products

{%- endcomment %}

  <div class="id" data-class="foo"></div>


    <div
    {% if x %}
      xxx
    {% endif %}>

    Lorem ipsum dolor.
</div>

  <div class="id" data-class="foo" data-attr-name="xxoxox" aria-name="xxxxx"></div>
</div>

</div>


`;

export const markup_example = `



<script>
const foo = 'bar'

const regex = /20/g;

if(2 === 4) return true

const x = f ? 1: 4

function name(foo) {
  const o = {
    one: 2,
    two: [
      {
        four: 5
      }
    ]
  }
}
</script>

{%- comment -%}

PRODUCT ITEM

This snippet will render a product item as
part of a collection. Snippet variables are
passed in the render call.

{%- endcomment %}

<div class="product-item {{ grid }}"{%- if style -%} {{ style }} {%- endif -%} {{ target }}>

  {%- comment -%}

  ON SALE BADGE

  Renders a small text badge overlay in
  the top left corner of the product image

  {%- endcomment -%}

  {%- if product.available and product.compare_at_price > product.price -%}
  <div class="badge sale">
  {{- 'product_item.on_sale' | t -}}
  </div>
  {%- endif -%}

{%- unless product.available -%}
<div class="badge sold-out">
  {%- if product.vendor == 'Spring / Summer 22'  -%}
  <small>
  AVAILABLE SOON
  </small>
  {%- else -%}
  {{- 'product_item.sold_out' | t -}}
  {%- endif -%}
</div>
{%- endunless -%}

<a href="{{ product.url }}" class="d-block">
<div class="details d-flex ai-center jc-center text-center">

{%- comment -%}

LOW STOCK BADGE

When quantity levels are below or equal
to 4 a low stock badge is rendered.

{%- endcomment -%}
{%- if product.available -%}

{%- for v in product.variants -%}
{%- assign stock = stock | default: 0 | plus: v.inventory_quantity -%}
{%- if stock >= 4 -%}
  {% break %}
{%- endif -%}
{%- endfor -%}

{%- if stock <= 4 -%}
<span class="low-stock h6">
  {{- 'words.only' | t -}}&nbsp;{{ stock }}&nbsp;{{- 'product_item.low_stock' | t -}}
</span>
{%- endif -%}
{%- endif -%}

<ul>

{%- comment -%}

PRODUCT NAME

The product name is split using an "En Dash"
UTF: 16:0x2013 uncode character.

{%- endcomment -%}
<li class="d-block h5 mb-1">
{{- product.title | split: '–' | first -}}
</li>

{%- comment -%}

VARIANT NAME

Spilts product name on variant using an "En Dash"
UTF: 16:0x2013 uncode character.

{%- endcomment -%}
<li class="d-block h6 mt-0">
{{- product.title | split: '–' | last | strip -}}
</li>

{%- comment -%}

PRICE INTEGER

Capture of the product price. This is applied so prices
can render in attributes for dynamic coversion. This is
only useful when store is in SEK.

{%- endcomment -%}
{%- capture product_price -%}
{%- if cart.currency.iso_code == shop.currency -%}
  {{- product.price
  | money_without_trailing_zeros
  | remove: ','
  | remove: '.'
  | remove: cart.currency.symbol -}}
{% endif %}
{%- endcapture -%}

{%- if product.compare_at_price > product.price -%}

{%- comment -%}

  COMPARE AT PRICE INTEGER

  Same logic as price integer but applied to the
  compare_at_price amount.

{%- endcomment -%}
{%- capture compared_price -%}
{%- if cart.currency.iso_code == shop.currency -%}
{{ product.compare_at_price
| money_without_trailing_zeros
| remove: ','
| remove: '.'
| remove: cart.currency.symbol -}}
{% endif %}

{{-
  product.compare_at_price
| money_without_trailing_zeros
| remove: ','
| remove: '.'
| remove: cart.currency.symbol
 -}}

{%- endcapture -%}



{%- comment -%}

  DISCOUNTED PRICE

  The selling price of the product as per
  the amount defined within Shopify.

{%- endcomment -%}
<li
  class="price h5 d-inline mr-1"
  data-currency-price="{{- product_price | default: 'NaN'  }}">
  {{- product.price | money_without_trailing_zeros -}}
</li>

{%- comment -%}

  ORIGINAL PRICE

  The standard (retail) price before
  discount was applied, ie: the original price.

{%- endcomment -%}
<li
  class="price price-old h5 d-inline ml-1"
  data-currency-price="{{- compared_price | default: 'NaN'  }}">
  {{- product.compare_at_price | money_without_trailing_zeros  -}}
</li>

{%- else -%}

{%- comment -%}

  RETAIL PRICE

  The standard (retail) price of the product.
  This block is rendered when no discount is
  applied on the pricing.

{%- endcomment -%}
<li
  class="price h5 d-inline mr-1"
  data-currency-price="{{- product_price | default: 'NaN'  }}">
  {{- product.price | money_without_trailing_zeros -}}
</li>

{%- endif -%}

</ul>

{%- comment -%}

HIGHLIGHT BANNER

{%- endcomment -%}
{%- if product.metafields.product.highlight != null -%}
<div id="foo" aria-active="x" class="highlight h6">

{%- comment -%}

  For aesthetics when a highlight is
  reversible we reverse the R letter.

{%- endcomment -%}
{%- if product.metafields.product.highlight contains 'Reversible'-%}
  {{- product.metafields.product.highlight
    | replace: 'Reversible', 'Reve<span class="letter-flip">r</span>sible' -}}
{%- else -%}
  {{- product.metafields.product.highlight -}}
{%- endif -%}

</div>
{%- endif -%}

</div>

{%- comment -%}

PRODUCT IMAGES

Product images are lazy loaded using lazysizes
module. This logic is repeated within the virtual
mobile component.

{%- endcomment -%}
<div class="aspect-ratio">
<picture>
<source
media="xl"
data-srcset="{{- product.featured_image.src | img_url: '600x' | format: 'pjpg' -}}" />
<source
media="lg"
data-srcset="{{- product.featured_image.src | img_url: '500x' | format: 'pjpg' -}}" />
<source
media="md"
data-srcset="{{- product.featured_image.src | img_url: '440x' | format: 'pjpg' -}}" />
<source
media="sm"
data-srcset="{{- product.featured_image.src | img_url: '320x' | format: 'pjpg' -}}" />
<source
media="xs"
data-srcset="{{- product.featured_image.src | img_url: '320x' | format: 'pjpg' -}}" />
<img
class="img-fluid lazy"
data-src="{{- product.featured_image.src | img_url: '500x' -}}"
alt="{{- product.title -}}" />
</picture>
</div>

</a>

{%- comment -%}

PRODUCT FEATURE

This is a peristed base banner applied
to the product when a it contains a a
feature metafield.

{%- endcomment -%}
{%- if product.metafields.product.sustainable_feature != null -%}
<div class="feature text-center">
<div class="ribbon d-flex ai-center jc-center">
<span>{{- product.metafields.product.sustainable_feature -}}</span>
</div>
</div>
{%- endif -%}

</div>

`;
/**
 * Ignore Code Inline
 *
 * Mock represents a comment ignore
 */
export const markup_ignore_inline = `

<ul>
<li>

{{ foo | replace: article.id, 'dd' }}

</li>


<!-- @prettify ignore:start -->
<li>
<div> WILL NOT FORMAT </div>
</li>
<!-- @prettify ignore:end -->

<li>
{{ baz }}
</li>

<li>
{{ 'sss' }}
</li>
<li {{ bae }}>
{{ bae }}
</li>
<li>
{{ s }}
</li>
</ul>

<!-- @prettify ignore:start -->
{%if customer.name == "xxx" %} THIS WILL BE IGNORED AND NOT FORMATTED
{% elsif customer.name == "xx" %}
The lines and spacing will be preserver {% else %}Hi Stranger!         {% endif %}
<!-- @prettify ignore:end -->

Formatting is applied:

<div>
<ul>
<li>one</li>
<li>two</li>
</ul>
</div>


Lets test Liquid comment ignores

{% comment -%}example{%- endcomment -%}

{%- comment -%}
example
{%- endcomment -%}

<div>
<ul>
<li>one</li>
<li>two</li>
</ul>
</div>


{% comment %} two {% endcomment %}


<div class="bar"> <div>foo </div></div>


<div>
<ul>
<li>one</li>
<li>two</li>
</ul>
</div>

`;

/**
 * Invalid Markup Mock data
 *
 * Error is a missing comma character located at
 * `</div> `because `{% endif %}` is missing
 */
export const markup_invalid = `
<div>
{%if customer.name == "kevin" %}
Hey Kevin!
{% elsif customer.name == "anonymous" %}
Hey Anonymous!
{% else %}
Hi Stranger!

</div>

<ul>
<li>
{{ s }}
</li>
</ul>
`;

/* -------------------------------------------- */
/* UNFORMATTED BEAUTIFICATION                   */
/* -------------------------------------------- */

export const markup_unformatted = `

{%tablerow x in items %}
{{ x }}
<div data-attr="foo" id="{{ some.tag }}"   >xx</div>
{% endtablerow-%}

{%if customer.name == "kevin" %}
Hey Kevin!
{% elsif customer.name == "anonymous" %}
Hey Anonymous!
{% else %}
Hi Stranger!
{% endif %}

<html lang="en">
<head>

<meta
charset="UTF-8" />

<meta
http-equiv="X-UA-Compatible"
content="IE=edge">

<meta
name="viewport"
content="width=device-width">

<title>Document</title>

</head>
<body>
<ul>
<li accesskey="{{ product |append: 10000 }}"
aria-colcount="{{ product |append: 10000 }}"
aria-checked="{{ product |append: 10000 }}"
{% if something %}
id="bar"{% else %}
id="bar"
class="quux"
{% endif %}
{% unless something %}
bar {% endunless %}>

{{ foo | replace: article.id, 'dd' }}

</li>
<li {% if something %}
id=""{% endif %}>
{{ bar }}
</li>
<li>
{{ baz }}
</li>
<li>
{{ 'sss' }}
</li>
<li {{ bae }}>
{{ bae }}
</li>
<li>
{{ s }}
</li>
</ul>
</body>
</html>
`;
