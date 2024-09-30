import spx, { SPX } from 'spx';

export class Anchor extends spx.Component<typeof Anchor.define> {

  static define = {
    id: 'anchor',
    state: {
      threshold: Number,
      open: {
        typeof: Boolean,
        default: true
      },
      rootMargin: {
        typeof: String,
        default: '0px'
      }
    },
    nodes: <const>[
      'href',
      'anchor',
      'toggle',
      'toggler',
      'describe'
    ]
  };

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

    this.describeNodes.forEach(node => {

      node.style.width = `${node.offsetWidth}px`

    })

  }



  onToggle ({ currentTarget }: SPX.Event) {

    if(this.state.open) {
      this.toggleNode.classList.add('close-anchors')
      this.togglerNode.classList.add('active')
      this.state.open = false
    } else {
      setTimeout(() => this.toggleNode.classList.remove('open-anchors'), 190)
      this.toggleNode.classList.remove('close-anchors')
      this.toggleNode.classList.add('open-anchors')
      this.togglerNode.classList.remove('active')
      this.state.open = true
    }

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
