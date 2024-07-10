import { Widget } from "../models/Widget";
import dashyboardEvent from "./Event";

export default <D extends Widget["data"]>(widgetId: string, data: D) => {
  return dashyboardEvent({
    name: "UPDATE_WIDGET_DATA",
    data: {
      widgetId,
      data,
    },
  });
};
