import { createApp } from "..";
import { BindableAttribute } from "../core/Attributes/BindableAttribute";

const app = createApp();

//Add a custom bindable attribute that will render an image each time it's attched data changed
app.addAttribute(
  new BindableAttribute("avatar", (el, value) => {
    el.innerHTML = `<img src="https://ui-avatars.com/api/?name=${value}"></img>`;
  })
);

//Add a modifier to r-text attribute to add braces above value
app.addModifier("text", "braced", (value) => `[${value}]`);

app.mount();
