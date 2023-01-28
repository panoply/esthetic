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

/**
 * Highlight Code
 *
 * @param {markdownit} md markdown-it
 * @param {string} str code
 * @param {string} lang code language
 * @returns {string} highlighted result wrapped in pre
 */
function highlighter(md, str, lang) {

  let result = "";

  if (lang) {
    try {
      languages([lang]);
      result = Prism.highlight(str, Prism.languages[lang], lang);
    } catch (err) {
      console.error(lang, err);
      result = md.utils.escapeHtml(str);
    }
  } else {
    result = md.utils.escapeHtml(str);
  }

  return `<pre class="language-${lang}"><code>${result}</code></pre>`;

};

/**
 * Line Numbers
 *
 * @param {markdownit} md
 * @license MIT License. See file header.
 */
function lineNumbers (md)  {

  const { fence } = md.renderer.rules;

  md.renderer.rules.fence = (...args) => {

    const [ tokens, idx ] = args;
    const lang = tokens[idx].info.trim();
    const raw = fence(...args);
    const code = raw.slice( raw.indexOf("<code>"), raw.indexOf("</code>"));
    const lines = code.split("\n");
    const numbers = [ ...Array(lines.length - 1) ]
    const lineNo = numbers.map((_, i) => (`<span class="line-number">${i + 1}</span><br>`)).join("");
    const lineNoWrap = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNo}</div>`;

    return raw
      .replace(/<\/pre>\n/, `${lineNoWrap}</pre>`)
      .replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
      .replace(/<code>/, `<code class="language-${lang}">`)

  };
};

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
 */
function containers(type, tokens, index) {

  if (tokens[index].nesting === 1) {
    if(type === 'note') return `<blockquote class="${type}">`.trim();
  }

  return '</blockquote>'

}


module.exports = eleventy(function (config) {

  config.addPlugin(navigation);
  config.addPlugin(highlight, {
    init: Prism,
    alwaysWrapLineHighlights: true,
    templateFormats: ["liquid"]
  });

  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => highlighter(md, str, lang)
  })

  md.use(anchor)
  md.use(lineNumbers)
  md.use(mdcontainer, 'note', { render: (tokens, idx) => containers('note', tokens, idx) })
  md.disable("code");

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



  config.addPlugin(htmlmin, {
    collapseBooleanAttributes: false,
    collapseWhitespace: true,
    decodeEntities: true,
    html5: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeOptionalTags: true,
    sortAttributes: true,
    sortClassName: true
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    pathPrefix: '',
    templateFormats: [
      'liquid',
      'json',
      'md',
      'html',
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
