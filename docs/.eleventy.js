const eleventy = require('@panoply/11ty');
const svgsprite = require('eleventy-plugin-svg-sprite');
const navigation = require('@11ty/eleventy-navigation');
const htmlmin = require('@sardine/eleventy-plugin-tinyhtml');
const markdownit = require('markdown-it');
const mdcontainer = require('markdown-it-container')
const anchor = require('markdown-it-anchor');
const papyrus = require('papyrus');
const merge = require('mergerino');
const yaml = require('js-yaml');
const fs = require('node:fs')
const esthetic = require('esthetic');
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
      commentNewline: false,
      commentIndent: true,
      delimiterTrims: 'preserve',
      delimiterPlacement: 'preserve',
      forceFilter: 0,
      forceArgument: 0,
      ignoreTagList: [],
      indentAttribute: false,
      lineBreakSeparator: 'before',
      normalizeSpacing: true,
      preserveComment: false,
      preserveInternal: false,
      dedentTagList: [],
      quoteConvert: 'none'
    },
    markup: {
      attributeCasing: 'preserve',
      attributeSort: false,
      commentDelimiters: 'preserve',
      commentNewline: false,
      commentIndent: true,
      delimiterTerminus: 'inline',
      forceAttribute: 3,
      forceAttributeValue: true,
      forceIndent: false,
      ignoreCSS: false,
      ignoreJS: true,
      ignoreJSON: false,
      lineBreakValue: 'preserve',
      preserveComment: false,
      preserveText: false,
      preserveAttribute: false,
      selfCloseSpace: true,
      selfCloseSVG: true,
      stripAttributeLines: false,
      quoteConvert: 'none'
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
 * @param {string} language code language
 */
function highlightCode(md, raw, language) {

  let code = '';

  if (language) {

    if (language === 'json:rules') {

      if(isRule) throw new Error('Repeated "```json:rules" block. Only 1 can exist above a code block')

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
              'data-demo-target="input"'
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
function getWrapFractionRuleExample (estheticRules, papyrusValue, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: true,
    addAttrs: {
      pre: [
        'data-demo-target="input"'
      ]
    }
  });

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
            data-demo-target="wrapFractionRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-cyan pl-1"
          data-demo-target="wrapFractionCount"
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
            data-demo-target="wrapRange"
            data-action="demo#onWrapFraction">
        </div>
        <div
          class="col-auto fs fc-salmon pl-1 pr-0"
          data-demo-target="wrapCount"
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
        data-demo-target="wrapFractionLine">
      </div>
      <div
        style="width: ${rules.esthetic.wrap}%"
        class="wrap-line"
        data-demo-target="wrapLine">
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
function getWrapRuleExample (estheticRules, papyrusValue, rawInput) {


  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: false,
    addAttrs: {
      pre: [
        'data-demo-target="input"'
      ]
    }
  });

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
          data-demo-target="range"
          data-action="demo#onForm">
        <div
          class="col-auto fs-sm ml-4 pl-1"
          data-demo-target="wrapCount"
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
        data-demo-target="wrapLine">
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
 * @param {papyrus.CreateOptions} papyrusValue
 * Papyrus editor options
 *
 * @param {string} inputValue
 * The Papyrus input codeblock generated in `highlightCode`
 *
 * @param {string} rawInput
 * The unescaped raw input of the codeblock
 *
 * @returns {string}
 */
function getRuleDemo (estheticRules, papyrusValue, inputValue, rawInput) {

  /** @type {papyrus.CreateOptions} */
  const papyrusOptions = merge(papyrusValue, {
    editor: false,
    showSpace: false,
    showTab: false,
    addAttrs: {
      pre: [
        'data-demo-target="output"'
      ]
    }
  });

  let output = ''

  try {

    const format1 = esthetic.format(rawInput, estheticRules)
    const format2 = esthetic.format(format1, estheticRules)

    output = papyrus.static(format2, papyrusOptions)

  } catch (error) {

    console.error(error)

    output = papyrus.static(rawInput, papyrusOptions)

  }


  return string([
    /* html */`

      <!-- EMPTY IN DEMO SHOWCASE -->
      <div class="col-6"></div>

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
    `
  ])

}

/**
 *
 * Generate the rule showcase type. Reads and digests `json:rules`, returning
 * the intended values and showcase demo/example.
 *
 * @param {markdownit} md
 * @param {string} inputValue
 * @param {string} language
 * @returns {{ template: string; rulesValue: string; papyrusValue: string; mode: string; }}
 */
function getRuleShowcase (md, inputValue, language) {

  /** @type {'example'|'editor'} */
  const mode = has('example') ? 'example' : 'editor'

  /** @type {esthetic.Rules} */
  const rulesValue = has('esthetic') ? merge(rules.esthetic, { language }) : merge(rules, { language });

  /** @type {papyrus.MountOptions} */
  const papyrusValue = has('papyrus') ? merge(rules.papyrus, { language }) : { language };

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

      showcase = getWrapRuleExample(estheticOptions, papyrusValue, rawInput)

    } else if(rules.example.rule === 'wrapFraction') {

      showcase = getWrapFractionRuleExample(estheticOptions, papyrusValue, rawInput)

    }

  } else {

    showcase = getRuleDemo(estheticOptions, papyrusValue, inputValue, rawInput)

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
            data-demo-target="inputTab"
            data-action="demo#onClickInputTab"
            aria-label="${tabs.input.tooltip}"
            data-tooltip="top">
            ${tabs.input.label}
          </button>
          <button
            type="button"
            class="tab pr-2"
            data-demo-target="rulesTab"
            data-action="demo#onClickRulesTab"
            aria-label="${tabs.rules.tooltip}"
            data-tooltip="top">
            ${tabs.rules.label}
          </button>
          <div
            data-controller="dropdown"
            data-dropdown-selected-value="default"
            data-dropdown-kind-value="preset"
            class="dropdown">
            <button
              type="button"
              class="tab"
              data-dropdown-target="button"
              aria-label="Select different preset"
              data-action="dropdown#toggle"
              data-demo-target="presetTab"
              data-tooltip="top">
              Preset (default)
              <span class="icon"></span>
            </button>

            <ul data-dropdown-target="collapse">
              <li
                id="default"
                data-action="click->dropdown#option click->demo#onPresetChange"
                class="selected">default</li>
              <li
                data-action="click->dropdown#option click->demo#onPresetChange"
                id="recommended">recommended</li>
              <li
                data-action="click->dropdown#option click->demo#onPresetChange"
                id="warrington">warrington</li>
              <li
                data-action="click->dropdown#option click->demo#onPresetChange"
                id="strict">strict</li>
              <li
                data-action="click->dropdown#option click->demo#onPresetChange"
                id="prettier">prettier</li>
            </ul>

          </div>
          <button
            type="button"
            class="tab is-undo ml-auto"
            data-action="demo#onClickResetButton"
            aria-label="Reset Input"
            data-tooltip="top">
          </button>
        </div>
      </div>

      <!-- SHOWCASE -->

      ${showcase}

    </div>
    `
  ]);


  return {
    template,
    mode,
    rulesValue: md.utils.escapeHtml(JSON.stringify(rulesValue)),
    papyrusValue: md.utils.escapeHtml(JSON.stringify(papyrusValue))
  }

}


/**
 * @param {markdownit} md
 */
function codeblocks(md) {

  const { fence } =  md.renderer.rules

  md.renderer.rules.fence = function(...args) {

    const [ tokens, index ] = args;
    const language = tokens[index].info.trim();
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

    const {
      template,
      mode,
      papyrusValue,
      rulesValue
    } = getRuleShowcase(md, inputValue, language)


    rules = undefined

    return string([
      /* html */`
      <div
        class="rule-example"
        data-controller="demo"
        data-demo-uuid-value="${Math.random().toString(36).slice(2)}"
        data-demo-mode-value="${mode}"
        data-demo-preset-value="default"
        data-demo-rules-value="${rulesValue}"
        data-demo-rules-original-value="${rulesValue}"
        data-demo-language-value="${language}"
        data-demo-input-value="${input.trim()}"
        data-demo-input-original-value="${input.trim()}"
        data-demo-papyrus-value="${papyrusValue}"
        spx-morph="children">
        ${template.trim()}
      </div>`

    ])

  }

}

/**
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
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
            class="h5 mr-2"
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
 * Generates HTML markup for various blocks
 *
 * @param {"note"|"tip"|"important"} type The type of alert to create.
 * @param {Array<markdownit>} tokens Array of MarkdownIt tokens to use.
 * @param {number} index The index of the current token in the tokens array.
 * @returns {string} The markup for the alert.
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

  return fs.readdirSync(join(cwd(), 'version')).map(version => {
    const v = version.replace(/\.zip/, '')
   return `<li><a href="/v/${v}/">${v.replace(/-beta/, '(beta)')}</a></li>`
  }).join('')

}

module.exports = eleventy(function (config) {


  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight: (str, lang) => highlightCode(md, str, lang)
   })
    .use(anchor)
    .use(codeblocks)
    .use(mdcontainer, 'grid', { render: (tokens, idx) => grid(md, tokens, idx) })
    .use(mdcontainer, 'note', { render: (tokens, idx) => notes(tokens, idx) })
    .use(mdcontainer, 'rule', { render: (tokens, idx) => rule(md, tokens, idx) })
    .disable("code");

  config.addLiquidShortcode('version', () => require('../package.json').version);
  config.addLiquidShortcode('versions', () => versions());

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
        transform: ['svgo'],
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
    'node_modules/esthetic/dist/esthetic.js': 'assets/esthetic.min.js'
  })


  if(process.env.ENV ==='prod') {

    config.addPlugin(htmlmin, {
      collapseBooleanAttributes: false,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeOptionalTags: false,
      sortAttributes: true,
      sortClassName: true
    });

  }

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
