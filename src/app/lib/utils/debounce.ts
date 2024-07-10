export function debounce(func: Function, timeout = 0) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      /** @ts-ignore */
      func.apply(this, args);
    }, timeout);
  };
}
