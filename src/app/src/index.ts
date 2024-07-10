import { createApp } from "../lib/index";
import GridStackPlugin from "./modules/gridstack/index";
import WebsocketPlugin from "./modules/websocket/index";
import * as Components from "./components/components";
const app = createApp().use(GridStackPlugin).use(WebsocketPlugin);

Object.entries(Components).forEach(([name, setup]) => {
  app.registerComponent(name, setup);
});

app.mount();
