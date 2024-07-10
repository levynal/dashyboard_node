import { WidgetConfiguration, WidgetPositionSize } from "../types/widget";
import { AppManager } from "../core/AppManager";
import { SocketManager } from "../core/SocketManager";
import UpdateWidgetDataEvent from "../events/UpdateWidgetDataEvent";
export function widgetConfiguration<D extends { [k: string]: unknown }>(
  conf: WidgetConfiguration<D>
) {
  return conf;
}

export type WidgetConfigurationType = typeof widgetConfiguration;

export class Widget<
  D extends { [k: string]: unknown } = { [k: string]: unknown }
> {
  #title: string;
  #position: WidgetPositionSize = { x: 0, y: 0, w: 1, h: 1 };
  data: WidgetConfiguration<D>["data"];
  #_emitData: boolean = true;
  constructor(
    public id: string,
    private appManager: typeof AppManager,
    public widgetConfiguration: WidgetConfiguration<D>
  ) {
    this.setData(widgetConfiguration.data);
    this.#title = this.widgetConfiguration.name;
    this.data = this.#getDataProxy(this.widgetConfiguration.data);
  }

  async init() {
    this.#_emitData = false;
    await this.widgetConfiguration.init(this);
    this.#_emitData = true;
  }

  get title() {
    return this.#title;
  }

  set title(title: string) {
    this.#title = title;
  }

  loadFromDb(data: {
    id: string;
    title: string;
    position: WidgetPositionSize;
    widgetName: string;
  }) {
    this.#position = data.position;
    this.#title = data.title;
  }

  #getDataProxy(data?: D) {
    const that = this;
    return new Proxy(data ?? ({} as D), {
      get(target: D, prop: string, receiver: any) {
        console.log("Proxy get", { target, prop });
        return target[prop];
      },
      set(target: D, p: string, newval: any) {
        // @ts-ignore
        target[p] = newval;
        if (that.#_emitData) {
          SocketManager.send(UpdateWidgetDataEvent(that.id, that.data));
        }

        return true;
      },
    });
  }

  setData(data?: D) {
    this.data = this.#getDataProxy(data);
  }

  setPositionSize(positionSize: WidgetPositionSize) {
    this.#position = positionSize;
  }
  toJSON() {
    return {
      id: this.id,
      title: this.#title,
      widgetName: this.widgetConfiguration.name,
      position: this.#position,
    };
  }
}
