import { ComponentInstance } from "../Component";

export const Events = {
  click: {
    HtmlEventName: "click",
  },
  input: {
    HtmlEventName: "input",
  },
  submit: {
    HtmlEventName: "submit",
    action: (e: Event) => e.preventDefault(),
  },
} as const;

export default function RegisterEvents(this: ComponentInstance) {
  (Object.keys(Events) as Array<keyof typeof Events>).forEach((eventName) => {
    const eventData = Events[eventName];
    const elements = this.componentEl.querySelectorAll(`[r-${eventName}]`);
    elements.forEach((element) => {
      element.addEventListener(eventData.HtmlEventName, (event) => {
        const eventScript = element.getAttribute(`r-${eventName}`)!;

        try {
          if ("action" in eventData) eventData.action(event);

          const func = new Function(
            "e",
            "with(document) {" + "with(this) {" + eventScript + "}" + "}"
          );

          func.apply(this.__setupData);
        } catch (error) {
          console.error("FROM EVENTSREGISTER", error, eventScript);
        }
      });
    });
  });
}
