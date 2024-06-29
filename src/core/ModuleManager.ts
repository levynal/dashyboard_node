import { DraftBoardReturn, Module } from "../types/module";
import fs from "node:fs/promises";
import path from "path";
import * as ts from "typescript";
import clearModule from "clear-module";
import { AppManager } from "./AppManager";
import { WidgetManager } from "./WidgetManager";

export namespace ModuleManager {
  console.log("INIT", "ModuleManager");

  let modulesData: DraftBoardReturn[] = [];
  console.log("ici");
  export let a = "ok";
  export const tot = "ok";
  export async function loadModules() {
    let modules: Module[] = await importModules();

    modulesData = await Promise.all(
      modules.map((module) => module.draftboard())
    );
    WidgetManager.widgetsConfigurations = [
      ...modulesData.map((moduleData) => moduleData.widgets).flat(),
    ];
  }
  async function importModules() {
    let modules: Module[] = [];
    const basePath = path.join(__dirname, "../..", ".modules");
    const moduleFiles = (await fs.readdir(basePath, { withFileTypes: true }))
      .filter((f) => f.isFile())
      .map((f) => f.name);

    for (let index = 0; index < moduleFiles.length; index++) {
      let file = moduleFiles[index];

      let moduleFilePath = path.join(basePath, moduleFiles[index]);

      //Si c'est un ficier ts on le convertit en js
      if (file.endsWith(".ts")) {
        moduleFilePath = await tsCompile(moduleFilePath);
      }
      clearModule(moduleFilePath);

      delete require.cache[moduleFilePath];

      const module = (await require(moduleFilePath)) as Module;

      modules.push(module);
    }
    return modules;
  }

  async function tsCompile(
    filePath: string,
    options: ts.TranspileOptions | null = null
  ) {
    // Default options -- you could also perform a merge, or use the project tsconfig.json
    if (null === options) {
      options = {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          suppressImplicitAnyIndexErrors: true,
        },
      };
    }
    const { ext, base, name, dir } = path.parse(filePath);
    const source = await fs.readFile(filePath, { encoding: "utf-8" });
    const jsContent = ts.transpileModule(source, options).outputText;
    const newPath = path.join(
      __dirname,
      "../..",
      ".modules_compiled",
      `${name}}.js`
    );

    await fs.writeFile(newPath, jsContent, {
      encoding: "utf-8",
    });
    return newPath;
  }
}
