import Sprite from './sprite'

class Player extends Sprite {
    protected speed = 1
    protected hyp = Math.sqrt(2 * Math.pow(this.speed, 2))
    fill = '#4b4'
    dir = {
        lt: false,
        up: false,
        rt: false,
        dn: false
    }

    constructor() {
        super(0, 0)
    }

    move(): void {
        let dx = 0
        let dy = 0
        if (this.dir.lt)
            dx -= this.speed
        if (this.dir.up)
            dy -= this.speed
        if (this.dir.rt)
            dx += this.speed
        if (this.dir.dn)
            dy += this.speed
        if (this.x + dx < 0 || this.x + dx > window.innerWidth - this.width)
            dx = 0
        if (this.y + dy < 0 || this.y + dy > window.innerHeight - this.height)
            dy = 0
        if (dx && !dy)
            dx *= this.hyp
        if (dy && !dx)
            dy *= this.hyp
        super.move(dx, dy)
    }
}

export default Player
