const {addCSSRules,computeCSS} = require('./cssParser')
const {layout} = require('./layout')
const EOF = Symbol('EOF');//end of file 标识文件结束。可以用这种技巧处理绝大多数需要带结束的场景，不然状态机会一直等着结束；

let stack = [{type:'document',children:[]}],currentTextNode=null;

module.exports.parseHTML = function parseHTML(html){//return dom tree
    try {
        let state = data
        for (const char of html) {
            state = state(char)
        }
        state = state(EOF);
        return stack[0]
    } catch (error) {
        console.error(error)
    }

}
let currentToken=null,currentAttr=null;
function data(char){
    if(char === '<'){
        return tagOpen
    }else if(char === EOF){
        emit(EOF)
        return data
    }else if(char === '&'){
        return new Error('Unexpected Token')
    }else{
        emit({
            type:"text",
            content:char
        })
        return data
    }
}
function tagOpen(char){
    if(/[a-zA-Z]/.test(char)){
        currentToken = {
            type:"startTag",
            tagName:''
        }
        return tagName(char)
    }else if(char === '/'){
        return endTagOpen
    }
    return new Error('Unexpected Token')
}

function endTagOpen(char){
    if(/[a-zA-Z]/.test(char)){
        currentToken = {
            type:"endTag",
            tagName:'',
        }
        return tagName(char)
    }
    return new Error('Unexpected Token')
}

function tagName(char){
    if(/[\t\n\f ]/.test(char)){
        return beforeAttrName
    }else if(char === '/'){
        return selfClosingTag
    }else if(char === '>'){
        emit(currentToken)
        currentToken = null
        return data
    }else if(char === EOF){
        return new Error('Unexpected Token')
    }
    currentToken.tagName+=char.toLowerCase();
    return tagName
}

function beforeAttrName(char){
    if(/[\t\n\f ]/.test(char)){
        return beforeAttrName
    }else if(/[/>]/.test(char) ||  char === EOF){
        return afterAttrName(char)
    }else if(char === '='){
        return new Error('Unexpected Token')
    }else{
        currentAttr = {
            attrName:'',
            attrValue:''
        }
        return attrName(char)
    }
}

function attrName(char){
    if(/[\t\n\f />]/.test(char) || char === EOF){
        return afterAttrName(char)
    }else if(char === '='){
        return beforeAttrValue
    }else if(/["'<]/.test(char)){
        return new Error('Unexpected Token')
    }else{
        currentAttr.attrName+=char.toLowerCase()
        return attrName
    }
}

function afterAttrName(char){
    if(/[\t\n\f ]/.test(char)){
        return afterAttrName
    }else if(char === '/'){
        return selfClosingTag
    }else if(char === '='){
        return beforeAttrValue
    }else if(char === '>'){
        currentToken[currentAttr.attrName] = currentAttr.attrValue
        emit(currentToken)
        return data
    }
}

function beforeAttrValue(char){
    if(/[\t\n\f ]/.test(char)){
        return beforeAttrValue
    }else if(char === '"'){
        return doubleQuotedAttrValue
    }else if(char === "'"){
        return singleQuotedAttrValue
    }else if(char ==='>'){
        return new Error('Unexpected Token')
    }else{
        return unQuotedAttrValue(char)
    }
}

function doubleQuotedAttrValue(char){
    if(char === '"'){
        return afterQuotedAttrValue
    }else if((char === EOF) || (char === '&')){
        return new Error('Unexpected Token')
    }else{
        currentAttr.attrValue+=char
        return doubleQuotedAttrValue
    }
}

function singleQuotedAttrValue(char){
    if(char === "'"){
        return afterQuotedAttrValue
    }else if((char === EOF) || (char === '&')){
        return new Error('Unexpected Token')
    }else{
        currentAttr.attrValue+=char
        return singleQuotedAttrValue
    }
}

function unQuotedAttrValue(char){
    if(/[\t\n\f ]/.test(char)){
        return beforeAttrName
    }else if((char === EOF) || (char === '&')){
        return new Error('Unexpected Token')
    }else if(char ==='>'){
        emit(currentToken)
        return data
    }else{
        currentAttr.attrValue+=char;
        return unQuotedAttrValue
    }
}

function afterQuotedAttrValue(char){
    if(/[\t\n\f ]/.test(char)){
        currentToken[currentAttr.attrName] = currentAttr.attrValue //Need submit currentAttr here to keep multiple attrs to currentToken
        return beforeAttrName
    }else if(char === '/'){
        currentToken[currentAttr.attrName] = currentAttr.attrValue //Need submit currentAttr here to keep multiple attrs to currentToken
        return selfClosingTag
    }else if(char === '>'){
        currentToken[currentAttr.attrName] = currentAttr.attrValue //Need submit currentAttr here to keep multiple attrs to currentToken
        emit(currentToken)
        return data
    }else{
        return new Error('Unexpected Token')
    }
}

function selfClosingTag(char){
    if(char === '>'){
        currentToken.isSelfClosing = true;
        emit(currentToken)
        currentToken = null
        return data
    }else{
        return new Error('Unexpected Token')
    }
}

function emit(token){
    let top = stack[stack.length-1]
    if(token.type ==='text'){
        if(currentTextNode){
            currentTextNode.content+=token.content
        }else{
            currentTextNode =  {
                type:"text",
                content:token.content
            }
            top.children.push(currentTextNode)
        }
    }else{
        if(token.type === 'startTag'){
            let element = {
                type:'element',
                tagName:token.tagName,
                children:[],
                attributes:[]
            }
            for (const key in token) {
                if((key!=='type') && (key!=='tagName')){
                    element.attributes.push({
                        attrName:key,
                        attrValue:token[key]
                    })
                }
            }
            
            top.children = top.children || [];
            top.children.push(element);
            element.parent = top;
            computeCSS(element)

            if(!token.isSelfClosing){
                stack.push(element)
            }else{
                layout(element)
            }
            currentTextNode = null
        }else if(token.type === 'endTag'){
            if(top.tagName !== token.tagName){
                return new Error('Start Tag doesn\'t match')
            }else{
                //Add CSS Rules here
                if(top.tagName === 'style'){
                    addCSSRules(top.children[0].content)
                }
                layout(top)
                stack.pop()
            }
            currentTextNode = null
        }
    }
}