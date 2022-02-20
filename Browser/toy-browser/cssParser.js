const css = require('css')
const CssSelectorParser = require('css-selector-parser').CssSelectorParser,
cssSelectorparser = new CssSelectorParser();
// parser.registerSelectorPseudos('has');
cssSelectorparser.registerNestingOperators('>', '+', '~');
cssSelectorparser.registerAttrEqualityMods('^', '$', '*', '~');
cssSelectorparser.enableSubstitutes();

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
        for (const ruleSelector of rule.selectors) {
            const matched = match(ruleSelector,element)
            if(matched){
                //add style rules to element
                for (const declaration of rule.declarations) {
                    element.computedStyle[declaration.property] = element.computedStyle[declaration.property] || {}
                    if(element.computedStyle[declaration.property].specificity){
                        const existsSP = element.computedStyle[declaration.property].specificity;
                        const comingSP = specificity(ruleSelector);
                        if(spCompare(existsSP,comingSP)<0){
                            element.computedStyle[declaration.property].specificity = specificity(ruleSelector)
                            element.computedStyle[declaration.property].value = declaration.value
                        }
                    }else{
                        element.computedStyle[declaration.property].specificity = specificity(ruleSelector)
                        element.computedStyle[declaration.property].value = declaration.value
                    }
                    
                }
            }
        }
    }
}

const IncludeOperater = '*=', EndingOperator = '$=', WordOperator = '~=';EqualOperator = '='

// tag class attr id
// combinator space > ~ +
function match(selector,element){

    const parsedSelector = cssSelectorparser.parse(selector)

    const isSelectorRuleMatched = (rule,el)=>{
        if(!rule || !el){
            return
        }
        let ruleMatched = true;
        const propNames = Object.getOwnPropertyNames(rule)
        for (const ruleProp of propNames) {
            if (ruleMatched) {
                let ruleValue = rule[ruleProp];
                switch (ruleProp) {
                    case 'classNames':
                        ruleValue = ruleValue.filter(clsN=>!!clsN)
                        const clsValues = el.attributes.find(attr=>attr.attrName === 'class')?.attrValue.split(' ').map(clsName=>clsName.trim()).filter(n=>!!n)
                        ruleMatched = (!clsValues?.length && !ruleValue.length) || ruleValue.every(cls=>clsValues?.includes(cls))
                        break
                    case 'pseudos':
                        //TODO
                        break
                    case 'id':
                        const idAttr = el.attributes.find(attr=>attr.attrName === 'id')
                        ruleMatched = idAttr && (idAttr.attrValue === ruleValue)
                        break
                    case 'attrs':
                        for (const attr of ruleValue) {
                            if(attr.value){
                                const elAttr = el.attributes.find(elAttr=>(elAttr.attrName === attr.name))
                                switch (attr.operator) {
                                    //'^', '$', '*', '~'
                                    case '*=':
                                        ruleMatched = elAttr.attrValue?.includes(attr.value)
                                        break;
                                    case '^=':
                                        ruleMatched = elAttr.attrValue?.startsWith(attr.value)
                                        break;
                                    case '$=':
                                        ruleMatched = elAttr.attrValue?.endsWith(attr.value)
                                        break;
                                    case '~=':
                                        ruleMatched = elAttr.attrValue?.split(' ').some(v=>v===attr.value)
                                        break;
                                    default:
                                        ruleMatched = elAttr.attrValue === attr.value
                                        break;
                                }
                            }else{
                                ruleMatched = el.attributes.some(elAttr=>(elAttr.attrName === attr.name) && !elAttr.attrValue)
                            }
                        }
                        break
                    case 'tagName':
                        ruleMatched = el.tagName === ruleValue
                        break
                    default:
                        break;
                }
            }else{
                break
            }
        }
        return ruleMatched
    }

    if(parsedSelector.type === 'ruleSet'){
        let selectorSegments = [parsedSelector.rule]
        let currentRule = parsedSelector.rule
        while (currentRule.rule) {
            selectorSegments.push(currentRule.rule)
            currentRule = currentRule.rule
        }
        selectorSegments.reverse()
        if(selectorSegments.length === 1){
            return isSelectorRuleMatched(selectorSegments[0],element)
        }else{
            if(!isSelectorRuleMatched(selectorSegments[0],element)){
                return false
            }else{
                let combinatorMatched = true;
                let currentElement = element;
                for (let i = 1; i < selectorSegments.length; i++) {
                    const selectorSegment = selectorSegments[i]
                    if(combinatorMatched){
                        const siblings = element.parent?.children?.filter(child=>child.type === 'element')
                        const currentElIndex = siblings.findIndex(sibling=>sibling === currentElement)
                        switch (selectorSegments[i-1].nestingOperator) {
                            case '+'://adjacent sibling combinator
                                combinatorMatched = isSelectorRuleMatched(selectorSegment,siblings[currentElIndex-1])
                                break;
                            case '~'://general-sibling-combinator
                                let m = false
                                for (let index = 0; index < currentElIndex; index++) {
                                    const sibling = siblings[index];
                                    if(isSelectorRuleMatched(selectorSegment,sibling)){
                                        m = true;
                                        break;
                                    }
                                    
                                }
                                combinatorMatched = m;
                                break
                            case '>': //child combinator
                                combinatorMatched = isSelectorRuleMatched(selectorSegment,currentElement.parent)
                                break
                            default: //descendant combinator
                                const elements = [currentElement];
                                while(elements[elements.length-1]?.parent) {
                                    elements.push(elements[elements.length-1].parent) 
                                }
                                let j = 1;
                                for (let i = 0; i < elements.length; i++) {
                                    if(isSelectorRuleMatched(selectorSegments[j],elements[i])){
                                        j++
                                    }
                                }
                                combinatorMatched = j >= selectorSegments.length
                                break;
                        }
                    }
                }
                return combinatorMatched
            }
        }
    }
}

function specificity(selector){
    const parsedSelector = cssSelectorparser.parse(selector)
    const getRuleSpecificity = rule=>{
        const sp = [0,0,0,0] //inline/id/class/tag
        const propNames = Object.getOwnPropertyNames(rule)
        for (const ruleProp of propNames) {
            const ruleValue = rule[ruleProp];
            switch (ruleProp) {
                case 'classNames':
                    sp[2]+=ruleValue.length
                    break
                case 'id':
                    sp[1]++
                    break
                case 'tagName':
                    sp[3]++
                    break
                default:
                    break;
            }
        }
        return sp
    }
    if(parsedSelector.type === 'ruleSet'){
        let selectorSegments = [parsedSelector.rule]
        let currentRule = parsedSelector.rule
        while (currentRule.rule) {
            selectorSegments.push(currentRule.rule)
            currentRule = currentRule.rule
        }
        const sp= [0,0,0,0]
        for (const selectorSegment of selectorSegments) {
            const _sp = getRuleSpecificity(selectorSegment);
            sp[0]+=_sp[0];
            sp[1]+=_sp[1];
            sp[2]+=_sp[2];
            sp[3]+=_sp[3];
        }
        return sp
    }
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