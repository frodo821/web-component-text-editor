// tslint:disable-next-line: import-name
import jsx from './index';

export class Component<P = {}, R extends Element = Element> extends HTMLElement
  implements JSX.JSXElement<P> {
  root: ShadowRoot;
  protected current: R;
  props?: P;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    const sty = document.createElement('style');
    sty.textContent = this.styleOf();
    this.root.appendChild(sty);
    this.current = this.render();
    this.root.appendChild(this.current);
    this.init();
  }

  protected triggerEvent(event: string, details?: any) {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, true, true, details);
    this.current.dispatchEvent(evt);
  }

  querySelector(query: string) {
    return this.current.querySelector(query);
  }

  querySelectorAll(query: string) {
    return this.current.querySelectorAll(query);
  }

  render(): R {
    return <div></div>;
  }

  styleOf(): string {
    return '';
  }

  init() {}

  static register() {
    if (customElements.get(this.tagname) !== undefined) {
      return;
    }
    customElements.define(this.tagname, this);
    console.log(`element ${this.tagname} registered.`);
  }

  static get tagname(): string {
    return this.name.replace(/(?!^)([A-Z0-9])/g, '-$1').toLowerCase();
  }
}
