import { FastifyInstance } from "fastify";
import api from "./api";
import app from "./app";

export default function (
  fastify: FastifyInstance,
  opts: {},
  done: (err?: Error) => void
) {
  fastify.register(api, { prefix: "api" });
  fastify.register(app, { prefix: "/" });

  done();
}
