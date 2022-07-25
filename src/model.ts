/* eslint-disable no-lone-blocks */

import { PartialDeep } from 'type-fest';
import { Prettify, MarkupOptions, StyleOptions, ScriptOptions, JSONOptions } from 'types/prettify';
import { object } from '@utils/helpers';
import { create, defineProperty } from '@utils/native';

/* -------------------------------------------- */
/* EXPORT                                       */
/* -------------------------------------------- */

export const prettify: Prettify = (function () {

  const model = object<PartialDeep<Prettify>>({
    env: (typeof process !== 'undefined' && process.versions != null) ? 'node' : 'browser',
    mode: 'beautify',
    end: 0,
    iterator: 0,
    start: 0,
    scopes: [],
    beautify: create(null),
    lexers: create(null),
    parsed: object<Prettify['parsed']>(
      {
        begin: [],
        ender: [],
        lexer: [],
        lines: [],
        stack: [],
        token: [],
        types: []
      }
    ),
    hooks: object<Prettify['hooks']>(
      {
        before: [],
        language: [],
        rules: [],
        after: []
      }
    ),
    stats: object<Prettify['stats']>(
      {
        chars: -1,
        time: -1,
        size: '',
        language: ''
      }
    ),
    options: object<Prettify['options']>(
      {
        lexer: 'auto',
        language: 'text',
        languageName: 'Plain Text',
        mode: 'beautify',
        indentLevel: 0,
        crlf: false,
        commentIndent: true,
        endNewline: false,
        indentChar: ' ',
        indentSize: 2,
        preserveComment: false,
        preserveLine: 2,
        wrap: 0,
        grammar: object<Prettify['options']['grammar']>(
          {
            html: object<Prettify['options']['grammar']['html']>(
              {
                tags: [],
                voids: [],
                embedded: create(null)
              }
            ),
            liquid: object<Prettify['options']['grammar']['liquid']>(
              {
                tags: [],
                else: [],
                singletons: [],
                embedded: create(null)
              }
            ),
            script: object<Prettify['options']['grammar']['script']>(
              {
                keywords: []
              }
            ),
            style: object<Prettify['options']['grammar']['style']>(
              {
                units: []
              }
            )

          }
        ),
        markup: object<MarkupOptions>(
          {
            correct: false,
            commentNewline: false,
            attributeChain: 'inline',
            attributeValues: 'preserve',
            attributeSort: false,
            attributeSortList: [],
            forceAttribute: false,
            forceLeadAttribute: false,
            preserveText: false,
            preserveAttributes: false,
            selfCloseSpace: false,
            forceIndent: false,
            quoteConvert: 'none'
          }
        ),
        style: object<StyleOptions>(
          {
            correct: false,
            compressCSS: false,
            classPadding: false,
            noLeadZero: false,
            sortSelectors: false,
            sortProperties: false,
            quoteConvert: 'none',
            forceValue: 'preserve'
          }
        ),
        script: object<ScriptOptions>(
          {
            correct: false,
            braceNewline: false,
            bracePadding: false,
            braceStyle: 'none',
            braceAllman: false,
            commentNewline: false,
            caseSpace: false,
            inlineReturn: true,
            elseNewline: false,
            endComma: 'never',
            arrayFormat: 'default',
            objectSort: false,
            objectIndent: 'default',
            functionNameSpace: false,
            functionSpace: false,
            styleGuide: 'none',
            ternaryLine: false,
            methodChain: 4,
            neverFlatten: false,
            noCaseIndent: false,
            noSemicolon: false,
            quoteConvert: 'none',
            variableList: 'none',
            vertical: false
          }
        ),
        json: object<JSONOptions>(
          {
            arrayFormat: 'default',
            braceAllman: false,
            bracePadding: false,
            objectIndent: 'default',
            objectSort: false
          }
        )
      }
    )
  });

  /* -------------------------------------------- */
  /* INPUT SOURCE                                 */
  /* -------------------------------------------- */

  let input: string | Buffer = '';

  defineProperty(model, 'source', {
    get () {
      return model.env === 'node' && Buffer.isBuffer(input)
        ? input.toString()
        : input as string;
    },
    set (source: string | Buffer) {
      input = model.env === 'node'
        ? Buffer.isBuffer(source) ? source : Buffer.from(source)
        : source;
    }
  });

  return model as Prettify;

})();
