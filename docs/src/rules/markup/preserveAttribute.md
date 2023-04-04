---
title: 'Markup - Preserve Attribute'
layout: base
permalink: '/rules/markup/preserveAttribute/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

# Preserve Attribute

Whether or not markup tags should have their insides preserved, (i.e: attributes). This option is only available to markup and does not support child tokens that require a different lexer. When enabled, this rule will run precedence and override all attribute related rules such as `attributeCase`, `attributeSort` and `forceAttribute`.

If you're working with a JavaScript framework that implements a data-attribute development based architecture (like Alpine or Angular) which requires a build-step then this rule _might_ help prevent Æsthetic from augmenting code or failing when it encounters otherwise invalid structures not supported or recognized by official markup based language specifications.

::: note

When preserving attributes indentation will not be applied during the beautification cycle. The rule effects the entire inner structure contained within tags.

:::

<!--
🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

# Rule Options

This is **Markup** specific rule which will take effect on languages like HTML, XML, JSX/TSK and will also override Liquid beautification operations. The **recommended** option to use is `false`,

::: rule 🙌

#### false

:::

The `preserveAttribute` is disabled (i.e: `false`) by default. The inner contents of markup tags are handled by Æsthetic and will apply beautification in accordance with the attribute related rules defined. In the below example, we have set the [forceAttribute](/rules/markup/forceAttribute) rule to `true` so all attributes are forced onto newlines. If `preserveAttribute` was set to `true` then attributes would be preserved.

```json:rules
{
  "language": "html",
  "markup": {
    "forceAttribute": true,
    "stripAttributeLines": true,
    "forceIndent": true,
    "lineBreakValue": "force-indent",
    "preserveAttribute": false
  }
}
```

<!-- prettier-ignore -->
```html
<div>
<ul>
  <li>
<section
   id="x"     data-a="foo"
   data-b="bar"     data-c="baz"

              class="xxx"

   data-example="[{ prop: 'hello world!' }],
   [1,2,3,4,5]">

<p>
  The attributes above will be formatted
  </p>

</section>
</li>
</ul>
</div>
```

---

::: rule 🤡

#### true

:::

When `preserveAttribute` is enabled (i.e: `true`) then the insides of markup tags will be preserved. In the below example, there is no difference between the **before** and **after** versions of the code.

```json:rules
{
  "language": "html",
  "markup": {
    "forceAttribute": true,
    "forceIndent": true,
    "preserveAttribute": true
  }
}
```

<!-- prettier-ignore -->
```html
<div>
<ul>
  <li>
<section
   id="x"     data-a="foo"
   data-b="bar"     data-c="baz"

              class="xxx"

   data-example="[{ prop: 'hello world!' }],
   [1,2,3,4,5]">

<p>
  The attributes above will be formatted.
</p>
</section>
</li>
</ul>
</div>
```
