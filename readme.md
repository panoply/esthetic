<br>
<p align="center">
<img src="https://raw.githubusercontent.com/panoply/esthetic/next/docs/src/assets/svg/esthetic.svg" width="300px">
</p>

<br>

### WIP ~ WORK IN PROGRESS

The new generation code beautification tool for formatting HTML, Liquid, CSS/SCSS, JavaScript, TypeScript and more! Æsthetic leverages the [Sparser](https://sparser.io/docs-html/tech-documentation.xhtml#universal-parse-model) lexing algorithm and its parse approach has been repurposed from the distributed source of the late and powerful [PrettyDiff](https://github.com/prettydiff/prettydiff/blob/master/options.md).

### Documentation

Documentation lives on **[æsthetic.dev](https://æsthetic.dev)**

### Features

- Fast, performant and lightweight (50kb gzip).
- Format, parse and language detection capabilities.
- Provides a granular set of beautification rules.
- Supports 10+ different front~end facing languages.
- Uniformed data structures with incremental traversal.
- Simple and painless integration within existing projects.

# Installation

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

# Acknowledgements

Æsthetic owes its existence to Sparser and PrettyDiff. This project has been adapted from these 2 brilliant tools and while largely refactored + overhauled the original parse architecture remains intact.

### [PrettyDiff](https://github.com/prettydiff/prettydiff) and [Sparser](https://github.com/unibeautify/sparser)

Æsthetic is made possible because of the [Austin Cheney](https://github.com/prettydiff) who is the original author of [Sparser](https://github.com/unibeautify/sparser) and [PrettyDiff](https://github.com/prettydiff/prettydiff). Austin is one of the great minds in JavaScript and I want to thank him for open sourcing these tools.

Both PrettyDiff and Sparser were retired in 2019 after a nearly a decade of production. Austin has since created [Shared File Systems](https://github.com/prettydiff/share-file-systems) which is a privacy first point-to-point communication tool. Please check it out and also have a read of
[wisdom](https://github.com/prettydiff/wisdom) which personally helped me become a better developer.

## Author 🥛 [Νίκος Σαβίδης](mailto:nicos@gmx.com)

<a href="https://twitter.com/niksavvidis">
<img
  align="right"
  src="https://img.shields.io/badge/-@niksavidis-1DA1F2?logo=twitter&logoColor=fff"
/>
</a>
