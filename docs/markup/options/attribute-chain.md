# Attribute Chain

The `attributeChain` option controls how Liquid tags contained within HTML attributed should be formatted. This option is only applied when HTML attributes contain Liquid, it has no effect on code that does not contain Liquid. Attribute chaining respects the defined `wrap` limit but overrides `forceAttribute` on inner contents when using `inline`. In cases where you have defined a `wrap` limit and using `inline` with `correct` enabled Prettify will apply whitespace dashes to surrounding tag delimiters of the inner content it has new lined when the chained content exceeds `wrap` length. Typically, the best option to use here is going to be the default `preserve` as it allows you to control how the inner content of tag blocks contained within HTML attributes are should be structured.

# Definition

This option accepts a `string` type definition. There are 4 available formatting chain styles available, each of which produces different results. The `attributeChain` option may use global options `wrap`, `preserveLine` and/or `forceAttribute` depending on which style you've selected.

### Usage

The default style Prettify uses is `none` but it's recommended that you choose a chain style that best suits your project and coding preference. Typically, `preserve` is the choice because it's safe and predictable.

```ts
{
  markup: {
    attributeChain: 'none' | 'preserve' | 'inline' | 'collapse';
  }
}
```

## None

Formatting code with the `none` option will leave Liquid infused HTML attributes partially intact. Despite this being the default for Prettify, it's not an _ideal_ choice. The `none` style will prevent Prettify from applying any augmentations to the supplied structure beyond stripping extraneous whitespace and alignment, code is left intact.

#### Before Formatting

<!-- prettier-ignore -->
```html
<div class="x"
   {% if x %}
       id="{{ foo }}"
{% else %}   data-x="xx"
                {% endif %}></div>
```

#### After Formatting

<!-- prettier-ignore -->
```html
<div class="x"
  {% if x %}
  id="{{ foo }}"
  {% else %}   data-x="xx"
  {% endif %}>
</div>
```

The problem with using `none` as a chain style is that newlines and extraneous whitespace characters contained within expression blocks will be preserved. In the above _before_ example the `{% else %} data-x="xx"` line remained intact and whitespace characters were persisted _after_ beautification was applied which is problematic as that extra spacing and newlines can safely be omitted.

## Preserve

Despite the style name, this option will augment input. Formatting code with the `preserve` option is safe and predictable. This option strips extraneous whitespace contained within expression blocks, removes newlines which exceed the global `preserveLine` limit but leaves the overall structure intact.

> Below we are assuming the `preserveLine` global option is set to `1` meaning that only single newline is allowed.

#### Before Formatting

<!-- prettier-ignore -->
```html
<div class="x" {% if x %} id=  "{{ foo }}" {% else %}   data-x="xx"  {% endif %}>

 <div class="x"


  {% unless x != y %}
  id="{{ foo }}"

  {% if y and x %}       data-something="x"   {% endif %}



  {% endunless %}>
 </div>

</div>
```

#### After Formatting

<!-- prettier-ignore -->
```html
<div class="x" {% if x %}id="{{ foo }}"{% else %}data-x="xx"{% endif %}>

 <div class="x"

  {% unless x != y %}
  id="{{ foo }}"

  {% if y and x %}data-something="x"{% endif %}

  {% endunless %}>
 </div>

</div>
```

In the _before_ and _after_ examples above, notice how the extraneous whitespace characters contained within the tag block expressions were completely removed and the newlines were stripped with only a single newline remaining as per the globally defined `preserveLine` rule that was assumed.

> If your `preserveLine` rule was set to `3` then all newlines in the examples will be preserved.

## Inline

The `inline` chain style is the preferred beautification choice to use. Inline will produce the best results in terms of readability and overall structure. This style removes newlines, extraneous whitespace and chains tag expression blocks together. The `inline` style will take into account global options `wrap` and `forceAttribute` when determining how the provided structure should be handled. The beautification result when chaining with `inline` allows Prettify to reason about with your input code to produce the most readable and elegant output possible.

> Below we assume that the markup option `forceAttribute` was set to `1` meaning that tags with more than 1 attribute will be forced onto newlines.

#### Before Formatting

<!-- prettier-ignore -->
```html
<div class="x"

  {% if x %}
  id="{{ foo }}"
  {% else %}
  data-x="xx"
  {% endif %}
  data-attr="{{ quux }}"

  {% unless x != y %}id="{{ foo }}"

  {% if y and x %}
  data-something="x"
  {% endif %}

  {% endunless %}></div>
```

#### After Formatting

<!-- prettier-ignore -->
```html
<div
  class="x"
  data-attr="{{ quux }}"
  {% if x %}id="{{ foo }}"{% else %}data-x="xx"{% endif %}
  {% unless x != y %}
  id="{{ foo }}"
  {% if y and x %}data-something="x"{% endif %}
  {% endunless %}></div>
```

In the _before_ and _after_ examples above the code has undergone a series of changes. First, we applied automatic sorting to the code and moved the `data-attr="{{ quux }}"` below `class="x"` to help separate our HTML attributes from our Liquid ones. Next, we stripped all newlines from the first `{% if x %}` condition and inlined the tag block, from here the `{% unless x != y %}` was analyzed. Prettify determined the unless tag contained a nested control expression of `{% if y and x %}`, because we are using `forceAttribute` and have more than `1` attribute defined, the `id="{{ foo }}"` was output onto a newline. The `{% if y and x %}` was inlined as per our chain style option and the `{% endunless %}` inherited the forced structure imposed in the starter.

It's important to note that `inline` will behave differently depending and results will different if `forceAttribute` was `false` or if `wrap` limit was defined and exceeded. In such cases output will differ only slightly.

### Collapse

Collapse will newline the contents of the tag block. Notice how before formatting contents are expressed on a single line, whereas after formatting content is forced onto newlines.

#### Before Formatting

```html
<div class="x" {% if x %}id="{{ foo }}" {% else %}data-x="xx" {% endif %}></div>
```

#### After Formatting

<!-- prettier-ignore -->
```html
<div class="x"
  {% if x %}
  id="{{ foo }}"
  {% else %}
  data-x="xx"
  {% endif %}></div>
```

# Usage with Correct

The `attributeChain` option when use together with `correct` enabled does some additional processing to help improve your otherwise shitty Liquid code. Depending on the style option you've defined and in cases where stripping can be inferred, Prettify will automatically apply whitespace dashes to Liquid delimiters where possible. This form of correction is applied in the safe manner and only code which Prettify has deemed possible will be augmented.
