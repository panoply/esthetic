# Æsthetic Documentation

The Æsthetic documentation website is built using [11ty](https://www.11ty.dev/docs/) and served via [Netlify](https://netlify.com/).

Visit the docs: [æsthetic.dev](https://æsthetic.dev)

# Development

All dependencies are included within the `package.json` file. ESLint, Prettier and Stylelint is assumed to be installed globally but available as optional dependencies. Documentation is written in markdown and views are composed in Liquid. Frontmatter and JSON data files are used for the order of navigation and various other reference specific information.

### Commands

After installing, run `pnpm dev` to start in development mode. Documentation will build and be deployed via Github actions.

```cli
pnpm dev                 Starts development in watch mode
pnpm stage               Serve up via Netlify for staging
pnpm build               Builds for production and applies version copy .zip
pnpm release             Runs netlify build, generates sitemap and deploys
pnpm 11ty:build          Triggers an 11ty build
pnpm 11ty:watch          Starts 11ty in watch mode with server
pnpm scss:build          Compiles SASS into CSS
pnpm scss:watch          Start SASS in watch mode
pnpm ts:build            Build production JS bundle
pnpm ts:watch            Start ESBuild in watch mode
```

# Markdown Customizations

Markdown files will are processed using [markdown-it](https://github.com/markdown-it/markdown-it) and a couple of custom plugins. Frontmatter and JSON data files are used to the order of navigation and various other reference specific information.

- [Grid Container](#grid-container)
- [Rule Heading](#rule-heading)
- [Rule Showcase](#rule-showcase)

## Grid Container

Grid access is made possible using fenced containers in the markdown. The `grid` keyword along with triple `:::` markers will result in encapsulate content being wrapped. The [Brixtol Bootstrap](https://brixtol.github.io/bootstrap/) variation grid system and CSS framework class utilities are available.

### INPUT

```md
:::: grid row jc-center ai-center

::: grid col-sm-6 col-md-4
Lorem ipsum dolor sit...
:::

::: grid col-6 col-md-8
Lorem ipsum dolor sit...
:::

::::
```

### OUTPUT

<!--prettier-ignore-->
```html
<div class="row jc-center ai-center">

  <div class="col-sm-6 col-md-4">
    Lorem ipsum dolor sit...
  </div>
  <div class="col-6 col-md-8">
    Lorem ipsum dolor sit...
  </div>
</div>
```

## Rule Heading

Rule documentation files, specifically rule example titles are wrapped within a custom container with annotation emoji. These containers will render tooltips and are required when describing rule behaviors. Different emoji types will result in different tooltip hovers.

### INPUT

<!--prettier-ignore-->
```md

::: rule 🙌

#### choice

:::

```

### OUTPUT

<!--prettier-ignore-->
```html
<div class="rule-title d-flex ai-center">
  <span
    class="h5 mr-2"
    aria-label="You gotta do, what you gotta do"
    data-tooltip="top"
  > 🙌 </span>
  <h4 id="choice" tabindex="-1">choice</h4>
</div>
```

### TOOLTIPS

| Emoji | Tooltip                                 |
| ----- | --------------------------------------- |
| 🙌    | Authors Recommendation                  |
| 👍    | Good choice                             |
| 👎    | Not Recommended                         |
| 😳    | We live in a society, we're not animals |
| 🤌    | Delightful. Your mother is proud of you |
| 🤡    | The choice of a clown                   |
| 💡    | Showing an example of the rule          |
| 🧐    | You gotta do, what you gotta do         |

> The [src/rules/strap.md](/docs//src/rules/strap.md) markdown file can be used as a strap.

# Rule Showcasing

Rule documentation files generate interactive demos/examples to showcase how code will be formatted. There are 2 different showcase types (`demo` and `example`) for describing formatting rules. The markdown files for formatting rules use a common structure to achieve this.

Whenever a JSON codeblock uses an annotation identifier of `json:rules` then a standard codeblock show immediately follow. The contents of the `json:rules` is parsed during the 11ty build process (via markdown-it) and used as a reference point. The `json:rules` contents inform upon how and what the showcase should generate.

## Demo Showcase

The below structure is used for generating a rule demo type showcase. Æsthetic formatting rules are provided and the resulting output will be a split pane editor. The left pane is the `input` and the right is `output`. An additional tab is also made available which will inject the rules provided.

The below is a basic example of how a demo showcase is generated and expressed:

<!--prettier-ignore-->
```md

```json:rules
{
  "language": "liquid",
  "liquid": {
    "indentAttributes": true
  }
}
```

```liquid

<!-- Code Sample -!>

```

```

```

## Example Showcase

The below structure is used for generating a rule `example` type showcase. Instead of providing Æsthetic rules within `json:rules` codeblock, we pass an object with a `example` and `esthetic` property. The `example` property is used to describe the example form helpers and the `esthetic` property is intended to hold the formatting rules.

<!--prettier-ignore-->
```md

```json:rules
{
  "example": {}, // example config
  "esthetic": {} // formatting rules
}
```

```liquid

<!-- Code Sample -!>

```

```

```

## Papyrus Options

In addition to the `example` and `esthetic` properties, `json:rules` may also accept a `papyrus` property. When provided the option will be passed to the `papyrus.create` method. The `papyrus` option can be used in either `demo` or `example` rule showcases.

<!--prettier-ignore-->
```md

```json:rules
{
  "papyrus": {}, // papyrus config
  "esthetic": {} // formatting rules
}
```

```liquid

<!-- Code Sample -!>

```

```

```
