import type { LanguageName, LexerName } from 'types';
import { cc } from 'lexical/codes';
import { NIL } from 'chars';
import { is } from 'utils';

interface ReturnValue {
  language: LanguageName,
  lexer: LexerName
}
export function detect (sample: string): ReturnValue {

  let b:string[] = [];
  let c: number = 0;

  /**
   * Variable Test
   */
  const vtest = (
    (/(((var)|(let)|(const)|(function)|(import))\s+(\w|\$)+[a-zA-Z0-9]*)/).test(sample) &&
    (/@import/).test(sample) === false
  );

  /**
   * Final Statics Test
   */
  const stest = (
    (/((((final)|(public)|(private))\s+static)|(static\s+void))/).test(sample)
  );

  function Style (): ReturnValue {

    if (/\n\s*#+\s+/.test(sample) || /^#+\s+/.test(sample)) {
      return {
        language: 'markdown',
        lexer: 'markup'
      };
    }

    if (
      /\$[a-zA-Z]/.test(sample) ||
      /\{\s*(\w|\.|\$|#)+\s*\{/.test(sample) || (
        /^[.#]?[\w][\w-]+\s+\{(?:\s+[a-z][a-z-]+:\s*\S+;)+\s+[&>+]?\s+[.#:]?[\w][\w-]\s+\{/.test(sample) &&
        /:\s*@[a-zA-Z];/.test(sample) === false
      )
    ) {
      return {
        language: 'scss',
        lexer: 'style'
      };
    }

    if (/@[a-zA-Z]:/.test(sample) || /\.[a-zA-Z]\(\);/.test(sample)) {
      return {
        language: 'less',
        lexer: 'style'
      };
    }

    return {
      language: 'css',
      lexer: 'style'
    };
  };

  function NotMarkup (): ReturnValue {

    let d: number = 1;
    let join: string = NIL;
    let flaga:boolean = false;
    let flagb: boolean = false;

    const pp: boolean = (
      (/((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/).test(sample)
    );

    function Script (): ReturnValue {

      if (
        sample.indexOf('(') > -1 ||
        sample.indexOf('=') > -1 || (
          sample.indexOf(';') > -1 &&
          sample.indexOf('{') > -1
        )
      ) {

        /* -------------------------------------------- */
        /* TYPESCRIPT                                   */
        /* -------------------------------------------- */

        /**
         * Final Statics Test
         */
        if (
          stest === true ||
          /\w<\w+(,\s+\w+)*>/.test(sample) ||
          /(?:var|let|const)\s+\w+\s*:/.test(sample) ||
          /=\s*<\w+/.test(sample)
        ) {

          return {
            language: 'typescript',
            lexer: 'script'
          };

        }

        /* -------------------------------------------- */
        /* JAVASCRIPT                                   */
        /* -------------------------------------------- */

        return {
          language: 'javascript',
          lexer: 'script'
        };
      }

      /* -------------------------------------------- */
      /* UNKNOWN                                      */
      /* -------------------------------------------- */

      return {
        language: 'unknown',
        lexer: 'text'
      };
    };

    function ScriptOrStyle (): ReturnValue {

      /* -------------------------------------------- */
      /* TYPESCRIPT                                   */
      /* -------------------------------------------- */

      if (
        /:\s*(?:number|string|boolean|any|unknown)(?:\[\])?/.test(sample) ||
        /(?:public|private)\s+/.test(sample) ||
        /(?:export|declare)\s+type\s+\w+\s*=/.test(sample) ||
        /(?:namespace|interface|enum|implements|declare)\s+\w+/.test(sample) ||
        /(?:typeof|keyof|as)\s+\w+/.test(sample) ||
        /\w+\s+as\s+\w+/.test(sample) ||
        /\[\w+(?:(?::\s*\w+)|(?:\s+in\s+\w+))\]:/.test(sample) ||
        /\):\s*\w+(?:\[\])?\s*(?:=>|\{)\s+/.test(sample) ||
        /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/.test(sample)
      ) {

        return {
          language: 'typescript',
          lexer: 'script'
        };

      }
      /* -------------------------------------------- */
      /* LIQUID                                       */
      /* -------------------------------------------- */

      if (
        /\s(class|var|const|let)\s+\w/.test(sample) === false &&
        /<[a-zA-Z](?:-[a-zA-Z])?/.test(sample) &&
        /<\/[a-zA-Z-](?:-[a-zA-Z])?/.test(sample) && (
          /\s?\{%/.test(sample) || /{{/.test(sample)
        )) {

        return {
          language: 'liquid',
          lexer: 'markup'
        };

      }

      /* -------------------------------------------- */
      /* JAVASCRIPT                                   */
      /* -------------------------------------------- */

      if (
        /^(\s*[$@])/.test(sample) === false &&
        /([}\]];?\s*)$/.test(sample) && (
          /^\s*import\s+\*\s+as\s+\w+\s+from\s+['"]/.test(sample) ||
          /module\.export\s+=\s+/.test(sample) ||
          /export\s+default\s+\{/.test(sample) ||
          /[?:]\s*[{[]/.test(sample) ||
          /^(?:\s*return;?(?:\s+[{[])?)/.test(sample)
        )
      ) {

        return {
          language: 'javascript',
          lexer: 'script'
        };
      }

      /* -------------------------------------------- */
      /* LIQUID                                       */
      /* -------------------------------------------- */

      if (/{%/.test(sample) && /{{/.test(sample) && /<\w/.test(sample)) {

        return {
          language: 'liquid',
          lexer: 'markup'
        };
      }

      /* -------------------------------------------- */
      /* LESS                                         */
      /* -------------------------------------------- */

      if (/{\s*(?:\w|\.|@|#)+\s*\{/.test(sample)) {

        return {
          language: 'less',
          lexer: 'style'
        };

      }

      /* -------------------------------------------- */
      /* SCSS                                         */
      /* -------------------------------------------- */

      if (/\$(\w|-)/.test(sample)) {

        return {
          language: 'scss',
          lexer: 'style'
        };

      }

      /* -------------------------------------------- */
      /* LESS                                         */
      /* -------------------------------------------- */

      if (/[;{:]\s*@\w/.test(sample) === true) {

        return {
          language: 'less',
          lexer: 'style'
        };

      }

      /* -------------------------------------------- */
      /* CSS                                          */
      /* -------------------------------------------- */

      return {
        language: 'css',
        lexer: 'style'
      };
    };

    if (d < c) {

      do {
        if (flaga === false) {

          if (is(b[d], cc.ARS) && is(b[d - 1], cc.FWS)) {
            b[d - 1] = NIL;
            flaga = true;
          } else if (
            flagb === false &&
            d < c - 6 &&
            b[d].charCodeAt(0) === 102 && //     f
            b[d + 1].charCodeAt(0) === 105 && // i
            b[d + 2].charCodeAt(0) === 108 && // l
            b[d + 3].charCodeAt(0) === 116 && // t
            b[d + 4].charCodeAt(0) === 101 && // e
            b[d + 5].charCodeAt(0) === 114 && // r
            is(b[d + 6], cc.COL)
          ) {
            flagb = true;
          }

        } else if (flaga === true && is(b[d], cc.ARS) && d !== c - 1 && is(b[d + 1], cc.FWS)) {
          flaga = false;
          b[d] = NIL;
          b[d + 1] = NIL;
        } else if (flagb === true && is(b[d], cc.SEM)) {
          flagb = false;
          b[d] = NIL;
        }

        if (flaga === true || flagb === true) b[d] = NIL;

        d = d + 1;
      } while (d < c);
    }

    join = b.join(NIL);

    /* -------------------------------------------- */
    /* JSON                                         */
    /* -------------------------------------------- */

    if (
      (/\s\/\//).test(sample) === false &&
      (/\/\/\s/).test(sample) === false &&
      (/^(\s*(\{|\[)(?!%))/).test(sample) === true &&
      (/((\]|\})\s*)$/).test(sample) &&
      sample.indexOf(',') !== -1
    ) {

      return {
        language: 'json',
        lexer: 'script'
      };

    }
    /* -------------------------------------------- */
    /* SCRIPT                                       */
    /* -------------------------------------------- */

    if (
      (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i).test(sample) === true && (
        vtest === true ||
        pp === true ||
        (/console\.log\(/).test(sample) === true ||
        (/export\s+default\s+class\s+/).test(sample) === true ||
        (/export\s+(const|var|let|class)s+/).test(sample) === true ||
        (/document\.get/).test(sample) === true ||
        (/((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/).test(sample) === true ||
        sample.indexOf('{') === -1 ||
        (/^(\s*if\s+\()/).test(sample) === true
      )
    ) return Script();

    /* -------------------------------------------- */
    /* SCRIPT OR STYLE                              */
    /* -------------------------------------------- */

    // * u007b === {
    // * u0024 === $
    // * u002e === .
    if (
      sample.indexOf('{') > -1 && (
        /^(\s*[\u007b\u0024\u002e#@a-z0-9])/i.test(sample) ||
        /^(\s*\/(\*|\/))/.test(sample) ||
        /^(\s*\*\s*\{)/.test(sample)
      ) &&
      /^(\s*if\s*\()/.test(sample) === false &&
      /=\s*(\{|\[|\()/.test(join) === false && (
        (
          /(\+|-|=|\?)=/.test(join) === false ||
          /\/\/\s*=+/.test(join)) || (
          /=+('|")?\)/.test(sample) &&
          /;\s*base64/.test(sample)
        )
      ) && /function(\s+\w+)*\s*\(/.test(join) === false) return ScriptOrStyle();

    /* -------------------------------------------- */
    /* LIQUID OR UNKNOWN                            */
    /* -------------------------------------------- */

    return sample.indexOf('{%') > -1
      ? {
        language: 'liquid',
        lexer: 'markup'
      }
      : {
        language: 'unknown',
        lexer: 'text'
      };

  };

  function Markup (): ReturnValue {

    function HTML (): ReturnValue {

      return (
        /{%-?\s*(schema|for|if|unless|render|include)/.test(sample) ||
        /{%-?\s*end\w+/.test(sample) ||
        /{{-?\s*content_for/.test(sample) ||
        /{{-?\s*[a-zA-Z0-9_'".[\]]+\s*-?}}/.test(sample) || (
          /{%/.test(sample) &&
          /%}/.test(sample) &&
          /{{/.test(sample) &&
          /}}/.test(sample)
        )
      ) ? {
          language: 'liquid',
          lexer: 'markup'
        } : {
          language: 'html',
          lexer: 'markup'
        };

    };

    return (
      /^(\s*<!doctype\s+html>)/i.test(sample) ||
      /^(\s*<html)/i.test(sample) || (
        /<form\s/i.test(sample) &&
        /<label\s/i.test(sample) &&
        /<input\s/i.test(sample)
      ) || (
        /<img(\s+\w+=['"]?\S+['"]?)*\s+src\s*=/.test(sample) ||
        /<a(\s+\w+=['"]?\S+['"]?)*\s+href\s*=/.test(sample)
      ) || (
        /<ul\s/i.test(sample) &&
        /<li\s/i.test(sample) &&
        /<\/li>/i.test(sample) &&
        /<\/ul>/i.test(sample)
      ) || (
        /<head\s*>/.test(sample) &&
        /<\/head>/.test(sample)
      ) || (
        /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(sample) &&
        /XHTML\s+1\.1/.test(sample) === false &&
        /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(sample) === false
      )
    ) ? HTML() : /\s?{[{%]-?/.test(sample) ? {
        language: 'liquid',
        lexer: 'markup'
      } : {
        language: 'xml',
        lexer: 'markup'
      };

  };

  if (sample === null || sample.replace(/\s+/g, NIL) === NIL) {
    return {
      language: 'unknown',
      lexer: 'text'
    };
  }

  /* -------------------------------------------- */
  /* MARKDOWN                                     */
  /* -------------------------------------------- */

  if (
    (
      /\n\s*#{1,6}\s+/.test(sample) ||
      /\n\s*(?:\*|-|(?:\d+\.))\s/.test(sample)
    ) && (
      /\[( |x|X)\]/.test(sample) ||
      /\s[*_~]{1,2}\w+[*_~]{1,2}/.test(sample) ||
      /\n\s*```[a-zA-Z]*?\s+/.test(sample) ||
      /-+\|(-+\|)+/.test(sample)
    )
  ) {

    return {
      language: 'markdown',
      lexer: 'text'
    };

  }
  /* -------------------------------------------- */
  /* MARKUP                                       */
  /* -------------------------------------------- */

  if (/^(\s*<!DOCTYPE\s+html>)/i.test(sample)) return Markup();

  /* -------------------------------------------- */
  /* STYLE                                        */
  /* -------------------------------------------- */

  if ((/^\s*@(?:charset|import|include|keyframes|media|namespace|page)\b/).test(sample)) return Style();

  if (
    /**
     * Final Statics Test
     */
    stest === false &&
    /=(>|=|-|\+|\*)/.test(sample) === false &&
    /^(?:\s*((if)|(for)|(function))\s*\()/.test(sample) === false &&
    /(?:\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(sample) === false &&
    vtest === false &&
    /return\s*\w*\s*(;|\})/.test(sample) === false && (
      sample === undefined ||
      /^(?:\s*#(?!(!\/)))/.test(sample) || (
        /\n\s*(\.|@)\w+(\(|(\s*:))/.test(sample) &&
        />\s*<\w/.test(sample) === false
      ) || (
        /^\s*:root\s*\{/.test(sample) ||
        /-{2}\w+\s*\{/.test(sample) ||
        /^\s*(?:body|button|hr|section|h[1-6]|p|strong|\*)\s+\{\s+/.test(sample)
      )
    )
  ) return Style();

  b = sample.replace(/\[[a-zA-Z][\w-]*=['"]?[a-zA-Z][\w-]*['"]?\]/g, NIL).split(NIL);
  c = b.length;

  /* -------------------------------------------- */
  /* MARKUP                                       */
  /* -------------------------------------------- */

  if (/^(\s*({{|{%|<))/.test(sample)) return Markup();

  /* -------------------------------------------- */
  /* NOT MARKUP                                   */
  /* -------------------------------------------- */

  /**
   * Final Statics Test
   */
  if (stest === true || (
    /^(?:[\s\w-]*<)/.test(sample) === false &&
    /(?:>[\s\w-]*)$/.test(sample) === false)) return NotMarkup();

  /* -------------------------------------------- */
  /* MARKUP OR NOT                                */
  /* -------------------------------------------- */

  return (
    (

      /^(?:\s*<\?xml)/.test(sample) ||
      /(?:>[\w\s:]*)?<(?:\/|!|#)?[\w\s:\-[]+/.test(sample) || (
        /^\s*</.test(sample) &&
        /<\/\w+(\w|\d)+>\s*$/.test(sample)
      )

    ) && (

      /^(?:[\s\w]*<)/.test(sample) ||
      /(?:>[\s\w]*)$/.test(sample)

    )
  ) || (

    /^(?:\s*<s((cript)|(tyle)))/i.test(sample) &&
    /(?:<\/s((cript)|(tyle))>\s*)$/i.test(sample)

  ) ? (

      /^(?:[\s\w]*<)/.test(sample) === false ||
      /(?:>[\s\w]*)$/.test(sample) === false

    ) ? NotMarkup() : Markup() : {
      language: 'unknown',
      lexer: 'text'
    };
}
