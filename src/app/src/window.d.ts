import { GridStack } from "gridstack";

declare global {
  interface Window {
    GridStack: typeof GridStack;
  }
}

export {};
