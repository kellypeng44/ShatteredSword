import Vec2 from "../../DataTypes/Vec2";
import Graphic from "../../Nodes/Graphic";
import BoidController from "./BoidController";
import FlockBehavior from "./FlockBehavior";

export default class Boid extends Graphic {
    direction: Vec2 = Vec2.UP.rotateCCW(Math.random()*2*Math.PI);
    acceleration: Vec2 = Vec2.ZERO;
    velocity: Vec2 = Vec2.ZERO;

    ai: BoidController;
    fb: FlockBehavior;

    constructor(position: Vec2){
        super();
        this.position = position;
        this.ai = new BoidController(this);
    }

    update(deltaT: number){
        this.ai.update(deltaT);
    }

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.getViewportOriginWithParallax();

        let dirVec = this.direction.scaled(this.size.x, this.size.y);
        let finVec1 = this.direction.clone().rotateCCW(Math.PI/2).scale(this.size.x/2, this.size.y/2).sub(this.direction.scaled(this.size.x/1.5, this.size.y/1.5));
        let finVec2 = this.direction.clone().rotateCCW(-Math.PI/2).scale(this.size.x/2, this.size.y/2).sub(this.direction.scaled(this.size.x/1.5, this.size.y/1.5));

        ctx.lineWidth = 1;
        ctx.fillStyle = this.color.toString();
        ctx.beginPath();
        ctx.moveTo(this.position.x - origin.x + dirVec.x,      this.position.y - origin.y + dirVec.y);
        ctx.lineTo(this.position.x - origin.x + finVec1.x,     this.position.y - origin.y + finVec1.y);
        ctx.lineTo(this.position.x - origin.x - dirVec.x/3,    this.position.y - origin.y - dirVec.y/3);
        ctx.lineTo(this.position.x - origin.x + finVec2.x,     this.position.y - origin.y + finVec2.y);
        ctx.lineTo(this.position.x - origin.x + dirVec.x,      this.position.y - origin.y + dirVec.y);
        ctx.fill();
    }
}