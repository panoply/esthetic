import { MarkupEnforced, IMarkupOptions } from './types/markup';
import { StyleEnforced, IStyleOptions } from './types/style';
import { JSONEnforced, IJSONOptions } from './types/json';
import { ScriptEnforced, IScriptOptions } from './types/script';
import { PrettyDiffOptions } from './types/prettydiff';
import { prettydiff } from './prettydiff/parser/prettydiff';

/**
 * Creates a language specific instance
 */
function createInstance (options: PrettyDiffOptions) {

  const x = Object.assign(Object.create(null), prettydiff.options, options);

  console.log(x);
  return x;
}

/**
 * Markup PrettyDiff Instance
 */
export const markup: PrettyDiffOptions = createInstance(
  {
    indentSize: 2,
    attemptCorrection: false,
    attributeSort: false,
    attributeSortList: [],
    commentIndent: false,
    commentNewline: false,
    forceAttribute: false,
    forceIndent: false,
    indentChar: ' ',
    indentLevel: 0,
    language: 'html',
    languageDefault: 'html',
    languageName: 'HTML/Liquid',
    lexer: 'markup',
    mode: 'beautify',
    endNewline: true,
    preserveAttributes: false,
    preserveComment: true,
    preserveLine: 3,
    preserveText: true,
    quoteConvert: 'double',
    selfCloseSpace: false,
    tagMerge: false,
    tagSort: false,
    wrap: 0
  } as MarkupEnforced & IMarkupOptions
);

/**
 * Style PrettyDiff Instance
 */
export const style: PrettyDiffOptions = createInstance(
  {
    braceAllman: false,
    classPadding: false,
    compressedCSS: false,
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    language: 'css',
    language_default: 'css',
    language_name: 'CSS/Liquid',
    lexer: 'style',
    mode: 'beautify',
    endNewline: true,
    noLeadZero: false,
    objectSort: false,
    preserveLine: 3,
    quoteConvert: 'none',
    wrap: 0
  } as StyleEnforced & IStyleOptions
);

/**
 * JSON PrettyDiff Instance
 */
export const json: PrettyDiffOptions = createInstance(
  {
    arrayFormat: 'default',
    attemptCorrection: false,
    braceAllman: true,
    bracePadding: false,
    braceStyle: 'none',
    endComma: 'never',
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    language: 'json',
    languageDefault: 'json',
    languageName: 'JSON',
    preserveText: true,
    lexer: 'script',
    mode: 'beautify',
    endNewline: true,
    noSemicolon: true,
    objectIndent: 'indent',
    objectSort: false,
    preserveLine: 2,
    quoteConvert: 'double',
    wrap: 0
  }
);

/**
 * JSON PrettyDiff Instance
 */
export const script: PrettyDiffOptions = createInstance(
  {
    arrayFormat: 'default',
    attemptCorrection: false,
    braceAllman: false,
    bracePadding: false,
    braceStyle: 'none',
    endComma: 'never',
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    language: 'javascript',
    language_default: 'javascript',
    language_name: 'JavaScript/Liquid',
    lexer: 'script',
    mode: 'beautify',
    braceNewline: true,
    caseSpace: false,
    commentIndent: false,
    commentNewline: false,
    elseNewline: true,
    endNewline: true,
    functionNameSpace: true,
    functionSpace: false,
    methodChain: 0,
    neverFlatten: false,
    noCaseIndent: false,
    noSemicolon: false,
    objectIndent: 'indent',
    objectSort: false,
    preserveComment: true,
    preserveLine: 3,
    preserveText: true,
    quoteConvert: 'single',
    semicolon: false,
    ternaryLine: false,
    variableList: [],
    vertical: false,
    wrap: 0
  } as ScriptEnforced & IScriptOptions
);
