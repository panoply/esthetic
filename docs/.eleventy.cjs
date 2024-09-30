const { eleventy, markdown, sprite, terser, util } = require('e11ty');
const markdownit = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const iterator = require('markdown-it-for-inline')
const papyrus = require('papyrus');
const merge = require('mergerino');
const { marked } = require('marked');
const matter = require('gray-matter');
const esthetic = require('esthetic');
const fs = require('node:fs')
const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');
const { cwd } = require('node:process');

esthetic.settings({
  persistRules: false
})


/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

/** Examples input (code) tab */
const INPUT = 'Input';

/** Examples input code rules tag */
const RULES = 'Rules';

/** The pixel width of papyrus font */
const FONT_PIXEL = 8.1

/** The default word wrap for papyrus showcase */
const WRAP = 70

/** The pixel width for papyrus code block padding  */
const PADDING = 22.95

/** Tooltips aria labels for tooltip blocks */
const TOOLTIPS = {
  '🤡': 'The choice of a clown.',
  '🙌': 'Authors choice',
  '👍': 'Good choice.',
  '👎': 'Not recommended',
  '🤌': 'Delightful. Your mother is proud of you',
  '😳': 'We live in a society, we\'re not animals',
  '💡': 'Showing an example of the rule',
  '🧐': 'You gotta do, what you gotta do',
  '🫡': 'Alright, alright alright...'
};

/* -------------------------------------------- */
/* CONFIGS                                      */
/* -------------------------------------------- */

/**
 * Æsthetic Rules
 *
 * An immutable merge of Æsthetic rules applied when producing
 * the demo side-by-side rule examples.
 *
 *
 * @param {esthetic.Rules} ruleOptions
 * @returns {esthetic.Rules}
 */
function getEstheticRules (ruleOptions) {



  return esthetic.preset('default', ruleOptions)

}

/* -------------------------------------------- */
/* STATES                                       */
/* -------------------------------------------- */

/**
 * Code Before and After Snippets
 *
 * Holds the raw input of before and after code blocks
 *
 * @type {{ rules: esthetic.Rules; before: string; after: string; }}
 */
const template = { rules: null, before: null, after: null }

/**
 * Code Block Input
 *
 * Holds an escaped string reference to the contents of code blocks. This is assigned
 * in the `highlightCode` function and is the raw code input.
 *
 * @type {string}
 */
let input;

/**
 * Æsthetic Format Rules
 *
 * Holds a reference to the formatting rules custom code block applied in markdown
 * files which uses this annotation:
 *
 * ```md
 * json:rules
 * ```
 *
 * @type {esthetic.Rules}
 */
let rules;

/**
 * Papyrus Settings
 *
 * Holds a reference to Papyrus editor options
 *
 * ```md
 * json:rules
 * ```
 *
 * @type {string}
 */
let height;

/**
 * isRule
 *
 * Holds a boolean reference indicating whether or not the embedded code region
 * is a formatting rule. Formatting rules will **ALWAYS** follow a `json:rules`
 * code block.
 *
 * ```md
 * json:rules
 * ```
 *
 * @type {boolean}
 */
let isRule;


/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

/**
 * Sugar helper for generating markup. Just a simple `.join('')`
 * utility
 *
 * @param {string[]} lines
 * @returns {string}
 */
function string (lines) {

  return lines.join('')

}

/**
 * Extracts the raw string from a `<code></code>` element.
 *
 * @param {string} raw
 * @returns {string}
 */
function getCodeBlockInput (raw) {

  const begin = raw.indexOf('>', raw.indexOf('<code') + 1) + 1
  const ender = raw.indexOf('</code')

  return raw.slice(begin, ender)

}

/**
 * An inspector for the `rules` variable which holds the parsed `json:rules`
 * code block JSON contents. The `json:rules` code block may sometimes instruct
 * upon what should be generated. This function is used to determine what the
 * object holds.
 *
 *
 * @param {'example'|'esthetic'|'papyrus'|'tabs'} prop
 * @returns {string}
 */
function has (prop) {

  if (typeof rules === 'object' && prop in rules) return true

  return false;


}


/**
 * Return Papyrus height based on the before and after code snippets
 *
 * @param {string} before
 * @param {string} after
 * @param {boolean} isNL
 */
function getPapyrusHeight (before, after, isNL = false) {

  const b = 24 + PADDING * before.split('\n').length
  const a = 24 + PADDING * after.trim().split('\n').length

  return {
    longest: b >= a ? `${b}` : `${a}`,
    after: isNL ? a + PADDING : a,
    before: b
  }

}

