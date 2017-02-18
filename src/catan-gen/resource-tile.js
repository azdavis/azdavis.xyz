import Tile from "./tile"

class ResourceTile extends Tile {
    constructor() {
        super()
        this.number = null
    }

    draw(x, y, r) {
        super.draw(x, y, r)
        if (this.number === null) {
            return
        }
    }
}

export default ResourceTile
