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
    wrap: 0,
    language: 'liquid',
    preserveLine: 1,
    liquid: {
      delimiterTrims: 'preserve',
      delimiterPlacement: 'force-multiline',
      lineBreakSeparator: 'before',
      indentAttribute: true,
      forceFilter: 0,
      forceArgument: 2,
      preserveInternal: false,
      quoteConvert: 'single'
    },
    markup: {
      forceAttribute: 2,
      forceIndent: true,
      delimiterTerminus: 'adapt',
      lineBreakDelimiter: false,
      lineBreakValue: 'force-preserve',
      selfCloseSVG: true
    },
    json: {
      arrayFormat: 'indent',
      braceAllman: true
    }
  });

  return {
    source: output,
    repeat: 5,
    inspect: true,
    logger: false,
    colors: false,
    finish: () => {
      console.log(esthetic.stats);
      console.log(esthetic.table);
      // console.log(esthetic.rules());
    }
  };

});
