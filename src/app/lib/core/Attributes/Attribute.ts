import { ComponentInstance } from "../../Component";
import AppConfig from "../Constants/AppConfig";

export type Modifiers = {
  [k: string]: (value: any) => any;
};
export default abstract class Attribute<E extends Element = Element> {
  constructor(public name: string, public modifiers?: Modifiers) {}

  abstract register(
    componentInstance: ComponentInstance,
    element: E,
    atributeName: string,
    modifier?: string
  ): void;

  init(componentInstance: ComponentInstance) {
    const modifiers = this.getModifiers(componentInstance);

    let attributeName = `${AppConfig.attribute.prefix}${this.name}`;
    componentInstance.componentEl
      .querySelectorAll<E>(`[${attributeName}]`)
      .forEach((domElement) => {
        this.register(componentInstance, domElement, attributeName);
      });

    if (modifiers) {
      Object.keys(modifiers).forEach((modifier) => {
        attributeName = `${AppConfig.attribute.prefix}${this.name}-${modifier}`;
        componentInstance.componentEl
          .querySelectorAll<E>(`[${attributeName}]`)
          .forEach((domElement) => {
            this.register(
              componentInstance,
              domElement,
              attributeName,
              modifier
            );
          });
      });
    }
  }

  getModifiers(componentInstance: ComponentInstance) {
    return {
      ...this.modifiers,
      ...componentInstance.__app__.MODFIERS[this.name],
    };
  }
}

export function evalInComponentContext(script: string) {
  return new Function(
    "e",
    ` with(document) {
        with(this) {
          return ${script};
        }
      }`
  );
}
