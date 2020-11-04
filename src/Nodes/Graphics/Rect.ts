import Graphic from "../Graphic";
import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";

export default class Rect extends Graphic {

    protected borderColor: Color;
    protected borderWidth: number;

    constructor(position: Vec2, size: Vec2){
        super();
        this.position = position;
        this.size = size;
        this.borderColor = this.color;
        this.borderWidth = 0;
    }

    /**
     * Sets the border color of this rectangle
     * @param color The border color
     */
    setBorderColor(color: Color){
        this.borderColor = color;
    }

    /**Sets the border width of this rectangle
     * 
     * @param width The width of the rectangle in pixels
     */
    setBorderWidth(width: number){
        this.borderWidth = width;
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.scene.getViewTranslation(this);
        let zoom = this.scene.getViewScale();

        if(this.color.a !== 0){
            ctx.fillStyle = this.color.toStringRGB();
            ctx.fillRect((this.position.x - this.size.x/2 - origin.x)*zoom, (this.position.y - this.size.y/2 - origin.y)*zoom, this.size.x*zoom, this.size.y*zoom);
        }

        ctx.strokeStyle = this.borderColor.toStringRGB();
        ctx.lineWidth = this.borderWidth;
        ctx.strokeRect((this.position.x - this.size.x/2 - origin.x)*zoom, (this.position.y - this.size.y/2 - origin.y)*zoom, this.size.x*zoom, this.size.y*zoom);
    }

}