**Default** `false`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `false`

Whether or not markup tags should have their insides preserved, ie: attributes. This option is only available to markup and does not support child tokens that require a different lexer. When enabled, this rule will run precedence and override all attribute related rules.

---

#### Example

Below is an example of how this rule works if it's enabled, ie: `true`. There is no difference between the _before_ and _after_ version of the code when this option is enabled. Typically, you are not going to want to enable this rule unless of course your project is better off using it.

```html

<!-- Before Formatting -->
<div
  id="x"    data-x="foo"
 class="xx"></div>

<!-- After Formatting -->
<div
  id="x"    data-x="foo"
 class="xx"></div>

```
