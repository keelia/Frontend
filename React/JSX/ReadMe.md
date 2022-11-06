# Play around JSX without using React
1. Use babel to transform jsx to js without using React.createElement/React.Fragment, using MyToReact instead.
- Configure customized pragma/pragmaFrag in package.json"
- Write a jsx code file withMyToyReact.js
- Import MyToyReact's MyElement, MyFragment
- npm run compile to transfer it to main.js
2. npm run start to webpack serve compiled main.js