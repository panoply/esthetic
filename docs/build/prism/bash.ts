export default <Prism.Grammar>{
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
};
