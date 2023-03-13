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

// Prism.languages.style = Prism.languages.extend('css', css(base));
// Prism.languages.script = Prism.languages.extend('javascript', js(base));

/* -------------------------------------------- */
/* INSERT BEFORE                                */
/* -------------------------------------------- */

const grammar = {
 pattern: /{[{%]-?[\s\S]*-?[%}]}/,
  inside: {
    'liquid-comment': {
      lookbehind: true,
      global: true,
      pattern: /(?:\{%-?\s*comment\s*-?%\}[\s\S]+\{%-?\s*endcomment\s*-?%\}|\{%-?\s*#[\s\S]+?-?%\})/
    },
    'liquid-tag': {
      lookbehind: true,
      pattern: /({%-?)\s*\b([a-z]+)\b(?=[\s-%])/i
    },
    'liquid-tagged': {
      greedy: true,
      multiline: true,
      pattern: /\n\s+\b((?:end)?[a-z]+|echo)\b/
    },
    'liquid-object': {
      lookbehind: true,
      pattern: /[a-z_$][\w$]+(?=\.\s*)/i
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

const html = (
  /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/
)

Prism.languages.html = Prism.languages.extend('markup', {
  'tag': {
    pattern: html,
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
          'tag-name': grammar,
          string: {
            greedy: true,
            pattern: /"[^"]*"|'[^']*'/,
            inside: {
              punctuation: /{[{%]-?|-?[%}]}/,
              'attr-object': {
                lookbehind: true,
                pattern: /([a-z]*?)\s*[[\]0-9_\w$]+(?=\.)/i
              },
              'attr-property': {
                lookbehind: true,
                pattern: /(\.)\s*?[[\]\w0-9_$]+(?=[.\s?])/i
              }
            }
          },
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
          }
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },
  'delimiters': grammar
});



//Prism.languages.extend('html', Prism.languages.html);
//Prism.languages.extend('liquid', liquid)

/**
 * Prism Theme
 *
 * Custom token highlights for different languages.
 * This is passed to the @11ty/eleventy-plugin-syntaxhighlight
 * plugin and brings some sanity to grammers.
 */

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

/**
 * Highlights code blocks contained within markdown files. Some contained
 * code blocks may use a language identifier separated by colon `:` character.
 * In such cases, this typically infers some higher order logic will be applied
 * in the next known code block. Typically this is found in the rules.
 *
 * @param {markdownit} md markdown-it
 * @param {string} str code input
 * @param {string} lang code language
 */
function highlighter (md, raw, language) {

  let code = '';

  if (language) {

    if(language === 'json:rules') return raw

    try {

      languages([language]);

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
 * @param {'input' | 'output'} target the name of the stimulus target
 * @param {string} raw The code input source
 */
function getEditorLines (target, raw) {

  const count = raw.trim().split("\n").length -1
  const lines = [ ...Array(count > 0 ? count : 1) ]
  const numbers = lines.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`)).join('');

  return [
    /* html */`
    <div
      data-example-target="${target}Lines"
      class="line-numbers-wrapper"
      aria-hidden="true">
      ${numbers}
    </div>
   `
  ].join('')

}

function getCodeInput (raw, language) {

  const lines = getEditorLines('input', raw)

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
          data-action="example#before"
          aria-label="Before Formatting"
          data-tooltip="top">
          Before
        </button>
      </div>
      <div class="col-auto pr-0">
        <button
          data-action="example#after"
          aria-label="After Formatting"
          data-tooltip="top">
         After
        </button>
      </div>
    </div>

    ${output}`

  ].join()

}

/**
 * Extracts code input source from `<pre></pre>` code regions.
 * When the raw input ends with a `|` character
 *
 * @param {markdownit} md markdown-it
 * @param {string} raw The character to join
 */
function getInputSource (md, raw) {

  if(raw.indexOf('</pre>') > -1) {

    const index = raw.indexOf('</pre>')

    return  {
      source: md.utils.escapeHtml(raw.slice(5, index)),
      syntax: `\n${raw.slice(0, index  + 6)}\n`
    }

  }

  return {
    source: null,
    syntax: raw
  }

}

function getRuleExample (raw, language) {

  const code = raw.slice(raw.indexOf("<code>"), raw.indexOf("</code>"));
  const [ lines, count ] = getEditorLines('output', code)

  return [
    /* html */`<pre class="hide-scroll line-numbers-mode language-${language}">`
    ,
    /* html */`<code data-example-target="output" class="language-${language}">`
    ,
    /* html */`${'\n'.repeat(count)}`
    ,
    /* html */`</code>`
    ,
    /* html */`${lines}`
    ,
    /* html */`</pre>`
  ].join('')

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

  const output = getCodeInput(raw, language)
  const rules = md.utils.escapeHtml(JSON.stringify(store))

  store = undefined

  return [
    /* html */`
    <div
      data-controller="example"
      data-example-rules-value="${rules}"
      data-example-input-value="${input.trim()}"
      data-example-output-value="${input.trim()}">
      ${output.trim()}
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
      }  else {
        tooltip = m[1]
      }


      // opening tag
      return [

        /* html */`
        <div class="rule-title d-flex ai-center">
        <div
          class="h5 mr-3"
          aria-label="${tooltip}"
          data-tooltip="top">
        ${md.utils.escapeHtml(m[1])}
        </div>
        `
      ].join('')
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
