/**
 * Liquid Attirbute Values
 *
 * Mock represents Liquid attribute values.
 */
export const liquid_values = `

-------------------------------------------------------
Both of these markup tags should be identical as the
liquid values should match the string html values.
-------------------------------------------------------

Liquid Attribute Values:

<div
id="{{ xxx | filter: 'lorem-ips' }}"              class="{{ y.xxxxxx }}"
data-x="{{ x }}">

</div>

------------------------------------------------------

HTML Attribute Values:

<div
id="an-id-of-the-same-length-as-xxx"class="a-class-like-y"
data-x="aligned">

</div>
`;

/**
 * Liquid Attirbutes
 *
 * Mock represents Liquid attributes
 * expressed in different ways
 */
export const liquid_many = `

<div id="xxxxxxxxxxx">
<div
  id="xxxx" class="xxxxxxxxxxxxxxxxxxxxxxxxxx"
        data-x="zzzz"
  >

  <div data-attr="xxxxxxxxxxxxxxxxxx"  class="xxxxxxxxxxxxxxxxxxx"
  id="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx">

  <div id="xxxxxxxxxxxxxxxxx" class="xxx">

  </div>
  </div>
  </div>
</div>

HTML Attribute Values:

<div id="{{ first }}">
<div
  id="ssss" class="xxxxxx {{- within.value -}}"
        data-x="zzzz"
  >

  <div data-attr="{{ within.value }}"  class="{{ no.quotations }}"
  id="{%if x == xx%} {{ condition.in_value -}} {% endif -%}">

  <div id={{ no.quotations }} class="xxx">

  </div>
  </div>
  </div>
</div>


`;
