import { dev } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

// esthetic.on('format', ({ stats }) => {

//   console.log(stats);

// });

// esthetic.on('rules', (change) => {

//   console.log(change);
// });

dev(function (source) {

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

  // esthetic.grammar({
  //   liquid: {
  //     embedded: {
  //       capture: [
  //         {
  //           language: 'json',
  //           argument: [ 'json_tag' ]
  //         }
  //       ]
  //     }
  //   }
  // });

  const output = esthetic.format(source, {
    language: 'liquid',
    wrap: 125,
    crlf: false,
    indentSize: 2,
    preserveLine: 1,
    endNewline: false,
    wrapFraction: 90,
    liquid: {
      commentIndent: true,
      commentNewline: true,
      dedentTagList: [
        'schema'
      ],
      delimiterPlacement: 'consistent',
      delimiterTrims: 'never',
      lineBreakSeparator: 'before',
      indentAttribute: true,
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'single',
      forceFilter: 0,
      forceArgument: 3
    },
    markup: {
      quoteConvert: 'double',
      lineBreakValue: 'preserve',
      commentNewline: true,
      attributeSort: [
        'method',
        'accept-charset',
        'type',
        'for',
        'name',
        'id',
        'class',
        'aria-label',
        'aria-hidden',
        'data-controller'
      ],
      forceIndent: true,
      ignoreJS: false,
      forceAttribute: 3,
      preserveText: true
    }
  });

  return {
    source: output,
    repeat: 0,
    inspect: true,
    logger: false,
    colors: false,
    finish: () => {
      // console.log(JSON.stringify(output));
      console.log(esthetic.stats);
      // console.log(esthetic.table);
      // console.log(esthetic.rules());
    }
  };

});
