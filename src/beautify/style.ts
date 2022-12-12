import type { Options } from 'types/prettify';
import { prettify } from '@prettify/model';
import { is, not } from '@utils/helpers';
import { cc, NIL, WSP } from '@utils/chars';

/* -------------------------------------------- */
/* MARKUP BEAUTIFICATION                        */
/* -------------------------------------------- */

prettify.beautify.style = (options: Options) => {

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * The beautified result
   */
  const build = [];

  /**
   * Reference to `options.parsed`
   */
  const data = prettify.data;

  /**
   * Carriage return / Line Feed
   */
  const lf = options.crlf === true ? '\r\n' : '\n';

  /**
   * The input length
   */
  const len = prettify.end > 0 ? prettify.end + 1 : data.token.length;

  /**
   * Line preservation
   */
  const pres = options.preserveLine + 1;

  /**
   * Single unit of indentation
   */
  const tab = (() => {

    let aa = 0;
    const bb = [];

    do {
      bb.push(options.indentChar);
      aa = aa + 1;
    } while (aa < options.indentSize);

    return bb.join(NIL);

  })();

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Indentation level - References `options.indentLevel`
   */
  let indent = options.indentLevel;

  /**
   * Word wrap - This is used for `forceValue`
   */
  let wrap = options.wrap > 0 ? options.wrap : 0;

  /**
   * Holds the current index position.
   */
  let a = prettify.start;

  /**
   * When store - Holds reference to something (unsure what this is for?)
   */
  let when = [ NIL, NIL ];

  /* -------------------------------------------- */
  /* FUNCTIONS                                    */
  /* -------------------------------------------- */

  /**
   * Applies New lines plus indentation
   */
  function nl (tabs: number) {

    const linesout = [];
    const total = (() => {

      if (a === len - 1) return 1;

      if (data.lines[a + 1] - 1 > pres) return pres;
      if (data.lines[a + 1] > 1) return data.lines[a + 1] - 1;

      return 1;

    })();

    let index = 0;

    if (tabs < 0) tabs = 0;

    do {
      linesout.push(lf);
      index = index + 1;
      wrap = indent;
    } while (index < total);

    if (tabs > 0) {
      index = 0;
      do {
        linesout.push(tab);
        index = index + 1;
      } while (index < tabs);
    }

    build.push(linesout.join(NIL));

  };

  /**
   * Vertical colon applier, used when `options.style.vertical`
   * is provided. I will likely to deprecate or remove this.
   */
  function vertical () {

    const start = data.begin[a];
    const startChar = data.token[start];
    const endChar = data.token[a];
    const store = [];

    let b = a;
    let c = 0;
    let item: [ number, number ];
    let longest = 0;

    if (start < 0 || b <= start) return;

    do {

      b = b - 1;

      if (data.begin[b] === start) {

        if (is(data.token[b], cc.COL)) {
          item = [ b - 1, 0 ];

          do {
            b = b - 1;

            if (
              (
                (
                  (
                    is(data.token[b], cc.SEM) &&
                    startChar === '{'
                  ) || (
                    is(data.token[b], cc.COM) &&
                    startChar === '('
                  )
                ) &&
                data.begin[b] === start) || (
                data.token[b] === endChar &&
                data.begin[data.begin[b]] === start
              )
            ) {
              break;
            }

            if (
              data.types[b] !== 'comment' &&
              data.types[b] !== 'selector' &&
              data.token[b] !== startChar &&
              data.begin[b] === start
            ) {

              item[1] = data.token[b].length + item[1];
            }

          } while (b > start + 1);

          if (item[1] > longest) longest = item[1];

          store.push(item);
        }

      } else if (data.types[b] === 'end') {

        if (b < data.begin[b]) break;

        b = data.begin[b];
      }

    } while (b > start);

    b = store.length;

    if (b < 2) return;

    do {

      b = b - 1;

      if (store[b][1] < longest) {
        c = store[b][1];

        do {
          data.token[store[b][0]] = data.token[store[b][0]] + ' ';
          c = c + 1;
        } while (c < longest);

      }

    } while (b > 0);
  };

  if (options.script.vertical === true && options.style.compressCSS === false) {

    a = len;

    do {
      a = a - 1;
      if (is(data.token[a], cc.RCB) || is(data.token[a], cc.RPR)) vertical();
    } while (a > 0);

    a = prettify.start;
  }

  /* -------------------------------------------- */
  /* BEAUTIFICATION LOOP                          */
  /* -------------------------------------------- */

  do {

    if (data.types[a] === 'property') wrap = indent + data.token[a].length;

    if (data.types[a + 1] === 'end' || data.types[a + 1] === 'template_end' || data.types[a + 1] === 'template_else') {

      indent = indent - 1;

    }

    if (data.types[a] === 'template' && data.lines[a] === 0) {

      build.push(data.token[a]);

      if (data.types[a + 1] === 'template' && data.lines[a + 1] > 0) nl(indent);

    } else if (data.types[a] === 'template' && data.lines[a] > 0) {

      // HOTFIX
      //
      // Fixes semicolon newlines from occuring when output tag is used as a property
      // value within classes, eg: .class { color: {{ foo }}; }
      // In addition we will also gracefully handle comma separated values
      //
      if (data.types[a - 2] !== 'property' && data.types[a - 1] !== 'colon') {

        wrap = indent;

        build.push(data.token[a]);

        if (data.types[a + 1] !== 'separator' && not(data.token[a + 1], cc.SEM)) {
          nl(indent);
        }

      } else if (
        data.types[a - 2] === 'property' &&
        data.types[a - 1] === 'colon' &&
        data.types[a + 1] === 'separator' &&
        is(data.token[a + 1], cc.COM)
      ) {

        wrap = wrap + data.token[a].length;

        if (wrap > options.wrap) nl(indent);

        build.push(data.token[a]);

        do {

          a = a + 1;

          build.push(data.token[a]);

          if (data.lines[a + 1] > 0) nl(indent);

        } while (data.types[a] !== 'separator' && not(data.token[a], cc.SEM));

        if (is(data.token[a], cc.SEM) && data.types[a] === 'separator') {

          build.push(data.token[a]);

          if (data.lines[a + 1] > 0) nl(indent);

          a = a + 1;
          continue;
        }

      } else {

        wrap = wrap + data.token[a].length;

        if (options.wrap > 0 && wrap > options.wrap) {

          nl(indent);

          build.push(data.token[a]);

        } else {
          build.push(data.token[a]);
        }

      }

    } else if (data.types[a] === 'template_else') {

      build.push(data.token[a]);

      indent = indent + 1;
      nl(indent);

    } else if (data.types[a] === 'start' || data.types[a] === 'template_start') {

      indent = indent + 1;

      build.push(data.token[a]);

      if (data.types[a + 1] !== 'end' && data.types[a + 1] !== 'template_end' && (
        options.style.compressCSS === false || (
          options.style.compressCSS === true &&
          data.types[a + 1] === 'selector'
        ))
      ) {

        nl(indent);
      }

    } else if ((is(data.token[a], cc.SEM) && (
      options.style.compressCSS === false || (
        options.style.compressCSS === true &&
        data.types[a + 1] === 'selector'
      )
    )) || (
      data.types[a] === 'end' ||
      data.types[a] === 'template_end' ||
      data.types[a] === 'comment'
    )) {

      build.push(data.token[a]);

      if (data.types[a + 1] === 'value') {

        if (data.lines[a + 1] === 1) {
          build.push(' ');
        } else if (data.lines[a + 1] > 1) {
          nl(indent);
        }

      } else if (data.types[a + 1] !== 'separator') {

        if (data.types[a + 1] !== 'comment' || (data.types[a + 1] === 'comment' && data.lines[a + 1] > 1)) {

          nl(indent);
        } else {
          build.push(WSP);
        }
      }

    } else if (is(data.token[a], cc.COL)) {

      // console.log(data.token[a], data.types[a], data.types[a - 1]);

      build.push(data.token[a]);

      // console.log(data.types[a]);

      if (options.style.compressCSS === false) {
        if (data.types[a] !== 'selector' && not(data.token[a + 1], cc.COM)) build.push(WSP);
      }

    } else if (data.types[a] === 'selector') {

      if (
        options.style.classPadding === true &&
        data.types[a - 1] === 'end' &&
        data.lines[a] < 3
      ) {
        build.push(lf);
      }

      if (data.token[a].indexOf('and(') > 0) {

        data.token[a] = data.token[a].replace(/and\(/, 'and (');
        build.push(data.token[a]);

      } else if (data.token[a].indexOf('when(') > 0) {

        when = data.token[a].split('when(');
        build.push(when[0].replace(/\s+$/, NIL));
        nl(indent + 1);
        build.push(`when (${when[1]}`);

      } else {

        build.push(data.token[a]);
      }

      if (data.types[a + 1] === 'start') {
        // if (options.style.braceAllman === true) {
        //   nl(indent);
        // } else

        if (options.style.compressCSS === false) {
          build.push(' ');
        }
      }

    } else if (is(data.token[a], cc.COM)) {

      build.push(data.token[a]);

      if (data.types[a + 1] === 'selector' || data.types[a + 1] === 'property') {
        nl(indent);
      } else if (options.style.compressCSS === false) {
        build.push(' ');
      }

    } else if (
      data.stack[a] === 'map' &&
      is(data.token[a + 1], cc.RPR) &&
      a - data.begin[a] > 5
    ) {

      build.push(data.token[a]);
      nl(indent);

    } else if (data.token[a] === 'x;') {

      nl(indent);

    } else if ((data.types[a] === 'variable' || data.types[a] === 'function') &&
      options.style.classPadding === true &&
      data.types[a - 1] === 'end' &&
      data.lines[a] < 3
    ) {

      build.push(lf);
      build.push(data.token[a]);

    } else if (not(data.token[a], cc.SEM) || (
      is(data.token[a], cc.SEM) && (options.style.compressCSS === false || (
        options.style.compressCSS === true &&
        not(data.token[a + 1], cc.RCB)
      ))
    )) {

      build.push(data.token[a]);

    }

    a = a + 1;

  } while (a < len);

  prettify.iterator = len - 1;

  return build.join(NIL);

};
