import { Ref } from "../../Reactivity";
import { ComponentInstance } from "../../../Component";
import Attribute from "../Attribute";

export class RefAttribute extends Attribute {
  constructor(name: string = "ref") {
    super(name);
  }

  register(
    componentInstance: ComponentInstance,
    element: HTMLElement,
    attributeName: string
  ): void {
    const maybeRef =
      componentInstance.__setupData[element.getAttribute(attributeName)!];
    if (maybeRef && maybeRef instanceof Ref) {
      maybeRef.value = element;
    } else {
      console.warn(`Please attach  ${attributeName} using a Ref variable`);
    }
  }
}
