import { ModuleManager } from "../core/ModuleManager";
import { select } from "@inquirer/prompts";
import { WidgetManager } from "../core/WidgetManager";

export namespace DashyBordCLI {
  console.log("INIT", "DashyBordCLI");

  async function addWidget() {
    const confs = WidgetManager.getWidgetConfigurationNames();
    if (confs.length) {
      const answer = await select(
        {
          message: "Select a module",
          choices: confs.map((conf) => ({
            value: conf,
          })),
        },
        { clearPromptOnDone: true }
      );

      WidgetManager.addWidget(answer);
    }
  }
  export async function openCLI() {
    const action = await select({
      message: "Select a module",
      choices: [
        { value: "addWidget", name: "Add widget" },
        { value: "reloadModule", name: "Reload module" },
      ],
    });

    switch (action) {
      case "addWidget":
        await addWidget();
        break;
      case "reloadModule":
        await ModuleManager.loadModules();
        console.log("module reloadded");
    }
    return openCLI();
  }
}
