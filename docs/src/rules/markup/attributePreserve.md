---
title: 'Markup - Attribute Preserve'
layout: base
permalink: '/rules/markup/attributePreserve/index.html'
describe:
  - Comment Newline
  - Rule Options
options:
  - false
  - true
---

::: grid col-12 col-sm-9 p-100

# Attribute Preserve

Whether or not markup tags should have their insides preserved, (i.e: attributes). This option is only available to markup and does not support child tokens that require a different lexer. When enabled, this rule will run precedence and override all attribute related rules such as `attributeCase`, `attributeSort` and `forceAttribute`.

If you're working with a JavaScript framework that implements a data-attribute development based architecture (like Alpine or Angular) which requires a build-step then this rule _might_ help prevent Æsthetic from augmenting code or failing when it encounters otherwise invalid structures not supported or recognized by official markup based language specifications.

> When preserving attributes indentation will not be applied during the beautification cycle. The rule effects the entire inner structure contained within tags.

This is **Markup** specific rule which will take effect on languages like HTML, XML, JSX/TSK and will also override Liquid beautification operations. The **recommended** option to use is `false`,

<!--
🙌 - Recommended Choice
👍 - Good Choice
👎 - Not Recommended
🤡 - Clown Choice
😳 - Bad Choice
🧐 - You gotta do, what you gotta do
💡 - Showing an example of the rule
-->

:::

---

::: rule 🙌

#### false

:::

The `attributePreserve` is disabled (i.e: `false`) by default. The inner contents of markup tags are handled by Æsthetic and will apply beautification in accordance with the attribute related rules defined. In the below example, we have set the [forceAttribute](/rules/markup/forceAttribute) rule to `true` so all attributes are forced onto newlines. If `attributePreserve` was set to `true` then attributes would be preserved.

```json:rules
{
  "language": "html",
  "markup": {
    "attributePreserve": false
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

   data-example="[{ prop: 'hello world!' }]">

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

When `attributePreserve` is enabled (i.e: `true`) then the insides of markup tags will be preserved. In the below example, there is no difference between the **before** and **after** versions of the code.

```json:rules
{
  "language": "html",
  "markup": {
    "attributePreserve": true
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

   data-example="[{ prop: 'hello world!' }]">

<p>
  The attributes above will be formatted.
</p>
</section>
</li>
</ul>
</div>
```
