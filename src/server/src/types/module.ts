import { widgetConfiguration } from "../models/Widget";

export type DraftBoardReturn = {
  widgets: ReturnType<typeof widgetConfiguration>[];
};
export type Module = {
  __esModule: boolean;
  draftboard: <W = DraftBoardReturn>() => W | Promise<W>;
};
