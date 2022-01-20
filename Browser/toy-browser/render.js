const images = require("images")

module.exports.render = function render(viewpoint,element){
    if(element.style){
        const elImg = images(element.style.width,element.style.height)
        if(element.style['background-color']){
            const reg = /rgb\((?:[ ]*)(\d{1,3})(?:[ ]*,[ ]*)(\d{1,3})(?:[ ]*,[ ]*)(\d{1,3})(?:[ ]*)\)/i;
            let color = element.style['background-color'] || 'rgb(238, 204, 55)';
            const [full,red,green,blue] = color.match(reg)
            elImg.fill(Number(red),Number(green),Number(blue))
        }
        viewpoint.draw(elImg,element.style.left||0,element.style.top||0)
    }
    if(element.children){
        for (const child of element.children) {
            render(viewpoint,child)
        }
    }
}