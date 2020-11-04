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
        let origin = this.scene.getViewTranslation(this);
        let zoom = this.scene.getViewScale();

		ctx.fillStyle = this.color.toStringRGBA();
        ctx.fillRect((this.position.x - origin.x - this.size.x/2)*zoom, (this.position.y - origin.y - this.size.y/2)*zoom,
            this.size.x*zoom, this.size.y*zoom);
    }

}