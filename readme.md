<br>
<p align="center">
<br>
<a href="https://æsthetic.dev">
<img src="https://raw.githubusercontent.com/panoply/esthetic/next/docs/src/assets/svg/æsthetic.svg" width="290px">
</a>
<br>
<br>
</p>

<br>

### WIP ~ WORK IN PROGRESS

A new generation code beautification tool for formatting HTML, Liquid, CSS/SCSS, JavaScript, TypeScript and more! Æsthetic leverages the [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and its parse approach has been repurposed from the distributed source of the late and powerful [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

### Documentation

Documentation lives on **[æsthetic.dev](https://æsthetic.dev)**

### Features

- Fast, performant and lightweight (50kb gzip).
- Format, parse and language detection capabilities.
- Provides a granular set of beautification rules.
- Supports 10+ different front~end facing languages.
- Uniformed data structures with incremental traversal.
- Simple and painless integration within existing projects.

## Installation

Æsthetic supports both CJS/ESM environments and also provides basic CLI support.

###### PNPM

```bash
pnpm add esthetic
```

###### YARN

```bash
yarn add esthetic
```

###### NPM

```bash
npm install esthetic --save
```

###### CDN

```bash
https://unpkg.com/esthetic
```

## Usage

Consult the [documentation](https://æsthetic.dev) for a better understanding.

###### CLI

```bash
$ esthetic <file> --flag
```

###### ESM / BROWSER

<!--prettier-ignore-->
```js
import esthetic from 'esthetic';

esthetic.format('...', { /* rules */ })

```

###### CJS

<!--prettier-ignore-->
```js
const esthetic = require('esthetic');

esthetic.format('...', { /* rules */ })

```

## Contributing

Looking to contribute? Æsthetic leverages [pnpm](https://pnpm.js.org/) so ensure you're using it as your package manager. Development is intended to be conducted within the [vscode](https://code.visualstudio.com/) text editor. Fork or clone the project and install dependencies.

<details>
<summary>
  Overview
</summary>
<p>

The Æsthetic codebase may seem large and daunting to navigate at first glance, but it's relatively easy to dissect and grasp. The first place you want to start is [src/esthetic.ts](/src/esthetic.ts) which is where the esthetic instance is established.

**Parser**

The [src/parse/parser.ts](/src/parse/parser.ts) file is where you will finds the controller responsible for maintaining and generating the data-structure parse table. The lexers will refer to the values and methods contained within.

**Lexers**

The [src/lexers](/src/lexers/) directory and containing files are responsible for parse operations, this where the parse table gets generated. Markup languages use the [markup.ts](/src/lexers/markup.ts) lexer, Script languages (i.e: JSON, JavaScript etc) use [script.ts](/src/lexers/script.ts) lexer and Style languages (i.e: CSS) use [style.ts](/src/lexers/style.ts) lexer

**Format**

The [src/format](/src/format/) directory and containing files are used in the second cycle, following the lexer operation/s. This where the generated parse table will be traversed and beautification is applied.

---

If you have any questions or would like more context etc please do not hesitate to submit an issue or reach me on [Twitter](https://twitter.com/niksavvidis). I'm also happy to hear from, learn from or help developers interested in this project.

</p>
</details>

<details>
<summary>
  Pre-requisites
</summary>
<p>

- [Git](https://git-scm.com/)
- [Node v16^](https://nodejs.org/)
- [Pnpm v7^](https://pnpm.js.org/)
- [VSCode](https://code.visualstudio.com/)

</p>
</details>

### Commands

The following commands are available as executable scripts.

```
pnpm dev         Bundles module with ESBuild (via tsup) in watch mode
pnpm build       Generates the distribution bundles
pnpm release     Builds bundle, build then deploys docs and publish on npm
pnpm play        Starts up AVA in development mode and runs the dev.txt
pnpm test        Runs all the tests
pnpm tests       Cherry pick test cases to run
```

### Testing / Development

Æsthetic uses the powerful [AVA](https://github.com/avajs/ava) test runner together with a small helper utility that helps alleviate some of the complexities involved with testing tools of its criteria. It's recommended that you develop in a two pane terminal. The [dev.test.mjs](/tests/dev.test.mjs) and [dev.txt](/tests/dev.txt) files are core to testing and working on the module, they will be called when running `pnpm play`

> Consult the [tests](/tests/) readme for more information on `test` prefixed commands

## Acknowledgements

Æsthetic owes its existence to Sparser and PrettyDiff. This project has been adapted from these 2 brilliant tools and while largely refactored + overhauled the original parse architecture remains intact.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

Æsthetic is made possible because of the [Austin Cheney](https://github.com/prettydiff) who is the original author of [Sparser](https://github.com/unibeautify/sparser) and [PrettyDiff](https://github.com/prettydiff/prettydiff). Austin is one of the great minds in JavaScript and I want to thank him for open sourcing these tools.

Both PrettyDiff and Sparser were retired in 2019 after a nearly a decade of production. Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool. Please check it out and also have a read of
[wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

## Author 🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com)

Follow me on [X](https://x.com/niksavvidis) or shoot me an [Email](mailto:n.savvidis@gmx.com).
