import CanvasNode from "./CanvasNode";
import Color from "../Utils/Color";
import Vec2 from "../DataTypes/Vec2";
import RandUtils from "../Utils/RandUtils";

export default class ColoredCircle extends CanvasNode{
    private color: Color;

    constructor(){
        super();
        this.position = new Vec2(RandUtils.randInt(0, 1000), RandUtils.randInt(0, 1000));
        this.color = RandUtils.randColor();
        this.size = new Vec2(50, 50);
    }

    setColor(color: Color): void {
        this.color = color;
    }

    getColor(): Color {
        return this.color;
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D, origin: Vec2){
        ctx.fillStyle = this.color.toStringRGBA();
        ctx.beginPath();
        ctx.arc(this.position.x + this.size.x/2 - origin.x, this.position.y + this.size.y/2 - origin.y, this.size.x/2, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }
}