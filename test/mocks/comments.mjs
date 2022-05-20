/**
 * Liquid comments
 *
 * Mock represents Liquid comment related
 * formatting. Used to test different comments
 * logics.
 */
export const liquid_comment_formatting = `

<h1>Testing inline comments</h1>.
<!-- test html -->
<p> The below comment should be untouched as
there is no space characters.</p>

<div class="foo">
{%-comment -%} one{%- endcomment -%}
</div>

{% comment %} two {% endcomment %}


<div class="bar"> <div>foo </div></div>

`;
