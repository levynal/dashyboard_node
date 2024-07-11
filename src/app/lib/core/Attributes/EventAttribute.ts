import { ComponentInstance } from "../../Component";
import Attribute from "./Attribute";

export class EventAttribute extends Attribute {
  constructor(
    name: string,
    public htmlEventName: string,
    public beforeCallback: (event: Event, modifier: string) => void = () => {}
  ) {
    super(name);
  }

  register(
    componentInstance: ComponentInstance,
    element: Element,
    atributeName: string,
    modifier: string
  ): void {
    console.log("event register");
    element.addEventListener(this.htmlEventName, (event) => {
      const eventScript = element.getAttribute(atributeName)!;

      try {
        this.beforeCallback(event, modifier);

        const func = new Function(
          "e",
          "with(document) {" + "with(this) {" + eventScript + "}" + "}"
        );

        func.apply(componentInstance.__setupData);
      } catch (error) {
        console.error("FROM EVENTSREGISTER", error, eventScript);
      }
    });
  }
}
