declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  type ValueOf<T> = T[keyof T];
}

export {};
