import Component from "../../../lib/Component";
import useLoading from "../../macros/useLoading";
import {
  updateWidget,
  updateWidgetsPositionAndSize,
} from "../../scripts/service/widget.service";

type Widget = {
  id: string;
  title: string;
  widgetName: string;
  position: { x: number; y: number; w: number; h: number };
};

export default Component(function () {
  const widget = this.ref(this.data as Widget);
  const input = this.ref(0);

  const maRef = this.ref(undefined);
  const dialogRef = this.ref<HTMLDialogElement | undefined>(undefined);
  const widgetTitle = this.ref((this.data as Widget).title);
  this.watch(
    () => [dialogRef.value],
    (newValue, oldValue) => {
      console.log("WATCH[dialogRef]", { newValue, oldValue });
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

  const [editWidgetLoading, editWidget] = useLoading.bind(this)(async () => {
    const resp = await updateWidget({
      id: widget.value.id,
      title: widget.value.title,
    });
    if (resp.ok) {
      widget.value = await resp.json();
      window
        .Toastify({
          text: "Succefull changed widget data",
          className: "info",
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        })
        .showToast();
    } else {
      widgetTitle.value = widget.value.title;
      window
        .Toastify({
          text: "Error while changing widget data",
          className: "error",
          position: "center",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        })
        .showToast();
    }
  });

  function openEditWidget() {
    if (dialogRef.value) {
      console.log(dialogRef.value);
      dialogRef.value.showModal();
    }
  }

  function onActionClick(action: string) {
    console.log("onActionClick", action);
  }

  function onModalClose() {
    console.log("modal close");
  }
  return {
    onModalClose,
    onActionClick,
    editWidgetLoading,
    editWidget,
    dialogRef,
    computedVar,
    maRef,
    maVar,
    widget,
    input,
    openEditWidget,
    widgetTitle,
  };
});
