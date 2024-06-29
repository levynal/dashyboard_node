import { WidgetPosition } from "../types/widget";
import { SocketManager } from "../core/SocketManager";
import { ModuleManager } from "../core/ModuleManager";
import { WidgetManager } from "../core/WidgetManager";

export namespace WidgetController {
  const socketManager = SocketManager;
  const moduleManager = ModuleManager;
  const widgetManager = WidgetManager;
  export async function updateWidgetPosition(
    widgetId: string,
    widgetPosition: WidgetPosition
  ) {}

  export async function getWidgetConfigurationNames() {
    return widgetManager.getWidgetConfigurationNames();
  }

  export async function addWidget(name: string) {
    return widgetManager.addWidget(name);
  }
  export async function getWidgets() {
    // return Object.values(await widgetDB.getData("/widgets"));
    return Object.values(WidgetManager.widgets).map((module) =>
      module.toJSON()
    );
  }
}
