import './parser/parse';
import './lexers/style';
import './lexers/script';
import './lexers/markup';
import './beautify/markup';
import './beautify/style';
import './beautify/script';
import './options';

export { definitions } from './options/definitions';

export * as default from './prettify';
