# React features
##  Pure Component
### 纯函数(Pure Function)
> 当一个函数满足如下条件时，就可以被认为是纯函数：
> 1. 函数无论被调用多少次，只要参数相同，返回值就一定相同，这一过程不受外部状态或者 IO 操作的影响；
> 2. 函数被调用时不会产生副作用（Side Effect），即不会修改传入的引用参数，不会修改外部状态，不会触发 IO 操作，也不会调用其他会产生副作用的函数;

```js
const func = (a, b) => { return a + b;};
```

### “纯函数组件”
>用纯函数的概念来分析下面的 React 函数组件，对于给定的 props a和b，每次渲染时都会返回相同的无序列表元素
> 编写纯函数组件，可以最直观地展示输入的 props 与输出的渲染元素之间的关系，非常利于开发者把握组件的层次结构和样式。但需要知道，这样的纯函数组件除了 props、JSX 外，几乎不能使用 React 组件的所有其他特性——对于纯函数组件来说，这些其他特性全部都是外部状态或副作用。

```js
const Component = ({ a, b }) => {
  return (
    <ul>
      <li>{a}</li>
      <li>{b}</li>
    </ul>
  );
};
```

### React.memo
#### shallow compare(Shallow Compare)
> 对新旧两个对象做浅对比，具体实现方式依然是基于 Object.is()。当两个对象属性数量相同，且其中一个对象的每个属性都与另一个对象的同名属性相等时，这两个对象才算相等。在下面的过程中，React 会调用 shallowEqual(oldObj, newObj) 来对比新旧对象（主要是 props）：
> 1. React.memo 进入更新阶段，如果属性均相同，则跳过该组件继续执行下一个工作；
> 2. PureComponent 进入更新阶段，如果属性均相同，则跳过该组件继续执行下一个工作。

> 每次渲染时纯组件会把 props 记录下来，下次渲染时会用新的 props 与老的 props 做浅对比，如果判断相等则跳过这次原组件的渲染。**但要注意，原组件内部不应该有 state 和 context 操作(即纯函数组件)，否则就算 props 没变，原组件还是有可能因为 props 之外的原因重新渲染**。

#### when to use React.memo
1. Pure funcitonal component : Your \<Component> is functional and give same props, always render the same output
2. Render often
3. Re-redering with same props : Your \<Component> is usually provided with same props during re-render
4. Medium to big size: Your \<Component> contains a decent amount of UI elements to reason props quality check 

*The more often the component renders with the same props, the heavier and the more computationally expensive the output is, the more chances are that component needs to be wrapped in React.memo().*

#### when to avoid React,memo https://dmitripavlutin.com/use-react-memo-wisely/
> If the component isn't heavy and usually renders with different props, most likely you don't need React.memo().

Imagine a component that usually renders with different props. In this case, memoization doesn't provide benefits.

Even if you wrap such a volatile component in React.memo(), React does 2 jobs on every rendering:

1. Invokes the comparison function to determine whether the previous and next props are equal
2. Because props comparison almost always returns false, React performs the diff of previous and current render results

You gain no performance benefits but also run for naught the comparison function.


### [Immer](https://immerjs.github.io/immer/zh-CN/)
> 它可以让 JS 开发者使用原生的 JS 数据结构，和本来不具有不可变性的 JS API，创建和操作不可变数据。

#### 在 React 中使用 Immer
> 在函数组件中，可以直接使用 Immer 提供的 Hooks 来替代 useState。
1. 安装 Immer：
`npm install immer use-immer`
2. 在组件中使用 Immer：
```js
import React from "react";
import { useImmer } from "use-immer";

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useImmer([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ]);
  // ...
  const handleSubmit = (title) => {
    setTodoList(draft => {
      draft.unshift({ title, status: new Date().toDateString() });
    });
  };
  // ...```


