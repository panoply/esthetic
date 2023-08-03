---
title: 'Limitations'
layout: base
permalink: '/misc/limitations/index.html'
---

# Limitations

Æsthetic is comparatively _recluse_ in terms of PnP (plug and play) integrations/extensibility. Depending on your stack and development preferences you may wish to use Æsthetic together with additional tools like [eslint](https://eslint.org/), [stylelint](https://stylelint.io/) or even [Prettier](https://prettier.io/). There are a few notable caveats you should be aware before running Æsthetic, most of which are trivial.

## Æsthetic and Prettier

It is not uncommon for developers to use Prettier in their projects but you should avoid executing Æsthetic alongside Prettier in code editor environments. You can easily prevent issues from arising by excluding the files Æsthetic handles by adding them to a `.prettierignore` file.

## Linters

Æsthetic can be used together with tools like ESLint and StyleLint without the need to install additional plugins but the caveats come when you introduce Liquid into the code. Æsthetic can format Liquid contained in JavaScript, TypeScript, JSX and TSX but tools like ESLint are currently unable to process content of that nature and as such without official linting support for Liquid by these tools it is best to only run Æsthetic with linters on code that does not contain Liquid.

## Shopify Themes

Developers working with straps like [Dawn](https://github.com/Shopify/dawn) should take some consideration before running Æsthetic on the distributed code contained within the project. Dawn is chaotic, novice and it employs some terrible approaches. Using Æsthetic blindly on the project may lead to problematic scenarios and readability issues.
