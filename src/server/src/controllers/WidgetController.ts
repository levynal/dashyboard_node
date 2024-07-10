import { SocketManager } from "../core/SocketManager";
import { ModuleManager } from "../core/ModuleManager";
import { WidgetManager } from "../core/WidgetManager";
import { UpdatePositionSizeBody } from "../routes/api/widgets";

export namespace WidgetController {
  const socketManager = SocketManager;
  const moduleManager = ModuleManager;
  const widgetManager = WidgetManager;

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

  export async function updatePositionAndSize(
    widgetsData: UpdatePositionSizeBody[]
  ) {
    console.log({ widgetsData });
    return Promise.all(
      widgetsData.map((widgetData) => {
        const { id, ...positionSize } = widgetData;

        return WidgetManager.updateWidgetPosition(widgetData.id, positionSize);
      })
    );
    //on va chercher chque widget avec son id et on
  }
}
