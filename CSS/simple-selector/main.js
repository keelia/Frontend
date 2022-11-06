//id type universal class attribute pseudo-class
function querySelctor(selector,dom) {
    const regs = {
        universal:/^\s*[*]\s*/,
        id:/^\s*[#](\w+(\w|\d)*)\s*/,
        class:/^\s*[.](\w+(\w|\d)*)\s*/,
        tag:/^\s*(\w+(\w|\d)*)\s*/,
        pseudoClass:/^\s*[:](\w+(-\w)?\w*)(\(\))?\s*/,
    }
    if(regs.universal.test(selector)){
        return dom.firstChild
    }else if(regs.id.test(selector)){
        for (const child of dom.children) {
            if(child.id === selector.match(regs.id)[1]){
                return child
            }
        }
    }else if(regs.class.test(selector)){
        for (const child of dom.children) {
            if(child.classList.contains(selector.match(regs.class)[1])){
                return child
            }
        }
    }else if(regs.tag.test(selector)){
        for (const child of dom.children) {
            if(child.tagName.toLowerCase() === selector.match(regs.tag)[1]){
                return child
            }
        }
    }else if(regs.pseudoClass.test(selector)){
        return selector.match(regs.pseudoClass)?.[1]
    }
}
module.exports.querySelctor = querySelctor;

