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

  get moloko () {

    return Playground.moloko;
  }

  get hash () {
    return localStorage.getItem('moloko');
  }

  svg: Element;
  timer: NodeJS.Timer;

  async connect () {

    if (this.hash) window.location.hash = this.hash;

    if (Playground.loaded) return this.mount();

    this.splashTarget.classList.remove('d-none');

    this.loading();
    await this.module();

  }

  disconnect (): void {

    localStorage.setItem('moloko', this.moloko.hash());

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
        path: 'assets/moloko'
      }
    });

  }

  loading () {

    if (!Playground.loaded) {

      this.timer = setInterval(() => {

        this.loading();

      }, 500);

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
