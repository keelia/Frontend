# Create own React App without CRA(project scafolding tool)
## Basic functions of CRA
- 基于 Webpack(bundler静态模块打包器) 的开发服务器和生产环境构建；
- 用 Babel 做代码转译（Transpile）；
- 基于 Jest 和 @testing-library/react 的自动化测试框架；
- ESLint 代码静态检查；
- 以 PostCSS 为首的 CSS 后处理器。
## Build a React App
### Tech Stack
- NodeJS
- NPM
- React
- 3rd-party libs, e.g. css-in-js libs(emotions)
- Browser

### Project Init
- git init
- npm initall Build tool [Vite](https://cn.vitejs.dev/guide/why.html#the-problems)
    - *Vite also provides project-scaffolding-tool npm [create-vite](https://www.npmjs.com/package/create-vite), which isn's used for this project.*
    - npm i -D vite
    - Config package.json
        - "start": "vite dev --open"
        - "build": "vite build",
- Create React app's index.html in project's [root](https://cn.vitejs.dev/guide/#index-html-and-project-root) folder
> 你可能已经注意到，在一个 Vite 项目中，index.html 在项目最外层而不是在 public 文件夹内。这是有意而为之的：在开发期间 Vite 是一个服务器，而 index.html 是该 Vite 项目的入口文件。

### Config React in Project
- Intall React : npm install react react-dom
- Install Vite react plugin [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) :npm i -D @vitejs/plugin-react
- create [vite.config.js](https://cn.vitejs.dev/config/#configuring-vite)

### Write JSX
- create src/index.jsx

> The reason Vite requires .jsx extension for JSX processing is because in most cases plain .js files shouldn't need full AST transforms to work in the browser. Allowing JSX in .js files means every served file must be full-AST-processed just in case it contains JSX.

### Linting(代码静态检查) - [ESLint](https://eslint.org/)
> 代码静态检查（Linting）是通过静态代码分析，为开发者指出代码中可能的编程错误和代码风格问题，并提出修改建议
- npm init @eslint/config -y ; choose to check sytax.find problems, and enforce code style; popular airbnb style;
- config lint npm in package.json lint:eslint 
- npm run lint
- 自动修正 ： npm run lint -- --fix

#### Lint rules
- 禁止不被使用的表达式 [no-unused-expressions](https://eslint.org/docs/latest/rules/no-unused-expressions)
- 禁止在函数内部修改函数参数, 除了evt（e.g.dropEffect）[no-param-reassign](https://eslint.org/docs/latest/rules/no-param-reassign)
- [disable "React' must be in scope when using JSX" rule](https://github.com/jsx-eslint/eslint-plugin-react/blob/HEAD/docs/rules/react-in-jsx-scope.md#when-not-to-use-it) *'react/react-in-jsx-scope': 0*

### Git Hook - 代码必须通过 Lint 和 Test，否则禁止提交
#### Intall Husky
- [install git hook tool into project](https://www.npmjs.com/package/husky-init): npx husky-init && npm install
- package.json 中额外加入一个 lint-staged
- 在新加入的 .husky/pre-commit 中把默认的 npm test 改为 npm run lint-staged，这样之后加 Git Hook 只要改 package.json 就可以了
- 测试husky precomit是否生效：git add . git commit -m "Husky"
#### Install [lint-staged](https://www.npmjs.com/package/lint-staged)
> 这个工具会保证只检查需要提交的文件，而不是所有文件
- npm install --save-dev lint-staged