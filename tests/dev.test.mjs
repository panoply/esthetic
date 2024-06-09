import { dev } from '@liquify/ava/esthetic';
import esthetic from 'esthetic';

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
    indentSize: 2,
    preserveLine: 4,
    wrap: 80,
    liquid: {
      indentAttribute: true,
      forceFilter: 0,
      forceArgument: 0
    },
    markup: {
      forceAttribute: 2,
      delimiterTerminus: 'force',
      forceIndent: true,
      ignoreJS: true,
      ignoreJSON: false,
      valueSpacing: 'equipoise',
      valueLineBreak: 'force-indent'
    }
  });

  return {
    source: output,
    repeat: 0,
    inspect: true,
    logger: false,
    colors: true,
    finish: () => {

      // console.log(JSON.stringify(output.split(/(\n+)/), null, 2));
      console.log(esthetic.stats);
      // console.log(esthetic.table);
      // console.log(esthetic.rules());

    }
  };

});
