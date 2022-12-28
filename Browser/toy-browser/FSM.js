
//Find abc
function start(char){
    if(char === 'a'){
        return findA
    }
    return start
}
function findA(char){
    if(char === 'b'){
        return findB
    }
    //return start Bug : can't handle 'aabc' pattern, in this case, keep char and let start check it again
    //严格的状态机最好不要这么写，而是应该给每个状态加上具体的代码，而不是代理到最初的状态
    return start(char)
}
function findB(char){
    if(char === 'c'){
        return end
    }
    //return start
    return start(char)
}
function end(char){
    return end
}

// function match(str){
//   let state = start
//   for (const char of str) {
//       state = state(char)
//   };
//   return state === end
// }
//console.log(match('I am aabcde f'))

//Find abababx
function start(char){
    if(char === 'a'){
        return findA
    }
    return start
}

function findA(char){
    if(char === 'b'){
        return findB
    }
    return start(char)
}

function findB(char){
    if(char === 'a'){
        return findA1
    }
    return start
}

function findA1(char){
    if(char === 'b'){
        return findB1
    }
    return start
}

function findB1(char){
    if(char === 'a'){
        return findA2
    }
    return start
}

function findA2(char){
    if(char === 'b'){
        return findB2
    }
    return start
}
function findB2(char){
    if(char === 'x'){
        return end
    }
    return start
}
function end(char){
    return end
}

function match(str){
    let state = start
    for (const char of str) {
        state = state(char)
    };
    return state === end
}
// console.log(match('I am abababx f'))
const test_true = ['abababx','aaabababx','abababxxxx','abxabababx','abababxabb','i and ababx ababxxx abababbx abababx'];
const test_false = ['abababbx','abaababx','abbababx','ababbabx','ababxabx','i and ababx ababxxx abababbx'];
test_false.map(s=>console.log(match(s)))

//TODO : Find custom pattern
function matchPattern(pattern,str){

}