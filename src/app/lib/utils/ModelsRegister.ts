import { ComponentInstance } from "../Component";
import { debounce } from "./debounce";

const modifiers = {
  number: (value: string) => {
    const numbered = Number(value);
    return isNaN(numbered) ? value : numbered;
  },
};

function registerByModifier(
  this: ComponentInstance,
  modifier?: keyof typeof modifiers
) {
  const attribute = `r-model${modifier ? `-${modifier}` : ""}`;
  const models = this.componentEl.querySelectorAll<HTMLInputElement>(
    `[${attribute}]`
  );

  models.forEach((modelEl) => {
    const componentInstance = this;

    modelEl.setAttribute("r-value", modelEl.getAttribute(`${attribute}`)!);
    const onInput = function (this: HTMLInputElement, ev: Event) {
      try {
        const value = modifier ? modifiers[modifier](this.value) : this.value;
        const setValue = new Function(
          "e",
          "with(document) {" +
            "with(this) { return " +
            `${modelEl.getAttribute(`${attribute}`)!} = ${
              typeof value === "number" ? value : `'${value}'`
            };` +
            "}" +
            "}"
        );
        modelEl.setAttribute("r-no-update", "true");
        setValue.call(componentInstance.__setupData);
        debounce(() => {
          modelEl.removeAttribute("r-no-update");
        })();
      } catch (error) {
        console.error(error, { componentInstance, el: this });
      }
    };

    modelEl.addEventListener("input", onInput);
  });
}
export default function RegisterModels(this: ComponentInstance) {
  registerByModifier.bind(this)();
  registerByModifier.bind(this)("number");
}
