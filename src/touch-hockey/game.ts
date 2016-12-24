import Canvas from "./canvas"
import AutomaticCircle from "./automatic_circle"
import ControlledCircle from "./controlled_circle"

const zero = () => 0

const width = () => Canvas.dim.width
const height = () => Canvas.dim.height
const widthHalf = () => width() / 2
const heightHalf = () => height() / 2

const playerRadius = () => width() * 0.08
const puckRadius = () => width() * 0.05

const goalWidthHalf = () => 2 * playerRadius() - puckRadius()
const goalLt = () => widthHalf() - goalWidthHalf()
const goalRt = () => widthHalf() + goalWidthHalf()
const nearGoal = x => goalLt() <= x && x <= goalRt()

const playerOffset = playerRadius() * 2

const top = new ControlledCircle(
    widthHalf()
  , playerOffset
  , playerRadius
  , zero
  , width
  , zero
  , heightHalf
  , "#d77"
)

const bot = new ControlledCircle(
    widthHalf()
  , height() - playerOffset
  , playerRadius
  , zero
  , width
  , heightHalf
  , height
  , "#77d"
)

const puck = new AutomaticCircle(
    widthHalf()
  , heightHalf()
  , puckRadius
  , zero
  , width
  , () => nearGoal(puck.x) ? -height() : zero()
  , () => nearGoal(puck.x) ? height() * 2 : height()
  , "#777"
)

function render(): void {
    Canvas.clear()
    puck.draw()
    top.draw()
    bot.draw()
    let p = top.overlaps(puck) ? top
          : bot.overlaps(puck) ? bot
          : null
    if (p !== null) {
        puck.collideWith(p)
    }
    puck.move()
    requestAnimationFrame(render)
}

export default {top, bot, render}
