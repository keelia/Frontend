const existingIds = [];
export const MyElement = (tagName,props,...children)=>{
    if(typeof tagName === 'string'){
        let elId = props?.id || existingIds.length+1;
        let myEl = document.getElementById(elId);
        if(!myEl){
            myEl = document.createElement(tagName);
            myEl.id = elId
        }
        for (const childNode of children) {
            if(typeof childNode === 'string'){
                myEl.textContent = childNode
            }
        }
        return myEl;
    }else{
        //MyFragment
        const myFrag = tagName();
        for (const childNode of children) {
            myFrag.appendChild(childNode)
        }
        return myFrag
    }

}

export const MyFragment = ()=>{
    const myFrag = document.createElement('div');
    myFrag.className ='my-fragment'
    return myFrag
}

export const renderToDom = (root,...children)=>{
    for (const child of children) {
        root.appendChild(child)
    }
}