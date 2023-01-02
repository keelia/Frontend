/** Compilation = bnf - lexical(token)->grammar(ast)->interpreter(evaluation)
 * <Expression ::= <AdditiveExpression><EOF>
 * <AddtiveExpression> ::= <MultiplicativeExpression>
 *                         <AddtiveExpression> <+> <MultiplicativeExpression>
 *                         <AddtiveExpression> <-> <MultiplicativeExpression>
 * <MultiplicativeExpression> :: = Number
 *                                 <MultiplicativeExpression> <*>  Number
 *                                 <MultiplicativeExpression> </> Number
 * 
 * */

const exp = '12 + 20 * 34';
const EOF = Symbol('EOF');

const parse = function(expInput){
    let token = null;
    const tokens = [];
    let state = start
    for (const char of expInput.split('')) {
        state = state(char)
    }
    state(EOF)

    function start(char) {
        if(['1','2','3','4','5','6','7','8','9','0'].some(s=>s ===  char)){
            token = {
                type:'Number',
                content:char
            }
            return inNumber
        }else if(['+','-','*','/'].some(o=>o === char)){
            if(token){
                emitToken(token)
            }
            emitToken({
                type:'Operator',
                content:char
            })
            return start
        }else if(char === EOF){
            if(token){
                emitToken(token)
            }
            emitToken({
                type:EOF
            })
        }
        return start
    }
    function inNumber(char) {
        if(['1','2','3','4','5','6','7','8','9','0'].some(s=>s ===  char)){
            token.content += char
            return inNumber
        }
        return start(char)
    }

    function emitToken(token) {
        tokens.push(token)
        token = null
    }
    return tokens
}

const source = parse(exp);
AdditiveExpression(source)
function AdditiveExpression(source){//merge rootNode to newNode
    let node
    if(source[0].type === 'MultiplicativeExpression'){
        node = {
            type:'AdditiveExpression',
            children:[]
        }
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }else if(source[0].type === 'AdditiveExpression' && source[1]?.content === '+'){
        node = {
            type:'AdditiveExpression',
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }else if(source[0].type === 'AdditiveExpression' && source[1]?.content === '-'){
        node = {
            type:'AdditiveExpression',
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return AdditiveExpression(source)
    }else{
        if(source[0].type === 'AdditiveExpression'){
            return source
        }
        MultiplicativeExpression(source)
        return AdditiveExpression(source)
    }
}

function MultiplicativeExpression(source){
    let node
    if(source[0].type === 'Number'){
        node = {
            type:'MultiplicativeExpression',
            children:[]
        }
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }else if(source[0].type === 'MultiplicativeExpression' && source[1]?.content === '*'){
        node = {
            type:'MultiplicativeExpression',
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        MultiplicativeExpression(source)
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }else if(source[0].type === 'MultiplicativeExpression' && source[1]?.content === '/'){
        node = {
            type:'MultiplicativeExpression',
            children:[]
        }
        node.children.push(source.shift())
        node.children.push(source.shift())
        source.unshift(node)
        return MultiplicativeExpression(source)
    }else{
        if(source[0].type === 'MultiplicativeExpression'){
            return source
        }
        return MultiplicativeExpression(source)
    }
}

Expression(source)

function Expression(source) {
    let node
    if(source[0].type === 'AdditiveExpression' && source[1]?.type === EOF){
        node = {
            type:'Expression',
            children:[source.shift(),source.shift()]
        }
        source.unshift(node)
        return source
    }else{
        AdditiveExpression(source)
        return Expression(source)
    }
}

function evaluate(node) {
    if(node.type === 'Expression'){
        return evaluate(node.children[0])
    }else if(node.type === 'AdditiveExpression'){
        if(node.children[1]?.type === 'Operator'){
            if(node.children[1].content === '+'){
                return evaluate(node.children[0]) + evaluate(node.children[2]) 
            }else if(node.children[1].content === '-'){
                return evaluate(node.children[0]) - evaluate(node.children[2]) 
            }
        }else if(node.children[0]?.type ==='MultiplicativeExpression'){
            return evaluate(node?.children[0])
        }
    }else if(node.type === 'MultiplicativeExpression'){
        if(node.children[1]?.type === 'Operator'){
            if(node.children[1].content === '*'){
                return evaluate(node.children[0]) * evaluate(node.children[2]) 
            }else if(node.children[1].content === '/'){
                return evaluate(node.children[0]) / evaluate(node.children[2]) 
            }
        }else if(node.children[0]?.type ==='Number'){
            return Number(node.children[0].content)
        }
    }
}
console.log('sss',evaluate(source[0]))
console.log(source)

