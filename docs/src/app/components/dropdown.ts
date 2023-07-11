import { Controller } from '@hotwired/stimulus';
import relapse from 'relapse';

/**
 * Dropdown
 *
 * Facilitates Dropdown/Collapsible functionality.
 */
export class Dropdown extends Controller {

  /**
   * Stimulus Values
   */
  static values = {
    selected: String,
    form: String,
    accordion: String,
    required: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: String,
      default: 'closed'
    },
    type: {
      type: String,
      default: 'dropdown'
    }
  };

  /**
   * Stimulus Targets
   */
  static targets = [
    'collapse',
    'button',
    'placeholder',
    'input',
    'viewport'
  ];

  /**
   * Stimulus Classes
   *
   * @static
   * @memberof Dropdown
   */
  static classes = [
    'selected',
    'disabled',
    'invalid'
  ];

  /**
   * Stimulus Initialize
   *
   * @static
   * @memberof Dropdown
   */
  connect () {

  }

  /**
   * Stimulus Disconnect
   *
   * @static
   * @memberof Dropdown
   * @version 2.0
   */
  disconnect () {

    //

  }

  /**
   * Returns all `<label>` elements in the dropdown
   */
  inViewport () {

    const rect = this.collapseTarget.getBoundingClientRect();

    for (const { element, folds } of relapse.get().values()) {
      if (element.id === this.accordionValue) {

        if (!(
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )) {
          folds.find(fold => fold.expanded === true).close();
        }

        break;
      }
    }

  }

  /**
   * Toggle - Open/Close
   */
  toggle (event: Event) {

    event.stopPropagation();

    if (this.element.classList.contains('is-open')) return this.close();

    this.collapseValue = 'opened';
    this.element.classList.add('is-open');
    this.buttonTarget.classList.remove('selected');

    if (this.hasAccordionValue) this.inViewport();

    // listen for outside clicks
    addEventListener('click', this.outsideClick.bind(this));

  }

  /**
   * Click detected outside, eg: document body
   */
  outsideClick (event: Event) {

    if (this.buttonTarget !== event.target) {
      if (this.element.classList.contains('is-open')) {
        this.close();
      }
    }

  }

  /**
   * Close Dropdown
   */
  close () {

    this.element.classList.remove('is-open');

    if (this.collapseValue === 'selected' || this.hasSelectedValue) {
      this.element.classList.add('selected');
      this.collapseValue = 'selected';
    } else {
      this.collapseValue = 'closed';
    }

    removeEventListener('click', this.outsideClick);
    this.buttonTarget.focus();
  }

  /**
   * Select Inputs
   *
   * Used for Dropdown Forms
   */
  select ({ target }: { target: HTMLInputElement }) {

    target.checked = true;
    this.selectedValue = target.value;
    this.buttonTarget.innerText = target.getAttribute('aria-label');
    this.collapseValue = 'selected';

    for (const label of this.element.getElementsByTagName('label')) {

      if (label.getAttribute('for') === target.id) {
        if (!label.classList.contains('selected')) {
          label.classList.add('selected');
        }
      } else {
        if (label.classList.contains('selected')) {
          label.classList.remove('selected');
        }
      }

    };

    this.close();

  }

  /**
   * Items in dropdown - An ul > li <select> element equivelent
   */
  options (event: MouseEvent) {

    if (event.target instanceof HTMLElement) {

      if (event.currentTarget instanceof HTMLElement) {
        const [ selected ] = event.currentTarget.getElementsByClassName('selected');
        if (selected) this.selectedValue = selected.id; // the <span> text
      }
      if (event.currentTarget instanceof HTMLElement) {
        // console.log(event.currentTarget);
      }

      if (this.hasRequiredValue) {

        if (this.buttonTarget.classList.contains('is-invalid')) {
          this.buttonTarget.classList.remove('is-invalid');
        }

        this.requiredValue = false;
        this.buttonTarget.classList.add('selected');
      }

      this.selectedValue = event.target.textContent;
      this.buttonTarget.textContent = event.target.textContent;
      this.collapseValue = 'selected';

      this.toggle(event);

    }
  }

  /* -------------------------------------------- */
  /* TYPES                                        */
  /* -------------------------------------------- */

  /**
   * Stimulus: The button element which when clicked shows dropdown list
   */
  buttonTarget: HTMLElement;

  /**
   * Stimulus: The placeholder element within the button - applies selected value
   */
  placeholderTarget: HTMLElement;

  /**
   * Stimulus: The input element containing the selected value
   */
  inputTarget: HTMLInputElement;

  /**
   * Stimulus: The input element containing the selected value
   */
  viewportTarget: HTMLElement;

  /**
   * Stimulus: The input element containing the selected value
   */
  hasViewportTarget: HTMLElement;

  /**
   * Stimulus: The input element containing the selected value
   */
  hasInputTarget: boolean;

  /**
   * Stimulus: The collpase element which contains the list items
   */
  collapseTarget: HTMLElement;

  /**
   * Stimulus: Whether or not a collapse state was provided
   */
  hasCollpaseValue: boolean;

  /**
   * Stimulus: The current state of the dropdown, defaults to `closed`
   */
  collapseValue: 'opened' | 'closed' | 'selected';

  /**
   * Stimulus: Dropdown is being used a form select
   */
  isFormSelect: boolean;
  /**
   * Stimulus: Whether or not a form identifier was provided
   */
  hasFormValue: boolean;
  /**
   * Stimulus: Whether or selection is required - Typically used in forms
   */
  requiredValue: boolean;
  /**
   * Stimulus: Whether or not the dropdown has a required value
   */
  hasRequiredValue: boolean;
  /**
   * Stimulus: Whether or not type value exists - Defaults to `dropdown` is undefined
   */
  hasTypeValue: boolean;

  /**
 * Stimulus: Whether or not the dropdown is using an accordion toggle
 */
  hasAccordionValue: boolean;
  /**
   * Stimulus: The element `id` of the accordion to trigger viewport toggle
   */
  accordionValue: string;

  /**
   * Stimulus: The current selected list item value in the dropdown list
   */
  selectedValue: string;

  /**
   * Stimulus: Whether or not a list item was selected
   */
  hasSelectedValue: boolean;

  /* -------------------------------------------- */
  /* CLASSES                                      */
  /* -------------------------------------------- */

  /**
   * Stimulus: The `active` class which will open the dropdown
   */
  openedClass: string;
  /**
   * Stimulus: The `disabled` class to be applied to dropdown items
   */
  disabledClass: string;
  /**
   * Stimulus: Whether or not `disabledClass` was passed
   */
  hasDisabledClass: boolean;
  /**
   * Stimulus: The `selected` class to be applied to when an item was chosen
   */
  selectedClass: string;
  /**
   * Stimulus: Whether or not `selected` class was passed
   */
  hasSelectedClass: boolean;
  /**
   * Stimulus: The `selected` class to be applied to when an item was chosen
   */
  invalidClass: string;
  /**
    * Stimulus: Whether or not `required` class was passed
    */
  hasInvalidClass: boolean;

}
