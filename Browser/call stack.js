//Stack overflow
function runStack (n) {
    if (n === 0) return 100;
    return runStack( n- 2);
  }
runStack(50000);

//Optimaze - for loop
function runStack(n) {
    for (let index = n; index >=0; index=index-2) {
        if(index === 0){
            return 100
        }
    }
};
console.log(runStack(50000))

// function runStack(n) {
//     function* gen(n) {
//         for (let index = n; index >=0; index=index-2) {
//             if(index === 0){
//                 return 100
//             }
//             yield index
//         }
//     }
//     const it = gen(n);
//     // let result = it.next();
//     // while (!result.done) {
//     //     result = it.next()
//     // }
//     // return result.value
//     let ret;
//     for (const item of it) {
//         ret = item
//     }
//     return ret

// };
// console.log(runStack(10))


// function produceIterator(n) {
//     let index = n;
//     return {
//         next:()=>{
//             if(index === 0){
//                 return{
//                     done:true,
//                     value:100
//                 }
//             }
//             let value = index;
//             index-=2;
//             return {
//                 done:false,
//                 value
//             }
//         }
//     }
// };
// const it = produceIterator(10);
// for (const item of it) {
//     console.log(item)
// }

const makeIterator = (start = 0,end = Infinity,step=2)=>{
    let nextIndex = start;
    let iterationCount = 0;
    return {
        next:()=>{
            if(nextIndex >= end){
                return {
                    done:true,
                    value:iterationCount
                }
            }else{
                let value = nextIndex;
                nextIndex +=step;
                iterationCount++
                return {
                    done:false,
                    value
                }
            }
        },
        [Symbol.iterator]:()=>{
            console.log(this)
            return this
        },
        // [Symbol.iterator](){
        //     console.log(this)
        //     return this
        // }
    }
}

const it = makeIterator(1,10);
console.log(it[Symbol.iterator],it[Symbol.iterator]())

// let result = it.next();
// while (!result.done) {
//     console.log(result.value)
//     result = it.next();
// }
// console.log("Iterated over sequence of size: ", result.value); 


// for (const item of it) {
// console.log('made to for of',item)
// }

// // function* makeIterator(start = 0,end = Infinity,step=2){
// //     let iterationCount = 0;
// //     for (let index = start; index < end; index+=step) {
// //         yield index;
// //     }
// //     return iterationCount;
// // };
// // const it = makeIterator(1,10);

// // for (const item of it) {
// //     console.log(item)
// // }

// // for (const item of it) {
// //     console.log('again',item)
// // }
// // console.log(it[Symbol.iterator]() === it)

// function* gen() {
//     yield* ['a', 'b', 'c'];
//   }
//   let item = gen();
// console.log(item.next())
// console.log(item.next())
// console.log(item.next())
// console.log(item.next())







