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

{% comment %}example{% endcomment %}
{%comment%}example{%endcomment%}
{%- comment %}example{% endcomment %}
{% comment -%}example{% endcomment %}
{%- comment -%}example{% endcomment %}
{%-comment-%}example{%endcomment%}
{%-comment-%}example{%-endcomment-%}
{%-comment-%}example {%-endcomment-%}

{{foo}}

{%for i in bar%}
{%
  endfor
  %}

<h1>Testing indented comments</h1>.
<p>The below comment should be indented onto a newline</p>{%- comment -%} example {%- endcomment -%}

{% comment %} example {% endcomment %}

{%-comment-%} example{%-endcomment-%}

{%- comment -%}
  example {%- endcomment -%}

{%- comment -%} example
{%- endcomment -%}
`;
