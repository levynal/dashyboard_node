window.Dashyboard = {
  __components_queue: [],
};
window.R = {
  add: (__component: string, el: string | Element) => {
    window.Dashyboard.__components_queue.push({ el, __component });
  },
};
