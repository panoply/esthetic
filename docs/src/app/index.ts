import relapse from 'relapse';
import spx from 'spx';

import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { Marquee } from './components/marquee';
import { Playground } from './components/playground';
import { ScrollSpy } from './components/scrollspy';
import { Search } from './components/search';
import { Showcase } from './components/showcase';

spx({
  progress: false,
  fragments: [
    'main',
    'navbar',
    'menu'
  ],
  components: {
    Marquee,
    Showcase,
    Dropdown,
    Drawer,
    Search,
    ScrollSpy,
    Playground
  }
})(function () {

  relapse();

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
