import Fastify from "fastify";
import routes from "./routes";
import fastifyWebsocket from "@fastify/websocket";
import path from "node:path";
import AppFactory from "./factories/AppFactory";
import { SocketManager } from "./core/SocketManager";
import fastifyView from "@fastify/view";
const fastify = Fastify({
  logger: false,
});

fastify.register(fastifyWebsocket);

fastify.register(async function (fastify) {
  fastify.get(
    "/ws",
    { websocket: true },
    (socket /* WebSocket */, req /* FastifyRequest */) => {
      SocketManager.addSocket(socket);
    }
  );
});

console.log(path.join(__dirname, "app"));

fastify.register(fastifyView, {
  root: path.join(__dirname, "..", "app", "src"),
  engine: {
    ejs: require("ejs"),
  },
});

// fastify.register(fastifyStatic, {
//   root: path.join(__dirname, "..", "public"),
//   prefix: "/",
// });

fastify.register(routes);

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
  AppFactory.getInstance().init();

  console.log(
    `🦊 Elysia is running at ${address}`,
    path.join(__dirname, "public")
  );
});
