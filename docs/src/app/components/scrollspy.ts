import { Controller } from '@hotwired/stimulus';

export class ScrollSpy extends Controller {

  /**
   * Stimulus: Targets
   */
  static targets = [
    'anchor'
  ];

  /**
   * Stimulus: Values
   */
  static values = {
    rootMargin: {
      type: String,
      default: '0px'
    },
    threshold: {
      type: Number,
      default: 0
    }

  };

  /**
   * Stimulus: Classes
   */
  static classes = [
    'active'
  ];

  /**
   * Stimulus: Initialize
   */
  initialize () {
    this.anchors = [];
    this.options = {
      rootMargin: this.rootMarginValue,
      threshold: this.thresholdValue
    };
  }

  /**
   * Stimulus: Connect
   */
  connect () {

    for (const a of this.anchorTargets) {
      const anchor = a.href.slice(a.href.lastIndexOf('#'));
      const element = this.element.querySelector(anchor) as HTMLHeadingElement;
      if (this.element.contains(element)) {
        this.anchors.push(element);
        a.onclick = () => {
          setTimeout(() => {
            this.anchorTargets.forEach(j => j.classList.remove(this.activeClass));
            a.classList.add(this.activeClass);
          }, 300);
        };
      }
    }

    if (window.scrollY < 10) {
      this.anchorTargets[0].classList.add(this.activeClass);
    } else {
      this.onScroll();
    }

    window.onscroll = this.onScroll;
  }

  onScroll = () => {

    this.anchors.forEach((v, i) => {

      const next = v.getBoundingClientRect().y - 50;

      if (next < window.screenY) {
        this.anchorTargets.forEach(j => j.classList.remove(this.activeClass));
        this.anchorTargets[i].classList.add(this.activeClass);
      }
    });
  };

  /**
   * Stimulus: Disconnect
   */
  disconnect (): void {
    this.anchors = [];
  }

  /* -------------------------------------------- */
  /* TYPE VALUES                                  */
  /* -------------------------------------------- */

  active: HTMLHeadingElement;
  anchors: HTMLHeadingElement[];
  /**
   * Intersection Observer
   */
  observer: IntersectionObserver;
  /**
   * Itersection Observer Options
   */
  options: IntersectionObserverInit;
  /**
   * Stimulus: The Intersection Observer root margin value
   */
  rootMarginValue: string;
  /**
   * Stimulus: The intersection Observer threshold value
   */
  thresholdValue: number;

  /* -------------------------------------------- */
  /* TARGETS                                      */
  /* -------------------------------------------- */

  /**
   * Stimulus: The first matching viewport target
   */
  headings: HTMLHeadingElement[];
  /**
   * Stimulus: All viewport targets
   */
  anchorTargets: HTMLLinkElement[];

  /* -------------------------------------------- */
  /* TYPE CLASSES                                 */
  /* -------------------------------------------- */

  /**
   * Stimulus: The url anchor class to apply when intersecting
   */
  activeClass: string;

}
