import { ComponentInstance } from "../../Component";
import Attribute, { Modifiers } from "./Attribute";

export class BindableAttribute extends Attribute {
  constructor(
    name: string,
    private onChange: BindableAttribute["__onChange__"],
    modifiers?: Modifiers
  ) {
    super(name, modifiers);
  }

  register(
    componentInstance: ComponentInstance,
    element: Element,
    attributeName: string,
    modifier?: string
  ): void {
    this.modifiers = this.getModifiers(componentInstance);
    const getValue = new Function(
      "e",
      "with(document) {" +
        "with(this) { return " +
        `${element.getAttribute(attributeName)!};` +
        "}" +
        "}"
    ).bind(componentInstance.__setupData);

    componentInstance.watch(getValue, () => {
      if (!element.hasAttribute("r-no-update")) {
        this.__onChange__(element, getValue(), modifier);
      }
    });
  }

  __onChange__(element: Element, value: unknown, modifier?: string) {
    const _value =
      modifier && this.modifiers && modifier in this.modifiers
        ? this.modifiers[modifier](value)
        : value;
    this.onChange(element, _value, modifier);
  }
}
