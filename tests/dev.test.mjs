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
    wrap: 80,
    language: 'liquid',
    crlf: false,
    indentChar: ' ',
    indentSize: 2,
    preserveLine: 2,
    endNewline: false,
    //  wrapFraction: 60,
    liquid: {
      commentIndent: true,
      commentNewline: true,
      dedentTagList: [
        'schema',
        'case'
      ],
      delimiterPlacement: 'inline',
      delimiterTrims: 'preserve',
      lineBreakSeparator: 'after',
      indentAttribute: true,
      normalizeSpacing: true,
      preserveComment: false,
      quoteConvert: 'single',
      forceFilter: 0,
      forceArgument: 2
    },
    markup: {
      quoteConvert: 'double',
      // lineBreakValue: 'preserve',
      commentNewline: true,
      commentIndent: true,
      commentDelimiters: 'force',
      // attributeSort: true,
      forceAttribute: 3,
      // forceIndent: true,
      // delimiterTerminus: 'inline',
      // ignoreJS: false,
      preserveText: false,
      selfCloseSVG: false
    },
    json: {
      braceAllman: true,
      arrayFormat: 'indent',
      objectIndent: 'indent'
    },
    style: {
      correct: true,
      commentNewline: true,
      commentIndent: true,
      noLeadZero: true,
      quoteConvert: 'single',
      classPadding: true
    },
    script: {
      correct: true,
      arrayFormat: 'indent',
      objectIndent: 'indent',
      methodChain: 3,
      caseSpace: true,
      quoteConvert: 'single',
      elseNewline: true,
      functionNameSpace: true,
      functionSpace: true,
      commentNewline: true,
      noCaseIndent: true
    }
  });

  return {
    source: output,
    repeat: 4,
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
