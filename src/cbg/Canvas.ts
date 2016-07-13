module Canvas {
    const el = document.querySelector("canvas") as HTMLCanvasElement
    export const cx = el.getContext("2d")
    const container = document.querySelector("#container") as HTMLElement
    const btns = document.querySelector("#btns") as HTMLElement

    const pxRatio = devicePixelRatio || 1
    const i = x => parseInt(x, 10)

    // resize the canvas to the given w and h while still fitting completely in
    // its container
    export function resize(w: number, h: number): void {
        const p = i(getComputedStyle(document.body).paddingTop)
                + i(getComputedStyle(document.body).paddingBottom)
        const b = i(getComputedStyle(btns).height)
                + i(getComputedStyle(btns).marginBottom)
        const ch = innerHeight - p - b
        const cw = innerWidth - p
        const scale = Math.min(cw / w, ch / h)

        cx.clearRect(0, 0, w, h)
        container.style.width = `${cw}px`
        container.style.height = `${ch}px`
        el.width = scale * w * pxRatio
        el.height = scale * h * pxRatio
        el.style.width = `${scale * w}px`
        el.style.height = `${scale * h}px`
        cx.scale(scale * pxRatio, scale * pxRatio)
    }
}

export default Canvas
