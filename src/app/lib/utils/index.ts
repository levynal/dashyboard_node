import { Ref, Watch, Computed } from "./ref";
import RegisterEvents from "./EventsRegister";
import RegisterModels from "./ModelsRegister";
import RegisterAttributesBinding, {
  registerAttributeBinding,
} from "./AttributesBindingRegister";
import { debounce } from "./debounce";

export {
  Computed,
  debounce,
  Watch,
  Ref,
  RegisterEvents,
  RegisterModels,
  RegisterAttributesBinding,
  registerAttributeBinding,
};
