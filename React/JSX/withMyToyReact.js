import { MyElement, MyFragment,renderToDom} from "./MyToyReact";
const items = [
  {
    name:'Item1',
    value:'001'
  },
  {
    name:'Item2',
    value:'002'
  }
]
const descriptions = items.map(item => (
    <>
      <dt id={item.name}>{item.name}</dt>
      <dd id={item.name}>{item.value}</dd>
    </>
 ));
renderToDom(document.body,...descriptions)
 