/**
 * Returns the current language name and assign height
 *
 * @param {string} annotation
 */
function getLanguage(annotation) {

  const index = annotation.indexOf(':');

  return index > -1 ? annotation.slice(0, index) : annotation

}

/**
 * Prints an error to the console when an issue occurs during the
 * `highlightCode` function.
 *
 * @param {string} language
 * @param {Error} error
 */
function highlightError (language, error) {

  const SEP = '\n\n------------------------------------------------------------\n\n'

  console.error(
    SEP,
    ' HIGHLIGHT ERROR\n',
    ' LANGUAGE: ' + language + '\n\n',
    error,
    SEP
  );

}


/* -------------------------------------------- */
/* MARKDOWN-IT PLUGINS                          */
/* -------------------------------------------- */


/**
 * Highlights code blocks contained within markdown files. Some contained
 * code blocks may use a language identifier separated by colon `:` character.
 * In such cases, this infers some higher order logic will be applied
 * in the next known code block.
 *
 * Typically this is found in the rules.
 *
 * @param {markdownit} md markdown-it
 * @param {string} str code input
 * @param {string} languageValue code language
 */
function highlightCode(md, raw, languageValue) {

  let code = '';

  const language = getLanguage(languageValue)

  if (language) {


    if (languageValue === 'json:rules') {

      if(isRule) {
        throw new Error('Repeated "```json:rules" block. Only 1 can exist above a code block');
      } else {
        isRule = true;
      }

      return raw;
    }

    try {

      if(isRule) {

        if (
          template.before === null &&
          template.after === null &&
          languageValue.endsWith(':before')) {


          code = raw.trim()

          template.before = code
          template.after = ''

        } else if (
          template.before !== null &&
          template.after === '' &&
          languageValue.endsWith(':after')) {

          isRule = false;
          code = raw.trim()

          template.language = language
          template.after = code



        } else {

          input = raw
          isRule = false;
          code = papyrus.static(raw, {
            language,
            addAttrs: {
              pre: [
                'spx-node="showcase.input"',
              ]
            }
          });

        }

      } else if (
        language === 'bash' ||
        language === 'cli' ||
        language === 'shell' ||
        language === 'treeview') {


        code = papyrus.highlight(raw, {
          language,
          lineNumbers: false
        })

      } else {

        code = papyrus.highlight(raw, {
          language,
          trimEnd: true,
          trimStart: true
        });

      }

      input = md.utils.escapeHtml(raw);

    } catch (error) {

      highlightError(language, error)

      code = md.utils.escapeHtml(raw);
    }

  } else {

    code = md.utils.escapeHtml(raw);
    input = md.utils.escapeHtml(raw);

  }


  return code;

};


/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Generate the rule showcase type. Reads and digests `json:rules`, returning
 * the intended values and showcase demo/example.
 *
 * @param {markdownit} md
 * @param {string} language
 * @param {string} uuid
 * @returns {{ showcase: string; rules: string; mode: string; }}
 */
