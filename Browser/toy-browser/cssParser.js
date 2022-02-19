const css = require('css')
let rules = [];
module.exports.addCSSRules = (cssStr)=>{
    const cssAST = css.parse(cssStr);
    rules.push(...cssAST.stylesheet.rules)
}

module.exports.computeCSS = (element)=>{
    // if(['html','head','style'].includes(element.tagName) ){
    //     return
    // }
    element.computedStyle = element.computedStyle || {};
    let elements = [element];
    while(elements[elements.length-1]?.parent) {
        elements.push(elements[elements.length-1].parent) 
    }
    for (const rule of rules) {
        const selectorSegments = rule.selectors[0].split(' ').reverse();
        if(!match(selectorSegments[0],element)){
            continue
        }
        let j = 1,matched= false
        for (let i = 1; i < elements.length; i++) {
            if(match(selectorSegments[j],elements[i])){
                j++
            }
        }
        if(j >= selectorSegments.length){
            matched = true
        }
        if(matched){
            //add style rules to element
            // console.log('Element',element,'Matched',rule)
            //element.computedStyle[declaration.property].specificity = 
            for (const declaration of rule.declarations) {
                element.computedStyle[declaration.property] = element.computedStyle[declaration.property] || {}
                if(element.computedStyle[declaration.property].specificity){
                    const existsSP = element.computedStyle[declaration.property].specificity;
                    const comingSP = specificity(rule.selectors[0]);
                    if(spCompare(existsSP,comingSP)<0){
                        element.computedStyle[declaration.property].specificity = specificity(rule.selectors[0])
                        element.computedStyle[declaration.property].value = declaration.value
                    }
                }else{
                    element.computedStyle[declaration.property].specificity = specificity(rule.selectors[0])
                    element.computedStyle[declaration.property].value = declaration.value
                }
                
            }
        }
    }
}

function match(selector,element){
    //. # tagName > [attr=value]
    if(!selector || !element?.attributes){
        return
    }
    selector = selector.trim();
   if(selector.charAt(0) === '#'){
        const idAttr = element.attributes.find(attr=>attr.attrName === 'id')
        return idAttr && (idAttr.attrValue === selector.replace('#',''))
   }else if(selector.charAt(0) === '.'){
        const clsAttr = element.attributes.find(attr=>attr.attrName === 'class')
        //TODO multiple class supports
        return clsAttr && (clsAttr.attrValue === selector.replace('.',''))
   }else{
       return element.tagName === selector
   }
   //TODO combined selector support
}

function specificity(selector){
    const sp = [0,0,0,0] //inline/id/class/tag
    selector = selector.trim();
    const selectorSegments = selector.split(' ')
    for (const selectorSegment of selectorSegments) {
        if(selectorSegment.charAt(0) === '#'){
            sp[1] += 1
       }else if(selector.charAt(0) === '.'){ //TODO multiple class supports
            sp[2] += 1
       }else{
            sp[3] += 1
       }
    }
    return sp
    //TODO combined selector support
}

function spCompare(sp1,sp2){
    if(sp1[0]!==sp2[0]){
        return sp1[0]-sp2[0]
    }else if(sp1[1]!==sp2[1]){
        return sp1[1]-sp2[1]
    }else if(sp1[2]!==sp2[2]){
        return sp1[2]-sp2[2]
    }else{
        return sp1[3]-sp2[3]
    }
}