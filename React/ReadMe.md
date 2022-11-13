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

# Test
## E2E Test
> 端到端测试（End-to-End Testing，简称 E2E Testing），就是从最终用户体验出发，模拟真实的用户场景，验证软件行为和数据是否符合预期的测试
### e2e testing using [Playwright](https://playwright.dev/)
1. Intall Playwright
2. package.json `e2e: playwright test`
3. npm run e2e
4. playwright.config.js -Run your local dev server before starting the tests  
```js  
webServer: {
    command: 'npm run start',
    port: 3000,
}
````

5. specify browser package.json `"e2e:firefox": "playwright test --project=firefox"`

### Other e2e Test tools
主流的 Web 前端自动化 E2E 测试工具还包括 Cypress、Selenium。其中 Cypress 是在 Electron 基础上运行了一个高度自定义的浏览器环境，在这个环境中加入了自动化测试的各种功能和 API；而 Selenium 则是基于各个浏览器各自的 WebDriver。Playwright 与二者都不同，它使用了现代浏览器原生支持的CDP 协议（DevTools Protocol），标准较新，运行效率也更高一些。

## Testability(应用的可测试性)
- 测试脚本中，切忌使用太多 HTML 标签名来定位元素，如 page.locator('section') ，相当于是使用了 CSS 语法来查询元素，会使得测试和开发脚本. React 组件内是使用了还是 section 还是li，属于组件的内部实现，连同为源码的父组件都不应该知道，那外部的自动化测试脚本更不应该知道了。这样的写法会导致内部实现细节的泄漏，降低测试用例的可维护性。更何况，React 渲染生成的 DOM 结构往往比组件树复杂，E2E 脚本定位元素时常会有偏差，需要反复调整。看来应用源码和测试用例代码之间存在着 Gap。
- 解决方式 可以利用 data-testid 字段。这个 HTML 元素字段并不属于哪个标准，但广泛被 Jest 等主流测试框架所采用。为html标签加入一个data-testid 属性，然后在测试用例中查询这个属性，这样就可以避免暴露 HTML 标签名这样的实现细节

## Test Pyramid
- 10% e2e(黑盒测试)
- 70% intergration test(黑盒测试)
- 20% unit test(白盒测试)

> 白盒测试也称为结构测试，主要用于检测软件编码过程中的错误。 程序员的编程经验、对编程软件的掌握程度、工作状态等因素都会影响到编程质量，导致代码错误。 黑盒测试又称为功能测试，主要检测软件的每一个功能是否能够正常使用。

## React Test
> React 单元测试的范围和目标
> - React 组件；
> - 自定义 Hooks；
> - Redux 的 Action、Reducer、Selector 等；
> - 其他。

*近年来 React 组件测试实践越来越丰富，根据实际需要，可以将父子组件写在同一个测试用例里，也可以组件带着自定义 Hooks 一起测。可以说，这已经逐渐模糊了组件单元测试和整合测试的界限。但类比连着真实数据库一起测的后端整合测试，前端 React 组件测试使用模拟（Mock）的比重还是很大的，所以这里依旧把组件测试归类到单元测试的范畴。*

### React 技术社区最为流行的单元测试框架是 Jest + RTL（React Testing Library）
开发测试用例时，你可以参照单元测试的[3A模式](https://wiki.c2.com/?ArrangeActAssert) : Arrange（准备）→ Act（动作）→ Assert（断言）。
#### 定位元素
- By Role : RTL 库的设计原则是：“你的测试代码越是贴近软件的真实用法，你从测试中得到的信心就越足。”所以 RTL 里的 API 设计，基本都不鼓励去深挖 DOM 结构这种实现细节。 findByRole 里的 Role 特指WAI-ARIA，即 W3C 推出的富互联网应用可访问性标准中的 Roles。HTML 里包括input在内的大部分标签都有默认的 Role，比标签名本身更具业务意义，具体可以参考这个[标准表格](https://www.w3.org/TR/html-aria/#docconformance)。
- By data-testid : 如果你实在手痒想用 CSS 选择器或者 XPath 来查找 DOM 节点，可以折中一下，为 HTML 标签加入 data-testid

#### 测试用例的内容
- 预期路径（Happy Path），
- 你还需要编写一些负向的用例（Negative Cases），用来测试出错的情况以及一些边界情况。

#### 如何避免渲染子组件，只focus在当前组件？
利用 Jest 的[模拟功能](https://zh-hans.reactjs.org/docs/testing-recipes.html#mocking-modules)，将被测组件所导入的其他组件替换成简化的模拟版本。

#### hooks unit test
可以使用RTL renderHook API，单元测试是不应该有副作用的。对于包含api call的hook，可以先用 jest.spyOn 方法将全局的 fetch 方法替换成了模拟函数，经过动作、断言，最后要记得把被替换的全局 fetch 方法还原。否则，有可能影响到其他测试用例。

## React Sub-Component设计模式的实现
- Child Component，用于描述在 React 运行时（Runtime）构建的组件树（元素树）中，组件与组件之间的父子关系
- Sub-components (附属组件/次级组件/副组件)，主要还是在描述设计时（Design-time）组件与组件间的强包含关系（Containment），而在运行时这些组件之间却不一定是父子关系

### sub-component实现示例
1. 在渲染时，这些真·子组件与其他自定义组件一样，会创建对应的 React 元素出来，但它们会导致元素树变得冗长。我们并不希望这样，而只想把它们当作是 Dialog 组件的一种扩展属性。这就需要在 Dialog 的 children 属性上做文章。首先基于 React.Children API，定义两个工具函数 findByType 和 findAllByType，用于选取 children 中特定类型的 React 元素
2. 然后在 Dialog 组件函数体中，定义渲染标题、正文和动作按钮的函数，并在返回的 JSX 中调用它们
```js
function findByType(children, type) {
  return React.Children.toArray(children).find(c => c.type === type);
}

