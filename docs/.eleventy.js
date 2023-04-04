const eleventy = require('@panoply/11ty');
const highlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const svgsprite = require('eleventy-plugin-svg-sprite');
const navigation = require('@11ty/eleventy-navigation');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const markdownit = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const Prism = require('prismjs');
const languages = require("prismjs/components/");
const esthetic = require('esthetic')

// Prism.languages.style = Prism.languages.extend('css', css(base));
// Prism.languages.script = Prism.languages.extend('javascript', js(base));

/* -------------------------------------------- */
/* INSERT BEFORE                                */
/* -------------------------------------------- */
Prism.languages.insertBefore('js', 'keyword', {
  variable: {
    pattern: /\b(?:const|var|let)\b/
  },
  module: {
    pattern: /\b(?:import|as|export|from|default)\b/
  },
  op: {
    pattern: /\b(?:typeof|new|of|delete|void|readonly)\b/
  },
  'punctuation-chars': {
    pattern: /[.,]/,
    global: true
  },
  semi: {
    pattern: /[;]/,
    global: true
  },
  nil: {
    pattern: /\b(?:null|undefined)\b/
  },
  'browser-objects': {
    pattern: /\b(?:window|document|console)\b/
  },
  types: {
    pattern: /\b(?:any|string|object|boolean|number|Promise)\b/,
    global: true
  },
  'type-array': {
    pattern: /\[\]/,
    global: true
  },
  'type-object': {
    pattern: /\{\}/,
    global: true
  },
  'return-type': {
    pattern: /(\)):(?=\s)/,
    global: true,
    lookbehind: true
  },
  'parameter-optional': {
    pattern: /[a-z_$][\w$]+(?=\?:\s*)/i,
    lookbehind: true
  },
  'parameter-type': {
    pattern: /(\?:\s*)[a-z_$][\w$]+/i,
    lookbehind: true
  },
  flow: {
    pattern: /\b(?:return|await)\b/
  },
  method: {
    pattern: /(\.\s*)[a-z_$][\w$]*(?=(\())/i,
    lookbehind: true
  }
});


