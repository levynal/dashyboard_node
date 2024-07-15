import { ComponentInstance } from "../../Component";
import getStringValue from "../../utils/getStringValue";
import Attribute, { Modifiers } from "./Attribute";
import { BindableAttribute } from "./BindableAttribute";
import { EventAttribute } from "./EventAttribute";
import { ModelAttribute } from "./internal/ModelAttribute";
import { RefAttribute } from "./internal/RefAttribute";

export default function RegisterAttributes(this: ComponentInstance) {
  return [
    new RefAttribute(),
    new ModelAttribute(),
    new BindableAttribute("html", (element, value) => {
      element.innerHTML = getStringValue(value);
    }),
    new BindableAttribute("text", (element, value) => {
      if (element instanceof HTMLElement) {
        element.innerText = getStringValue(value);
      } else {
        console.error("Cant set text on element", element);
      }
    }),
    new BindableAttribute("value", (element, value) => {
      if (element instanceof HTMLInputElement) {
        element.value = getStringValue(value);
      } else {
        console.error("Cant set value on element", element);
      }
    }),

    new EventAttribute("click", "click"),
    new EventAttribute("input", "input"),
    new EventAttribute("submit", "submit", {
      prevent: (e: Event) => e.preventDefault(),
    }),
    ...this.__app__.ATTRIBUTES,
  ] as Attribute[];
}
