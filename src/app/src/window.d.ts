import { GridStack } from "gridstack";
import Toastify from "toastify-js";

declare global {
  interface Window {
    GridStack: typeof GridStack;
    Toastify: typeof Toastify;
  }
}

export {};
