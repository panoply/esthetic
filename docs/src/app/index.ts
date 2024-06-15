import { Application } from '@hotwired/stimulus';
import { Drawer } from './components/drawer';
import { Sticky } from './components/sticky';
import { Showcase } from './components/showcase';
import { Dropdown } from './components/dropdown';
import { ScrollSpy } from './components/scrollspy';
import { Playground } from './components/playground';
import { Parser } from './components/parser';
import { Search } from './components/search';
import spx from 'spx';
import relapse from 'relapse';

spx.connect({
  progress: false,
  fragments: ['main', 'navbar', 'menu'],
  components: {
    Showcase,
    Dropdown,
    Drawer,
    Search,
    ScrollSpy,
    Playground
  }
})(function() {

   relapse()

  const stimulus = Application.start();


  stimulus.register('sticky', Sticky)
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