function findAllByType(children, type) {
  return React.Children.toArray(children).filter(c => c.type === type);
}


const Dialog = ({ modal, onClose, children }) => {
  const renderTitle = () => {
    const subElement = findByType(children, Dialog.Title);
    if (subElement) {
      const { className, style, children } = subElement.props;
      return (<h1 {...{ className, style }}>{children}</h1>);
    }
    return null;
  };
  const renderContent = () => {
    const subElement = findByType(children, Dialog.Content);
    return subElement?.props?.children;
  };
  const renderButtons = () => {
    const subElements = findAllByType(children, Dialog.Action);
    return subElements.map(({ props: { onClick, children } }) => (
      <button onClick={onClick} key={children}>{children}</button>
    ));
  };
  return (
    <dialog open>
      <header>{renderTitle()}</header>
      <main>{renderContent()}</main>
      <footer>{renderButtons()}</footer>
    </dialog>
  );
};
Dialog.Title = () => null;
Dialog.Content = () => null;
Dialog.Action = () => null;
```
*更详细的例子请参考 Github 上 [Semantic-UI-React 的 v3 版本](https://github.com/Semantic-Org/Semantic-UI-React/tree/next-v3)。*
### sub-component实现的好处
1. 对于很多props的组件，sub-component将他们分类，使得dialog组件的props更加结构化、语义化
2. 降低组件 props 结构与组件内部实现的耦合
但除了使用sub-component，还可以通过别的方式实现这两个目标
1. 使用类似 JSON 这样的 DSL（Domain Specific Language）作为 props，让组件内部逻辑解析 DSL 来决定如何渲染；
2. 组件的组合（Composition）

## React 17/18 中的 react/jsx-runtime
> JSX 是 React.createElement 的语法糖。React 从 17 版本开始已经启用全新的 [JSX 运行时](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-automatic-runtime)来替代 React.createElement

在启用新 JSX 运行时的状态下，用代码编译器编译 JSX：
- 在生产模式下被编译成了 react/jsx-runtime 下的 jsx 或 jsxs （目前同 jsx ）；
- 在开发模式下 JSX 被编译成了 react/jsx-dev-runtime 下的 jsxDEV 。

作为编译输入，JSX 的语法没有改变，编译输出无论是 jsx-runtime 还是 React.createElement 函数，它们的返回值也同样都是 React 元素。可见，代码编译器为开发者隐藏了新旧 API 的差异。这个变化并不影响已有的对 JSX 的理解。另外，如果是开发者手工创建 React 元素，依旧应该调用 React.createElement 。这个 API 并不会被移除。而 jsx-runtime 代码只应由编译器生成，开发者不应直接调用这个函数。

引入新 JSX 运行时的动机主要是因为原有的 React.createElement 是为了类组件设计的，而目前函数组件已然成为主流，老接口限制了进一步的优化.与React.createElement 相比的变化包括：
- 自动导入；
- 在 props 之外传递 key 属性；
- 将 children 直接作为 props 的一部分；
- 分离生产模式和开发模式的 JSX 运行时。

