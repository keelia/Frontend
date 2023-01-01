let jack = {
    name : "jack.ma",
    age:40,
    like:{
        dog:{
            color:'black',
            age:3,
        },
        cat:{
            color:'white',
            age:2
        }
    }
}

let jack2 = copy(jack)

//比如修改jack2中的内容，不会影响到jack中的值
jack2.like.dog.color = 'green'
console.log(jack.like.dog.color) //打印出来的应该是 "black"

// function copy(src){
//     function copyLayer(obj) {
//         if((typeof obj === 'object') && obj!==null){
//             return Object.keys(obj).reduce((a,sourceKey)=>({
//                 ...a,
//                 [sourceKey]:copyLayer(obj[sourceKey])
//             }),{})
//         }else{}
//         return obj
//     };
//     return copyLayer(src)
// }

// function copy(src){//缺点：无法拷贝函数
//     return JSON.parse(JSON.stringify(src || {}))
// }
