const fs = require('node:fs');
const { readFile, writeFile } = require('node:fs/promises');
const { join } = require('node:path');
const { cwd } = require('node:process');

const { defineConfig, markdown, search, sprite, terser, util } = require('e11ty');
const esthetic = require('esthetic');
const matter = require('gray-matter');
const jsonParse = require('json-parse-better-errors');
// const markdownit = require('markdown-it');
const anchor = require('markdown-it-anchor');
const mdcontainer = require('markdown-it-container');
const iterator = require('markdown-it-for-inline');
const { marked } = require('marked');
const merge = require('mergerino');
const papyrus = require('papyrus');

esthetic.settings({
  persistRules: false
});

/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

/** Examples input (code) tab */
const INPUT = 'Input';

/** Examples input code rules tag */
const RULES = 'Rules';

/** The pixel width of papyrus font */
const FONT_PIXEL = 8.1;

/** The default word wrap for papyrus showcase */
const WRAP = 70;

/** The pixel width for papyrus code block padding  */
const PADDING = 22.95;

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

  return esthetic.preset('default', ruleOptions);

}

/* -------------------------------------------- */
/* STATES                                       */
/* ---/**
 * Code Before and After Snippets
 *
 * Holds the raw input of before and after code blocks
 *
 * @type {import('./.eleventy.d.ts').RulesTemplate}
 */
const template = {
  block: null,
  rules: null,
  rulesEsc: null,
  language: null,
  raw: null,
  before: null,
  after: null
};

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

  return lines.join('');

}

/**
 * Extracts the raw string from a `<code></code>` element.
 *
 * @param {string} raw
 * @returns {string}
 */
function getCodeBlockInput (raw) {

  const begin = raw.indexOf('>', raw.indexOf('<code') + 1) + 1;
  const ender = raw.indexOf('</code');

  return raw.slice(begin, ender);

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

  if (typeof rules === 'object' && prop in rules) return true;

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

  const b = 24 + PADDING * before.split('\n').length;
  const a = 24 + PADDING * after.trim().split('\n').length;

  return {
    longest: b >= a ? `${b}` : `${a}`,
    after: isNL ? a + PADDING : a,
    before: b
  };

}

/**
 * Returns the current language name and assign height
 *
 * @param {string} annotation
 */
function getLanguage (annotation) {

  const index = annotation.indexOf(':');

  return index > -1 ? annotation.slice(0, index) : annotation;

}

const getCodeblock = (language) => {

  const index = language.indexOf(':');

  return index > -1 ? {
    language: language.slice(0, index),
    action: language.slice(index + 1)
  } : {
    language,
    action: null
  };

};

/**
 * Prints an error to the console when an issue occurs during the
 * `highlightCode` function.
 *
 * @param {string} language
 * @param {Error} error
 */
function highlightError (language, error) {

  const SEP = '\n\n------------------------------------------------------------\n\n';

  console.error(
    SEP,
    ' HIGHLIGHT ERROR\n',
    ' LANGUAGE: ' + language + '\n\n',
    error,
    SEP
  );

}

function parseJSON (input) {

  try {
    return jsonParse(input);
  } catch (error) {
    throw new Error(error);
  }

}

/* -------------------------------------------- */
/* MARKDOWN-IT PLUGINS                          */
/* -------------------------------------------- */

