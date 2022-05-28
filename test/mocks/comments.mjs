/**
 * Liquid comments
 *
 * Mock represents Liquid comment related
 * formatting. Used to test different comments
 * logics.
 */
export const liquid_comment_formatting = `
<div>
<h1>Testing inline comments</h1>.
<!-- test html -->
<p> The below comment should be untouched as
there is no space characters.</p>

<h1>Testing indented comments</h1>.
<p>
The below comment should be indented onto a newline

  {%- if product.available and product.compare_at_price > product.price -%}
  <div class="badge sale">
  {{- 'product_item.on_sale' | t -}}

    {%- comment -%}

ON SALE BADGE

  Renders a small text badge overlay in
  the top left corner of the product image

  {%- endcomment -%}
  </div>
  {%- endif -%}

</p>
</div>

`;