function getRuleShowcase (md, language, uuid) {

  /** @type {'example'|'editor'} */
  const mode = has('example') ? 'example' : 'editor'

  /** @type {esthetic.Rules} */
  const rulesValue = has('esthetic') ? rules.esthetic : Object.assign({}, template.rules, { language });

  if(!('wrap' in template.rules)) rulesValue.wrap = WRAP

  /** Default wrap for line reference */
  const wrap = FONT_PIXEL * (rulesValue.wrap || WRAP);

  /** @type {string} */
  const rawInput = md.utils.unescapeAll(input);

   /** @type {{ [name: string]: {label: string; tooltip: string; }}} */
  const tabs = has('tabs') ? rules.tabs : {
    input: {
      label: 'Input',
      tooltip: 'Before Formatting'
    },
    rules: {
      label: 'Rules',
      tooltip: 'Rule Definitions'
    }
  }

  /* SHOWCASE ----------------------------------- */

  /** @type {string} */
  let output = ''


  if(has('example')) {
    if(rules.example.rule === 'wrap') {
      output = getWrapRuleExample(rulesValue, rawInput)
    } else if(rules.example.rule === 'wrapFraction') {
      output = getWrapFractionRuleExample(rulesValue, rawInput)
    }
  } else {

    if(template.before !== null && template.after !== null) {

      const height = getPapyrusHeight(template.before, template.after, rulesValue.endNewline)

      const unformatted = papyrus.static(template.before, {
        language,
        id: `input:${uuid}`,
        useTabs: rulesValue.indentChar !== '\t',
        copyButton: false,
        addAttrs: {
          pre: [
            'spx-node="showcase.input"',
          ]
        }
      });

      const after = rulesValue.endNewline
        ? template.after + '\n'
        : rulesValue.indentChar === '\t'
          ? esthetic.format(template.after, rulesValue)
          : template.after

      const formatted = papyrus.static(after, {
        language,
        id: `output:${uuid}`,
        trimEnd: rulesValue.endNewline === false,
        readOnly: true,
        copyButton: true,
        addAttrs: {
          pre: [
            'spx-node="showcase.output"',
          ]
        }
      });

      output = string([
        /* html */`
        <div class="row gx-0">
          <div class="col-12 col-lg-6">
            <div class="showcase-before">
              ${unformatted}
            </div>
          </div>
          <div class="col-12 col-lg-6 rel">
            <div class="showcase-after">
            <div
              class="wrap-line"
              spx-node="showcase.wrapLine"
              style="width: ${wrap}px; display: none;"></div>
              ${formatted}
            </div>
          </div>
        </div>
        `
      ])

    }

  }

  /**
   * The rule showcase template
   */
  const showcase = string([
    /* html */`
    <div class="row gx-0">
      <div class="col-12 col-lg-6">
        <div class="showcase-tabs">
          <button
            type="button"
            class="tab is-active"
            spx-node="showcase.inputTab"
            spx@click="showcase.onClickInputTab"
            aria-label="${tabs.input.tooltip}"
            data-tooltip="top">
            ${tabs.input.label}
          </button>
          <button
            type="button"
            class="tab pr-2"
            spx-node="showcase.rulesTab"
            spx@click="showcase.onClickRulesTab"
            aria-label="${tabs.rules.tooltip}"
            data-tooltip="top">
            ${tabs.rules.label}
          </button>
          <div
            spx-component="dropdown"
            spx-dropdown:selected="default"
            spx-dropdown:kind="preset"
            class="dropdown">
            <button
              type="button"
              class="tab"
              aria-label="Select different preset"
              spx@click="dropdown.toggle"
              spx-node="dropdown.button"
              data-tooltip="top">
              <span spx-bind="showcase.preset"> Preset (default)</span>
              <span class="icon"></span>
            </button>

            <ul spx-node="dropdown.collapse">
              <li
                id="default"
                spx@click="dropdown.option showcase.onPresetChange"
                class="selected">default</li>
              <li
                spx@click="dropdown.option showcase.onPresetChange"
                id="recommended">recommended</li>
              <li
                spx@click="dropdown.option showcase.onPresetChange"
                id="warrington">warrington</li>
              <li
                spx@click="dropdown.option showcase.onPresetChange"
                id="strict">strict</li>
              <li
                spx@click="dropdown.option showcase.onPresetChange"
                id="prettier">prettier</li>
            </ul>
          </div>
          <button
            type="button"
            class="tab is-undo ml-auto"
            spx@click="showcase.onClickResetButton"
            aria-label="Reset Input"
            data-tooltip="top">
          </button>
        </div>
      </div>
      <div class="col-12 col-lg-2 rel wrap-offset">
        <div
          class="wrap-number pl-3 py-2 fc-gray ff-code fs-sm"
          spx-node="showcase.wrapCount">
          ${rulesValue.wrap || WRAP}
        </div>
        <input
          type="range"
          class="fm-range"
          min="0"
          data-tooltip="right"
          aria-label="Word Wrap"
          step="1"
          spx@input="showcase.onWrap">
      </div>
    </div>
    <!-- SHOWCASE -->
    ${output}
    `
  ]);


  return {
    mode,
    showcase,
    rules: md.utils.escapeHtml(JSON.stringify(rulesValue))
  }

}


/**
 * @param {markdownit} md
 */
