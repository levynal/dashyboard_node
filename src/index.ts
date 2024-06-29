import Fastify from "fastify";
import routes from "./routes";
import fastifyStatic from "@fastify/static";
import fastifyWebsocket from "@fastify/websocket";
import path from "node:path";
import AppFactory from "./factories/AppFactory";
import { SocketManager } from "./core/SocketManager";
import FastifyVite from "@fastify/vite";

const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyWebsocket);

fastify.register(FastifyVite, {
  root: import.meta.url,
  renderer: "@fastify/vue",
});

fastify.register(async function (fastify) {
  fastify.get(
    "/ws",
    { websocket: true },
    (socket /* WebSocket */, req /* FastifyRequest */) => {
      SocketManager.addSocket(socket);
      socket.on("message", (message) => {
        // message.toString() === 'hi from client'
        socket.send("hi from server");
      });
    }
  );
});

console.log(path.join(__dirname, "public"));
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/",
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "..", "node_modules"),
  prefix: "/node_modules/",
  decorateReply: false, // the reply decorator has been added by the first plugin registration
});
fastify.register(routes, {
  prefix: "api",
});

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}

  console.log(
    `🦊 Elysia is running at ${address}`,
    path.join(__dirname, "public")
  );
});

AppFactory.getInstance().init();
