import { FastifyInstance } from "fastify";
import { WidgetController } from "../controllers/WidgetController";
import fastifyStatic from "@fastify/static";
import path from "node:path";
export default function (
  fastify: FastifyInstance,
  opts: {},
  done: (err?: Error) => void
) {
  fastify.get("/", async (req, reply) => {
    return reply.viewAsync("views/index.ejs", {
      widgets: await WidgetController.getWidgets(),
    });
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "..", "node_modules"),
    prefix: "/node_modules/",
    decorateReply: false, // the reply decorator has been added by the first plugin registration
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "app", "src"),
    prefix: "/",
    decorateReply: false, // the reply decorator has been added by the first plugin registration
    allowedPath: (pathName, root, request) =>
      pathName.toLowerCase().endsWith(".js"),
  });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "..", "app", "lib"),
    prefix: "/lib",
    decorateReply: false, // the reply decorator has been added by the first plugin registration
    allowedPath: (pathName, root, request) =>
      pathName.toLowerCase().endsWith(".js"),
  });

  done();
}
