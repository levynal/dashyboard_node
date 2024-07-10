import { App } from "../../../lib/index";
import MyCustomSocket from "./WebSocket";

export default function WebsocketPlugin(app: App) {
  app.provide("WS", MyCustomSocket.getInstance());
}
