import { FastifyInstance } from "fastify";
import widgets from "./widgets";

export default function (
  fastify: FastifyInstance,
  opts: {},
  done: (err?: Error) => void
) {
  fastify.register(widgets, { prefix: "widget" });

  done();
}
