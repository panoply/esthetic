import { Application } from '@hotwired/stimulus';
import { Accordion } from './components/accordion';
import { Drawer } from './components/drawer';
import { Sticky } from './components/sticky';
import { Showcase } from './components/showcase';
import { Dropdown } from './components/dropdown';
import { ScrollSpy } from './components/scrollspy';
import { Playground } from './components/playground';
import { Parser } from './components/parser';
import spx from 'spx';
import relapse from 'relapse';

spx.connect({
  progress: false,
  fragments: ['main', 'navbar', 'sidebar'],
  components: {
    Showcase,
    Dropdown,
    Drawer,
    ScrollSpy
  }
})(function() {

   relapse()

  const stimulus = Application.start();

  stimulus.register('accordion', Accordion);
  stimulus.register('sticky', Sticky);
  stimulus.register('playground', Playground);
  stimulus.register('parser', Parser);

});

spx.on('load', (page) => {

  if (page.key === '/') {
    relapse.has() && relapse.destroy();
  } else if (!relapse.has()) {
    relapse();
  } else {
    relapse.reinit();
  }

});

spx.on('fetch', ({ key }) => {

  if (key === '/playground') {

    console.log(key)


  }

});
