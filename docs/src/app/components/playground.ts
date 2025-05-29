import type Moloko from 'moloko';

import spx from 'spx';

export class Playground extends spx.Component({
  nodes: [
    'mount',
    'splash'
  ],
  state: {
    module: String,
    loaded: Boolean
  }
}) {

  static loaded: boolean = false;
  static moloko: typeof Moloko;

  get moloko () { return Playground.moloko; }

  svg: Element;
  timer: NodeJS.Timeout;

  async connect () {

    await this.module();

  }

  async onmount () {

    if (Playground.loaded) return this.mount();

    this.splashNode.classList.remove('d-none');

    this.loading();

    await this.module();

    return this.mount();

  }

  unmount (): void {

  }

  async module () {

    const moloko = await import(this.state.module);

    Playground.moloko = moloko.default;

  }

  mount () {

    Playground.moloko.mount(this.mountNode, {
      samples: false,
      hash: false,
      splash: false,
      monaco: {
        stickyScroll: {
          enabled: false,
          scrollWithEditor: false
        },
        scrollbar: {
          useShadows: false
        }
      },
      sidebar: {
        actions: {
          ghissue: {
            active: false
          },
          link: {
            active: false
          }
        }
      },
      colors: {
        background: '#1b1b1d'
      },
      resolve: {
        path: 'assets/moloko'
      }
    });

    if (!Playground.loaded) Playground.loaded = true;

  }

  loading () {

    if (!Playground.loaded) {

      this.timer = setInterval(() => {

        this.loading();

      }, 250);

    } else {

      this.splashNode.classList.add('d-none');

      clearInterval(this.timer);

    }

  }

  /**
   * Import URL to the moloko module
   */
  mountTarget: HTMLElement;
  splashTarget: HTMLElement;
  moduleValue: string;
  estheticValue: string;
  loadedValue: boolean;

}
