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
      default: 0,
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
    this.anchors = []
    this.options = {
      rootMargin: this.rootMarginValue,
      threshold: this.thresholdValue
    }


    for (const a of this.anchorTargets) {
      const anchor = a.href.slice(a.href.lastIndexOf('#'))
      this.anchors.push(this.element.querySelector(anchor))
      a.onclick = (()=> {
        setTimeout(()=> {
          this.anchorTargets.forEach(j => j.classList.remove(this.activeClass))
          a.classList.add(this.activeClass)
        },300)
      })
    }

  }

  /**
   * Stimulus: Connect
   */
  connect () {

    if(window.scrollY < 10) {
      this.anchorTargets[0].classList.add(this.activeClass)
    } else {
      this.onScroll()
    }

    window.onscroll = this.onScroll
  }


  onScroll = () => {

    this.anchors.forEach((v,i)=> {

      let next = v.getBoundingClientRect().y - 50

      if(next < window.screenY){
        this.anchorTargets.forEach(j => j.classList.remove(this.activeClass))
        this.anchorTargets[i].classList.add(this.activeClass)
      }
    })
  }

  /**
   * Stimulus: Disconnect
   */
  disconnect (): void {
    this.anchors = []
    this.observer.disconnect()
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
  options: IntersectionObserverInit
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
  anchorTargets: HTMLLinkElement[]

  /* -------------------------------------------- */
  /* TYPE CLASSES                                 */
  /* -------------------------------------------- */

  /**
   * Stimulus: The url anchor class to apply when intersecting
   */
  activeClass: string;

}
