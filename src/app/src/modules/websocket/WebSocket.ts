export default class MyCustomSocket {
  #listenedEvents = new Map<
    string,
    { callback: Function; conditionFn?: Function }
  >();
  #socket;
  isReady;
  queue: Array<(mySocket: MyCustomSocket) => void>;
  static instance: MyCustomSocket | null = null;
  constructor(host: string = location.host) {
    this.queue = [];
    this.#socket = new WebSocket(`ws://${host}/ws`);
    this.isReady = false;
    this.listen();
    this.#socket.addEventListener("open", (event) => {
      this.queue.forEach((callback) => {
        callback(this);
      });
    });
  }

  static getInstance() {
    if (!MyCustomSocket.instance) {
      MyCustomSocket.instance = new MyCustomSocket();
    }

    return MyCustomSocket.instance;
  }

  on<D>(
    event: string,
    callback: (data: D) => void,
    conditionFn?: (data: D) => boolean
  ) {
    this.#listenedEvents.set(event, {
      callback,
      conditionFn: conditionFn,
    });
  }

  off(event: string) {
    this.#listenedEvents.delete(event);
  }

  onMessage(event: MessageEvent<any>) {
    const eventData = JSON.parse(event.data);
    const listener = this.#listenedEvents.get(eventData.name);
    if (listener) {
      if (listener.conditionFn) {
        if (!listener.conditionFn(eventData.data)) {
          return;
        }
      }
      listener.callback(eventData.data);
    }
  }

  listen() {
    this.#socket.addEventListener("message", this.onMessage);
  }

  stop() {
    this.#socket.removeEventListener("message", this.onMessage);
  }

  waitSocket(callback: (ws: MyCustomSocket) => void) {
    if (this.isReady) {
      callback(this);
    } else {
      this.queue.push(callback);
    }
  }
}
