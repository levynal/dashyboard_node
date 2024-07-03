import { FastifyInstance } from "fastify";
import { WidgetController } from "../../controllers/WidgetController";
import { WidgetPositionSize } from "../../types/widget";

export type UpdatePositionSizeBody = WidgetPositionSize & { id: string };

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
    )
    .post<{
      Body: UpdatePositionSizeBody[];
    }>("/updatePositionAndSize", (req) =>
      WidgetController.updatePositionAndSize(req.body)
    );

  done();
}
