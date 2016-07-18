import Canvas from "./Canvas"

class ZoomText {
    private static text = "Rüt"
    private static font = (() => {
        const bs = getComputedStyle(document.body)
        return {
            family: bs.fontFamily,
            variant: bs.fontVariant,
        }
    })()
    // the text sits in the middle of a (w x h) box
    private static w = 5
    private static h = 1
    // the angle formed by a right triangle with legs w and h
    private static a = Math.atan(ZoomText.h / ZoomText.w)

    public size: number
    public dx: number
    public dy: number
    private x: number
    private y: number
    private color: string

    public constructor() {
        this.reset()
    }

    public reset(): void {
        this.color = `hsl(${Math.random() * 360}, 60%, 60%)`
        this.size = 1

        const a = Math.random() * 2 * Math.PI
        if (0 <= a && a < ZoomText.a || 2 * Math.PI - ZoomText.a < a) {
            this.dx = ZoomText.w
            this.dy = ZoomText.w * Math.tan(a)
        } else if (ZoomText.a <= a && a < Math.PI - ZoomText.a) {
            this.dx = ZoomText.h / Math.tan(a)
            this.dy = -ZoomText.h
        } else if (Math.PI - ZoomText.a <= a && a < Math.PI + ZoomText.a) {
            this.dx = -ZoomText.w
            this.dy = ZoomText.w * Math.tan(a)
        } else {
            this.dx = -ZoomText.h / Math.tan(a)
            this.dy = ZoomText.h
        }

        const s = 5 + Math.random() * 15
        this.dx *= s
        this.dy *= s
        this.getXY()
    }

    public move(): void {
        this.size *= 1.01
        this.getXY()
    }

    public draw(): void {
        Canvas.cx.font =
            `${ZoomText.font.variant} ${this.size}px ${ZoomText.font.family}`
        Canvas.cx.fillStyle = this.color
        Canvas.cx.fillText(ZoomText.text, this.x, this.y)
    }

    public isOutOfBounds(): boolean {
        const hw = ZoomText.w * this.size / 2
        const hh = ZoomText.h * this.size / 2
        return this.x + hw < 0
            || this.x - hw > Canvas.w
            || this.y + hh < 0
            || this.y - hh > Canvas.h
    }

    private getXY(): void {
        this.x = Canvas.w / 2 + this.size * this.dx
        this.y = Canvas.h / 2 + this.size * this.dy
    }
}

export default ZoomText