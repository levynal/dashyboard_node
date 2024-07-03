import { FastifyInstance } from "fastify";
import { WidgetController } from "../controllers/WidgetController";

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

  done();
}
