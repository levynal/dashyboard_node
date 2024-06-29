import { FastifyInstance } from "fastify";
import { WidgetController } from "../controllers/WidgetController";

export default function (
  fastify: FastifyInstance,
  opts: {},
  done: (err?: Error) => void
) {
  fastify.decorate("utility", function () {});

  fastify
    .get("/", async () => WidgetController.getWidgets())
    .get("/configurations", () =>
      WidgetController.getWidgetConfigurationNames()
    )
    .post<{ Body: { name: string } }>(
      "/addModule",
      {
        schema: {
          body: {
            name: {
              type: "string",
            },
          },
        },
      },
      async (d) => WidgetController.addWidget(d.body.name)
    );

  done();
}
