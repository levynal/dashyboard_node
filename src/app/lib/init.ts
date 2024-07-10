window.Dashyboard = {
  __components_queue: [],
};
window.R = {
  add: (__component: string, id: string) => {
    window.Dashyboard.__components_queue.push({ id, __component });
  },
};
