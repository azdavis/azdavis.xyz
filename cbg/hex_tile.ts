import Canvas from "./canvas"
import NumberLabel from "./number_label"
import Sprite from "./sprite"

class HexTile extends Sprite {
    /*

              | .
              |      .      side
    halfSide  |           .
              |                .
              |___________________

                        xLeg


              . center of hexagon

     */
    private static side = 30
    private static halfSide = HexTile.side / 2
    private static xLeg = HexTile.halfSide * Math.sqrt(3)
    /* tslint:disable member-ordering */
    public static w = HexTile.xLeg * 2
    public static h = HexTile.side * 2
    /* tslint:enable member-ordering */
    protected x: number
    protected y: number

    public constructor(protected fill: string, private label: NumberLabel) {
        super(0, 0)
    }

    // draw a hexagon tile, centered at (this.x, this.y), and its label
    public draw(): void {
        Canvas.ctx.fillStyle = this.fill

        Canvas.ctx.moveTo(this.x, this.y - HexTile.side)
        Canvas.ctx.beginPath()
        Canvas.ctx.lineTo(this.x + HexTile.xLeg, this.y - HexTile.halfSide)
        Canvas.ctx.lineTo(this.x + HexTile.xLeg, this.y + HexTile.halfSide)
        Canvas.ctx.lineTo(this.x, this.y + HexTile.side)
        Canvas.ctx.lineTo(this.x - HexTile.xLeg, this.y + HexTile.halfSide)
        Canvas.ctx.lineTo(this.x - HexTile.xLeg, this.y - HexTile.halfSide)

        Canvas.ctx.closePath()
        Canvas.ctx.fill()

        this.label.draw()
    }
}

export default HexTile
