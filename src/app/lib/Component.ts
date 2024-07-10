import {
  Computed,
  Ref,
  RegisterAttributesBinding,
  RegisterEvents,
  RegisterModels,
  Watch,
} from "./utils/index";
import MyCustomSocket from "../src/modules/websocket/WebSocket";
import { App, InjectionKeys, MyEvent } from ".";
import ElementRefRegister from "./utils/ElementRefRegister";

type OnAppEventCallBack<E extends MyEvent = MyEvent> = (e: E) => void;
export type SetupFunction<SsrData> = (this: ComponentInstance<SsrData>) => {
  [k: string]: unknown;
};
export default function Component<SsrData = unknown>(
  setup: SetupFunction<SsrData>
) {
  return setup;
}

export class ComponentInstance<SsrData = unknown> {
  private _mounted: boolean = false;
  public componentEl: HTMLElement & { dashyboard: { data: SsrData } };
  private __app: App;
  public __setupData: { [k: string | symbol]: unknown } = {};
  public data: SsrData;

  public watchers: {
    callback: <V extends unknown | unknown[]>(newValue: V, oldValue: V) => any;
    dependencies: Set<symbol>;
  }[] = [];

  private onMountsFn: Function[] = [];
  private onAppEventFn: OnAppEventCallBack[] = [];

  public watch = Watch.bind(this);

  public computed = Computed.bind(this);
  constructor(
    el: HTMLElement,
    setup: (this: ComponentInstance<SsrData>) => { [k: string]: unknown },
    app: App
  ) {
    this.__app = app;
    const _el = el as HTMLElement & {
      dashyboard: { data: SsrData };
    };
    this.componentEl = _el;

    this.data = JSON.parse(
      decodeURIComponent(this.componentEl.dataset["data"]!)
    ) as SsrData;

    this.componentEl.dashyboard = {
      data: this.data,
    };
    this.componentEl.addEventListener(
      "app-event",
      (e) => {
        this.onAppEventFn.forEach((callback) =>
          callback((e as CustomEvent).detail)
        );
      },
      false
    );
    this.__setupData = setup.call(this);
    RegisterModels.apply(this);
    RegisterEvents.apply(this);
    RegisterAttributesBinding.apply(this);
    ElementRefRegister.apply(this);
    // this.context.ws.waitSocket(() => {
    //   this._mounted = true;
    //   this.onMountsFn.forEach((callback) => callback());
    // });
  }

  ref<V>(stateValue: V) {
    const state = new Ref(this, stateValue);
    return state;
  }

  onMount(callback: Function) {
    if (this._mounted) {
      this.onMountsFn.push(callback);
    } else {
      callback();
    }
  }

  onAppEvent(callback: OnAppEventCallBack) {
    this.onAppEventFn.push(callback);
  }

  toto() {
    return this.__app;
  }

  inject<T extends InjectionKeys>(name: T) {
    return this.__app.INJECTIONS[name];
  }

  // get context() {
  //   return {
  //     ws: MyCustomSocket.getInstance(),
  //   };
  // }
}
