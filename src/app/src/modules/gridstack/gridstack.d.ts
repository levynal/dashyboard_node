import "../../../lib";
import type { GridStack } from "gridstack";
declare module "../../../lib" {
  export interface GlobalInjection {
    Grid: GridStack;
  }
}
