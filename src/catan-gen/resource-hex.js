import Canvas from "./canvas"
import NumberDots from "./number-dots"
import ResourceColors from "./resource-colors"

class ResourceHex {
    constructor(resource, number) {
        this.resource = resource
        this.number = number
    }

    draw(x, y, r) {
        Canvas.drawHex(x, y, r, ResourceColors[this.resource])
        if (this.number === null) {
            return
        }
        const dots = NumberDots[this.number]
        const dotR = r / 40
        const dotMid = (dots - 1) / 2
        Canvas.drawCircle(x, y, r / 2.5, "#ddd")
        Canvas.cx.font = `${r / 35}em sans-serif`
        Canvas.cx.fillStyle = dots === 5 ? "#d22" : "#222"
        Canvas.cx.fillText(String(this.number), x, y - dotR)
        for (let i = 0; i < dots; i++) {
            Canvas.drawCircle(x + (i - dotMid) * dotR * 3, y + r / 4.5, dotR)
        }
    }
}

export default ResourceHex
