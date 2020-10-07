import Vec2 from "../DataTypes/Vec2";
import Graphic from "../Nodes/Graphic";
import BoidBehavior from "./BoidBehavior";

export default class Boid extends Graphic {
    direction: Vec2 = Vec2.UP.rotateCCW(Math.random()*2*Math.PI);
    acceleration: Vec2 = Vec2.ZERO;
    velocity: Vec2 = Vec2.ZERO;

    constructor(position: Vec2){
        super();
        this.position = position;
    }

    update(deltaT: number){
        this.position.add(this.velocity.scaled(deltaT));

        this.position.x = (this.position.x + this.scene.getWorldSize().x)%this.scene.getWorldSize().x;
        this.position.y = (this.position.y + this.scene.getWorldSize().y)%this.scene.getWorldSize().y;
    }

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.getViewportOriginWithParallax();

        let dirVec = this.direction.scaled(this.size.x, this.size.y);
        let finVec1 = this.direction.clone().rotateCCW(Math.PI/2).scale(this.size.x/2, this.size.y/2).sub(this.direction.scaled(this.size.x/1.5, this.size.y/1.5));
        let finVec2 = this.direction.clone().rotateCCW(-Math.PI/2).scale(this.size.x/2, this.size.y/2).sub(this.direction.scaled(this.size.x/1.5, this.size.y/1.5));

        ctx.lineWidth = 1;
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.moveTo(this.position.x + dirVec.x, this.position.y + dirVec.y);
        ctx.lineTo(this.position.x + finVec1.x, this.position.y + finVec1.y);
        ctx.lineTo(this.position.x - dirVec.x/3, this.position.y - dirVec.y/3);
        ctx.lineTo(this.position.x + finVec2.x,this.position.y + finVec2.y);
        ctx.lineTo(this.position.x + dirVec.x, this.position.y + dirVec.y);
        ctx.fill();

        // ctx.fillStyle = this.color.toStringRGBA();
        // ctx.fillRect(this.position.x - origin.x - this.size.x/2, this.position.y - origin.y - this.size.y/2,
        //     this.size.x, this.size.y);
    }
}