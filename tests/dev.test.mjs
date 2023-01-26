import test from 'ava';
import { dev } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

test('develop', async t => {

  await dev(t)(function (source) {

    // esthetic.grammar({
    //   html: {
    //     embedded: {
    //       script: [
    //         {
    //           language: 'json',
    //           attribute: {
    //             type: [ 'application/ldss+json' ]
    //           }
    //         }
    //       ]
    //     }
    //   },
    //   liquid: {
    //     embedded: {
    //       capture: [
    //         {
    //           language: 'json',
    //           argument: [
    //             'json'
    //           ]
    //         }
    //       ],
    //       stylesheet: [
    //         {
    //           language: 'css',
    //           argument: [
    //             'foo'
    //           ]
    //         },
    //         {
    //           language: 'css',
    //           argument: [
    //             'foo',
    //             'fo',
    //             'foox'
    //           ]
    //         },
    //         {
    //           language: 'css',
    //           argument: [
    //             'foox'
    //           ]
    //         },
    //         {
    //           language: 'css',
    //           argument: /['"]scss['"]/
    //         }
    //       ]
    //     }
    //   }
    // });

    //  esthetic.rules.listen((changed) => console.log(changed));

    // esthetic.rules({
    //   language: 'liquid',
    //   preserveLine: 0,
    //   wrap: 0,
    //   liquid: {
    //     correct: false,
    //     valueForce: 'always',
    //     lineBreakSeparator: 'before',
    //     ignoreTagList: [ 'javascript' ]
    //   },
    //   json: {
    //     arrayFormat: 'indent',
    //     objectIndent: 'indent',
    //     braceAllman: true,
    //     objectSort: true,
    //     bracePadding: false

    //   },
    //   markup: {
    //     correct: true,
    //     delimiterForce: false,
    //     selfCloseSpace: true,
    //     forceAttribute: 3,
    //     forceIndent: true,
    //     forceLeadAttribute: false,
    //     ignoreJS: false,
    //     ignoreJSON: false,
    //     ignoreCSS: false
    //   },
    //   script: {
    //     correct: true,
    //     noSemicolon: true,
    //     vertical: true,
    //     braceAllman: false
    //   },
    //   style: {
    //     classPadding: true
    //   }
    // });

    esthetic.grammar({
      liquid: {
        embedded: {
          capture: [
            {
              language: 'json',
              argument: [ 'json_tag' ]
            }
          ]
        }
      }
    });

    const output = esthetic.format.sync(source, {
      language: 'liquid',
      preserveLine: 2,
      liquid: {
        correct: true,
        commentIndent: true,
        commentNewline: true,
        delimiterTrims: 'strip',
        lineBreakSeparator: 'before',
        normalizeSpacing: true,
        indentAttributes: true,
        preserveComment: false,
        quoteConvert: 'single',
        valueForce: 'intent',
        ignoreTagList: [
          'capture',
          'javascript'
        ]
      },
      markup: {
        attributeCasing: 'preserve',
        attributeSort: false,
        attributeSortList: [],
        correct: true,
        delimiterForce: false,
        preserveAttributes: false,
        stripAttributeLines: false,
        preserveComment: false,
        preserveText: false,
        quoteConvert: 'double',
        selfCloseSpace: true,
        commentNewline: true,
        forceIndent: true,
        commentIndent: true,
        ignoreJS: false,
        ignoreJSON: false,
        ignoreCSS: false,
        forceAttribute: 2,
        forceLeadAttribute: true
      }
    });

    return {
      repeat: 0,
      source: output,
      logger: false,
      finish: () => {
        t.log(output);
        t.log(esthetic.stats);
      }
    };

  });

});
