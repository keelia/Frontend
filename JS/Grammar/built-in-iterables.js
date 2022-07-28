//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#built-in_iterables
//String, Array, TypedArray, Map, Set, and Intl.Segments are all built-in iterables, because each of their prototype objects implements an @@iterator method. In addition, the arguments object and some DOM collection types such as NodeList are also iterables.


const TypedArray = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    BigInt64Array,
    BigUint64Array
];
const BuiltInIterables = [String,Array,Map,Set]
const InstanceIterables = Intl.Segmenter

console.log(BuiltInIterables.every(o=>o.prototype.hasOwnProperty(Symbol.iterator)))
console.log(TypedArray.every(o=>o.prototype.__proto__.hasOwnProperty(Symbol.iterator)))
console.log((new InstanceIterables()).segment().__proto__.hasOwnProperty(Symbol.iterator))


const forOfIterable = (clazz,callback=()=>{},...config)=>{
    let iterableObj = new clazz(...config);
    iterableObj = callback(iterableObj) || iterableObj;
    console.log(iterableObj)
    // const iterator = iterableObj[Symbol.iterator]();
    // let item = iterator.next();
    // while (!item.done) {
    //     item = iterator.next();
    // }
    for (const item of iterableObj) {
        console.log(item);
    }
}

// forOfIterable(String,void 0,'123');
// forOfIterable(Array,void 0,1,'2',Symbol('abc'));
// forOfIterable(Int8Array,void 0,function*() { yield* [4, 2, 3]; }());
// forOfIterable(Uint8Array,void 0,5);
// forOfIterable(Int16Array,void 0,new Int16Array([21, 31]));
// forOfIterable(Uint16Array,void 0,new ArrayBuffer(16),2,4);
// forOfIterable(Uint16Array,void 0,new ArrayBuffer(16),2,4);
// forOfIterable(Int32Array,void 0,new ArrayBuffer(16));
// forOfIterable(Uint32Array,void 0,new ArrayBuffer(8));
// forOfIterable(Float32Array,void 0,new ArrayBuffer(8));
// forOfIterable(Float64Array,void 0,new ArrayBuffer(8));
// forOfIterable(BigInt64Array,void 0,new ArrayBuffer(16));
// forOfIterable(BigUint64Array,void 0,new ArrayBuffer(32));
// forOfIterable(Map,instance=>{
//     instance.set(1,'one')
//     instance.set(2,'two')
//     instance.set(3,'three')
// });
// forOfIterable(Set,instance=>instance.add(Symbol('set')),'hello world');
// forOfIterable(Intl.Segmenter,instance=>{
//     const str = "你好，我是开心果。";
//     const segments = instance.segment(str);
//     //console.table(Array.from(segments));
//     return segments
// },'zh-Hans-CN', { granularity: 'word' });

// function forOf(a) {
//     for (const argument of arguments) {
//         console.log(argument)
//     }
// }
// forOf(1,2,3,4)


