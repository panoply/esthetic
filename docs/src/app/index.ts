import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Drawer } from './components/drawer';
import { Sticky } from './components/sticky';
import { Editor } from './components/example';
//import { Playground  } from './playground/controller';

import spx from 'spx';

spx.connect({
  hover: {
    trigger: 'href'
  },
  progress: false
})((state) => {

  const stimulus = Application.start();

  stimulus.register('drawer', Drawer);
  stimulus.register('accordion', Accordion);
  stimulus.register('sticky', Sticky);
  stimulus.register('editor', Editor);
 // stimulus.register('playground', Playground);
});
