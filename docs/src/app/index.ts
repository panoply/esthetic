import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Drawer } from './components/drawer';
import { Sticky } from './components/sticky';
import { Example } from './components/example';
import { ScrollSpy } from './components/scrollspy';
import { Playground  } from './components/playground'

import spx from 'spx';

spx.connect({
  targets: ["#navbar","#main"],
  progress: false,
  hover: {
    trigger: 'href'
  },
})(function() {

  const stimulus = Application.start();

  stimulus.register('drawer', Drawer);
  stimulus.register('accordion', Accordion);
  stimulus.register('sticky', Sticky);
  stimulus.register('example', Example);
  stimulus.register('scrollspy', ScrollSpy);
  stimulus.register('playground', Playground);

});

console.log(spx)
spx.on('fetch', ({ key}) => {

 if(key === '/playground') {
  import(window.location.host + '/assets/moloko.js')
 }

})