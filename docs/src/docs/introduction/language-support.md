---
title: 'Language Support'
layout: base
permalink: '/introduction/language-support/index.html'
prev:
  label: 'Motivation'
  uri: '/introduction/motivation'
next:
  label: 'Installation'
  uri: '/introduction/installation'
anchors:
  - Language Support
  - Support List
---

# Language Support

Though Æsthetic uses the (language aware) Sparser algorithm, the majority of languages supported by Sparser are not supported in Æsthetic. Sparser's (and PrettyDiff) underlying parse approach in the adaptation to Æsthetic was heavily modified and the original language support list differs. Æsthetic (currently) aims to support only a small subset of languages, specifically those which pertain to front-end (client side) web development. Global language support is not something that Æsthetic aspires to provide currently as it's difficult to achieve both from a maintenance perspective but also from the performance level.

# Support List

Below is the current list of supported languages, along with their completion status and whether Æsthetic can be used for beautification. For languages with a completion status above 90%, you can confidently run Æsthetic for optimal code formatting. However, for languages below that threshold, they may not be fully ready for prime time. Languages with an above 80% completion status can handle basic structures, but they may encounter some limitations and potential issues in certain cases.

> Exercising caution and testing thoroughly is advisable to ensure a smooth beautification process for languages below **90%** completions and languages below **80%** should be avoided for now.

| Language                | Status       | Information                                 |     |
| :---------------------- | ------------ | ------------------------------------------- | --- |
| **XML**                 | 92% Complete | _Safe enough to use in projects_            | ✓   |
| **HTML**                | 94% Complete | _Safe enough to use in projects_            | ✓   |
| **Liquid + HTML**       | 92% Complete | _Safe enough to use in projects_            | ✓   |
| **Liquid + CSS**        | 87% Complete | _Safe enough to use in projects_            | ✓   |
| **Liquid + JSON**       | 80% Complete | _Use with caution, some structural defects_ | ✓   |
| **Liquid + JavaScript** | 79% Complete | _Use with caution, some structural defects_ | ✓   |
| **JSON**                | 88% Complete | _Safe enough to use in projects_            | ✓   |
| **CSS**                 | 92% Complete | _Safe enough to use in projects_            | ✓   |
| **SCSS**                | 72% Complete | _Avoid using, unexpected results_           | ✓   |
| **JavaScript**          | 78% Complete | _Use with caution, some structural defects_ | 𐄂   |
| **TypeScript**          | 70% Complete | _Avoid using, too many defects_             | 𐄂   |
| **JSX**                 | 70% Complete | _Avoid using, too many defects_             | 𐄂   |
| **LESS**                | 60% Complete | _Avoid using, too many defects_             | 𐄂   |
| **TSX**                 | 40% Complete | _Avoid using, too many defects_             | 𐄂   |
| **YAML**                | 50% Complete | _Do not use, not yet supported_             | 𐄂   |

> Please keep in mind that Æsthetic is still in its infancy, updates are frequent, patches and fixes are incurred as the tool progresses.