function codeblocks(md) {

  const { fence } = md.renderer.rules

  md.renderer.rules.fence = function(...args) {

    const [ tokens, index ] = args;
    const languageValue = tokens[index].info.trim()
    const language = getLanguage(languageValue);
    const inputValue = fence(...args);

    if (languageValue === 'json:rules') {

      const json = getCodeBlockInput(inputValue)

      try {
        template.rules = JSON.parse(json.trim());
        return ''
      } catch (e) {
        throw new Error('Invalid JSON in in the json:rules code block\n\n' + json)
      }

    } else if (
      language === 'bash' ||
      language === 'cli' ||
      language === 'shell' ||
      language === 'treeview') {

      return inputValue

    }

    if (template.rules === null) {

      return inputValue

    } else if (languageValue.endsWith(':before')) {

      return ''

    }

    const uuid = Math.random().toString(36).slice(2)
    const { rules, mode, showcase } = getRuleShowcase(md, language, uuid)

    template.rules = null
    template.before = null
    template.after = null

    return string([
      /* html */`
      <!-- END DESRCIPTION -->
      </section>

      <!-- RULE SHOWCASE COMPONENT -->
      <div
        class="rule-showcase"
        spx-component="showcase"
        spx-showcase:uuid="${uuid}"
        spx-showcase:mode="${mode}"
        spx-showcase:preset="default"
        spx-showcase:rules="${rules}"
        spx-showcase:rules-original="${rules}"
        spx-showcase:language="${language}"
        spx-showcase:input="${input.trim()}"
        spx-showcase:input-original="${input.trim()}"
        spx@window:mousedown="showcase.onWrapMove">
        ${showcase}
      </div>`

    ])

  }

}


/**
 * Renders a `<blockquote>` semantic HTML tag
 *
 * @param {markdownit.Token[]} tokens
 * Array of tokens to use.
 *
 * @param {number} index
 * The index of the current token in the tokens array.
 */
function notes(tokens, index) {

  return tokens[index].nesting === 1 ? `<blockquote class="note">` : '</blockquote>'

}

function rule(md, tokens, idx) {

  if (tokens[idx].nesting === 1) {

    var m = tokens[idx].info.trim().match(/^rule\s+(.*)$/);

    if (tokens[idx].nesting === 1) {

      if (m !== null && m[1] in TOOLTIPS) {


        // opening tag
        return [

          /* html */`
          <div class="rule-title d-flex ai-center">
          <div
            class="h4"
            aria-label="${TOOLTIPS[m[1]]}"
            data-tooltip="top">
            ${md.utils.escapeHtml(m[1])}
          </div>
          `
        ].join('')

      } else {

        // opening tag

        return [
          /* html */`
            <div class="rule-title d-flex ai-center">
          `
        ].join('')

      }
    }
  }

  return [
    /* html */`
    </div>
    <section class="col-12 col-md-9">
  `].join('')

}

/**
 * Renders a grid from markdown container expressions.
 *
 * @param {markdownit} md
 * Markdown Instance
 *
 * @param {markdownit.Token[]} tokens
 * Markdown tokens
 *
 * @param {number} idx
 * An index number reference
 */
function grid(md, tokens, idx) {

 if (tokens[idx].nesting === 1) {

  const col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

  if (col !== null) {

    // opening tag
    return [

      /* html */`
      <div class="${col[1]}">
      `
    ].join('')
  }


 }

  return '</div>'

}



/**
 * Generate JSON file to be used in search autocompletions
 *
 * @param {EleventyConfig}
 * The eleventy configuration instance
 */
function search (config) {

  const page = [];

  config.on('eleventy.after', async () => {
    if (page.length > 0) {
      const content = JSON.stringify(page, null, 2);
      await writeFile('./public/assets/esthetic.json', content);
    }
  });

  return async function (content) {

    let data;
    let heading;
    let anchor;

    const records = new Map();
    const read = await readFile(this.page.inputPath);
    const parse = marked.lexer(read.toString());

    const frontmatter = parse[0].type === 'hr'
      ? parse.splice(0, 2).map(({ raw }) => raw).join('\n')
      : null;

    if (frontmatter !== null) {

      data = matter(frontmatter).data;

    }

    parse.forEach(token => {

      if (token.text && token.text.length > 0) {

        if (token.type === 'heading') {

          if (token.text.toLowerCase().includes('acknowledgements')) return;

          heading = token.text.replace(/[`_*]/g, '');
          anchor = util.slug(heading);

          if (!records.has(heading)) records.set(heading, { anchor, content: '' });

        } else if (token.type === 'paragraph') {

          if (!/^({{|{%|<[a-z]|:::)/.test(token.text) && heading) {
            records.get(heading).content = token.text
              .replace(/[`_*]/g, '')
              .replace(/\[([a-z].*?)\]\(.*?\)/g, '$1');
          }

        }
      }

    });

    for (const [ heading, { anchor, content } ] of records) {
      page.push({
        title: data.title,
        heading,
        content,
        url: heading ? `${this.page.url.slice(0, -1)}#${anchor}` : this.page.url
      });
    }

  };

}


