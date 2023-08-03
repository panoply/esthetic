---
title: 'Documentation'
layout: base
permalink: '/misc/documentation/index.html'
---

# Documentation

The Æsthetic documentation uses several different Open Source modules under the hood. Some considerable time went into producing documentation and developers are free to use the internal tools in their own projects. Below is brief breakdown and of third-parties leveraged and their appropriation.

> Take a peek at the [source code](#) in the Æsthetic Github repository.

### 11ty

Æsthetic docs are developed using the [11ty](#) static site generator. Æsthetic compiles markdown files and uses certain structures to determine how output should be written. The [.eleventy.js](#) file is where you will find all bundling logic.

### SPX + Stimulus

Under the hood, the Æsthetic docs are using [SPX](#) which is an OTW (over the wire) module that intercepts navigation and maintains a snapshot cache engine in DOM state. SPX is used together with [Stimulus](#) to perform per-page interactivity and handling.

**SPX**

- [Repository](#)
- [Documentation](#)

**Stimulus**

- [Repository](#)
- [Documentation](#)

### Papyrus

The Æsthetic rule examples are made possible with [Papyrus](#) which was developed for usage in the documentation. Papyrus provides editable (lightweight) embedded text regions with [PrismJS](#) grammars.

- [Repository](#)
- [Documentation](#)

### Moloko

The Æsthetic playground is made possible with [Moloko](#) which provides a wrapped around the [Monaco Editor](#). Moloko leverages [Mithril](#) to virtually render Monaco and exposes some custom DX capabilities for specific usage in Æsthetic.

**Moloko**

- [Repository](#)
- [Documentation](#)

**Monaco**

- [Repository](#)
- [Documentation](#)
