---
title: 'Style - Quote Convert'
layout: base
permalink: '/rules/style/quoteConvert/index.html'
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

How quotation characters of style languages should be handled. Allows for conversion to single quotes or double quotes.

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

Below is an example of how this rule works if set to `none` which is the **default** setting. No conversion of quotations is applied when using `none`, notice how both single quotes and double are expressed.


```json:rules
{
  "language": "css",
  "markup": {
    "quoteConvert": "none"
  }
}
```

<!-- prettier-ignore-->
```css
.class-1 {
  background-image: url('./some/image/file.jpg');
  content: url('http://www.example.com/test.png');
  content: image-set("image1x.png" 1x, 'image2x.png' 2x);
}
```

---

::: rule 🤌

#### double

:::

Below is an example of how this rule works if set to `double` which will go about converting and ensuring all quotations are using doubles.

```json:rules
{
  "language": "html",
  "markup": {
    "quoteConvert": "double"
  }
}
```

<!-- prettier-ignore-->
```css
.class-1 {
  background-image: url('./some/image/file.jpg');
  content: url('http://www.example.com/test.png');
  content: image-set('image1x.png' 1x, 'image2x.png' 2x);
}
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
```css
.class-1 {
  background-image: url("./some/image/file.jpg");
  content: url("http://www.example.com/test.png");
  content: image-set("image1x.png" 1x, "image2x.png" 2x);
}
```

