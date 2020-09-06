import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";

export default class Rect extends Graphic {

    constructor(position: Vec2, size: Vec2){
        super();
        this.position = position;
        this.size = size;
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.getViewportOriginWithParallax();

		ctx.fillStyle = this.color.toStringRGBA();
		ctx.fillRect(this.position.x - origin.x, this.position.y - origin.y, this.size.x, this.size.y);
    }

}