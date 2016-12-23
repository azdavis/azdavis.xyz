import tau from "./tau"

function angle(dx: number, dy: number): number {
    const a = Math.atan(dy / dx)
    return isNaN(a) ? 0
        : dx < 0 ? tau / 2 + a
        : a
}

export default angle
