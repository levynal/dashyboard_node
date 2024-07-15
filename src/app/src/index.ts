import { createApp } from "../lib/index";
import GridStackPlugin from "./modules/gridstack/index";
import WebsocketPlugin from "./modules/websocket/index";
import * as Components from "./components/components";
import DialogPlugin from "./modules/dialog/index";
const app = createApp()
  .use(GridStackPlugin)
  .use(WebsocketPlugin)
  .use(DialogPlugin);

Object.entries(Components).forEach(([name, setup]) => {
  app.registerComponent(name, setup);
});

app.mount();
