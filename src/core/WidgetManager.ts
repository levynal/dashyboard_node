import { Widget, widgetConfiguration } from "../models/Widget";
import { AppManager } from "./AppManager";
import { v4 as uuidv4 } from "uuid";
import { JsonDB, Config } from "node-json-db";
import { WidgetPosition } from "../types/widget";
import { SocketManager } from "./SocketManager";
import NewWidgetEvent from "../events/NewWidgetEvent";

export namespace WidgetManager {
  console.log("INIT", "WidgetManager");

  export let widgetsConfigurations: ReturnType<typeof widgetConfiguration>[] =
    [];
  let widgetDB = new JsonDB(new Config("widgets", true, false, "/"));
  export let widgets: { [id: string]: Widget } = {};

  export function getWidgetConfigurationByName(name: string) {
    const conf = widgetsConfigurations.find((conf) => (conf.name = name));
    return conf;
  }

  export function getWidgetConfigurationNames() {
    return widgetsConfigurations.map((m) => m.name);
  }

  export async function addWidget(name: string) {
    const widgetConfiguration = getWidgetConfigurationByName(name);
    if (!widgetConfiguration) throw new Error("moduleConfiguration not found");

    const newWidget = new Widget(
      uuidv4(),
      AppManager,
      Object.assign(widgetConfiguration, {})
    );
    await newWidget.init();
    SocketManager.send(NewWidgetEvent(newWidget));
    widgets[newWidget.id] = newWidget;
    await saveWidgets(newWidget);
  }

  export async function loadWidgets() {
    const dbModules = Object.values(
      await widgetDB.getObjectDefault("/widgets", {})
    ) as {
      id: string;
      title: string;
      position: WidgetPosition;
      widgetName: string;
    }[];

    for (let index = 0; index < dbModules.length; index++) {
      const dbModule = dbModules[index];
      const widgetConfiguration = getWidgetConfigurationByName(
        dbModule.widgetName
      );
      if (widgetConfiguration) {
        const widget = new Widget(
          dbModule.id,
          AppManager,
          Object.assign(widgetConfiguration, {})
        );
        widget.loadFromDb(dbModule);
        await widget.init();
        widgets[dbModule.id] = widget;
      }
    }
  }

  export function saveWidgets(widget: Widget) {
    return widgetDB.push(`/widgets/${widget.id}`, widget.toJSON());
  }
}
