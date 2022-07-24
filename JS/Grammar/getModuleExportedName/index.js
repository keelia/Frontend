const { parse } = require("@babel/parser");
const type = require("@babel/types");

const CODE = `
import {a as d, modify} from "./a.js";

export a from "a.js";
export * from "a.js";
export const name = 'square';

export function draw(ctx, length, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, length, length);

  return {
    length: length,
    x: x,
    y: y,
    color: color
  };
}


var a = {};
export default a;

export var b = 3;
`

const ast = parse(CODE, { sourceType: "module",plugins:['exportDefaultFrom'] });


for (const bodyNode of ast.program.body) {
    if(type.isExportDeclaration(bodyNode)){//https://babeljs.io/docs/en/babel-types#exportdeclaration
       console.log(bodyNode)
    }
}