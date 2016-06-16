import Bullet from "./bullet"
import Sprite from "./sprite"

class Player extends Sprite {
    public w = 50
    public h = 50
    public speed = 6
    public fill = "#4b4"
    public bullets: Bullet[]
    public maxLives = 3
    public maxAmmo = 9
    public lives: number
    public ammo: number
    public dirs = {
        lt: false,
        up: false,
        rt: false,
        dn: false,
    }

    // put this just outside of the canvas, since x and y are set later by the
    // canvas dimensions
    public constructor() {
        super(0, 0)
        this.x -= this.w
        this.y -= this.h
    }

    // if this is moving and has ammo, make a new Bullet which moves in the
    // direction of movement and decrement ammo, otherwise, noop
    public shoot(): void {
        if (this.ammo === 0 || this.i === 0 && this.j === 0) {
            return
        }
        this.bullets.push(new Bullet(this))
        this.ammo--
    }

    // calculate the i and j values for this, based on the values of dirs
    public calcIJ(): void {
        this.i = this.j = 0
        if (this.dirs.lt) {
            this.i -= 1
        }
        if (this.dirs.up) {
            this.j -= 1
        }
        if (this.dirs.rt) {
            this.i += 1
        }
        if (this.dirs.dn) {
            this.j += 1
        }
    }

    // reset all dirs to false
    public stopMoving(): void {
        let i
        for (i in this.dirs) {
            if (this.dirs[i]) {
                this.dirs[i] = false
            }
        }
        this.calcIJ()
    }

    // reset some instance variables on this
    public reset(): void {
        this.bullets = []
        this.lives = this.maxLives
        this.ammo = this.maxAmmo
        this.stopMoving()
    }
}

export default Player