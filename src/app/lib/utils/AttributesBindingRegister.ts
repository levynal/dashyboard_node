import { ComponentInstance } from "../Component";

export function getStringValue(value: unknown) {
  if (value instanceof Object) {
    if (String(value) === "[object Object]") {
      return JSON.stringify(value);
    }
  }
  return String(value);
}
export const Attributes = {
  value: {
    action: (el: Element, value: unknown) => {
      if (el instanceof HTMLInputElement) {
        el.value = getStringValue(value);
      } else {
        console.error("Cant set value on element", el);
      }
    },
  },
  text: {
    action: (el: Element, value: unknown) => {
      if (el instanceof HTMLElement) {
        el.innerText = getStringValue(value);
      } else {
        console.error("Cant set text on element", el);
      }
    },
  },
  html: {
    action: (el: Element, value: unknown) =>
      (el.innerHTML = getStringValue(value)),
  },
} as const;

export function registerAttributeBinding(
  this: ComponentInstance,
  element: Element,
  attributeName: keyof typeof Attributes
) {
  const getValue = new Function(
    "e",
    "with(document) {" +
      "with(this) { return " +
      `${element.getAttribute(`r-${attributeName}`)!};` +
      "}" +
      "}"
  ).bind(this.__setupData);

  this.watch(getValue, () => {
    if (!element.hasAttribute("r-no-update")) {
      Attributes[attributeName].action(element, getValue());
    }
  });
}

export default function RegisterAttributesBinding(this: ComponentInstance) {
  (Object.keys(Attributes) as Array<keyof typeof Attributes>).forEach(
    (attributeName) => {
      const elements = this.componentEl.querySelectorAll(
        `[r-${attributeName}]`
      );
      elements.forEach((element) => {
        registerAttributeBinding.bind(this)(element, attributeName);
      });
    }
  );
}
