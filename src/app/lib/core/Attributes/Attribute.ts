import { ComponentInstance } from "../../Component";
import AppConfig from "../Constants/AppConfig";

export type Modifiers = {
  [k: string]: (value: any) => any;
};

//TODO: UTILSER ca pour le binding + comme ça on peut utiliser: pour les modifiers
// var nodesSnapshot = document.evaluate('//*/attribute::*[starts-with(name(), "r-text")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
// var attr;
// for (var i=0; i < nodesSnapshot.snapshotLength; i++ ) {
//    attr = nodesSnapshot.snapshotItem(i);
//    console.log(attr, attr.ownerElement)
// };
//Array.from({ length: nodesSnapshot.snapshotLength }, (_, index) => nodesSnapshot.snapshotItem(index));

export default abstract class Attribute<E extends Element = Element> {
  constructor(public name: string, public modifiers?: Modifiers) {}

  abstract register(
    componentInstance: ComponentInstance,
    element: E,
    atributeName: string,
    modifier?: string
  ): void;

  init(componentInstance: ComponentInstance) {
    const modifiers = this.getModifiers(componentInstance);

    let attributeName = `${AppConfig.attribute.prefix}${this.name}`;

    var nodesSnapshot = document.evaluate(
      `//*/attribute::*[starts-with(name(), "${attributeName}")]`,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    var attr;
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
      attr = nodesSnapshot.snapshotItem(i) as Attr;
      if (attr) {
        console.log(
          "aatribute",
          attr.nodeName,
          attr.ownerElement,
          attr.nodeName.split(":").at(1)
        );
        const modifier = attr.nodeName.split(":").at(1);
        this.register(
          componentInstance,
          attr.ownerElement as E,
          `${attributeName}${modifier ? `:${modifier}` : ""}`,
          attr.nodeName.split(":").at(1)
        );
      }
    }
  }

  getModifiers(componentInstance: ComponentInstance) {
    return {
      ...this.modifiers,
      ...componentInstance.__app__.MODFIERS[this.name],
    };
  }
}

export function evalInComponentContext(script: string) {
  return new Function(
    "e",
    ` with(document) {
        with(this) {
          return ${script};
        }
      }`
  );
}
