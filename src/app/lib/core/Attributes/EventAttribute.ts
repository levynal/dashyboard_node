import { ComponentInstance } from "../../Component";
import Attribute, { evalInComponentContext, Modifiers } from "./Attribute";

export class EventAttribute extends Attribute {
  constructor(
    name: string,
    public htmlEventName: string,
    // public beforeCallback: (event: Event, modifier: string) => void = () => {},
    modifiers?: Modifiers
  ) {
    super(name, modifiers);
  }

  register(
    componentInstance: ComponentInstance,
    element: Element,
    atributeName: string,
    modifier: string
  ): void {
    this.modifiers = this.getModifiers(componentInstance);

    element.addEventListener(this.htmlEventName, (event) => {
      if (modifier && this.modifiers && modifier in this.modifiers) {
        this.modifiers[modifier](event);
      }
      const eventScript = element.getAttribute(atributeName)!;

      try {
        const func = evalInComponentContext(eventScript);

        func.apply(componentInstance.__setupData);
      } catch (error) {
        console.error("FROM EVENTSREGISTER", error, eventScript);
      }
    });
  }
}
