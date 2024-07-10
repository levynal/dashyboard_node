import { App, createEvent } from "../../../lib/index";

export default function GridStackPlugin(app: App) {
  window.addEventListener("load", () => {
    const grid = window.GridStack.init();
    app.provide("Grid", grid);

    grid.on("change", function (event, els) {
      els?.forEach((gridstackNode) => {
        const { x, y, w, h, el } = gridstackNode;
        const _event = createEvent({
          name: "grid-change",
          data: { x, y, w, h } as {
            x: number;
            y: number;
            w: number;
            h: number;
          },
        });
        if (el) {
          el.dispatchEvent(_event);
        }
      });
    });
  });
}
