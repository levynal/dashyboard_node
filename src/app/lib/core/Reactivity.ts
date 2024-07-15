import { ComponentInstance } from "../Component";
import { debounce } from "../utils/debounce";

export function Computed<T>(
  this: ComponentInstance,
  call: Parameters<typeof this.watch>["0"],
  callback: () => T
) {
  const computedValue = this.ref<T>(callback());

  this.watch(
    call,
    () => {
      computedValue.value = callback();
    },
    { immediate: false }
  );
  return computedValue;
}

const dependencies = new Set<symbol>();

export type WatchOptions = {
  immediate?: boolean;
};

/**
 *
 * @param this
 * @param _refsCallBack Function that used refs that you wanna watch
 * @param callback Function that will run each time when data in first callback change
 * @param options
 */
export function Watch<V extends unknown | unknown[]>(
  this: ComponentInstance,
  _refsCallBack: () => V,
  callback: <V>(newValue: V, oldValue: V) => any,
  options?: WatchOptions
) {
  const _options: WatchOptions = {
    immediate: true,
    ...options,
  };
  dependencies.clear();

  const beforeValues = _refsCallBack();

  if (_options.immediate) {
    callback(beforeValues, beforeValues);
  }

  this.watchers.push({
    callback: debounce(callback, 0),
    dependencies: new Set(dependencies), // make a copy
  });
}

export type KeyPairedObject = { [k: string]: unknown };

export class Ref<T = unknown> {
  #_rawValue: T;
  #_value: T;
  #keyToSymbolMap = new Map<string | number | "__default__", symbol>();
  #componentInstance: ComponentInstance;
  constructor(componentInstance: ComponentInstance, rawRaw: T) {
    this.#componentInstance = componentInstance;
    this.#_rawValue = rawRaw;
    if (rawRaw instanceof Object && !(rawRaw instanceof Element)) {
      this.#_value = new RefProxyObject<{ [k: string]: unknown }>(
        rawRaw as { [k: string]: unknown },
        this.#onGetValue.bind(this),
        this.#onSetValue.bind(this)
      ) as T;
    } else {
      this.#_value = rawRaw;
    }
  }

  get value(): Prettify<T> {
    this.#onGetValue();
    return this.#_value;
  }

  set value(newValue: T) {
    if (newValue instanceof Object && !(newValue instanceof Element)) {
      this.#_value = new RefProxyObject(
        newValue as { [k: string]: unknown },
        this.#onGetValue.bind(this),
        this.#onSetValue.bind(this)
      ) as T;
    } else {
      this.#_value = newValue;
    }
    this.#onSetValue(newValue, this.#_rawValue);
    this.#_rawValue = newValue;
  }

  #onGetValue(key?: keyof { [k: string | number]: unknown }) {
    dependencies.add(this.getSymbolForKey(key));
  }

  #onSetValue(
    newValue: unknown,
    oldValue: unknown,
    key?: keyof { [k: string | number]: unknown }
  ) {
    this.#componentInstance.watchers
      .filter(({ dependencies }) => dependencies.has(this.getSymbolForKey(key)))
      .forEach(({ callback }) => callback(newValue, oldValue));
  }

  private getSymbolForKey = (
    key?: keyof { [k: string | number]: unknown }
  ): symbol => {
    const symbol = this.#keyToSymbolMap.get(key ?? "__default__") || Symbol();
    if (!this.#keyToSymbolMap.has(key ?? "__default__")) {
      this.#keyToSymbolMap.set(key ?? "__default__", symbol);
    }
    return symbol;
  };
}

class RefProxyObject<State extends KeyPairedObject> {
  [k: string]: unknown;
  constructor(
    value: State,
    onGetValue: (key?: keyof { [k: string | number]: unknown }) => void,
    onSetValue: (
      newValue: unknown,
      oldValue: unknown,
      key?: keyof { [k: string | number]: unknown }
    ) => void
  ) {
    Object.keys(value).forEach((key) => (this[key] = value[key]));
    return new Proxy(this, {
      get(target, p: string, receiver) {
        onGetValue(p);
        return target[p];
      },
      set(object, key: string, value) {
        const oldValue = object[key] ?? undefined;
        object[key] = value;
        onSetValue(value, oldValue, key);
        return true;
      },
    });
  }
}
