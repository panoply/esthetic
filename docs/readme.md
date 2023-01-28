# Æsthetic Documentation

Æsthetic documentation website built using [11ty](https://www.11ty.dev/docs/) and served via [Netlify](https://netlify.com/).

Visit the docs: [æsthetic.dev](https://æsthetic.dev)

# Development

All dependencies are included within the `package.json` file. ESLint, Prettier and Stylelint as assumed to be installed globally but available as optional dependencies.

```cli
pnpm install
```

### Commands

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
