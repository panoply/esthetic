import type { editor } from 'monaco-editor';

import merge from 'mergerino';
import join from 'url-join';

import { configuration, liquid } from './liquid';
import { PotionTheme, PotionThemeLightBackground } from './theme';

export const config: editor.IEditorOptions = {
  automaticLayout: true,
  useShadowDOM: false,
  multiCursorPaste: 'full',
  experimentalWhitespaceRendering: 'off',
  copyWithSyntaxHighlighting: false,
  accessibilitySupport: 'off',
  scrollbar: {
    verticalScrollbarSize: 2
  },
  smoothScrolling: true,
  minimap: {
    enabled: false
  },
  padding: {},
  renderWhitespace: 'boundary',
  formatOnPaste: false,
  scrollBeyondLastLine: false,
  fontFamily: "consolas, monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  fontWeight: '100',
  fontVariations: true,
  fontSize: 13.7,
  letterSpacing: 0.3,
  lineHeight: 1.7,
  cursorBlinking: 'blink',
  cursorStyle: 'line-thin',
  cursorWidth: 1,
  bracketPairColorization: {
    enabled: false,
    independentColorPoolPerBracketType: false
  }
};

export const configOutput: editor.IEditorOptions = Object.assign({}, config, {
  lineNumbers: 'on',
  readOnly: true,
  domReadOnly: true,
  renderLineHighlight: 'none',
  cursorStyle: 'line-thin'
});

/**
 * Monaco Editor
 *
 * Monaco instance assign after loading ESM module
 */
export let monaco: typeof import('monaco-editor');

/**
 * Import Monaco
 *
 * The monaco editor module is loaded externally, this function
 * will trigger the import and assign the `monaco` let variable.
 */
export async function getMonacoModule (path: string) {

  monaco = await import(join(path, 'assets/monaco/monaco.js'));

  monaco.editor.defineTheme('potion', PotionTheme);
  monaco.editor.defineTheme('potion-light', PotionThemeLightBackground);
  monaco.editor.setTheme('potion');
  monaco.languages.setMonarchTokensProvider('liquid', liquid);
  monaco.languages.setLanguageConfiguration('liquid', configuration);
  monaco.languages.html.registerHTMLLanguageService('liquid');
  monaco.languages.register({
    id: 'liquid',
    extensions: [ '.liquid' ],
    aliases: [ 'Liquid', 'liquid' ],
    mimetypes: [ 'text/liquid' ]
  });

  self.MonacoEnvironment = {
    getWorkerUrl: (_, label) => {
      switch (label) {
        case 'json':
          return join(path, 'assets/monaco/workers', 'json.js');
        case 'css':
        case 'scss':
        case 'less':
          return join(path, 'assets/monaco/workers', 'css.js');
        case 'html':
        case 'xml':
        case 'liquid':
          return join(path, 'assets/monaco/workers', 'html.js');
        default:
          return join(path, 'assets/monaco/workers', 'editor.js');
      }
    }
  };
}

export function getMonacoInput (
  element: { input: HTMLElement, output: HTMLElement },
  language: string,
  content: string
) {

  const $: {
    input: {
      model: editor.ITextModel;
      editor: editor.IStandaloneCodeEditor;
    };
    output: {
      model: editor.ITextModel;
      editor: editor.IStandaloneCodeEditor;
    };
    rules: {
      model: editor.ITextModel;
      editor: editor.IStandaloneCodeEditor;
    }
  } = {
    input: {
      model: null,
      editor: null
    },
    output: {
      model: null,
      editor: null
    },
    rules: {
      model: null,
      editor: null
    }
  };

  $.input.model = monaco.editor.createModel(content, language);
  $.output.model = monaco.editor.createModel(content, language);

  // monaco.languages.registerDocumentRangeFormattingEditProvider({ language: $.input.model.getLanguageId() }, {
  //   provideDocumentRangeFormattingEdits: model => {
  //     const text = esthetic.format(model.getValue());
  //     return [
  //       {
  //         text,
  //         range: model.getFullModelRange()
  //       }
  //     ];
  //   }
  // });

  // $.input.model.onDidChangeContent(() => {
  //   const value = $.input.model.getValue();
  //   const text = esthetic.format(value);
  //   $.output.model.setValue(text);
  // });

  $.input.editor = monaco.editor.create(element.input, Object.assign({}, config, {
    model: $.input.model
  }));

  // $.input.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
  //   $.input.editor.trigger(
  //     'editor',
  //     'editor.action.formatDocument',
  //     null
  //   );
  // });

  $.output.editor = monaco.editor.create(element.output, Object.assign({}, configOutput, {
    model: $.output.model
  }));

  // $.input.editor.onDidScrollChange((
  //   {
  //     scrollLeft,
  //     scrollTop
  //   }
  // ) => {

  //   $.output.editor.setScrollPosition({
  //     scrollLeft,
  //     scrollTop
  //   }, 0);

  // });

  $.input.editor.layout();
  $.output.editor.layout();

  console.log(content);

  return $;
}
