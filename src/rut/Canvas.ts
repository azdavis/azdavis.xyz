module Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")

    const pxRatio = devicePixelRatio || 1

    let w: number
    let h: number
    export const center = {x: 0, y: 0}

    // resize the canvas to be the size of the window
    export function resize(): void {
        w = innerWidth
        h = innerHeight
        center.x = w / 2
        center.y = h / 2
        el.width = w * pxRatio
        el.height = h * pxRatio
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        cx.scale(pxRatio, pxRatio)
    }

    // clear the entirety of the canvas
    export function clear(): void {
        cx.clearRect(0, 0, w, h)
    }

    resize()
}

export default Canvas
