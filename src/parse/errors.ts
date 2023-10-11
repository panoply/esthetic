import type { IParseError, Syntactic } from 'types';
import { parse } from 'parse/parser';
import { NWL, WSP } from 'lexical/chars';
import { isUndefined, join } from 'utils/helpers';
import { getLanguageName } from 'rules/language';
import { ParseError } from 'lexical/errors';
import { getTagName } from 'lexical/lexing';
import { config } from 'config';

/**
 * Markup Errors
 *
 * Generates the error string to throw in markup lexing
 */
export function MarkupError (errorCode: ParseError, token: string, tname?: string) {

  if (!tname) tname = getTagName(token);

  const error: IParseError = message(errorCode, tname, parse.lineNumber);
  error.language = getLanguageName(parse.language);

  parse.error = join(
    error.message
    , NWL
    , getSampleSnippet()
    , NWL
    , error.details.replace(/\n/g, WSP)
    , NWL
    , `Language: ${getLanguageName(parse.language)} `
    , `Location: ${parse.lineNumber}:${parse.lineColumn}`
    , `Æsthetic: Parse Failed (Code: ${error.code})`
  );

}

export function SyntacticError (errorCode: ParseError, context: Syntactic, tname?: string) {

  if (!tname) tname = getTagName(context.token);

  const error: IParseError = message(errorCode, tname, context.line);
  error.language = getLanguageName(parse.language);

  parse.error = join(
    error.message
    , NWL
    , getSampleToken(context)
    , NWL
    , error.details
    , NWL
    , ansi(`Language: ${getLanguageName(parse.language)}`)
    , ansi(`Location: ${context.line}`)
    , ansi(`Æsthetic: Parse Failed (Code: ${errorCode})`)
  );

}

/**
 * Markup Errors
 *
 * Generates the error string to throw in markup lexing
 */
export function CustomError (error: ParseError, context: {
  token: string;
  snippet: string;
  name: string;
  line: number;
}) {

  const info = message(error, context.name);
  const err: IParseError = {};

  err.code = error;
  err.language = getLanguageName(parse.language);
  err.details = info.details;
  err.message = info.message;

  return join(
    `Syntax Error (line ${context.line}): ${info.message}`
    , NWL
    , context.snippet
    , NWL
    , info.details
    , NWL
    , `Language: ${getLanguageName(parse.language)} `
    , `Æsthetic: Parse Failed (Code: ${error})`
  );

}

/**
 * Rule Errors
 *
 * Generates the error string to throw if an invalid rule was provided
 */
export function RuleError (error: {
  option: string;
  message: string;
  provided: any;
  expected: string[]
}) {

  return join(
    `Rule Error: ${error.message}`
    , NWL
    , `Definition: ${error.option}`
    , `Provided: ${error.provided} `
    , `Expected: ${error.expected.join(', ')} `
  );

}

/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

const point = (size: number) => config.logColors
  ? `\x1b[93m${'^'.repeat(size)}\x1b[39m`
  : `${'^'.repeat(size)}`;

/**
 * Get Sample Token
 *
 * This function will generate sample snippet when the token is determined
 * to contain newlines. Such cases occur when we are dealing with a HTML tag,
 * with multiple attributes.
 */
function getSampleToken (context: Syntactic) {

  /**
   * Line Number
   */
  let n: number = context.line - parse.get(context.index).lines;

  /**
   * Iteree index
   */
  let i: number = 0;

  /**
   * Token capture
   */
  let token: string = '';

  /**
   * The source split reference
   */
  const source: string[] = parse.source.split(NWL).slice(n, context.line);

  /**
   * The line number offset, eg: if line `9 |` we get size of `10 |`
   * to ensure the sample line numbers are always aligned.
   */
  const offset: number = `${context.line + 1}`.length;

  /**
   * The output store for which all items will be populated
   */
  const output: string[] = [];

  /**
   * Deconstruct various rules
   */
  const { indentSize, indentChar } = parse.rules;

  do {

    /**
     * Line number to write
     */
    const l = `${n + 1}`;

    /**
     * Line number prependiture, notice the starting space if true
     */
    const p = offset - l.length > 0
      ? config.logColors ? ` \x1b[90m${l} |` : ` ${l} |`
      : config.logColors ? `\x1b[90m${l} |` : `${l} |`;

    /* -------------------------------------------- */
    /* BEGIN                                        */
    /* -------------------------------------------- */

    token = source[i];

    if (i === 0) {

      if (isUndefined(source[i])) {
        if (config.logColors) {
          output.push(`${p} \x1b[31m${context.token}\x1b[39m`);
        } else {
          output.push(`${p} ${context.token}`);
        }
        break;
      }

      token = source[i].trimStart();
      if (config.logColors) {
        output.push(`${p} \x1b[31m${token}\x1b[39m`);
      } else {
        output.push(`${p} ${token}`);
      }

    } else {

      const match = token.match(/^\s*/);

      if (match !== null && match[0].length > indentSize) {
        token = indentChar.repeat(indentSize) + token.trimStart();
      }

      if (config.logColors) {
        output.push(`${p} \x1b[31m${token}\x1b[39m`);
      } else {
        output.push(`${p} ${token}`);
      }

    }

    i = i + 1;
    n = n + 1;

  } while (i < source.length);

  return output.join(NWL);

}

/**
 * Error Snippet
 *
 * Generates an error snippet code preview for parse errors that occur.
 */
