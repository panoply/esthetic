/* -------------------------------------------- */
/* INLINE IGNORES                               */
/* -------------------------------------------- */

export const markup_play = `
{{ 'component-newsletter.css' | asset_url | stylesheet_tag }}
{{ 'newsletter-section.css' | asset_url | stylesheet_tag }}

{%- style -%}
  .section-{{ section.id }}-padding {
padding-top: {{ section.settings.padding_top | times: 0.75 | round: 0 }}px;
padding-bottom: {{ section.settings.padding_bottom | times: 0.75 | round: 0 }}px;
}

@media screen and (min-width: 750px) {
.section-{{ section.id }}-padding {
padding-top: {{ section.settings.padding_top }}px;
padding-bottom: {{ section.settings.padding_bottom }}px;
}
}
{%- endstyle -%}


{% javascript %}
  class LocalizationForm extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        input: this.querySelector("input[name='locale_code'], input[name='country_code']"),
        button: this.querySelector("button"),
        panel: this.querySelector(".disclosure__list-wrapper"), };
      this.elements.button.addEventListener("click", this.openSelector.bind(this));
      this.elements.button.addEventListener("focusout", this.closeSelector.bind(this));
      this.addEventListener("keyup", this.onContainerKeyUp.bind(this));

      this.querySelectorAll("a").forEach(item => item.addEventListener("click", this.onItemClick.bind(this)));
    }

    hidePanel() {
      this.elements.button.setAttribute("aria-expanded", "false");
      this.elements.panel.setAttribute("hidden", true);
    }

    onContainerKeyUp(event) {
      if(event.code.toUpperCase() !== "ESCAPE") return;

      this.hidePanel();
      this.elements.button.focus();
    }

    onItemClick(event) {
      event.preventDefault();
      const form = this.querySelector("form");
      this.elements.input.value = event.currentTarget.dataset.value;
      if(form) form.submit();
    }

    openSelector() {
      this.elements.button.focus();
      this.elements.panel.toggleAttribute("hidden");
      this.elements.button.setAttribute("aria-expanded", (this.elements.button.getAttribute("aria-expanded") === "false").toString());
    }

    closeSelector(event) {
      const shouldClose = event.relatedTarget && event.relatedTarget.nodeName === "BUTTON";
      if(event.relatedTarget === null || shouldClose) {
        this.hidePanel();
      }
    }
  }

  customElements.define("localization-form", LocalizationForm);

{% endjavascript %}

<div class="newsletter center {% if section.settings.full_width == false %}newsletter--narrow page-width{% endif %}">
<div class="newsletter__wrapper color-{{ section.settings.color_scheme }} gradient content-container isolate{% if section.settings.full_width %} content-container--full-width{% endif %} section-{{ section.id }}-padding">
{%- for block in section.blocks -%}
{%- case block.type -%}
{%- when '@app' -%}
{% render block %}
{%- when 'heading' -%}
<h2 class="{{ block.settings.heading_size }}" {{ block.shopify_attributes }}>{{ block.settings.heading | escape }}</h2>
{%- when 'paragraph' -%}
<div class="newsletter__subheading rte" {{ block.shopify_attributes }}>{{ block.settings.text }}</div>
{%- when 'email_form' -%}
<div {{ block.shopify_attributes }}>
{% form 'customer', class: 'newsletter-form' %}
  <input type="hidden" name="contact[tags]" value="newsletter">
  <div class="newsletter-form__field-wrapper">
    <div class="field">
      <input
        id="NewsletterForm--{{ section.id }}"
        type="email"
        name="contact[email]"
        class="field__input"
        value="{{ form.email }}"
        aria-required="true"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="email"
        {% if form.errors %}
          autofocus
          aria-invalid="true"
          aria-describedby="Newsletter-error--{{ section.id }}"
        {% elsif form.posted_successfully? %}
          aria-describedby="Newsletter-success--{{ section.id }}"
        {% endif %}
        placeholder="{{ 'newsletter.label' | t }}"
        required
      >
      <label class="field__label" for="NewsletterForm--{{ section.id }}">
        {{ 'newsletter.label' | t }}
      </label>
      <button type="submit" class="newsletter-form__button field__button" name="commit" id="Subscribe" aria-label="{{ 'newsletter.button_label' | t }}">
        {% render 'icon-arrow' %}
      </button>
    </div>
    {%- if form.errors -%}
      <small class="newsletter-form__message form__message" id="Newsletter-error--{{ section.id }}">{% render 'icon-error' %}{{ form.errors.translated_fields['email'] | capitalize }} {{ form.errors.messages['email'] }}</small>
    {%- endif -%}
  </div>
  {%- if form.posted_successfully? -%}
    <h3 class="newsletter-form__message newsletter-form__message--success form__message" id="Newsletter-success--{{ section.id }}" tabindex="-1" autofocus>{% render 'icon-success' %}{{ 'newsletter.success' | t }}</h3>
  {%- endif -%}
{% endform %}
</div>
{%- endcase -%}
{%- endfor -%}
</div>
</div>

{% schema %}
{
"name": "t:sections.newsletter.name",
"tag": "section",
"class": "section",
"settings": [
{
"type": "select",
"id": "color_scheme",
"options": [
{
"value": "accent-1",
"label": "t:sections.all.colors.accent_1.label"
},
{
"value": "accent-2",
"label": "t:sections.all.colors.accent_2.label"
},
{
"value": "background-1",
"label": "t:sections.all.colors.background_1.label"
},
{
"value": "background-2",
"label": "t:sections.all.colors.background_2.label"
},
{
"value": "inverse",
"label": "t:sections.all.colors.inverse.label"
}
],
"default": "background-1",
"label": "t:sections.all.colors.label"
},
{
"type": "checkbox",
"id": "full_width",
"default": true,
"label": "t:sections.newsletter.settings.full_width.label"
},
{
"type": "paragraph",
"content": "t:sections.newsletter.settings.paragraph.content"
},
{
"type": "header",
"content": "t:sections.all.padding.section_padding_heading"
},
{
"type": "range",
"id": "padding_top",
"min": 0,
"max": 100,
"step": 4,
"unit": "px",
"label": "t:sections.all.padding.padding_top",
"default": 40
},
{
"type": "range",
"id": "padding_bottom",
"min": 0,
"max": 100,
"step": 4,
"unit": "px",
"label": "t:sections.all.padding.padding_bottom",
"default": 52
}
],
"blocks": [
{
"type": "heading",
"name": "t:sections.newsletter.blocks.heading.name",
"limit": 1,
"settings": [
{
"type": "text",
"id": "heading",
"default": "Subscribe to our emails",
"label": "t:sections.newsletter.blocks.heading.settings.heading.label"
},
{
"type": "select",
"id": "heading_size",
"options": [
{
  "value": "h2",
  "label": "t:sections.all.heading_size.options__1.label"
},
{
  "value": "h1",
  "label": "t:sections.all.heading_size.options__2.label"
},
{
  "value": "h0",
  "label": "t:sections.all.heading_size.options__3.label"
}
],
"default": "h1",
"label": "t:sections.all.heading_size.label"
}
]
},
{
"type": "paragraph",
"name": "t:sections.newsletter.blocks.paragraph.name",
"limit": 1,
"settings": [
{
"type": "richtext",
"id": "text",
"default": "<p>Be the first to know about new collections and exclusive offers.</p>",
"label": "t:sections.newsletter.blocks.paragraph.settings.paragraph.label"
}
]
},
{
"type": "email_form",
"name": "t:sections.newsletter.blocks.email_form.name",
"limit": 1
},
{
"type": "@app"
}
],
"presets": [
{
"name": "t:sections.newsletter.presets.name",
"blocks": [
{
"type": "heading"
},
{
"type": "paragraph"
},
{
"type": "email_form"
}
]
}
]
}
{% endschema %}

`;

export const markup_example = `


<script>
  document.addEventListener('DOMContentLoaded', function() {
    function isIE() {
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf('MSIE ');
      const trident = ua.indexOf('Trident/');

      return (msie > 0 || trident > 0);
    }

    if (!isIE()) return;
    const hiddenInput = document.querySelector('{{ product_form_id }}');
    const noScriptInputWrapper = document.createElement('div');
    const variantSwitcher = document.querySelector('variant-radios') || document.querySelector('variant-selects');
    noScriptInputWrapper.innerHTML = document.querySelector('.product-form__noscript-wrapper-').textContent;
    variantSwitcher.outerHTML = noScriptInputWrapper.outerHTML;

    document.querySelector('#Variants').addEventListener('change', function(event) {
      hiddenInput.value = event.currentTarget.value;
    });
  });
</script>

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
