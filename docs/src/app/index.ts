import { Drawer } from './components/drawer';
import { Showcase } from './components/showcase';
import { Marquee } from './components/marquee';
import { Dropdown } from './components/dropdown';
import { Anchor } from './components/anchors';
import { Playground } from './components/playground';
import { Search } from './components/search';
import spx from 'spx';
import relapse from 'relapse';

spx.connect({
  progress: false,
  fragments: ['main', 'navbar', 'menu'],
  components: {
    Marquee,
    Showcase,
    Dropdown,
    Drawer,
    Search,
    Anchor,
    Playground
  }
})(function() {

    relapse()

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

