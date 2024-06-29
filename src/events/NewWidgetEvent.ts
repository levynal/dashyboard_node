import { Widget } from "../models/Widget";
import dashyboardEvent from "./Event";

export default (widget: Widget) => {
  return dashyboardEvent({
    name: "NEW_WIDGET",
    data: widget.toJSON(),
  });
};
