export default <Prism.Grammar>{
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
};
