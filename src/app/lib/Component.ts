import { Computed, Ref, Watch } from "./core/Reactivity";
import { App, InjectionKeys, MyEvent } from ".";
import RegisterAttributes from "./core/Attributes/RegisterAttributes";

type OnAppEventCallBack<E extends MyEvent = MyEvent> = (e: E) => void;

export interface ISetupData {
  [k: string | symbol]: unknown;
}
export type SetupFunction<SsrData = unknown, SetupData = ISetupData> = (
  this: ComponentInstance<SsrData>
) => SetupData;

export default function Component<SsrData, SetupData>(
  setup: SetupFunction<SsrData, SetupData>
) {
  return setup;
}

export class ComponentInstance<
  SsrData = unknown,
  SetupData extends ISetupData = ISetupData
> {
  private _mounted: boolean = false;
  public componentEl: HTMLElement & {
    _relement: ComponentInstance<SsrData, SetupData>;
  };
  private __app: App;
  public __setupData: SetupData = {} as SetupData;
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
    el: Element,
    setup: (this: ComponentInstance<SsrData, SetupData>) => SetupData,
    app: App
  ) {
    this.__app = app;
    const _el = el as HTMLElement & {
      _relement: ComponentInstance<SsrData, SetupData>;
    };
    this.componentEl = _el;

    this.data = JSON.parse(
      decodeURIComponent(this.componentEl.dataset["data"]!)
    ) as SsrData;

    this.componentEl._relement = this;
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

    const appAttributes = RegisterAttributes.call(this);

    appAttributes.forEach((attribute) => attribute.init(this));
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

  get __app__() {
    return this.__app;
  }

  inject<T extends InjectionKeys>(name: T) {
    return this.__app.INJECTIONS[name];
  }
}
