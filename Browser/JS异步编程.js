//Thunk(转换器)：任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式
const fs = require('fs');
//Normal Read File : fs.readFile(fileName,callback)
//Thunk Read File
function readFileThunk(fileName) {
 return callback=>fs.readFile(fileName,callback)   
}
readFileThunk('fileA')((err,data)=>{console.log('thunk',err,data)})

//Example 1 - Callback 基于回调函数的自动执行
//基于 Thunk 函数的 Generator 执行器：使用thunk函数用于generator的自动流程管理
// yield 命令用于将程序的执行权移出 Generator 函数，那么就需要一种方法，将执行权再交还给 Generator 函数。
//这种方法就是 Thunk 函数，因为它可以在回调函数里，将执行权交还给 Generator 函数

function* readFileGen() {
    const fileA = yield readFileThunk('fileA');
    console.log('fileA',fileA);
    const fileB = yield readFileThunk('fileB');
    console.log('fileB',fileB);
}
//Manually:可以发现 Generator 函数的执行过程，其实是将同一个回调函数，反复传入 next 方法的 value 属性。这使得我们可以用递归来自动完成这个过程。
const manualReadGen = readFileGen();
manualReadGen.next().value((err,data)=>{
    console.log(err,data)
    gen.next().value((err,data)=>{
        console.log(err,data)
    })
})
//Automatially via thunk
//Thunk 函数真正的威力，在于可以自动执行 Generator 函数。
//不管有多少个异步操作，直接传入 run 函数即可。当然，前提是每一个异步操作，都要是 Thunk 函数，也就是说，跟在 yield 命令后面的必须是 Thunk 函数
function run(generatorFunction) {
    const gen = generatorFunction();
    function next(err,data) {
        const ret = gen.next()
        if(ret.done){
            return
        }else{
            ret.value(next)
        }
    }
    next();
}
run(readFileGen)

//Eample 2 - Promise 基于promise的自动执行
function* fetchData() {//生成器函数 generatorFunction
    const response1 = yield fetch('https://www.geekbang.org') //yield 命令用于将程序的执行权移出 Generator 函数
    console.log('response1!!',response1)
    const response2 = yield fetch('https://www.geekbang.org/test')
    console.log('response2!!',response2)
}
//Manually:手动执行其实就是用 then 方法，层层添加回调函数
const manualFetchGen = fetchData();//执行生成器函数 返回生成器generator
manualFetchGen.next().value.then(resp1=>{
    manualFetchGen.next(resp1).value.then(resp2=>{
        manualFetchGen.next(resp2)
    })
})
//Automatially - 只要 Generator 函数还没执行到最后一步，next 函数就调用自身，以此实现自动执行
function co(generatorFunction) {
    const gen = generatorFunction();
    function next(data) {
        const ret = gen.next(data);
        if(ret.done){
            return ret.value
        }else{
            return ret.value.then(next)
        }
    }
    next()
}
co(fetchData)//通过使用生成器配合执行器，就能实现使用同步的方式写出异步代码了，这样也大大加强了代码的可读性。



