import Component, { ComponentInstance, SetupFunction } from "./Component";
import Attribute, { Modifiers } from "./core/Attributes/Attribute";

declare global {
  interface Window {
    Dashyboard: {
      __app?: App;
      __components_queue: {
        el: string | Element;
        __component: string;
      }[];
    };
    R: {
      add: (__component: string, id: string | Element) => void;
    };
  }
  export interface GlobalInjection {
    [k: string]: unknown;
  }
}
export type InjectionKeys = keyof GlobalInjection;
export type InjectionValues = ValueOf<GlobalInjection>;

export type Plugin = (app: App) => void;

export type MyEvent = {
  name: string;
  data: any;
};
export const createEvent = <E extends MyEvent>(event: E) => {
  return new CustomEvent("app-event", {
    detail: event,
  });
};
export class App {
  #COMPONENTS: Map<string, SetupFunction<unknown>> = new Map();
  #COMPONENTS_INSTANCE: ComponentInstance[] = [];
  #INJECTIONS: { [k in InjectionKeys]?: GlobalInjection[k] } = {}; //new Map<InjectionKeys, InjectionValues>();

  #EXTRA_ATTRIBUTES: Attribute[] = [];

  #EXTRA_MODFIERS: { [k: string]: Modifiers } = {
    model: {
      number: (value) => {
        const numbered = Number(value);
        return isNaN(numbered) ? value : numbered;
      },
    },
  };

  initComponent(__component: string, el: string | Element) {
    const setup = this.#COMPONENTS.get(__component);
    if (setup) {
      const i = this.#COMPONENTS_INSTANCE.push(
        new ComponentInstance(
          typeof el === "string" ? document.getElementById(el)! : el,
          setup,
          this
        )
      );
      return this.#COMPONENTS_INSTANCE[i - 1];
    } else {
      console.warn("Not setup foudn for component ", { __component, el });
    }
  }

  mount() {
    window.Dashyboard.__components_queue.forEach((component) => {
      this.initComponent(component.__component, component.el);
    });
    return this;
  }

  registerComponent(name: string, setup: SetupFunction) {
    this.#COMPONENTS.set(name, setup);
    return this;
  }

  use(plugin: Plugin) {
    plugin(this);
    return this;
  }

  get COMPONENTS() {
    return this.#COMPONENTS;
  }

  get COMPONENTS_INSTANCE() {
    return this.#COMPONENTS_INSTANCE;
  }

  get INJECTIONS() {
    return this.#INJECTIONS;
  }

  get ATTRIBUTES() {
    return this.#EXTRA_ATTRIBUTES;
  }

  get MODFIERS() {
    return this.#EXTRA_MODFIERS;
  }

  addModifier(
    attributeName: string,
    modifierName: string,
    modifierAction: Modifiers[string]
  ) {
    if (!(attributeName in this.#EXTRA_MODFIERS)) {
      this.#EXTRA_MODFIERS[attributeName] = {};
    }

    this.#EXTRA_MODFIERS[attributeName][modifierName] = modifierAction;
  }

  addAttribute(attribute: Attribute) {
    this.#EXTRA_ATTRIBUTES.push(attribute);
  }

  provide<N extends InjectionKeys>(name: N, value: GlobalInjection[N]) {
    this.#INJECTIONS[name] = value;
  }
}

export function createApp() {
  if (window.Dashyboard.__app) {
    throw new Error("Only one app is alowed");
  }
  window.Dashyboard.__app = new App();

  return window.Dashyboard.__app;
}

export { Component };
