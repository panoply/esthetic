import type Moloko from 'moloko';
import spx from 'spx';

export class Playground extends spx.Component<typeof Playground.define>{

  static loaded: boolean = false;
  static moloko: typeof Moloko;

  /**
   * Stimulus: Targets
   */
  static define = {
    nodes: [
      'mount',
      'splash'
    ],
    state: {
      module: String,
      loaded: Boolean
    }
  }

  get moloko () {
    return Playground.moloko;
  }


  svg: Element;
  timer: NodeJS.Timeout

  async connect () {

    await this.module();

  }


 async onmount() {

    if (Playground.loaded) return this.mount();

    this.splashNode.classList.remove('d-none');

    this.loading();

    await this.module();
    return this.mount();
  }

  unmount (): void {



  }

  async module () {

    try {

    const moloko = await import(this.state.module);

    Playground.moloko = moloko.default;

    } catch(e) {
      throw e
    }
  }

  mount () {

    Playground.moloko.mount(this.mountNode, {
      offset: 0,
      samples: false,
      hash: false,
      splash: false,
      resolve: {
        path: 'assets/moloko',
      }
    });


    if (!Playground.loaded) Playground.loaded = true;

  }

  loading () {

    if (!Playground.loaded) {

      this.timer = setInterval(() => {

        this.loading();

      }, 500);

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
