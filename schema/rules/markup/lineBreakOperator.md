**Default** `default`

💁🏽‍♀️ &nbsp;&nbsp; Recommended setting is: `before`

Controls the placement of Liquid tag operator type characters in newline structures. In situations where you write a multiline tag expression this rule can augment the order of leading operator characters such as the parameter comma `,` separator.

**Options**

The rule accepts one of the following options:

- `default`
- `before`
- `after`

---

#### 👍 &nbsp;&nbsp; `default`

_Below is an example of how this rule works if set to `default` which is the **default** setting and will leave operator placement intact. Notice in the example how the comma separator of `param_1` begins at the end of the argument whereas the comma separator of `param_3` and `param_4` begins at the start._

```liquid

<!-- Before Formatting -->
{% render 'snippet',
   param_1: true,
   param_2: 1000
   , param_3: 'string'
   , param_4: nil %}

<!-- After Formatting -->
{% render 'snippet',
   param_1: true,
   param_2: 1000
   , param_3: 'string'
   , param_4: nil %}

```

---

#### 👍 👍 &nbsp;&nbsp; `before`

_Below is an example of how this rule works if set to `before` which is recommended approach. This will ensure all operator separators begin at the start of arguments. Notice how **before** formatting the comma separators are placed at the end of each parameter argument but **after** formatting they are moved to the start._

```liquid

<!-- Before Formatting -->
{%- render 'snippet',
  param_1: true,
  param_2: 1000,
  param_3: 'string',
  param_4: nil -%}

<!-- After Formatting -->
{%- render 'snippet'
  , param_1: true
  , param_2: 1000
  , param_3: 'string'
  , param_4: nil %}

```

---

#### 👎 &nbsp;&nbsp; `after`

_Below is an example of how this rule works if set to `after` which is what most developers tend to prefer it making expressions more difficult to read._

```liquid

<!-- Before Formatting -->
{% render 'snippet'
 , param_1: true
 , param_2: 1000
 , param_3: 'string'
 , param_4: nil %}


<!-- After Formatting -->
{% render 'snippet',
   param_1: true,
   param_2: 1000,
   param_3: 'string',
   param_4: nil %}

```


