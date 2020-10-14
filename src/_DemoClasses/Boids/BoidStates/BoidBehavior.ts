import State from "../../../DataTypes/State/State";
import StateMachine from "../../../DataTypes/State/StateMachine";
import Vec2 from "../../../DataTypes/Vec2";
import Debug from "../../../Debug/Debug";
import GameEvent from "../../../Events/GameEvent";
import MathUtils from "../../../Utils/MathUtils";
import { CustomGameEventType } from "../../CustomGameEventType";
import Boid from "../Boid";

export default class BoidBehavior extends State {
    actor: Boid;
    separationFactor: number;
    alignmentFactor: number;
    cohesionFactor: number;

    static MIN_SPEED: number = 80;
    static START_SPEED: number = 90;
    static MAX_SPEED: number = 100;
    static MAX_STEER_FORCE: number = 300;

    constructor(parent: StateMachine, actor: Boid, separationFactor: number, alignmentFactor: number, cohesionFactor: number){
        super(parent);
        this.actor = actor;
        this.separationFactor = separationFactor;
        this.alignmentFactor = alignmentFactor;
        this.cohesionFactor = cohesionFactor;        
    }

    onEnter(): void {
        // Do nothing special
    }

    handleInput(event: GameEvent): void {
        if(event.type === CustomGameEventType.PLAYER_MOVE){
            if(this.actor.position.distanceSqTo(event.data.get("position")) < 50*50){
                // If player moved and we're close, change state
                this.finished("runAway");
            }
        }
    }

    onExit(): void {
        // Do nothing special
    }

    update(deltaT: number): void {
        if(this.actor.velocity.x === 0 && this.actor.velocity.y === 0){
            this.actor.velocity = this.actor.direction.scaled(BoidBehavior.START_SPEED);
        }

        // Only update as boid if it has neighbors
        if(this.actor.fb.hasNeighbors){
            let flockCenter = this.actor.fb.flockCenter;
            let flockHeading = this.actor.fb.flockHeading;
            let separationHeading = this.actor.fb.separationHeading;

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
                Debug.log("BoidSep", "Separation: " + separationForce.toString());
                Debug.log("BoidAl", "Alignment: " + alignmentForce.toString());
                Debug.log("BoidCo", "Cohesion: " + cohesionForce.toString());
                Debug.log("BoidSpd", "Speed: " + speed);
            }
        }

        if(this.actor.getId() < 1){
            Debug.log("BoidDir", "Velocity: " + this.actor.velocity.toString());
        }

        // Update the position
        this.actor.position.add(this.actor.velocity.scaled(deltaT));
        this.actor.position.x = (this.actor.position.x + this.actor.getScene().getWorldSize().x)%this.actor.getScene().getWorldSize().x;
        this.actor.position.y = (this.actor.position.y + this.actor.getScene().getWorldSize().y)%this.actor.getScene().getWorldSize().y;
    }

    steerTowards(vec: Vec2){
        let v = vec.normalize().scale(BoidBehavior.MAX_SPEED).sub(this.actor.velocity);
        return MathUtils.clampMagnitude(v, BoidBehavior.MAX_STEER_FORCE);
    }

}