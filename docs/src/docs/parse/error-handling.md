---
title: 'Parse Errors'
layout: base
permalink: '/parse/error-handling/index.html'
anchors:
  - 'Parse Errors'
  - 'Error Exception'
---

# Parse Errors

Invalid syntax encountered during the parse cycle will result in an exception to be thrown. Æsthetic will determine code errors during traversal and attempt to correct issues before throwing but in cases where a resolution cannot be achieved execution will be halted, input returned and an exception thrown.

### Error Exception

The exception that throws will hold the following information about the error. You can be access the error within a `catch` block.

```js
export interface ParseError {
  /**
   * The error message, to be thrown (combines all refs in this model)
   */
  message: string;
  /**
   * Error details, holds more informative information about error
   */
  details: string;
  /**
   * Snippet Error Code Sample
   */
  snippet: string;
  /**
   * The Error Type
   */
  type: ErrorTypes;
  /**
   * Snippet Error Sample
   */
  code: number;
  /**
   * The error syntax Language (Proper Name)
   */
  language: string;
  /**
   * The range based location of the error.
   */
  location: {
    start: {
      line: number,
      character: number
    },
    end: {
      line: number,
      character: number
    }
  };
}
```

<!-- prettier-ignore -->
```js
import { format } from 'esthetic';

try {

  format('<div id="foo"> This code is invalid! <div>');

} catch (error) {

   /**
   * The error message, to be thrown (combines all refs in this model)
   */
  error.message
  /**
   * Error details, holds more informative information about error
   */
  error.details?: string;
  /**
   * Snippet Error Code Sample
   */
  error.snippet?: string;
  /**
   * The Error Type
   */
  error.type?: ErrorTypes;
  /**
   * Snippet Error Sample
   */
  error.code?: ParseErrors;
  /**
   * The error syntax Language (Proper Name)
   */
  error.language?: LanguageOfficialName;
  /**
   * The range based location of the error.
   */
  error.location?: {
    start: {
      line: number;
      character: number;
    };
    end: {
      line: number;
      character: number;
    }
  };

}

```
