import { parse } from 'parse/parser';
import { NWL } from 'lexical/chars';
import { join } from 'utils';
import { getLanguageName } from 'rules/language';
import { ParseError } from 'lexical/errors';
import { IParseError } from 'types/index';

/**
 * Markup Errors
 *
 * Generates the error string to throw in markup lexing
 */
export function MarkupError (error: ParseError, token: string, name?: string, start?: string) {

  const info = message(error, token, name || parse.stack.entry[0]);
  const err: IParseError = {};

  err.code = error;
  err.language = getLanguageName(parse.language);
  err.details = info.details;
  err.message = info.message;

  parse.error = join(
    `Syntax Error (line ${parse.lineNumber}): ${info.message}`
    , NWL
    , snippet()
    , NWL
    , info.details
    , NWL
    , `Language: ${getLanguageName(parse.language)} `
    , `Location: ${start}:${parse.lineColumn}  ⟷  ${parse.lineNumber}:${parse.lineColumn}`
    , `Æsthetic: Parse Failed (Code: ${error})`
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

  const info = message(error, context.token, context.name);
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
    , 'Definition:'
    , `  ${error.option}`
    , 'Provided:'
    , `  ${error.provided} `
    , 'Expected:'
    , `  ${error.expected.join('  \n')} `
  );

}

/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

/**
 * Error Snippet
 *
 * Generates an error snippet code preview for parse errors that occur.
 */
function snippet () {

  const output: string[] = [];
  const input: string[] = parse.source.split(NWL);
  const ender: number = parse.lineNumber - 1;
  const chars = `${ender + 1}`.length;
  const point = (size: number) => `\x1b[31m${'^'.repeat(size)}\x1b[39m`;

  let no: number = ender - 1;
  let prev: string = '';

  if (input.length > 2) no = ender - 3;
  if (input.length === 2) no = ender - 2;

  do {

    const num = `${no + 1}`;
    const prepend = chars - num.length > 0 ? ` \x1b[90m${num} |` : `\x1b[90m${num} |`;
    const token = input[no].trim();

    if (no > ender) break;

    if (!token) {
      no = no + 1;
      continue;
    }

    if (no === ender - 1) {

      if (token.length === 0) {
        output.push(`${' '.repeat(chars + 2)} ${point(prev.length)}`);
      } else {
        output.push(`${prepend} \x1b[90m${token}`);
        output.push(`${' '.repeat(chars + 2)} ${point(token.length)}`);
      }

    } else {

      output.push(`${prepend} \x1b[90m${token || '␤'}`);

    }

    no = no + 1;
    prev = token;

  } while (no < ender);

  return output.join(NWL);

}

/**
 * Error Messages
 *
 * Returns a relating error message based on the provided enum
 */
function message (code: ParseError, token: string, name: string): {
  code: ParseError,
  message: string;
  details: string;
} {

  return {
    [ParseError.MissingHTMLEndTag]: ({
      code,
      message: `Missing HTML \`${name}\` end tag`,
      details: join(
        `The \`<${name}>\` tag type has an incomplete HTML syntactic structure resulting in a parse error.`,
        `To resolve the issue check that you have a closing \`</${name}>\` tag. For more information`,
        'see: https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags'
      )
    }),
    [ParseError.MissingLiquidEndTag]: ({
      code,
      message: `Missing Liquid \`end${name}\` tag`,
      details: join(
        `The Liquid \`{% ${name} %}\` is a tag block type which requires an end tag be provided.`,
        `To resolve the issue check that you have an ending \`{% end${name} %}\` tag. For more information`,
        'see: https://shopify.dev/api/liquid/tags'
      )
    }),
    [ParseError.MissingHTMLStartTag]: ({
      code,
      message: `Missing HTML start \`${token}\` tag`,
      details: join(
        `The \`${token}\` tag has incorrect placement or an incomplete structure resulting in a parse error.`,
        `To resolve the issue, you may need to provide a start \`<${name}>\` tag type or correct the placement. `
      )
    }),
    [ParseError.MissingLiquidStartTag]: ({
      code,
      message: `Missing Liquid start \`{% ${name} %}"\` tag`,
      details: join(
        `The \`${token}\` tag has incorrect placement or an incomplete structure resulting in a parse error.`,
        `To resolve the issue, you may need to provide a start \`{% ${name} %}\` tag type or correct the placement. `
      )
    }),
    [ParseError.MissingHTMLEndingDelimiter]: ({
      code,
      message: 'Missing HTML > delimiter on end tag',
      details: join(
        `The \`${token}\` tag is missing its closing delimiter resulting in malformed syntax.`,
        'You can have Esthetic autofix syntax errors like this by setting the markup rule "correct" to true.'
      )
    }),
    [ParseError.InvalidHTMLCommentAttribute]: ({
      code,
      message: 'Invalid HTML Comment Attribute',
      details: join(
        'HTML comments are not allowed inside tags, start or end, at all.',
        `To resolve the issue, remove the comment \`${token}\` or place it above the tag.`,
        'For more information see: https://html.spec.whatwg.org/multipage/syntax.html#start-tags'
      )
    }),
    [ParseError.InvalidQuotation]: ({
      code,
      message: `Invalid quotation \`${token}\` character`,
      details: join(
        `Bad quotation character (\u201c, &#x201c) provided on the \`${token}\` tag. Only single (') or double (")`,
        'quotations characters are valid in HTML (markup) languages. For more information see:',
        'https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state'
      )
    }),
    [ParseError.InvalidCDATATermination]: ({
      code,
      message: 'Invalid CDATA Termination Sequence',
      details: join(
        `The CDATA \`${token}\` bracket state sequence provided is invalid resulting in a parse error.`,
        'For more information see: https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state'
      )
    }),
    [ParseError.InvalidLiquidCharacterSequence]: ({
      code,
      message: `Invalid character sequence in \`${name}\` token`,
      details: join(
        'An invalid sequence of characters defined'
      )
    }),
    [ParseError.UnterminateString]: ({
      code,
      message: 'Unterminated string',
      details: join(
        'There is an unterminated string sequence.'
      )
    })
  }[code];

}
