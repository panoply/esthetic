import { Controller as BaseController } from '@hotwired/stimulus';

export class Controller extends BaseController<HTMLElement> {

  /**
   * Document `<html>`
   *
   * Returns the html element from the `this.application`
   * selector exposed by stimulus.
   */
  get html (): HTMLElement {

    return this.application.element as HTMLElement;

  }

  /**
   * Document `<body>`
   *
   * Returns the body element from the `this.application`
   * selector exposed by stimulus.
   */
  get dom (): HTMLBodyElement {

    return this.application.element.lastElementChild as HTMLBodyElement;

  }

  /**
   * Get Controller
   *
   * Returns the controller instance and methods from Stimulus.
   * Optionally pass in an `id` parameter value, which would
   * be the DOM element `id=""` value.
   */
  controller (identifier: string, id?: string): any {

    return this.application.controllers.find(({ context }) => id ? (
      context.identifier === identifier &&
      context.element.id === id
    ) : (
      context.identifier === identifier
    ));

  }

}
