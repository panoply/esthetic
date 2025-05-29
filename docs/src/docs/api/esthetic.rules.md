---
title: 'Rules'
layout: base
permalink: '/api/esthetic.rules/index.html'
anchors:
  - Rules
  - Example
---

# Rules

The `{js} esthetic.rules()` method in Æsthetic allows you to perform immutable merges on formatting options. When you use the rules method, Æsthetic performs an immutable merge of the new rules with the existing configuration. This means that your original configuration remains unchanged, and a new configuration object is created with updated rules. Once applied, these formatting options are persisted throughout the execution session and all subsequent beautification processes will use them consistently until they are changed or the execution session ends.

> You can enable or disable the rule persistence behavior using the [`{js} esthetic.settings()`](/api/esthetic.settings/). method. When persistence is disabled, Æsthetic will use default settings for each beautification operation.

### Update Rules

Below we are setting rules to be applied for every single call of `{js} esthetic.format()`.

<!-- prettier-ignore -->
```js
import esthetic from 'esthetic';

esthetic.rules({
  language: 'html',
  indentSize: 4,
  attributeLineBreak: true,
  attributeSort: true,
  // etc etc
});

```

---

### Reading Rules

You can return the current ruleset by omitting arguments.

```js
import esthetic from 'esthetic';

const rules = esthetic.rules();

console.log(rules); // Omitting argument will return the current rules
```

---

### Immutable

You cannot update rules from the `{js} esthetic.rules()` instance.

```js
import esthetic from 'esthetic';

const rules = esthetic.rules();

// ❌ DO NOT DO THIS
rules.indentSize = 2;

// ✅ DO THIS INSTEAD
esthetic.rules({ indentSize: 2 });
```