/**
 * Used for the navbar current url `active` class.
 *
 * @param {string} value
 * The current link.url passed
 *
 * @param {import('./src/data/navigation.json')} navigation
 * The navigation data cascade file
 */
function active (value, navigation) {

  if (value.startsWith('/rules/') && this.page.url.startsWith(value)) {

    return 'active'

  } else if (value.startsWith('/introduction/')) {

    if (navigation.docs.some(({ links }) => links.some(({ url }) => url === this.page.url ))) {

      return 'active'

    }

  } else if(value.startsWith('/playground/') && this.page.url.startsWith(value)) {

    return 'active'

  }

  return ''

}

/**
 * Returns the current navigation reference
 *
 * @param {import('./src/data/navigation.json')} value
 * The navigation data cascade file
 */
function navigate (value) {


  if (this.page.url.startsWith('/rules/')) {

    return value.rules

  } else if (value.docs.some(({ links }) => links.some(({ url }) => url === this.page.url ))) {

    return value.docs

  }

  return value

}


/**
 * Renders inline code blocks
 *
 * @param {markdownit} md
 * Markdown Instance
 *
 * @param {markdownit.Token[]} tokens
 * Markdown tokens
 *
 * @param {number} idx
 * An index number reference
 */
function codeinline (md) {

  const regexp = /^{\w+} /

  /**
   * Renders inline code blocks
   *
   * @param {markdownit} md
   * Markdown Instance
   *
   * @param {markdownit.Token[]} tokens
   * Markdown tokens
   *
   * @param {number} idx
   * An index number reference
   */
  function render (token) {


      // console.log('=====================================================')
      const pull = token.indexOf('} ')
      const raw = token.slice(pull + 1).trimStart()
      const language = token.slice(1, pull)

      // console.log(raw)
      // console.log('=====================================================')


      return papyrus.inline(raw, { language  })

  }

  function scan (state) {

    for (let x = state.tokens.length - 1; x >= 0; x--) {
      if (state.tokens[x].type !== 'inline') continue
      const token = state.tokens[x].children
      for (let i = token.length - 1; i >= 0; i--) {
        if (token[i].type !== 'code_inline') continue;
        if(!/^{\w+} /.test(token[i].content)) continue
        token[i].tag = ''
        token[i].type = 'html_block',
        token[i].markup = ''
        token[i].block = true,
        token[i].content = render(token[i].content);
      }
    }
  }


  md.core.ruler.push('inline_papyrus', scan)

}



module.exports = eleventy(function (eleventyConfig) {


  const md = markdownit({
    highlight: (str, lang) => highlightCode(md, str, lang),
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
  })
  .use(anchor)
  .use(codeblocks)
  .use(codeinline)
  .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(md, tokens, idx) })
  .use(mdcontainer, 'note', { render: (tokens, idx) => notes(tokens, idx) })
  .use(mdcontainer, 'rule', { render: (tokens, idx) => rule(md, tokens, idx) })
  .disable("code");


  md.use(anchor, {
    slugify: util.slug,
    callback: ({ attrs }) => attrs.push([ 'spx-node', 'anchor.anchor' ])
  })


  eleventyConfig.addFilter('active', active);
  eleventyConfig.addFilter('navigate', navigate);
  eleventyConfig.addFilter('anchor', (value) => `#${encodeURI(util.slug(value))}`);
  eleventyConfig.addLiquidShortcode('search', search(eleventyConfig));
  eleventyConfig.addLiquidShortcode('version', () => require('../package.json').version);
  eleventyConfig.addLiquidShortcode('versions', () => versions());
  eleventyConfig.setLibrary('md', md);
  eleventyConfig.addPlugin(sprite, { inputPath: './src/assets/svg', spriteShortCode: 'sprite' });
  eleventyConfig.addPlugin(terser);

  eleventyConfig.addPassthroughCopy({
    'src/assets/img/*': 'assets',
    'src/assets/font/*': 'assets/font',
    'node_modules/moloko/dist': 'assets/moloko',
    'node_modules/esthetic/dist/esthetic.js': 'assets/esthetic.min.js'
  })

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
    },
  };

});