function getSampleSnippet (line = parse.lineNumber) {

  const output: string[] = [];
  const input: string[] = parse.source.split(NWL);
  const ender: number = line;
  const chars = `${ender + 1}`.length;

  let no: number = ender - 1;
  let prev: string = '';

  if (input.length > 2) no = ender - 3;
  if (input.length === 2) no = ender - 2;

  do {

    const num = `${no + 1}`;
    const prepend = chars - num.length > 0
      ? config.logColors ? ` \x1b[90m${num} |` : ` ${num} |`
      : config.logColors ? `\x1b[90m${num} |` : `${num} |`;

    const token = input[no].trim();

    if (no > ender) break;

    if (!token) {
      if (config.logColors) {
        output.push(`${prepend} \x1b[90m${token || '␤'}`);
      } else {
        output.push(`${prepend} ${token || '␤'}`);
      }
      no = no + 1;
      continue;
    }

    if (no === ender - 1) {

      if (token.length === 0) {
        output.push(`${' '.repeat(chars + 2)} ${point(prev.length)}`);
      } else {
        if (config.logColors) {
          output.push(`${prepend} \x1b[31m${token}\x1b[39m`);
        } else {
          output.push(`${prepend} ${token}`);
        }

        output.push(`${' '.repeat(chars + 2)} ${point(token.length)}`);
      }

    } else {

      if (config.logColors) {
        output.push(`${prepend} \x1b[90m${token || '␤'}`);
      } else {
        output.push(`${prepend} ${token || '␤'}`);
      }

    }

    no = no + 1;
    prev = token;

  } while (no < ender);

  return output.join(NWL);

}

/**
 * Join (newline)
 *
 * String concatenation helper that accepts a spread string list.
 * Items are joined with newline character
 */
function ansi (...message: string[]) {

  if (config.logColors) {

    return `${message.join(NWL)}`.replace(/"(.*?)"/g, '\x1b[31m$1\x1b[39m');
  }

  return message.join(NWL);

}

/**
 * Error Messages
 *
 * Returns a relating error message based on the provided enum
 */
function message (code: ParseError, token: string, lineNo: number = parse.lineNumber): {
  code: ParseError,
  message: string;
  details: string;
} {

  return {
    [ParseError.MissingHTMLEndTag]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing HTML "${token}" end tag`),
      details: ansi(
        `The "<${token}>" tag type has an incomplete HTML syntactic structure resulting in a parse error.`,
        `To resolve the issue check that you have a closing "</${token}>" tag. For more information`,
        'see: https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags'
      )
    }),
    [ParseError.MissingLiquidEndTag]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing Liquid "end${token}" tag`),
      details: ansi(
        `The Liquid "${token}" is a tag block type which requires an end tag be provided.`,
        'For more information, see: https://shopify.dev/api/liquid/tags'
      )
    }),
    [ParseError.MissingHTMLStartTag]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing HTML start "${token}" tag`),
      details: ansi(
        'There is an incorrect placement or an incomplete structure resulting in a parse error.',
        `To resolve the issue, you may need to provide a start \`<${token}>\` tag type or correct the placement. `
      )
    }),
    [ParseError.MissingLiquidStartTag]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing Liquid start "${token}" tag`),
      details: ansi(
        'The Liquid tag has incorrect placement or an incomplete structure resulting in a parse error.',
        'To resolve the issue, you may need to provide a start tag type or correct the placement. '
      )
    }),
    [ParseError.MissingLiquidCloseDelimiter]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing Close Delimiter "%}" or "}}" on liquid tag`),
      details: ansi(
        'The Liquid tag is missing its closing delimiter resulting in malformed syntax.'
      )
    }),
    [ParseError.MissingHTMLEndingDelimiter]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing HTML ">" delimiter on end tag`),
      details: ansi(
        'The HTML tag is missing its closing delimiter resulting in malformed syntax.',
        'You can have Esthetic autofix syntax errors like this by setting the markup rule "correct" to true.'
      )
    }),
    [ParseError.MissingHTMLEndingCommentDelimiter]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Missing HTML "-->" comment delimiter`),
      details: ansi(
        'An invalid HTML comment expression which has resulting in malformed syntax.',
        'HTML Comment require ending delimiters to be passed.'
      )
    }),
    [ParseError.InvalidHTMLCommentDelimiter]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Invalid HTML "<!--" comment delimeter`),
      details: ansi(
        'An invalid HTML opening comment delimiter expressed resulting in malformed syntax.'
      )
    }),
    [ParseError.InvalidHTMLCommentAttribute]: ({
      code,
      message: ansi(`Illegal Syntax (line ${lineNo}): Invalid HTML Comment Attribute`),
      details: ansi(
        'HTML comments are not allowed inside tags, start or end, at all.',
        'To resolve the issue, remove the comment or place it above the tag.',
        'For more information see: https://html.spec.whatwg.org/multipage/syntax.html#start-tags'
      )
    }),
    [ParseError.InvalidQuotation]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Invalid quotation character`),
      details: ansi(
        'Bad quotation character (\u201c, &#x201c) provided. Only single \' or double "',
        'quotations characters are valid in HTML (markup) languages. For more information see:',
        'https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state'
      )
    }),
    [ParseError.InvalidCDATATermination]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Invalid CDATA Termination Sequence`),
      details: ansi(
        'The CDATA bracket state sequence provided is invalid resulting in a parse error.',
        'For more information see: https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state'
      )
    }),
    [ParseError.InvalidLiquidCharacterSequence]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Invalid character sequence in "${token}" token`),
      details: ansi(
        'An invalid sequence of characters defined'
      )
    }),
    [ParseError.UnterminateString]: ({
      code,
      message: ansi(`Syntax Error (line ${lineNo}): Unterminated String`),
      details: ansi(
        'There is an unterminated string sequence resulting in a parse error.'
      )
    })
  }[code];

}