const grammar = {
  pattern: /{[{%]-?[\s\S]+-?[%}]}/,
  inside: {
    'liquid-comment': {
      lookbehind: true,
      global: true,
      pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
    },
    'liquid-tag': {
      lookbehind: true,
      pattern: /({%-?\s*)\b([a-z]+)\b(?=[\s-%])/i
    },
    'liquid-tagged': {
      pattern: /\s+\b((?:end)[a-z]+|echo|if|unless|for|case|when)\s+/
    },
    'liquid-object': {
      lookbehind: true,
      pattern: /({[{%]-?\s*)\b[a-z_$][\w$]+(?=\.\s*)/i
    },
    'liquid-property': {
      lookbehind: true,
      pattern: /(\.\s*)[a-z_$][\w$]+(?=[.\s])/i
    },
    'liquid-filter': {
      lookbehind: true,
      pattern: /(\|)\s*(\w+)(?=[:]?)/
    },
    'liquid-string': {
      lookbehind: true,
      pattern: /['"].*?['"]/
    },
    'liquid-punctuation': {
      global: true,
      pattern: /[.,|:?]/
    },
    'liquid-operator': {
      pattern: /[!=]=|<|>|[<>]=?|[|?:=-]|\b(?:and|contains(?=\s)|or)\b/
    },
    'liquid-boolean': {
      pattern: /\b(?:true|false|nil)\b/
    },
    'liquid-number': {
      pattern: /\b(?:\d+)\b/
    },
    'liquid-parameter': {
      lookbehind: true,
      global: true,
      greedy: true,
      pattern: /(,)\s*(\w+)(?=:)/i
    },
    'liquid-style': {
      inside: Prism.languages.style,
      lookbehind: true,
      pattern: /(\{%-?\s*style(?:sheet)?\s*-?%\})([\s\S]+?)(?=\{%-?\s*endstyle(?:sheet)?\s*-?%\})/
    },
    'liquid-javascript': {
      inside: Prism.languages.script,
      lookbehind: true,
      pattern: /(\{%-?\s*javascript\s*-?%\})([\s\S]*?)(?=\{%-?\s*endjavascript\s*-?%\})/
    },
    'liquid-schema': {
      inside: Prism.languages.json,
      lookbehind: true,
      pattern: /(\{%-?\s*schema\s*-?%\})([\s\S]+?)(?=\{%-?\s*endschema\s*-?%\})/
    }
  }
}

Prism.languages.html = Prism.languages.extend('markup', {
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [
            {
              pattern: /^=/,
              alias: 'attr-equals'
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: true
            }
          ]
        }
      },
      grammar: grammar,
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/,
          punctuation: /{[{%]-?|-?[%}]}/,
          'attr-object': {
            lookbehind: true,
            pattern: /([a-z]*?)\s*[[\]0-9_\w$]+(?=\.)/i
          },
          'attr-property': {
            lookbehind: true,
            pattern: /(\.)\s*?[[\]\w0-9_$]+(?=[.\s?])/i
          },
          'punctuation-chars': {
            global: true,
            pattern: /[.,|:?]/
          },
          'attr-eq': /=/
        }
      }
    }
  },
  'delimiters': {
    pattern: /{[{%]-?[\s\S]+-?[%}]}/,
    inside: {
      'liquid-comment': {
        lookbehind: true,
        global: true,
        pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
      },
      'liquid-tag': {
        lookbehind: true,
        pattern: /({%-?\s*)\b([a-z]+)\b(?=[\s-%])/i
      },
      'liquid-tagged': {
        pattern: /\s+\b((?:end)[a-z]+|echo|if|unless|for|case|when)\s+/
      },
      'liquid-object': {
        lookbehind: true,
        pattern: /({[{%]-?\s*)\b[a-z_$][\w$]+(?=\.\s*)/i
      },
      'liquid-property': {
        lookbehind: true,
        pattern: /(\.\s*)[a-z_$][\w$]+(?=[.\s])/i
      },
      'liquid-filter': {
        lookbehind: true,
        pattern: /(\|)\s*(\w+)(?=[:]?)/
      },
      'liquid-string': {
        lookbehind: true,
        pattern: /['"].*?['"]/
      },
      'liquid-punctuation': {
        global: true,
        pattern: /[.,|:?]/
      },
      'liquid-operator': {
        pattern: /[!=]=|<|>|[<>]=?|[|?:=-]|\b(?:and|contains(?=\s)|or)\b/
      },
      'liquid-boolean': {
        pattern: /\b(?:true|false|nil)\b/
      },
      'liquid-number': {
        pattern: /\b(?:\d+)\b/
      },
      'liquid-parameter': {
        lookbehind: true,
        global: true,
        greedy: true,
        pattern: /(,)\s*(\w+)(?=:)/i
      },
      'liquid-style': {
        inside: Prism.languages.style,
        lookbehind: true,
        pattern: /(\{%-?\s*style(?:sheet)?\s*-?%\})([\s\S]+?)(?=\{%-?\s*endstyle(?:sheet)?\s*-?%\})/
      },
      'liquid-javascript': {
        inside: Prism.languages.script,
        lookbehind: true,
        pattern: /(\{%-?\s*javascript\s*-?%\})([\s\S]*?)(?=\{%-?\s*endjavascript\s*-?%\})/
      },
      'liquid-schema': {
        inside: Prism.languages.json,
        lookbehind: true,
        pattern: /(\{%-?\s*schema\s*-?%\})([\s\S]+?)(?=\{%-?\s*endschema\s*-?%\})/
      }
    }
  }
});

Prism.languages.bash = {
  keyword: {
    pattern: /(esthetic\s)/
  },
  argument: {
    pattern: /\<(.*?)\>/
  },
  punctuation: {
    pattern: /[<>]|--?(?=[a-z])/
  },
  comment: {
    pattern: /#.*?(?=\n)/
  }
}


let store;
let input;
let opts;

/**
 * Highlights code blocks contained within markdown files. Some contained
 * code blocks may use a language identifier separated by colon `:` character.
 * In such cases, this typically infers some higher order logic will be applied
 * in the next known code block. Typically this is found in the rules.
 *
 * @param {markdownit} md markdown-it
 * @param {string} str code input
 * @param {string} language code language
 */
function highlighter (md, raw, language) {

  let code = '';


  if (language) {

    if(language === 'json:rules') return raw;

    try {


      code = Prism.highlight(raw, Prism.languages[language], language);
      input = md.utils.escapeHtml(raw);

    } catch (err) {

      code = md.utils.escapeHtml(raw);

      console.error(
        'HIGHLIGHTER ERROR\n',
        'LANGUAGE: ' + language + '\n\n', err);
    }

  } else {
    code = md.utils.escapeHtml(raw);
    input = md.utils.escapeHtml(raw);
  }


  return `<pre class="language-${language}"><code>${code}</code></pre>`;

};

/**
 * Generates editor lines for rule sample code blocks
 *
 * @param {string} raw The code input source
 */
function getEditorLines (raw) {

  const count = raw.trim().split("\n").length -1
  const lines = [ ...Array(count > 0 ? count : 1) ]
  const numbers = lines.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`)).join('');

  return [
    /* html */`
    <div
      data-example-target="lines"
      class="line-numbers-wrapper"
      aria-hidden="true">
      ${numbers}
    </div>
   `
  ].join('')

}

function beforeAfter (raw,language) {


  const lines = getEditorLines(raw)
  const output = raw
  .replace(/<\/pre>\n/, `${lines}</pre>`)
  .replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
  .replace(/<code>/, `<code data-example-target="input" class="language-${language}">`)

  return [
    /* html */`
    <div class="row editor-tabs">
      <div class="col-auto pl-0 pr-1">
        <button
          class="selected"
          data-example-target="before"
          data-action="example#onBefore"
          aria-label="Before Formatting"
          data-tooltip="top">
          Before
        </button>
      </div>
      <div class="col-auto pr-0">
        <button
          data-example-target="after"
          data-action="example#onAfter"
          aria-label="After Formatting"
          data-tooltip="top">
         After
        </button>
      </div>
      <div class="col-auto pr-0">
        <button
          data-example-target="rules"
          data-action="example#onRules"
          aria-label="Rule Definitions"
          data-tooltip="top">
         Rules
        </button>
      </div>
      <!-- EDIT BUTTON -->
      <div class="editor-edit">
        <button
          type="button"
          data-example-target="editor"
          data-action="example#onEdit"
          aria-label="Click to enable editing"
          data-tooltip="right"></button>
      </div>
    </div>

    ${output}`

  ].join()

}

/**
 * Highlights code blocks contained within markdown files. Some contained
 * code blocks may use a language identifier separated by colon `:` character.
 * In such cases, this typically infers some higher order logic will be applied
 * in the next known code block. Typically this is found in the rules.
 *
 * @param {markdownit} md markdown-it
 * @param {string} raw code input
 * @param {string} lines code input
 * @param {string} language code language
 */
function exampleRule (md, raw, language) {

  let code = ''

  if(opts.$.rule === 'wrap' || opts.$.rule === 'wrapFraction') {

    try {

      const format = esthetic.format(md.utils.unescapeAll(input), opts.rules)
      const lines = getEditorLines(format)
      const highlight = Prism.highlight(format, Prism.languages[language], language);

      code = [
        /* html */`<pre class="line-numbers-mode language-${language}">`
        ,
        /* html */`
        <div class="editor-word-wrap">
         <span
          class="editor-wrap-line"
          data-example-target="wrap"
          data-action="mousedown->example#onResize"
          style="width: ${opts.$.value}%"></span>
        </div>
        `
        ,
        /* html */`<code data-example-target="input" class="language-${language}">`
        ,
        /* html */`${highlight}`
        ,
        /* html */`</code>`
        ,
        /* html */`${lines}`
        ,
        /* html */`</pre>`
      ].join('')

    } catch (err) {

      const lines = getEditorLines(raw)
      code = raw
      .replace(/<\/pre>\n/, `${lines}</pre>`)
      .replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
      .replace(/<code>/, `${wrap}<code data-example-target="input" class="language-${language}">`)

      console.error(
        'HIGHLIGHTER ERROR\n',
        'LANGUAGE: ' + language + '\n\n', err);
    }

  }

  const render = getFormRuleControl()

  return [
    /* html */`
    <div class="row editor-tabs">
      <div class="col-auto pl-0 pr-1">
        <button
          class="selected"
          data-example-target="demo"
          data-action="example#onDemo"
          aria-label="Formatting Example"
          data-tooltip="top">
          Example
        </button>
      </div>
      <div class="col-auto pr-0">
        <button
          data-example-target="rules"
          data-action="example#onRules"
          aria-label="Rule Definitions"
          data-tooltip="top">
         Rules
        </button>
      </div>

      ${render}

      <!-- EDIT BUTTON -->
      <div class="editor-edit">
        <button
          type="button"
          data-example-target="editor"
          data-action="example#onEdit"
          aria-label="Click to enable editing"
          data-tooltip="right"></button>
      </div>
    </div>

    ${code}`

  ].join()


  /**
   *
   * @param {range} type
   * @param {string} name
   * @returns
   */
  function getFormRuleControl () {


    if(opts.$.form === 'range') {

      return [
        /* html */`
          <div class="col-auto ml-auto">
            <input
              type="range"
              class="fm-range"
              name="${opts.$.rule}"
              minlength="0"
              min="0"
              max="100"
              maxlength="100"
              value="${opts.$.value}"
              data-example-target="range"
              data-action="example#onForm"
              data-tooltip="top">
          </div>
          <div class="col-auto fs-sm mr-4 pr-2" data-example-target="wrapSize">
            ${opts.$.value}
          </div>
        `
      ].join('')
    }

    return ''
  }


}
function getTabTemplate (md, raw, language) {

  if(opts) {

    if(opts.$.mode === 'example') {
      return exampleRule(md, raw, language)
    } else {
      return beforeAfter(raw, language)
    }

  }

  return beforeAfter(raw, language)

}

/**
 * Extracts code input source from `<pre></pre>` code regions.
 * When the raw input ends with a `|` character
 *
 * @param {markdownit} md markdown-it
 * @param {string} raw The character to join
 */
function getInputSource (raw) {

  const start = raw.indexOf('<code>')

  if(start > -1) {
    const close = raw.lastIndexOf('</code>') - 8
    return raw.slice(start + 6, close)
  }

  return raw

}


function getCodeBlocks (md, fence, ...args) {


  const [ tokens, index ] = args;
  const language = tokens[index].info.trim();
  const raw = fence(...args);

  if(language === 'json:rules') {
    const json = raw.slice(raw.indexOf('>', raw.indexOf('<code') + 1) + 1, raw.indexOf('</code'))
    store = JSON.parse(json.trim())
    return ''
  }

  if(store === undefined) return raw

  let mode = ''

  if('$' in store) {
    opts = store
    store = opts.rules
    mode = opts.$.mode
  } else {
    mode = 'before'
  }

  const template = getTabTemplate(md, raw, language)
  const rules = md.utils.escapeHtml(JSON.stringify(store))

  store = undefined
  opts = null

  return [
    /* html */`
    <div
      class="rule-example"
      data-controller="example"
      data-example-mode-value="${mode}"
      data-example-editor-value="false"
      data-example-rules-value="${rules}"
      data-example-input-value="${input.trim()}">
      ${template.trim()}
    </div>`

  ].join('')

}

/**
 * Line Numbers
 *
 * @param {markdownit} md
 */
function codeblocks (md)  {

  const { fence } = md.renderer.rules;

  md.renderer.rules.fence = (...args) =>  getCodeBlocks(md, fence, ...args)

};

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function notes (tokens, index) {

  return tokens[index].nesting === 1 ? `<blockquote class="note">` : '</blockquote>'

}

function rule (md, tokens, idx) {

  if (tokens[idx].nesting === 1) {

    var m = tokens[idx].info.trim().match(/^rule\s+(.*)$/);

    if (tokens[idx].nesting === 1) {

      let tooltip = ''

      if(m !== null) {

        if('🤡' === m[1]) {
          tooltip = "The choice of a clown."
        } else if ('🙌' === m[1]) {
          tooltip = "Authors choice"
        } else if ('👍' === m[1]) {
          tooltip = "Good choice."
        } else if ('👎' === m[1]) {
          tooltip = "Not recommended"
        } else if ('😳' === m[1]) {
          tooltip = "We live in a society, we're not animals"
        } else if ('💡' === m[1]) {
          tooltip = 'Showing an example of the rule'
        } else if ('🧐' === m[1]) {
          tooltip = 'You gotta do, what you gotta do'
        }

        // opening tag
        return [

          /* html */`
          <div class="rule-title d-flex ai-center">
          <div
            class="h5 mr-3"
            aria-label="${tooltip}"
            data-tooltip="top">${md.utils.escapeHtml(m[1])}</div>
          `
        ].join('')

      } else  {

        // opening tag
        return [

          /* html */`
          <div class="rule-title d-flex ai-center">
          `
        ].join('')

      }
    }


  }

  return '</div>'

}


/**
 * Generates HTML markup for various blocks
 *
 * @param {markdownit} md
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} idx The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function options (tokens, idx) {

  if (tokens[idx].nesting === 1) {

    return [
      /*html */`
      <div
        data-controller="accordion"
        data-accordion-multiple-value="true"
        class="accordion accordion-markdown">
    `].join('')

  }

  return '</div>'

}

module.exports = eleventy(function (config) {

  config.addPlugin(navigation);

  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => highlighter(md, str, lang)
  })
  .use(anchor)
  .use(codeblocks)
  .use(mdcontainer, 'note', {
    render: (tokens, idx) => notes(tokens, idx)
  })
  .use(mdcontainer, 'rule', {
    render: (tokens, idx) => rule(md, tokens, idx)
  })
  .use(mdcontainer, 'options', {
    render: (tokens, idx) => options(tokens, idx)
  })
  .disable("code");

  config.setBrowserSyncConfig();
  config.setLibrary('md', md);
  config.addPlugin(svgsprite, {
    path: 'src/assets/svg',
    spriteConfig: {
      mode: {
        symbol: {
          inline: true,
          sprite: 'sprite.svg',
          example: false
        }
      },
      shape: {
        transform: [ 'svgo' ],
        id: {
          generator: 'svg-%s'
        }
      },
      svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false
      }
    }
  });

  config.addPassthroughCopy({
    'node_modules/moloko/dist': 'assets/moloko',
    'node_modules/esthetic/dist/iife/index.js': 'assets/esthetic.min.js'
  })



  // config.addPlugin(htmlmin, {
  //   collapseBooleanAttributes: false,
  //   collapseWhitespace: true,
  //   decodeEntities: true,
  //   html5: true,
  //   removeAttributeQuotes: true,
  //   removeComments: true,
  //   removeOptionalTags: true,
  //   sortAttributes: true,
  //   sortClassName: true
  // });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    markdownTemplateEngine: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'json',
      'md'
    ],
    dir: {
      input: 'src',
      output: 'public',
      includes: 'views/include',
      layouts: 'views/layouts',
      data: 'data'
    }
  };

});
