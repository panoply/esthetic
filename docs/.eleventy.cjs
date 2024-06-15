const { eleventy, markdown, sprite, terser, util } = require('e11ty');
const markdownit = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const papyrus = require('papyrus');
const merge = require('mergerino');
const { marked } = require('marked');
const matter = require('gray-matter');
const esthetic = require('esthetic');
const fs = require('node:fs')
const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');
const { cwd } = require('node:process');


/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

/** Examples input (code) tab */
const INPUT = 'Input';

/** Examples input code rules tag */
const RULES = 'Rules';

/** Tooltips aria labels for tooltip blocks */
const TOOLTIPS = {
  '🤡': 'The choice of a clown.',
  '🙌': 'Authors choice',
  '👍': 'Good choice.',
  '👎': 'Not recommended',
  '🤌': 'Delightful. Your mother is proud of you',
  '😳': 'We live in a society, we\'re not animals',
  '💡': 'Showing an example of the rule',
  '🧐': 'You gotta do, what you gotta do'
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

  return merge({
    crlf: false,
    correct: false,
    preset: 'default',
    language: 'auto',
    endNewline: false,
    indentChar: ' ',
    indentLevel: 0,
    indentSize: 2,
    preserveLine: 2,
    wrap: 0,
    wrapFraction: 0,
    liquid: {
      allowPlebSyntactic: true,
      allowRubeSyntactic: true,
      argumentLineBreak: 0,
      commentIndent: true,
      commentPreserve: false,
      delimiterTrims: 'preserve',
      delimiterPlacement: 'preserve',
      equipoiseSpacing: true,
      filterLineBreak: 0,
      forceIndent: false,
      indentAttribute: false,
      lineBreakSeparator: 'before',
      paddedTagList: [],
      dedentTagList: [],
      ignoreTagList: [],
      quoteConvert: 'none'
    },
    markup: {
      attributeCasing: 'preserve',
      attributeSort: false,
      attributeLineBreak: 3,
      attributePreserve: false,
      classListSort: false,
      classListUnique: false,
      commentDelimiter: 'preserve',
      commentIndent: true,
      commentPreserve: false,
      delimiterTerminus: 'inline',
      forceIndent: false,
      forceInline: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      inlineTagList: [],
      preserveText: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripTextWrapLines: false,
      stripAttributeLines: false,
      quoteConvert: 'none',
      valueLineBreak: 'preserve',
      valueSpacing: 'preserve'
    },
    json: {
      arrayFormat: 'default',
      braceAllman: false,
      bracePadding: false,
      objectIndent: 'default',
      objectSort: false,
      braceStyle: 'none',
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      correct: false,
      elseNewline: false,
      functionNameSpace: false,
      functionSpace: false,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      preserveComment: false,
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',
      quoteConvert: 'double',
      endComma: 'never',
      noSemicolon: true,
      vertical: false
    },
    style: {
      commentIndent: false,
      commentNewline: false,
      atRuleSpace: true,
      classPadding: false,
      noLeadZero: false,
      preserveComment: false,
      sortSelectors: false,
      sortProperties: false,
      quoteConvert: 'none'
    },
    script: {
      arrayFormat: 'default',
      braceNewline: false,
      bracePadding: false,
      braceStyle: 'none',
      braceAllman: false,
      caseSpace: false,
      commentIndent: false,
      commentNewline: false,
      elseNewline: false,
      endComma: 'never',
      functionNameSpace: false,
      functionSpace: false,
      inlineReturn: true,
      methodChain: 4,
      neverFlatten: false,
      noCaseIndent: false,
      noSemicolon: false,
      objectSort: false,
      objectIndent: 'default',
      preserveComment: false,
      quoteConvert: 'none',
      styleGuide: 'none',
      ternaryLine: false,
      variableList: 'none',
      vertical: false
    }
  }, ruleOptions);

}

/* -------------------------------------------- */
/* STATES                                       */
/* -------------------------------------------- */

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

