import spx from 'spx';

export class ScrollSpy extends spx.Component<typeof ScrollSpy.define> {

  static define = {
    id: 'scrollspy',
    state: {
      threshold: Number,
      rootMargin: {
        typeof: String,
        default: '0px'
      }
    },
    nodes: <const>[
      'href',
      'anchor'
    ]
  };

  /**
   * Stimulus: Initialize
   */
  connect () {

    this.anchors = [];
    this.options = {
      rootMargin: this.state.rootMargin,
      threshold: this.state.threshold
    };

  }

  /**
   * Stimulus: Connect
   */
  onmount () {


    this.hrefNode.classList.add('fc-pink');

    for (const a of this.hrefNodes) {
      this.anchors.push(a.href.slice(a.href.lastIndexOf('#') + 1));
      a.onclick = () => {
        setTimeout(() => {
          this.hrefNodes.forEach(j => j.classList.remove('fc-pink'));
          a.classList.add('fc-pink');
        }, 300);
      };

    }

    if (this.anchors.length === 0) return
    this.onScroll();

    window.onscroll = this.onScroll;
  }

  /**
   * Stimulus: Disconnect
   */
  unmount (): void {

    this.anchors = [];

  }

  onScroll = () => {

    this.anchorNodes.filter(a => this.anchors.includes(a.id)).forEach((v, i) => {

      const next = v.getBoundingClientRect().top;

      if (next < window.screenY && this.hrefNodes[i]) {

        this.hrefNodes.forEach(j => j.classList.remove('fc-pink'));
        this.hrefNodes[i].classList.add('fc-pink');

      }
    });
  };

  /* -------------------------------------------- */
  /* TYPE VALUES                                  */
  /* -------------------------------------------- */

  anchors: string[];
  observer: IntersectionObserver;
  options: IntersectionObserverInit;
  anchorNodes: HTMLLinkElement[];
  hrefNodes: HTMLLinkElement[];

}
