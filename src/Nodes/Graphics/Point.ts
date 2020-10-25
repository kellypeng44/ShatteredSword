import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";

export default class Point extends Graphic {

    constructor(position: Vec2){
        super();
        this.position = position;
        this.size.set(5, 5);
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.getViewportOriginWithParallax();

		ctx.fillStyle = this.color.toStringRGBA();
        ctx.fillRect(this.position.x - origin.x - this.size.x/2, this.position.y - origin.y - this.size.y/2,
            this.size.x, this.size.y);
    }

}