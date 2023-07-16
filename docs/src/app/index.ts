import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Drawer } from './components/drawer';
import { Sticky } from './components/sticky';
import { Demo } from './components/demo';
import { Dropdown } from './components/dropdown';
import { ScrollSpy } from './components/scrollspy';
import { Playground } from './components/playground';
import spx from 'spx';

spx.connect({
  targets: [ '#navbar', '#main' ],
  progress: false,
  hover: {
    trigger: 'href'
  }
})(function () {

  const stimulus = Application.start();

  stimulus.register('drawer', Drawer);
  stimulus.register('accordion', Accordion);
  stimulus.register('dropdown', Dropdown);
  stimulus.register('sticky', Sticky);
  stimulus.register('demo', Demo);
  stimulus.register('scrollspy', ScrollSpy);
  stimulus.register('playground', Playground);

});

spx.on('fetch', ({ key }) => {

  if (key === '/playground') {

    import(window.location.host + '/assets/moloko.js');

  }

});
