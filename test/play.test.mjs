import { play } from '@liquify/test-utils';
import * as prettify from '../package/index.mjs';
import * as mocks from './mocks/export.mjs';

prettify.options({
  forceAttribute: false,
  wrap: 80,
  attributeGlue: true
});

prettify.markup(mocks.markup.markup_example).then(value => {

  play(value);

}).catch(console.error);
