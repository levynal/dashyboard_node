import { ComponentInstance } from "../../lib/Component";

export default function useLoading(
  this: ComponentInstance,
  func: () => Promise<any>
) {
  const isLoading = this.ref(false);

  async function load() {
    isLoading.value = true;
    await func();
    isLoading.value = false;
  }

  return [isLoading, load];
}
