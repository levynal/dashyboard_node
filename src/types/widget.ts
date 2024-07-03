import { Widget } from "../models/Widget";

export type WidgetPositionSize = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export interface WidgetConfiguration<D extends { [k: string]: unknown }> {
  id: string;
  name: string;
  data: D;
  actions: {
    [id: string]: {
      title: string;
      handler: (module: Widget<D>) => unknown | Promise<unknown>;
    };
  };
  init: (module: Widget<D>) => void | Promise<void>;
}
