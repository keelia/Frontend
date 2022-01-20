module.exports.layout = function layout(element){
    if(!element.computedStyle){
        return
    }
    const elementStyle = getStyle(element);
    if(elementStyle.display !== 'flex'){
        return 
    }
    const children = element.children.filter(child=>child.type === 'element');
    ['width','height'].forEach(size=>{
        if((elementStyle[size] === 'auto') || (elementStyle[size] === '')){
            elementStyle[size] = null;
        }
    });
    //preset for flex layout
    if(!elementStyle.flexDirection || elementStyle.flexDirection === 'auto'){
        elementStyle.flexDirection = 'row'
    }

    if(!elementStyle.flexWrap || elementStyle.flexWrap === 'auto'){
        elementStyle.flexWrap = 'nowrap'
    }

    if(!elementStyle.justifyContent || elementStyle.justifyContent === 'auto'){
        elementStyle.justifyContent = 'flex-start'
    }

    if(!elementStyle.alignItems || elementStyle.alignItems === 'auto'){
        elementStyle.alignItems = 'stretch'
    }

    if(!elementStyle.alignContent || elementStyle.alignContent === 'auto'){
        elementStyle.alignContent = 'stretch'
    }
    //set main-axis/cross-axis
    let mainSize,mainStart,mainEnd,mainBase,mainSign,crossSize,crossStart,crossEnd,crossBase,crossSign;
    if(elementStyle.flexDirection === 'row'){
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';

    }else if(elementStyle.flexDirection === 'row-reverse'){
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }else if(elementStyle.flexDirection === 'column'){
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }else if(elementStyle.flexDirection === 'column-reverse'){
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = elementStyle.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(elementStyle.flexWrap === 'wrap-reverse'){
       let temp = crossStart;
       crossStart = crossEnd;
       crossEnd = temp;
       crossSign = -1;
       crossBase = elementStyle[crossSize]
    }else{
        crossSign = +1;
        crossBase = 0;
    }
    //mainSize is autoSize 
    let isAutoSize = false;
    if(!elementStyle[mainSize]){
        elementStyle[mainSize] = 0;
        for (const child of children) {
            const childStyle = getStyle(child)
            if(childStyle[mainSize]!=='' ||(childStyle[mainSize] !== null) || (childStyle[mainSize] !== (void 0))){
                elementStyle[mainSize]+=childStyle[mainSize]
            }
        }
        isAutoSize = true;
    }

    //feed elements into flexLine
    let flexLine = [];//current flexLine
    const flexLines = [flexLine];
    let mainSpace = elementStyle[mainSize],crossSpace = 0;
    for (const child of children) {
        const childStyle = getStyle(child)
        if(!childStyle[mainSize]||(childStyle[mainSize] === '') || (childStyle[mainSize] === 'auto')){
            childStyle[mainSize] = 0;
        }
        if(childStyle.flex){
            //child can always feed into current flexLine
            flexLine.push(child)
        }else if((elementStyle.flexWrap === 'nowrap') || isAutoSize){
            mainSpace -= childStyle[mainSize];
            if(childStyle[crossSize]!=='' && (childStyle[crossSize] !== null) && (childStyle[crossSize] !== (void 0))) {
               crossSpace = Math.max(crossSpace,childStyle[crossSize]) 
            }
            flexLine.push(child)
        }else{
            if(childStyle[mainSize] > elementStyle[mainSize]){
                childStyle[mainSize] = elementStyle[mainSize]
            }
            if(mainSpace < childStyle[mainSize]){
                flexLine.mainSpace = mainSpace
                flexLine.crossSpace = crossSpace

                flexLine = [child]
                flexLines.push(flexLine)

                mainSpace = elementStyle[mainSize]
                crossSpace = 0;
            }else{
                flexLine.push(child)
            }
            mainSpace -= childStyle[mainSize];
            if(childStyle[crossSize]!=='' && (childStyle[crossSize] !== null) && (childStyle[crossSize] !== (void 0))) {
                crossSpace = Math.max(crossSpace,childStyle[crossSize]) 
             }
            
        }
    }
    flexLine.mainSpace = mainSpace;
    if(elementStyle.flexWrap === 'nowrap' || isAutoSize){
        flexLine.crossSpace = ((elementStyle[crossSize]!=='') && (elementStyle[crossSize] !== null) && (elementStyle[crossSize]!== (void 0))) ? 
            elementStyle[crossSize] : crossSpace
    }else{
        flexLine.crossSpace = crossSpace
    }
    //calculate main-axis position
    for (const line of flexLines) {
        let currentMain = mainBase;
        if(line.mainSpace < 0){ //when nowrap, aka one-line
            const scale = elementStyle[mainSize]/(elementStyle[mainSize] - line.mainSpace)
            for (const lineItem of line) {
                const lineItemStyle = getStyle(lineItem)
                if(lineItemStyle.flex){
                    lineItemStyle[mainSize] = 0
                }else{
                    lineItemStyle[mainSize] = lineItemStyle[mainSize] * scale;
                }
                
                lineItemStyle[mainStart] = currentMain
                lineItemStyle[mainEnd] = currentMain + mainSign*lineItemStyle[mainSize];
                currentMain = lineItemStyle[mainEnd]
            }
        }else{
            const flexCount = line.filter(lineItem=>!!getStyle(lineItem).flex).length
            if(flexCount > 0){
                for (const lineItem of line) {
                    const lineItemStyle = getStyle(lineItem)
                    if(lineItemStyle.flex){
                        lineItemStyle[mainSize] = mainSpace/flexCount;
                    }
                    lineItemStyle[mainStart] = currentMain
                    lineItemStyle[mainEnd] = currentMain + mainSign*lineItemStyle[mainSize];
                    currentMain = lineItemStyle[mainEnd]
                }
            }else{
                //should consider justity-content
                let slot = 0;
                if(elementStyle.justifyContent === 'flex-start'){
                    currentMain = mainBase
                    slot = 0
                }else if(elementStyle.justifyContent === 'flex-end'){
                    currentMain =mainBase + mainSign * mainSpace
                    slot = 0
                }else if(elementStyle.justifyContent === 'center'){
                    currentMain = mainBase + mainSign * mainSpace/2
                    slot = 0
                }else if(elementStyle.justifyContent === 'space-between'){
                    currentMain = mainBase;
                    slot = mainSpace/(line.length-1)
                }else if(elementStyle.justifyContent === 'space-around'){
                    slot = mainSpace/line.length
                    currentMain = mainBase + mainSign * slot/2;
                }else if(elementStyle.justifyContent === 'space-evenly'){
                    slot = mainSpace/(line.length+1)
                    currentMain = mainBase + mainSign * slot;
                }

                for (const lineItem of line) {
                    const lineItemStyle = getStyle(lineItem)
                    lineItemStyle[mainStart] = currentMain
                    lineItemStyle[mainEnd] = currentMain + mainSign*lineItemStyle[mainSize];
                    currentMain = lineItemStyle[mainEnd] + slot;
                }
            }
        }
    }

    //crossAxis - positions
    let totalCrossSlot =0;
    isAutoSize = false;
    if(!elementStyle[crossSize]){
        totalCrossSlot = 0;
        elementStyle[crossSize] = 0;
        for (const line of flexLines) {
            elementStyle[crossSize] += line.crossSpace
        }
        isAutoSize = true;
    }else{
        totalCrossSlot = elementStyle[crossSize]
        for (const line of flexLines) {
            totalCrossSlot -= line.crossSpace
        }
    }

    if(elementStyle.flexWrap === 'wrap-reverse'){
        crossBase = elementStyle[crossSize]
    }else{
        crossBase = 0;
    }
    let lineCrossSlot = 0;
    if(elementStyle.alignContent === 'flex-start'){
        crossBase +=0;//NOT crossBase = 0, consider wrap-reverse
        lineCrossSlot = 0;
    }else if(elementStyle.alignContent === 'flex-end'){
        crossBase += crossSign * elementStyle[crossSize]
        lineCrossSlot = 0;
    }else if(elementStyle.alignContent === 'center'){
        crossBase += crossSign * (totalCrossSlot/2)
        lineCrossSlot = 0;
    }else if(elementStyle.alignContent === 'space-between'){
        crossBase+=0;
        lineCrossSlot = totalCrossSlot/(flexLines.length - 1)
    }else if(elementStyle.alignContent === 'space-around'){
        lineCrossSlot = totalCrossSlot/flexLines.length
        crossBase+=(lineCrossSlot/2) * crossSign;
    }else if(elementStyle.alignContent === 'space-evenly'){
        lineCrossSlot = totalCrossSlot/flexLines.length+1
        crossBase+=lineCrossSlot * crossSign;
    }else if(elementStyle.alignContent === 'stretch'){
        crossBase +=0;
        lineCrossSlot = 0;
    }

    let currentCross = crossBase;
    for (const line of flexLines) {
        const lineCrossSize = (elementStyle.alignContent === 'stretch') ? line.crossSpace + (totalCrossSlot /flexLines.length): line.crossSpace;
        //Notice! strech不是每行一样高，而是在保证每行行高的基础上，在给它们加上均分的剩余空间
        for (const lineItem of line) {
            const lineItemStyle = getStyle(lineItem)
            //align-self will override align-content
            const align = lineItemStyle.alignSelf || elementStyle.alignItems;
            if(!lineItemStyle[crossSize]){
                lineItemStyle[crossSize] = align === 'stretch' ? lineCrossSize: 0;
            }
            if(align === 'stretch'){
                lineItemStyle[crossStart] = currentCross;
                lineItemStyle[crossEnd] = lineItemStyle[crossStart] + crossSign * lineItemStyle[crossSize];
            }else if(align === 'flex-start'){
                lineItemStyle[crossStart] = currentCross;
                lineItemStyle[crossEnd] = lineItemStyle[crossStart] + crossSign * lineItemStyle[crossSize];
            }else if(align === 'flex-end'){
                lineItemStyle[crossEnd] = currentCross + crossSign * lineCrossSize
                lineItemStyle[crossStart] = lineItemStyle[crossEnd] - lineItemStyle[crossSize];
            }else if(align === 'center'){
                lineItemStyle[crossStart] = currentCross + crossSign * ((lineCrossSize - lineItemStyle[crossSize])/2);
                lineItemStyle[crossEnd] = lineItemStyle[crossStart] + crossSign * lineItemStyle[crossSize];
            }
        }
        currentCross += crossSign * (lineCrossSize + lineCrossSlot)
    }
}

function getStyle(element){
    element.style = element.style || {}
    for (const property in element.computedStyle) {
        element.style[property] = element.computedStyle[property].value
        if(/px$/i.test(element.style[property])){
            element.style[property] = parseInt(element.style[property])
        }
        if(/^[0-9\.]+$/.test(element.style[property])){
            element.style[property] = parseInt(element.style[property])
        }
    }
    return element.style
}