let noLines = false;

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
function rulesStructure (raw, language, escape) {

  if (language) {

    if (language.endsWith(':rules')) {

      template.rules = parseJSON(raw);

      console.log(raw);

      if (template.rules && template.rules.esthetic) return '';

      isRule = true;
      template.rulesEsc = escape;
      template.language = null;
      template.before = null;
      template.after = null;
      return '';
    } else if (language.endsWith(':no-lines')) {

      noLines = true;
    }

    if (isRule && language.endsWith(':before')) {

      template.raw = escape;
      template.before = raw;
      template.language = getLanguage(language);

      return '';

    } else if (isRule && language.endsWith(':after')) {

      template.after = raw;

      isRule = false;
      const markup = getRuleShowcase();

      return markup;

    }

    return '';

  }

  return '';

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
function getRuleShowcase () {

  /** Default wrap for line reference */
  const wrap = FONT_PIXEL * WRAP;
  const uuid = Math.random().toString(36).slice(2);
  const rules = getEstheticRules(template.rules);
  const tabs = {
    input: {
      label: 'Input',
      tooltip: 'Before Formatting'
    },
    rules: {
      label: 'Rules',
      tooltip: 'Rule Definitions'
    }
  };

  const unformatted = papyrus.static(template.before, {
    language: template.language,
    id: `input:${uuid}`,
    useTabs: rules.indentChar !== '\t',
    wordWrap: true,
    bracketPairs: false,
    searchWidget: false,
    matchTags: false,
    matchSelected: false,
    copyButton: false,
    indentGuides: false,
    addAttrs: {
      pre: [
        'spx-node="showcase.input"'
      ]
    }
  });

  const formatted = papyrus.static(template.after, {
    language: template.language,
    id: `output:${uuid}`,
    useTabs: template.rules.indentChar !== '\t',
    readOnly: true,
    copyButton: true,
    bracketPairs: false,
    searchWidget: false,
    matchTags: false,
    matchSelected: false,
    indentGuides: true,
    addAttrs: {
      pre: [
        'spx-node="showcase.output"'
      ]
    }
  });

  /**
   * The rule showcase template
   */
  return string([
    /* html */`
    <div
      class="rule-showcase"
      spx-component="showcase"
      spx-showcase:uuid="${uuid}"
      spx-showcase:mode="editor"
      spx-showcase:rules="${template.rulesEsc}"
      spx-showcase:language="${template.language}"
      spx-showcase:input="${template.raw}">
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
            <button
              type="button"
              class="tab is-undo ml-auto"
              spx@click="showcase.onClickResetButton"
              aria-label="Reset Input"
              data-tooltip="top">
            </button>
            <button
              type="button"
              class="tab is-format"
              spx@click="showcase.onClickFormat"
              aria-label="Format Code"
              data-tooltip="top">
            </button>
          </div>
        </div>
      </div>
      <div class="row gx-0">
        <div class="col-12 col-lg-6">
          <div class="showcase-before">${unformatted}</div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="showcase-after">${formatted}</div>
        </div>
      </div>
    </div>
    `
  ]);

}

/**
 * @param {markdownit} md
 */
function codeblocks (md) {

  const { fence } = md.renderer.rules;

  md.renderer.rules.fence = function (...args) {

    const [ tokens, index ] = args;
    const languageValue = tokens[index].info.trim();
    const language = getLanguage(languageValue);
    const inputValue = fence(...args);

    if (languageValue === 'json:rules') {

      const json = getCodeBlockInput(inputValue);

      try {
        template.rules = JSON.parse(json.trim());
        return '';
      } catch (e) {
        throw new Error('Invalid JSON in in the json:rules code block\n\n' + json);
      }

    } else if (
      language === 'bash' ||
      language === 'cli' ||
      language === 'shell' ||
      language === 'treeview') {

      return inputValue;

    }

    if (template.rules === null) {

      return inputValue;

    } else if (languageValue.endsWith(':before')) {

      return '';

    }

    const uuid = Math.random().toString(36).slice(2);
    const { rules, mode, showcase } = getRuleShowcase(md, language, uuid);
    const wrap = template.rules.wrap || WRAP;

    template.rules = null;
    template.before = null;
    template.after = null;

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
        spx-showcase:wrap="${wrap}"
        spx-showcase:rules="${rules}"
        spx-showcase:rules-original="${rules}"
        spx-showcase:language="${language}"
        spx-showcase:input="${input.trim()}"
        spx-showcase:input-original="${input.trim()}">
        ${showcase}
      </div>`

    ]);

  };

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
function notes (tokens, index) {

  return tokens[index].nesting === 1 ? '<blockquote class="note">' : '</blockquote>';

}

function rule (md, tokens, idx) {

  if (tokens[idx].nesting === 1) {

    const m = tokens[idx].info.trim().match(/^rule\s+(.*)$/);

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
        ].join('');

      } else {

        // opening tag

        return [
          /* html */`
            <div class="rule-title d-flex ai-center">
          `
        ].join('');

      }
    }
  }

  return [
    /* html */`
    </div>
    <section class="col-12 col-md-9">
  `
  ].join('');

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
function grid (md, tokens, idx) {

  if (tokens[idx].nesting === 1) {

    const col = tokens[idx].info.trim().match(/^grid\s+(.*)$/);

    if (col !== null) {

      // opening tag
      return [

        /* html */`
      <div class="${col[1]}">
      `
      ].join('');
    }

  }

  return '</div>';

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

    return 'active';

  } else if (value.startsWith('/introduction/')) {

    if (navigation.docs.some(({ links }) => links.some(({ url }) => url === this.page.url))) {

      return 'active';

    }

  } else if (value.startsWith('/playground/') && this.page.url.startsWith(value)) {

    return 'active';

  }

  return '';

}

/**
 * Returns the current navigation reference
 *
 * @param {import('./src/data/navigation.json')} value
 * The navigation data cascade file
 */
function navigate (value) {

  if (this.page.url.startsWith('/rules/')) {

    return value.rules;

  } else if (value.docs.some(({ links }) => links.some(({ url }) => url === this.page.url))) {

    return value.docs;

  }

  return value;

}

module.exports = defineConfig(function (config) {

  const md = markdown(config, {
    highlight: {
      inline: ({ raw, language }) => papyrus.inline(raw, { language }),
      fence: ({ language, raw, escape }) => language.endsWith('no-lines')
        ? papyrus.highlight(raw, {
          language: language.slice(0, language.indexOf(':')),
          lineNumbers: false,
          preClass: [ 'px-4' ]
        }) : language.includes(':')
          ? rulesStructure(raw, language, escape())
          : papyrus.highlight(raw, {
            language,
            lineNumbers: language !== 'bash' && language !== 'treeview'
          })
    }
  });

  config.addFilter('active', active);
  config.addFilter('navigate', navigate);
  config.addPlugin(search, { minify: true });
  config.addPlugin(sprite, { inputPath: './src/assets/svg', spriteShortCode: 'sprite' });

  config.addPassthroughCopy({
    'src/assets/img/*': 'assets',
    'src/assets/font/*': 'assets/font',
    'node_modules/moloko/dist': 'assets/moloko',
    'node_modules/esthetic/dist/esthetic.js': 'assets/esthetic.min.js'
  });

  return {
    htmlTemplateEngine: 'liquid',
    passthroughFileCopy: false,
    markdownTemplateEngine: false,
    pathPrefix: '',
    incremental: false,
    templateFormats: [
      'liquid',
      'json',
      'md',
      'html'
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
