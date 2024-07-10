import { ComponentInstance } from "../Component";
import { Ref } from "./ref";

export default function ElementRefRegister(this: ComponentInstance) {
  const models = this.componentEl.querySelectorAll<HTMLInputElement>(`[r-ref]`);

  models.forEach((modelEl) => {
    const setupData = this.__setupData;
    const maybeRef = setupData[modelEl.getAttribute("r-ref")!];
    if (maybeRef && maybeRef instanceof Ref) {
      maybeRef.value = modelEl;
    } else {
      console.warn("Please attach r-ref using a Ref variable");
    }
  });
}
