import {canvas} from "../base/dom"

module Canvas {
    export const el = canvas()
    export const cx = el.getContext("2d") as CanvasRenderingContext2D

    const pxRatio = devicePixelRatio || 1

    export let w: number
    export let h: number

    // resize this and set some text properties
    export function reset(): void {
        resize()
        cx.textAlign = "center"
        cx.textBaseline = "middle"
    }

    // resize the canvas to be the size of the window
    function resize(): void {
        w = innerWidth
        h = innerHeight
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

    reset()
}

export default Canvas
