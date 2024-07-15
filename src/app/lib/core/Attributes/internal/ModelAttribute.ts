import { ComponentInstance } from "../../../Component";
import getStringValue from "../../../utils/getStringValue";
import { debounce } from "../../../utils/debounce";
import Attribute, { evalInComponentContext } from "../Attribute";

export class ModelAttribute extends Attribute {
  constructor() {
    super("model");
  }

  register(
    componentInstance: ComponentInstance,
    modelEl: Element,
    attributeName: string,
    modifier?: string
  ): void {
    const that = this;
    modelEl.setAttribute("r-value", modelEl.getAttribute(attributeName)!);
    const onInput = function (this: HTMLInputElement, ev: Event) {
      try {
        const value =
          modifier && that.modifiers && modifier in that.modifiers
            ? that.modifiers[modifier](this.value)
            : this.value;
        const setValue = evalInComponentContext(
          `${modelEl.getAttribute(attributeName)!} = ${
            typeof value === "number" ? value : `'${value}'`
          }`
        );
        modelEl.setAttribute("r-no-update", "true");
        setValue.call(componentInstance.__setupData);
        debounce(() => {
          modelEl.removeAttribute("r-no-update");
        })();
      } catch (error) {
        console.error(error, { that, el: this });
      }
    };

    modelEl.addEventListener("input", onInput);
  }
}
