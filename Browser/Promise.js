//Promise的标准用法 - 创建Promise对象myPromise，并在executor中执行业务逻辑
const executor = (resolve,reject)=>resolve();
const successCallback = _=>console.log('fulfilled!'), failureCallback=_=>console.log('rejected');
// const myPromise = new Promise(executor);
// myPromise.then(successCallback,failureCallback);

/**
 * 模拟浏览器实现Promise
 * 1. 创建的时候不需要传入成功或者失败结果的回调函数；并且resolve，reject函数作为构造函数的参数
 * 2. 能够返回.then函数用来绑定onFulfilled/onRejected回调函数
 * 3. 当调用resolve/reject函数时，调用onFulfilled/onRejected回调函数。
 *  3.1 在构造函数中运行resolve时，.then的回调函数还没绑定好，因此需要延迟调用回调函数
 *  3.2 两种方式实现延迟调用回调函数：宏任务/微任务
 */
//V0 - resolve调用之后立即执行回调函数
function Bromise0(executor=()=>{}){
    let _onFulfilled = null;
    let _onRejected = null;

    function resolve(value) {
        //resolve的时候 调用通过.then绑定的onFulfilled回调函数
        _onFulfilled(value)//TypeError: _onFulfilled is not a function - 因此需要一个延迟调用回调函数
    }

    function reject(value) {
        //reject的时候 调用通过.then绑定的onRejected回调函数
        _onRejected(value)
    }
    executor(resolve,reject);
    return {
        then:(onFulfilled, onRejected)=>{
            _onFulfilled = onFulfilled;
            _onRejected = onRejected;
        }
    }
};
//V1 - 宏任务 延迟执行回调函数 但代码效率不高
function Bromise1(executor=()=>{}){
    let _onFulfilled = null;
    let _onRejected = null;

    function resolve(value) {
        //resolve的时候 调用通过.then绑定的onFulfilled回调函数
        setTimeout(()=>{
            _onFulfilled(value)
        },0)
    }

    function reject(value) {
        //reject的时候 调用通过.then绑定的onRejected回调函数
        _onRejected(value)
    }
    executor(resolve,reject);
    return {
        then:(onFulfilled, onRejected)=>{
            _onFulfilled = onFulfilled;
            _onRejected = onRejected;
        }
    }
};
//V2 - 微任务 延迟执行回调函数 并提高了代码效率
function Bromise2(executor=()=>{}){
    let _onFulfilled = null;
    let _onRejected = null;

    function resolve(value) {
        //resolve的时候 调用通过.then绑定的onFulfilled回调函数
        queueMicrotask(()=>{
            _onFulfilled(value)
        })
    }

    function reject(value) {
        //reject的时候 调用通过.then绑定的onRejected回调函数
        _onRejected(value)
    }
    executor(resolve,reject);
    return {
        then:(onFulfilled, onRejected)=>{
            _onFulfilled = onFulfilled;
            _onRejected = onRejected;
        }
    }
};

// const myBromise = new Bromise(executor);
// myBromise.then(successCallback,failureCallback);

//V3 - Promise 回调返回值穿透技术/Chainable
function Bromise(executor=()=>{}){
    let _onFulfilled = null;
    let _onRejected = null;

    function resolve(value) {
        queueMicrotask(()=>{
            _onFulfilled(value)
        })
    }

    function reject(value) {
        _onRejected(value)
    }
    executor(resolve,reject);
    return {
        then:(onFulfilled, onRejected)=>{
            _onFulfilled = onFulfilled;
            _onRejected = onRejected;
            return new Bromise(resolve=>resolve(101))
        }
    }
};

// const onFulfilled = value=>{
//     console.log(`On Resolved:${value}`)
//     let ret = new Bromise(resolve=>resolve(value+1))
//     return ret;
// };
// const myBromise1 = new Bromise((resolve,reject)=>{
//     resolve(100)
// });
//const myBromise2 = myBromise1.then(onFulfilled)
// myBromise2.then(value=>console.log(`Chained:${value}`))

let x1 = new Promise(resolve=>resolve(100))
// let x2 = x1.then(value=>{
//     return new Promise(resolve=>resolve(value+1))
// })
let x2 = x1.then()
console.log(x2,x2===x1)
// x2.then(value=>{
//     console.log(value)
//     console.log(x2)
// })