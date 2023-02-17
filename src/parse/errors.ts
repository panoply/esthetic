import { parse } from '@parse/parser';
import { NIL, NWL } from 'chars';
import * as rx from 'lexical/regex';
import { join, repeatChar } from 'utils';
import { Record, Syntactic } from 'types/internal';

export const enum ErrorTypes {
  /**
   * Syntax Error
   */
  SyntaxError = 1,
  /**
   * Configuration Error
   */
  ConfigurationError,
  /**
   * Grammar Error
   */
  GrammarError
}

export const enum ParseErrors {
  /**
   * Missing HTML End Tag
   *
   * @example
   * <div> // Missing ending </div> tag
   */
  MissingHTMLEndTag = 1,
  /**
   * Missing HTML End Tag
   *
   * @example
   * {% for xxx %} // Missing {% endfor %} tag
   */
  MissingLiquidEndTag,
  /**
   * Invalid HTML End Tag Placement
   *
   * @example
   * <div>
   * </div>
   * </div> // missing HTML Start tag
   */
  MissingHTMLStartTag,
  /**
   * Missing Liquid Filter Argument
   *
   * @example
   * {{ xxx || }}
   */
  MissingLiquidFilter,
  /**
   * Invalid HTML End Tag Placement
   *
   * @example
   * <div>
   * </div // missing HTML Delimiter
   */
  MissingHTMLEndingDelimiter,
  /**
   * Missing Liquid Start Tag
   *
   * @example
   * {% for xxx %}
   * {% endfor %}
   * {% endunless %} // missing Liquid Start tag
   */
  MissingLiquidStartTag,
  /**
   * Invalid Quotation Character
   *
   * @example
   * <div id=“xx”> // Invalid quote characters
   */
  InvalidQuotationCharacter,
  /**
   * Invalid Comment Attribute
   *
   * @example
   * <div <!-- comment --> id="foo"> // Comment cannot be placed within a attribute
   */
  InvalidHTMLCommentAttribute,
  /**
   * Invalid CDATA Termination
   *
   * @example
   * ]]> // Invalid CDATA ending
   */
  InvalidCDATATermination,
  /**
   * Invalid Liquid Character Sequence
   *
   * @example
   * {% render 'x',, %} // double commas is not valid
   */
  InvalidLiquidCharacterSequence,
  /**
   * Unterminated String
   *
   * @example
   *  const x '
   */
  UnterminateString,
}

function errorMessage (error: ParseErrors, token: string, name: string) {

  return {
    [ParseErrors.MissingHTMLEndTag]: ({
      message: 'Missing HTML ending tag',
      details: join(
        `The <${name}> tag type has an incomplete HTML syntactic structure resulting in a parse error.`,
        `To resolve the issue check that you have a closing </${name}> tag. For more information`,
        'see: https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags'
      )
    }),
    [ParseErrors.MissingLiquidEndTag]: ({
      message: `Missing Liquid end${name} tag`,
      details: join(
        `The Liquid {% ${name} %} is a tag block type which requires an end tag be provided.`,
        `To resolve the issue check that you have an ending {% end${name} %} tag. For more information`,
        'see: https://shopify.dev/api/liquid/tags'
      )
    }),
    [ParseErrors.MissingHTMLStartTag]: ({
      message: `Missing HTML start ${token} tag`,
      details: join(
        `The ${token} tag has incorrect placement or an incomplete structure resulting in a parse error.`,
        `To resolve the issue, you may need to provide a start <${name}> tag type or correct the placement. `
      )
    }),
    [ParseErrors.MissingLiquidStartTag]: ({
      message: `Missing Liquid start {% ${name} %} tag`,
      details: join(
        `The ${token} tag has incorrect placement or an incomplete structure resulting in a parse error.`,
        `To resolve the issue, you may need to provide a start {% ${name} %} tag type or correct the placement. `
      )
    }),
    [ParseErrors.MissingHTMLEndingDelimiter]: ({
      message: 'Missing HTML > delimiter on end tag',
      details: join(
        `The ${token} tag is missing its closing delimiter resulting in malformed syntax.`,
        'You can have Esthetic autofix syntax errors like this by setting the markup rule "correct" to true.'
      )
    }),
    [ParseErrors.InvalidHTMLCommentAttribute]: ({
      message: 'Invalid HTML Comment Attribute',
      details: join(
        'HTML comments are not allowed inside tags, start or end, at all.',
        `To resolve the issue, remove the comment ${token} or place it above the tag.`,
        'For more information see: https://html.spec.whatwg.org/multipage/syntax.html#start-tags'
      )
    }),
    [ParseErrors.InvalidQuotationCharacter]: ({
      message: `Invalid quotation ${token} character`,
      details: join(
        `Bad quotation character (\u201c, &#x201c) provided on the ${token} tag. Only single (') or double (")`,
        'quotations characters are valid in HTML (markup) languages. For more information see:',
        'https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state'
      )
    }),
    [ParseErrors.InvalidCDATATermination]: ({
      message: 'Invalid CDATA Termination Sequence',
      details: join(
        `The CDATA ${token} bracket state sequence provided is invalid resulting in a parse error.`,
        'For more information see: https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state'
      )
    }),
    [ParseErrors.InvalidLiquidCharacterSequence]: ({
      message: 'Invalid Liquid Character Sequence',
      details: join(
        `The ${name} tag has invalid sequence of characters defined.`,
        `To resolve the issue, fix the ${token} tag character order.`
      )
    }),
    [ParseErrors.UnterminateString]: ({
      message: 'Unterminated string',
      details: join(
        'There is an unterminated string sequence.'
      )
    })
  }[error];

}

