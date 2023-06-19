import type Moloko from 'moloko';
import { Controller } from '@hotwired/stimulus';

export class Playground extends Controller {

  static loaded: boolean = false;
  static moloko: typeof Moloko;

  /**
   * Stimulus: Targets
   */
  static targets = [
    'mount',
    'splash'
  ];

  /**
   * Stimulus: Values
   */
  static values = {
    module: String,
    loaded: Boolean
  };

  moloko: typeof Moloko;
  svg: Element;
  timer: NodeJS.Timer;

  async connect () {

    if (Playground.loaded) return this.mount();

    this.splashTarget.classList.remove('d-none');

    this.loading();
    this.module();

  }

  async module () {

    const moloko = await import(this.moduleValue);

    Playground.moloko = moloko.default;
    Playground.loaded = true;

  }

  mount () {

    Playground.moloko.mount(this.mountTarget, {
      offset: 52,
      resolve: {
        path: 'assets/moloko',
        esthetic: false
      }
    });

  }

  loading () {

    if (!Playground.loaded) {

      this.timer = setInterval(() => {

        this.loading();

      }, 1200);

    } else {

      this.splashTarget.classList.add('d-none');

      clearInterval(this.timer);
      this.mount();

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
