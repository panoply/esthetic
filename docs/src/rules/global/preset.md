---
title: 'Global Rules - Default'
permalink: '/rules/preset/index.html'
layout: base
describe:
  - Preset
  - Rule Options
options:
  - default
  - recommended
  - strict
  - warrington
  - prettier
---

:: row pr-5
:: col-8 p-100

# Preset

Æsthetic comes equipped with a useful feature called **Rule Presets**. These pre-defined style guides serve as default ruleset's and have been carefully curated to assist users in achieving polished output without having to understand how each rule works. Using the [global](/rules#global) → [preset](/rules/global/preset) option, you can conveniently apply one of the available presets as the runtime rule default. This simplifies the creative process and ensures consistent, aesthetically pleasing results without introducing any unnecessary complexities or learning curves.

Currently, there are **5** different presets available, each offering unique beautified output, with some presets being more extensive than others. These options provide users with a range of stylistic choices that can be used a starting point from which, you can progressively tailor and customizing to your specific tastes.

> Below is list of available style guide preset options. Refer to the [preset](/rules/global/preset) page for comparison samples and applied definitions. In cases where the `preset` rule is `undefined`, Æsthetic will automatically default to using `default` as the base ruleset.

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

---

:: rule 👍

#### default

::

By default, Æsthetic will use the `default` preset, which features the least obtrusive ruleset. The formatting employs a preservation-based technique, ensuring a subtle and non-intrusive approach to enhancing the output.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "default"
}
```

---

:: rule 🤌

#### warrington

::

The `warrington` style guide preset is specifically tailored for developers, particularly teams working with Shopify themes and markup. This carefully curated preset was crafted by [David Warrington](https://ellodave.dev/), making it an excellent choice for those in the Shopify ecosystem.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "warrington"
}
```

---

:: rule 🙌

#### aesthetic

::

The `aesthetic` style guide preset is curated by the author of Æsthetic, [Panoply](https://github.com/panoply). This choice embodies a refined and acquired taste. Based on existing feedback, the generated output is not for everybody as it has a focus on expressionism. However, for those who embrace it, the output when using `aesthetic` perfectly exemplifies the very essence of why Æsthetic was created.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "aesthetic"
}
```

---

:: rule 🤡

#### prettier

::

The `prettier` style guide preset offers a replication of the Prettier style of formatting. For those working with Æsthetic in Liquid (Shopify) projects and who have grown accustomed to the Shopify Liquid Prettier Plugin, using this preset will result in a familiar output.

- [Example](#)
- [Ruleset](#)

```json
{
  "preset": "prettier"
}
```

::
:::
