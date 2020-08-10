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
        console.log(this.color.toStringRGB());
        this.size = new Vec2(50, 50);
    }

    update(deltaT: number): void {}

    render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2){
        ctx.fillStyle = this.color.toStringRGB();
        ctx.beginPath();
        ctx.arc(this.position.x + this.size.x/2 - viewportOrigin.x, this.position.y + this.size.y/2 - viewportOrigin.y, this.size.x/2, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
    }
}