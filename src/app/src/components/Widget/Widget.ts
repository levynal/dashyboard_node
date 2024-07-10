import Component from "../../../lib/Component";
import { updateWidgetsPositionAndSize } from "../../scripts/service/widget.service";

type Widget = {
  id: string;
  title: string;
  widgetName: string;
  position: { x: number; y: number; w: number; h: number };
};

export default Component<Widget>(function () {
  const widget = this.ref(this.data);
  const input = this.ref(0);

  const maRef = this.ref(undefined);

  this.watch(
    () => [input.value],
    (newValue, oldValue) => {
      console.log("WATCH[input]", { newValue, oldValue });
    }
  );

  const computedVar = this.computed(
    () => input.value,
    () => input.value + 3
  );

  this.onAppEvent((event) => {
    console.log("aoo event", event);
    if (event.name === "grid-change") {
      widget.value.position = event.data;
      updateWidgetsPositionAndSize([{ ...event.data, id: widget.value.id }]);
    }
  });

  const ws = this.inject("WS");
  const maVar = "je susi un variable";
  ws?.on<{ id: string }>(
    "WIDGET_UPDATE_DATA",
    (data) => {},
    (data) => data.id === widget.value.id
  );

  function toto2(data2: unknown) {
    console.log({ data2, input });
    console.log({ event });
  }

  return {
    computedVar,
    maRef,
    maVar,
    widget,
    input,
    toto2,
  };
});
