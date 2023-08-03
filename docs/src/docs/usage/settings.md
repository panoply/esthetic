---
title: 'Usage - Settings'
layout: base
permalink: '/usage/settings/index.html'
prev:
  label: 'Parse'
  uri: '/usage/parse'
next:
  label: 'Events'
  uri: '/usage/events'
anchors:
  - Settings
  - Basic Usage
  - editorConfig
  - globalThis
  - reportStats
  - throwErrors
  - persistRules
  - logLevel
  - logColors
  - resolveConfig
---

# Settings

Æsthetic exposes core configuration control via the `esthetic.settings()` method. The settings method can be used to configure the execution preferences of Æsthetic in Node and Browser environments. Calling the `esthetic.settings` methods with parameters omitted will return the current setting configurations being used by Æsthetic, plus some additional information such as the version number, environment and current working directory.

#### Basic Usage

<!-- prettier-ignore-->
```js
import esthetic from 'esthetic';

esthetic.settings({
  editorConfig: false,
  globalThis: true,
  reportStats: true,
  throwErrors: true,
  persistRules: true,
  logLevel: 2,
  logColors: true,
  resolveConfig: 'package.json'
});

```

#### Read Usage

<!-- prettier-ignore-->
```js
import esthetic from 'esthetic';

const settings = esthetic.settings();

console.log(settings)


```

---

# Available Options

All settings are **optional** and changes will be persisted, similar to [rules](/usage/rules). The settings method returns `this` scope and can be chained. It's generally recommended that you provide setting customizations before invocation.

##### editorConfig

Whether or not Æsthetic should inherit and use options defined in `.editorconfig` files. When an `.editorconfig` file is detected in your projects root directory, Æsthetic will keep track and use inheritable options.

**Default:**&nbsp;&nbsp; `false`

##### globalThis

Whether of not Æsthetic should be made available to global scope when used in Browser environments. This defaults to `true` resulting in Æsthetic being accessible via `window`.

**Default:**&nbsp;&nbsp; `true`

##### reportStats

Whether or not Æsthetic should track execution statistics. When disabled, Æsthetic will skip reporting on formatting execution timing of beautification / parse operations.

**Default:**&nbsp;&nbsp; `true`

##### throwErrors

Whether or not Æsthetic should throw exceptions when encountering a parse error. When disabled (`false`) then errors will fail quietly. Use the `esthetic.on('error', (e) => {})` event or check the `esthetic.error` to take control of parse errors when this is disabled.

**Default:**&nbsp;&nbsp; `true`

##### persistRules

Whether or not Æsthetic should persist defined rules. By default, Æsthetic maintains a persisted reference of formatting rules. Setting this to `false` will result in Æsthetic merging rules with defaults (or `preset`) each time the `esthetic.format()`, `esthetic.parse()` or `esthetic.rules()` is invoked.

**Default:**&nbsp;&nbsp; `true`

##### logLevel

Control the log level when using the CLI. The following levels are available:

- `1` - Disables logs, only parse errors will show.
- `2` - Standard logs, this is the default. Operations, errors and warnings.
- `3` - Detailed logs, various information is printed throughout execution cycles

**Default:**&nbsp;&nbsp; `2`

##### logColors

By default, operations which involve printing to console, as such, errors will apply ansi coloring. Set this to `false` to prevent highlights being applied.

**Default:**&nbsp;&nbsp; `true`

##### resolveConfig

Use an external configuration approach for defined rules. Æsthetic supports `package.json` files containing an `esthetic` key, an `.esthetic` or `.esthetic.json` files. You can provide a uri reference to a specific file containing rules.

**Default:**&nbsp;&nbsp; `package.json`