/**
 * Paired token tag store for capturing invalid start/end tag
 * type structures.
 */
const pairs: Map<number, Syntactic> = new Map();

/**
 * Error Snippet
 *
 * Generates an error snippet code preview for parse errors
 * that occur.
 */
function snippet (line: number) {

  // const build: string[] = [];
  const lines: string[] = parse.source.split(NWL);
  const count: number = lines.length;

  const at = lines[line - 1].search(/\S/) - 1;

  console.log(parse.linesSpace, at);

  const ws = `${repeatChar(at)}${repeatChar(lines[line - 1].length - at - 1, '^')}`;

  if (count === 1) {

    return `${line} | ${lines[line - 1].trim()}`;

  } else if (count === 2) {

    return join(
      `${line - 1} │ ${lines[line - 2].trim().length === 0 ? '␤' : lines[line - 2].trim()}`,
          `${line} │ ${lines[line - 1].trim()}`
    );

  } else {

    parse.error.snippet = join(
      `  ${line - 1}  │ ${lines[line - 2]}`,
      `» ${line}  │ ${lines[line - 1]}`,
      `  ↓  │  ${ws}`,
      `𐄂 ${parse.lineNumber - 1}  │ ${lines[parse.lineNumber - 1]}`,
      `  ${parse.lineNumber} │  ${lines[parse.lineNumber]}`
    );

    return parse.error.snippet;

  }

}

/**
 * Parse Error
 *
 * This function is responsible cancelling the traversal and
 * returning a parse error when the lexing encounters an
 * error. The `parse.error` is assigned a string value that
 * informs about the issue.
 */
function generate (context: Syntactic, errCode: ParseErrors) {

  const info = errorMessage(errCode, context.token, context.stack);

  parse.error.message = join(
    `Syntax Error (line ${context.line || parse.lineNumber}): ${info.message}`,
    NWL,
    snippet(context.line),
    NWL,
    info.details,
    NWL,
    `Prettify: ${context.type === LangMap.HTML ? 'HTML' : 'Liquid'} Parse Error (Code: ${errCode}}`,
    `Location: ${context.line}:${parse.linesSpace} ⟷  ${parse.lineNumber}:25`
    // 'tip' in info ? 'TIP' + NWL + info.tip : NIL
  );

  return parse.error.message;

}

/**
 * Syntactical Tracking
 *
 * This is a store The `parse.data.begin` index. This will typically
 * reference the `parse.count` value, incremented by `1`
 */
export function syntactic (record: Record) {

  if (record.types === 'template_start' || record.types === 'start') {

    const name = rx.getTagName(record.token);

    if (record.types === 'start') {

      pairs.set(parse.count + 1, {
        line: parse.lineNumber,
        token: record.token,
        stack: name,
        type: LangMap.HTML
      });

    } else {

      pairs.set(parse.count + 1, {
        line: parse.lineNumber,
        token: record.token,
        stack: name,
        type: LangMap.Liquid
      });

    }

  } else if (record.types === 'end' || record.types === 'template_end') {

    if (pairs.has(parse.scope.index)) {

      const ref = pairs.get(parse.scope.index);

      if (ref.type === LangMap.Liquid) {

        if (ref.stack !== parse.scope.token) {
          return generate(ref, ParseErrors.MissingLiquidEndTag);
        } else {
          pairs.delete(parse.scope.index);

        }

      } else if (ref.type === LangMap.HTML) {

        if (`</${ref.stack}>` !== record.token) {
          return generate(ref, ParseErrors.MissingHTMLEndTag);
        } else {
          pairs.delete(parse.scope.index);
        }

      }

    }

  }

  return NIL;

}
