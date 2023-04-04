# Æsthetic Documentation

Æsthetic documentation website built using [11ty](https://www.11ty.dev/docs/) and served via [Netlify](https://netlify.com/).

Visit the docs: [æsthetic.dev](https://æsthetic.dev)

# Development

All dependencies are included within the `package.json` file. ESLint, Prettier and Stylelint is assumed to be installed globally but available as optional dependencies. Documentation is written in markdown and views are composed in Liquid. Frontmatter and JSON data files are used to the order of navigation and various other reference specific information.

### Commands

After installing, run `pnpm dev` to start development in mode. Documentation will build and be deployed via Github actions.

```cli
pnpm dev                 Starts development in watch mode
pnpm build               Builds documentation for production
pnpm 11ty:build          Triggers an 11ty build
pnpm 11ty:watch          Starts 11ty in watch mode with server
pnpm scss:build          Compiles SASS into CSS
pnpm scss:watch          Start SASS in watch mode
pnpm ts:build            Build production JS bundle
pnpm ts:watch            Start ESBuild in watch mode
```

# Markdown Customizations

Markdown files will are processed using [markdown-it](https://github.com/markdown-it/markdown-it) and a couple of custom plugins. Frontmatter and JSON data files are used to the order of navigation and various other reference specific information.

### Note Container

Notes will render within a padded border block. Note containers can be used in all `.md` files.

```md
::: note

Lorem ipsum dolor sit...

:::
```

### Rule Choice Header

Rule documentation files, specifically rule example titles are wrapped within a custom container with annotation emoji. These containers will render tooltips and are required when describing rule behaviors. Different emoji types will result in different tooltip hovers.

**Example**

<!--prettier-ignore-->
```md

::: rule 🙌

#### Choice

:::

```

| Emoji | Tooltip                                 |
| ----- | --------------------------------------- |
| 🙌    | Authors Recommendation                  |
| 👍    | Good choice                             |
| 👎    | Not Recommended                         |
| 😳    | We live in a society, we're not animals |
| 🤡    | The choice of a clown                   |

> The [src/rules/strap.md](#) markdown file can be used as a strap.

### Rule Codeblocks

Rule documentation files generate **before** and **after** tabs to showcase how code will be formatted. These tabs are applied during the build process and will only render when language code blocks follow JSON code blocks using an identifier value of `json:rules`. Rule codeblocks are omitted and the JSON is extracted.

for example:

<!--prettier-ignore-->
````md

```json:rules
{
  "language": "liquid",
  "liquid": {
    "indentAttributes": true
  }
}
```

```html

<!-- Code Sample -!>

```

```

