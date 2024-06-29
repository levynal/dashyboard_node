import { AppManager } from "../core/AppManager";
import FactoryBase from "./FactoryBase";

class AppFactory extends FactoryBase {
  private static instance: typeof AppManager;
  private constructor() {
    super();
    // Private constructor to prevent direct instances
  }
  static getInstance() {
    if (!AppFactory.instance) {
      AppFactory.instance = AppManager;
    }
    return AppFactory.instance;
  }
  // Additional methods and properties here
}
export default AppFactory;
