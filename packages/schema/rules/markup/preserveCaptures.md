**Default** `false`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`

Whether or not to apply formatting on the inner contents of Liquid `{% capture %}` tags. When disabled, the contained contents of capture tags will excluded from beautification.

---

#### Example

_Below is an example of how this rule works if it's enabled, ie: `true`. Notice how the contents of the capture tag block remain intact before and after formatting_

```html

<!-- Before formatting -->
{% capture foo  %}
I
  will
      not <strong>  be
</strong>
          formatted
{% endcapture %}

<!-- After formatting -->
{% capture foo  %}
I
  will
      not <strong>  be
</strong>
          formatted
{% endcapture %}

```

