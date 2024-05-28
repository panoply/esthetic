---
title: 'Rules'
layout: base
permalink: '/usage/rules/index.html'
prev:
  label: 'Config Files'
  uri: '/usage/config-files'
next:
  label: 'Inline Control'
  uri: '/usage/inline-control'
anchors:
  - Rules
  - Basic Usage
  - Read Usage
  - Using Preset Style Guides
  - Presets
  - Options
---

# Rules

The `rules` method within Æsthetic can be used to perform immutable merges to formatting options and define customized rules for code beautification or parsing. Once applied, these formatting options are persisted, ensuring that the defined rules are consistently used for all subsequent beautification processes, until changed or the execution session ends.

> You can enable/disable rule persistence behavior using the [settings](/usage/settings/) method. When **disabled** Æsthetic will use defaults for each beautification execution.

Utilizing the `rules` method will preset the configuration logic, allowing seamless and consistent code formatting across multiple calls.

#### Basic Usage

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic';

esthetic.rules({
  language: 'html',
  indentSize: 4,
  markup: {
    attributeSort: true,
    forceAttribute: true
    // etc etc
  },
  style: {
    noLeadZero: true
    // etc etc
  }
});
```

#### Read Usage

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic';

esthetic.rules() // Returns the current ruleset

```

---

# Using Preset Style Guides

Æsthetic comes equipped with a useful feature called **Rule Presets**. These pre-defined style guides serve as default ruleset's and have been carefully curated to assist users in achieving polished output without having to understand how each rule works. Using the [global](/rules#global) → [preset](/rules/global/preset) option, you can conveniently apply one of the available presets as the runtime rule default. This simplifies the creative process and ensures consistent, aesthetically pleasing results without introducing any unnecessary complexities or learning curves.

### Presets

Currently, there are **5** different presets available, each offering unique beautified output, with some presets being more extensive than others. These options provide users with a range of stylistic choices that can be used a starting point from which, you can progressively tailor and customizing to your specific tastes.

<!--

🤡 => The choice of a clown
🙌 => Authors choice
👍 => Good choice.
🤌 => Delightful. Your mother is proud of you.
👎 => Not recommended
🫡 => Alright
😳 => We live in a society, we\'re not animals
💡 => Showing an example of the rule
🧐 => You gotta do, what you gotta do

-->

### Options

Below is list of available style guide preset options. Refer to the [preset](/rules/global/preset) page for comparison samples and applied definitions. In cases where the `preset` rule is `undefined`, Æsthetic will automatically default to using `default` as the base ruleset.

::: rule 👍

#### default

:::

By default, Æsthetic will use the `default` preset, which features the least obtrusive ruleset. The formatting employs a preservation-based technique, ensuring a subtle and non-intrusive approach to enhancing the output.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "default"
}
```

---

::: rule 👍

#### recommended

:::

The `recommended` style guide preset is well-suited for most projects. Formatting will adhere to common standards and generate exceptional-based output. It shares some similarities with Prettier but takes a less aggressive approach, providing a balanced and refined way to beautify the code.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "recommended"
}
```

---

::: rule 🤌

#### warrington

:::

The `warrington` style guide preset is specifically tailored for developers, particularly teams working with Shopify themes and markup. This carefully curated preset was crafted by [David Warrington](https://ellodave.dev/), making it an excellent choice for those in the Shopify ecosystem.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "warrington"
}
```

---

::: rule 🙌

#### strict

:::

The `strict` style guide preset is curated by the author of Æsthetic, [Panoply](https://github.com/panoply). This choice embodies a refined and acquired taste. Based on existing feedback, the generated output is not for everybody as it has a focus on expressionism. However, for those who embrace it, the output when using `strict` perfectly exemplifies the very essence of why Æsthetic was created.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "strict"
}
```

---

::: rule 🤡

#### prettier

:::

The `prettier` style guide preset offers a replication of the Prettier style of formatting. For those working with Æsthetic in Liquid (Shopify) projects and who have grown accustomed to the Shopify Liquid Prettier Plugin, using this preset will result in a familiar output.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "prettier"
}
```
