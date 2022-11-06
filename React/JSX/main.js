import { MyElement, MyFragment, renderToDom } from "./MyToyReact";
const items = [{
  name: 'Item1',
  value: '001'
}, {
  name: 'Item2',
  value: '002'
}];
const descriptions = items.map(item => MyElement(MyFragment, null, MyElement("dt", {
  id: item.name
}, item.name), MyElement("dd", {
  id: item.name
}, item.value)));
renderToDom(document.body, ...descriptions);
