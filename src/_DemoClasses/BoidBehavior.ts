import Behavior from "../Behaviors/Behavior";
import AABB from "../DataTypes/AABB";
import Vec2 from "../DataTypes/Vec2";
import Debug from "../Debug/Debug";
import Point from "../Nodes/Graphics/Point";
import Scene from "../Scene/Scene";
import Color from "../Utils/Color";
import MathUtils from "../Utils/MathUtils";
import Boid from "./Boid";
import FlockBehavior from "./FlockBehavior";

export default class BoidBehavior extends Behavior {
    scene: Scene;
    actor: Boid;
    separationFactor: number;
    alignmentFactor: number;
    cohesionFactor: number;

    static MIN_SPEED: number = 80;
    static START_SPEED: number = 90;
    static MAX_SPEED: number = 100;
    static MAX_STEER_FORCE: number = 300;

    constructor(scene: Scene, actor: Boid, separationFactor: number, alignmentFactor: number, cohesionFactor: number){
        super();
        this.scene = scene;
        this.actor = actor;
        this.separationFactor = separationFactor;
        this.alignmentFactor = alignmentFactor;
        this.cohesionFactor = cohesionFactor;        
    }

    doBehavior(deltaT: number): void {
        if(this.actor.getId() < 1){
            this.actor.setColor(Color.GREEN);
        }

        if(this.actor.velocity.x === 0 && this.actor.velocity.y === 0){
            this.actor.velocity = this.actor.direction.scaled(BoidBehavior.START_SPEED * deltaT);
        }

        let flock = this.actor.getBehavior(FlockBehavior);

        if(!flock.hasNeighbors){
            // No neighbors, don't change velocity;
            return;
        }

        let flockCenter = flock.flockCenter;
        let flockHeading = flock.flockHeading;
        let separationHeading = flock.separationHeading;

        let offsetToFlockmateCenter = flockCenter.sub(this.actor.position);

        let separationForce = this.steerTowards(separationHeading).scale(this.separationFactor);
        let alignmentForce = this.steerTowards(flockHeading).scale(this.alignmentFactor);
        let cohesionForce = this.steerTowards(offsetToFlockmateCenter).scale(this.cohesionFactor);

        this.actor.acceleration = Vec2.ZERO;
        this.actor.acceleration.add(separationForce).add(alignmentForce).add(cohesionForce);
        this.actor.velocity.add(this.actor.acceleration.scaled(deltaT));
        let speed = this.actor.velocity.mag();
        this.actor.velocity.normalize();
        this.actor.direction = this.actor.velocity.clone();
        speed = MathUtils.clamp(speed, BoidBehavior.MIN_SPEED, BoidBehavior.MAX_SPEED);
        this.actor.velocity.scale(speed);

        if(this.actor.getId() < 1){
            Debug.log("BoidDir", "Velocity: " + this.actor.velocity.toString());
            Debug.log("BoidSep", "Separation: " + separationForce.toString());
            Debug.log("BoidAl", "Alignment: " + alignmentForce.toString());
            Debug.log("BoidCo", "Cohesion: " + cohesionForce.toString());
            Debug.log("BoidSpd", "Speed: " + speed);
        }
    }

    steerTowards(vec: Vec2){
        let v = vec.normalize().scale(BoidBehavior.MAX_SPEED).sub(this.actor.velocity);
        return MathUtils.clampMagnitude(v, BoidBehavior.MAX_STEER_FORCE);
    }

}