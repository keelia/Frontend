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
  const handleSubmit = (title) => {
    setTodoList(draft => {
      draft.unshift({ title, status: new Date().toDateString() });
    });
  };
  ```

# Performance
> 优化性能的时机-遇到性能问题的时候，过早优化会提高开发成本

## Slow(2s+)
1. 首次页面加载慢。这个其实在 Web 前端领域是个比较大的话题，浏览器中有一系列指标可以量化页面加载快慢的情况，包括首字节时间（TTFB）、首次内容绘制时间（FCP）、可交互时间（TTI）等，refer to [User-centric performance metrics](https://web.dev/metrics/)
2. 页面局部读取数据慢。这是单页应用的常见设计，比如在页面加载完成后，再延迟加载一个列表数据，这时一般会为列表显示一个临时的“读取中”标识，等到数据到位时再替换成真正的列表内容
3. 提交表单处理慢
4. 页面跳转慢 - 会降低转化率
5. 短时间内多次页面刷新。这是个很微妙但也很普遍的问题，如果用户在应用中完成一系列连贯性的操作，但过程中页面存在多次刷新会打断用户的连续操作时，“慢”的感觉会被放大。你可以设想一下，每点击下一步都得刷新页面的话，那体验会是多么糟糕
### Root Cause
- 首次页面加载慢和页面跳转慢的问题，可以通过浏览器的开发者工具来定位问题根源，是建立连接慢、等待服务器响应慢、下载慢，还是下载队列被阻塞了。这里尤其推荐 Chrome 浏览器开发者工具中的 Lighthouse 工具。
- 页面局部读取数据慢和提交表单处理慢，这两种问题的根源更有可能是服务器处理慢。
- 短时间内多次页面刷新，则更多是用户体验设计的问题。

## Stuck(10～100ms)
1. 表单控件交互卡顿。你可能在某些网页遇到过这样的体验：在文本框连续输入好几个字母，如“abcdef”，但只有“ab”出来了，等了半秒钟“cdef”才突然跳出来，这样的卡顿很影响交互效率
2. 鼠标、键盘交互的视觉反馈不及时。这个现象与上面的有一些差别，比如一个扁平式按钮，它的鼠标悬停效果可以帮助用户理解它是个按钮而不是单纯一个图标，但如果鼠标悬停上去，等了一秒钟后才出变化，就有可能误导用户。
3. 页面纵向滚动不连贯。网页的基本布局是纵向的流式文档布局，纵向滚动翻页就是网页最基本的操作之一。当用户用鼠标滚轮翻一页卡半页时，他将很难精准地定位到他想看的内容
4. 页面动画掉帧。这个情况跟游戏或电影掉帧类似
5. 页面短时间不响应。如果还能自动恢复正常，那还能称之为卡了；如果长时间不响应，用户会说页面挂了
### Root Cause
- 表单控件交互卡顿，和鼠标、键盘交互的视觉反馈不及时这两种表现，常见的根源是网页 JS 进行了比较耗时的同步操作，阻塞了网页的渲染。
- 页面纵向滚动不连贯常见于 DOM 内容过多的情况。
- 页面长时间不响应，则有可能是因为进入了 JS 死循环。

*React Developer Tools 里，包含一个 Profiler 性能分析功能，也可以用来定位性能问题。建议在设置中勾选“记录每个组件渲染的原因”，可以帮助你巩固对组件渲染过程的理解*

## Source
计算资源(GPU)、网络带宽资源(移动设备尤其)、存储资源(移动设备尤其)

## Improve Performance
1. 在为生产环境构建 React 应用项目时，需要指定生产模式，这样编译构建工具会在生成的产物中清理掉开发模式的代码，一举减轻浏览器运行时的负担。如果你用的是 CRA 创建的 React 项目，那么 npm run build 出来的产物就是面向生产环境的。如果你使用了 Vite，则执行 vite build ；如果直接使用了 Webpack，则使用 Webpack 的 mode: 'production'
2. 避免不必要的渲染 / 重新渲染 
- Pure Component 纯组件， React.memo 或 React.PureComponent API
  - 首先当一个组件由于 state 变更而重新渲染，它的子组件和后代组件都会被重新渲染（哪怕 props 没变化）。但它的父组件和祖先组件不会重新渲染，它的平级组件以及平级组件的子组件树也不会重新渲染，这是从设计上保证的
  - 如果传入纯组件的 props 值没有变化，那从 MyChildComponent 开始的子组件树的重新渲染就被打断了，这就是典型的基于纯组件的性能优化。
  - 不要滥用纯组件。你当然可以选择把项目中所有组件都封装成纯组件，但这属于明显的过度优化，代价是更深的元素树，也可能会遇到组件不按预期重新渲染的 Bug。我的建议是，只对比较“重”的组件下手
  - 很大一部分纯组件失效的情况，都是因为父组件给作为子组件的纯组件传递了**函数类型**的 props，而这个函数在父组件的每次重新渲染中都会被重新创建，破坏了不可变性。
- 除了纯组件之外，还可以比如针对长列表的部分渲染框架 react-window 或者 react-virtualized。
3. 代码分割
- 如果你构建出来的生产环境产物中，单个 JS 文件有好几个 MB 大小，那可以考虑利用构建工具的代码分割功能，将产物分成多个 chunk，每个 chunk JS 文件几百 KB，可以分摊整体 JS 体积，充分利用浏览器并行下载和缓存的特性优化应用加载速度
- 除了这种业务无关的代码分割方式，在 React 中开发者也可以按功能模块或路由显式地分割应用，然后用**懒加载**的方式在浏览器中按需加载应用的一部分







