import "../../../lib";
import MyCustomSocket from "./WebSocket";
declare module "../../../lib" {
  export interface GlobalInjection {
    WS: MyCustomSocket;
  }
}
