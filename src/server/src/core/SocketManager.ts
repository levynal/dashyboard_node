import type { WebSocket } from "@fastify/websocket";
import { DashyboardEvent } from "../types/event";
import { v4 as uuidv4 } from "uuid";

declare module "ws" {
  class _WS extends WebSocket {}
  export interface WebSocket extends _WS {
    id: string;
  }
}
export namespace SocketManager {
  console.log("INIT", "SocketManager");

  const sockets = new Map<string, WebSocket>();

  export function addSocket(socket: WebSocket) {
    socket.id = uuidv4();
    socket.on("close", () => removeSockets(socket.id));

    sockets.set(socket.id, socket);
  }

  export function send<D>(data: DashyboardEvent<D>) {
    return Promise.all(
      [...sockets.values()].map((socket) => {
        socket.send(JSON.stringify(data));
      })
    );
  }

  function removeSockets(id: string) {
    sockets.delete(id);
  }
}
