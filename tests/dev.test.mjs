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
    wrap: 70,
    language: 'liquid',
    liquid: {
      delimiterTrims: 'linebreak',
      delimiterPlacement: 'force-multiline',
      lineBreakSeparator: 'after',
      forceFilter: 2,
      forceArgument: 3,
      preserveInternal: false,
      quoteConvert: 'single'
    }
  });

  return {
    source: output,
    repeat: 0,
    inspect: true,
    logger: false,
    colors: false,
    finish: () => {
      console.log(esthetic.stats);
    //  console.log(esthetic.data);
      // console.log(esthetic.rules());
    }
  };

});
