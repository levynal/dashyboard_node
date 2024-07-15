import { ComponentInstance } from "../../../lib/Component";
import Attribute from "../../../lib/core/Attributes/Attribute";
import { EventAttribute } from "../../../lib/core/Attributes/EventAttribute";
import { RefAttribute } from "../../../lib/core/Attributes/internal/RefAttribute";
import { App, createEvent } from "../../../lib/index";

class DialogAttribute extends RefAttribute {
  constructor() {
    super("dialog");
  }

  register(
    componentInstance: ComponentInstance,
    element: HTMLElement,
    attributeName: string
  ): void {
    super.register(componentInstance, element, attributeName);

    element.addEventListener("click", function (event) {
      var rect = element.getBoundingClientRect();
      var isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInDialog) {
        (element as HTMLDialogElement).close();
      }
    });
  }
}

export default function DialogPlugin(app: App) {
  app.addAttribute(new EventAttribute("close", "close"));
  app.addAttribute(new DialogAttribute());
}
