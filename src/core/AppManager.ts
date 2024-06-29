import { DashyBordCLI } from "./DashyBordCLI";
import { ModuleManager } from "./ModuleManager";
import { WidgetManager } from "./WidgetManager";

export namespace AppManager {
  console.log("INIT", "AppManager");
  export async function init() {
    await ModuleManager.loadModules();
    await WidgetManager.loadWidgets();
    DashyBordCLI.openCLI();
  }
}
