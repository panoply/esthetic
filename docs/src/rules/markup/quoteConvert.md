---
title: 'Markup - Quote Convert'
layout: base
permalink: '/rules/markup/quoteConvert/index.html'
describe:
  - Quote Convert
  - Rule Options
options:
  - none
  - double
  - single
---

::: grid col-9 p-100

# Quote Convert

How quotation characters of markup attribute values should be handled. Allows for conversion to single quotes or double quotes. Markup tag attributes should always use double quotations, it's the standard in languages like HTML.

:::

---

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

::: rule 🤡

#### none

:::

Below is an example of how this rule works if set to `none` which is the **default** setting. No conversion of quotations is applied when using `none`. Notice how we have expressed a combination of both double and single quotes.

```json:rules
{
  "language": "html",
  "markup": {
    "quoteConvert": "none"
  }
}
```

<!-- prettier-ignore-->
```html
<div class='single' id="double">

  <p class='single' id="double">
    Hello World!
  </p>

</div>

```

---

::: rule 🤌

#### double

:::

Below is an example of how this rule works if set to `double` which will go about converting and ensuring all markup quotations are using double quotations.

```json:rules
{
  "language": "html",
  "markup": {
    "quoteConvert": "double"
  }
}
```

<!-- prettier-ignore-->
```html
<div class='foo' id='bar'>

  <p class='baz' id='qux'>
     Quotes will convert to doubles
  </p>

</div>
```

---


::: rule 😳

#### single

:::


Below is an example of how this rule works if set to `single` which will go about converting and ensuring all markup quotations are using singles. This is typically discourage in HTML and other markup languages.


```json:rules
{
  "language": "html",
  "markup": {
    "quoteConvert": "single"
  }
}
```

<!-- prettier-ignore-->
```html
<div class="foo" id="bar">

  <p class="baz" id="qux">
    Quotes will convert to singles
  </p>

</div>
```