/* -------------------------------------------- */
/* MARKDOWN-IT PLUGINS                          */
/* -------------------------------------------- */


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


    if (language === 'json:rules') {

      if(isRule) {
        throw new Error('Repeated "```json:rules" block. Only 1 can exist above a code block')
      }

      isRule = true;

      return raw;
    }

    try {

      if(isRule) {

        isRule = false;

        code = papyrus.static(raw, {
          language,
          editor: true,
          showSpace: false,
          addAttrs: {
            pre: [
              'spx-node="showcase.input"',
            ]
          }
        });

      } else if (language === 'bash' || language === 'cli' || language === 'shell') {


        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          showTab: false,
          showCR: false,
          showLF: false,
          showCRLF: false,
          lineNumbers: false
        })

      } else {

        code = papyrus.static(raw, {
          language,
          editor: false,
          showSpace: false,
          showTab: false,
          showCR: false,
          showLF: false,
          showCRLF: false,
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
 * Generates the `wrapFraction` rules example showcase
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getWrapFractionRuleExample (estheticRules, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions =  {
    editor: false,
    language: estheticRules.language,
    showSpace: true,
    addAttrs: {
      pre: [
        'spx-node="showcase.input"'
      ]
    }
  };

  let output = ''

  try {

    const format = esthetic.format(rawInput, estheticRules)

    output = papyrus.static(format, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`
    <div class="col-6">
      <div class="row jc-center ai-center px-2">
        <div class="col-5">
          <legend
            class="fs-xs mb-0"
            aria-label="Adjustments are disabled as we showcasing the default behaviour"
            data-tooltip="top">Wrap Fraction</legend>
          <input
            type="range"
            class="fm-range wrap-fraction"
            name="wrapFraction"
            min="0"
            max="100"
            step="1"
            value="80"
            disabled
            spx-node="showcase.wrapFractionRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-cyan pl-1"
          spx-node="showcase.wrapFractionCount"
          aria-label="wrapFraction"
          data-tooltip="top">
          80
        </div>
        <div class="col-5">
          <legend class="fs-xs mb-0">Wrap</legend>
          <input
            type="range"
            class="fm-range"
            name="wrap"
            min="0"
            max="100"
            step="1"
            value="100"
            spx-node="showcase.wrapRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-salmon pl-1 pr-0"
          spx-node="showcase.wrapCount"
          aria-label="wrap"
          data-tooltip="top">
          100
        </div>
      </div>
    </div>
    <div class="col-12 rel">
      <div
        style="width: 80%"
        class="wrap-fraction-line"
        spx-node="showcase.wrapFractionLine">
      </div>
      <div
        style="width: ${rules.esthetic.wrap}%"
        class="wrap-line"
        spx-node="showcase.wrapLine">
      </div>
      <div class="demo-input">
        ${output}
      </div>
    </div>
    `
  ])

}


/**
 * Generates the `wrap` rules example showcase
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getWrapRuleExample (estheticRules, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = {
    language: estheticRules.language,
    editor: false,
    showSpace: false,
    addAttrs: {
      pre: [
        'spx-node="showcase.input"'
      ]
    }
  };

  let output = ''

  try {

    const format = esthetic.format(rawInput, estheticRules)

    output = papyrus.static(format, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`
    <div class="col-6">
      <div class="row jc-center ai-center px-4 pt-1">
        <input
          type="range"
          class="col fm-range"
          name="${rules.example.rule}"
          min="${rules.example.min}"
          max="${rules.example.max}"
          step="${rules.example.step}"
          value="${rules.example.value}"
          spx-node="showcase.range"
          data-action="demo#onForm">
        <div
          class="col-auto fs-sm ml-4 pl-1"
          spx-node="showcase.wrapCount"
          aria-label="The wrap rule value"
          data-tooltip="top">
          ${rules.example.value}
        </div>
      </div>
    </div>
    <div class="col-12 rel">
      <div
        style="width: ${rules.example.value}%"
        class="wrap-line"
        spx-node="showcase.wrapLine">
      </div>
      <div class="demo-input">
        ${output}
      </div>
    </div>
    `
  ])

}

/**
 * Builds side-by-side comparisons for rules based on the Markdown structure
 *
 * @param {esthetic.Rules} estheticRules
 * Esthetic formatting rules
 *
 * @param {papyrus.StaticOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} inputValue
 * The Papyrus input codeblock generated in `highlightCode`
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @param {string} demoHeight
 * An optional height to apply to papayrus code block
 *
 * @returns {string}
 */
function getRuleDemo (estheticRules, inputValue, rawInput) {


  let output = ''

  try {

    const format = esthetic.format(rawInput, estheticRules)

    output = papyrus.static(format, {
      language: estheticRules.language,
      trimEnd: estheticRules.endNewline !== false,
      addAttrs: {
        pre: [
          'spx-node="showcase.output"',
        ]
      }
    })

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, {
      language: estheticRules.language,
      addAttrs: {
        pre: [
          'spx-node="showcase.output"',
        ]
      }
    })

  }


  return string([
    /* html */`
      <div class="row gx-0">
        <div class="col-12 col-lg-6">
          <div class="demo-input">
            ${inputValue}
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="demo-output">
            ${output}
          </div>
        </div>
      </div>
    `
  ])

}

/**
 * Generate the rule showcase type. Reads and digests `json:rules`, returning
 * the intended values and showcase demo/example.
 *
 * @param {markdownit} md
 * @param {string} inputValue
 * @param {string} language
 * @param {string|null} demoHeight
 * @returns {{ template: string; rulesValue: string; papyrusValue: string; mode: string; }}
 */
function getRuleShowcase (md, inputValue, language) {

  /** @type {'example'|'editor'} */
  const mode = has('example') ? 'example' : 'editor'

  /** @type {esthetic.Rules} */
  const rulesValue = has('esthetic') ? rules.esthetic : merge(rules, { language });

  /** @type {string} */
  const rawInput = md.utils.unescapeAll(input);

  /** @type {esthetic.Rules} */
  const estheticOptions = getEstheticRules(rulesValue);

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
  let showcase = ''


  if(has('example')) {

    if(rules.example.rule === 'wrap') {

      showcase = getWrapRuleExample(estheticOptions, rawInput)

    } else if(rules.example.rule === 'wrapFraction') {

      showcase = getWrapFractionRuleExample(estheticOptions, rawInput)

    }

  } else {

    showcase = getRuleDemo(estheticOptions, inputValue, rawInput)

  }

  /**
   * The rule showcase template
   */
  const template = string([
    /* html */`
    <div class="row gx-0">
      <div class="col-6">
        <div class="demo-tabs">
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
    </div>
    <!-- SHOWCASE -->

    ${showcase}
    `
  ]);


  return {
    template,
    mode,
    rulesValue: md.utils.escapeHtml(JSON.stringify(rulesValue))
  }

}

/**
 * Returns the current language name and assign height
 *
 * @param {string} annotation
 */
function getLanguage(annotation) {

  const heightIndex = annotation.indexOf('@');

  let language;

  if(heightIndex > -1) {
    language = annotation.slice(0, heightIndex);
    height = annotation.slice(heightIndex + 1) + 'px'

  } else {
    language = annotation
  }

  return language;

}


/**
 * @param {markdownit} md
 */
function codeblocks(md) {

  const { fence } =  md.renderer.rules

  md.renderer.rules.fence = function(...args) {

    const [ tokens, index ] = args;
    const language = getLanguage(tokens[index].info.trim());
    const inputValue = fence(...args);

    if (language === 'json:rules') {

      const json = getCodeBlockInput(inputValue)

      try {

        rules = JSON.parse(json.trim());

        return ''

      } catch (e) {


        throw new Error(
          'Invalid JSON in in the json:rules code block\n\n' + json
        )

      }

    } else if (language === 'bash' || language === 'cli' || language === 'shell') {

      return inputValue

    }

    if (rules === undefined) return inputValue

    const { template, mode, papyrusValue, rulesValue} = getRuleShowcase(md, inputValue, language)


    rules = undefined

    return string([
      /* html */`
      <div
        class="rule-example"
        spx-component="showcase"
        spx-showcase:uuid="${Math.random().toString(36).slice(2)}"
        spx-showcase:mode="${mode}"
        spx-showcase:preset="default"
        spx-showcase:rules="${rulesValue}"
        spx-showcase:rules-original="${rulesValue}"
        spx-showcase:language="${language}"
        spx-showcase:input="${input.trim()}"
        spx-showcase:input-original="${input.trim()}">
        ${template.trim()}
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

  return '</div>'

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

 if(tokens[idx].nesting === 1) {

  var col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

  if (col !== null) {

    // opening tag
    return [

      /* html */`
      <div class="${md.utils.escapeHtml(col[1])}">
      `
    ].join('')
  }


 }

  return '</div>'

}

function versions ()  {

  return fs.readdirSync(join(cwd(), 'version'))
  .filter(v => v !== '.DS_Store')
  .map(version => {
   const v = version.replace(/\.zip/, '')
   return `<li><a href="/v/${v}/">${v.replace(/-beta/, ' (beta)')}</a></li>`
  }).join('')

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
  .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(md, tokens, idx) })
  .use(mdcontainer, 'note', { render: (tokens, idx) => notes(tokens, idx) })
  .use(mdcontainer, 'rule', { render: (tokens, idx) => rule(md, tokens, idx) })
  .disable("code");

  md.use(anchor, {
    slugify: util.slug,
    callback: ({ attrs }) => attrs.push([ 'spx-node', 'scrollspy.anchor' ])
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
