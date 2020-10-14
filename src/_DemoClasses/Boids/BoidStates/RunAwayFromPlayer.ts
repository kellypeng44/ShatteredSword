import State from "../../../DataTypes/State/State";
import StateMachine from "../../../DataTypes/State/StateMachine";
import Vec2 from "../../../DataTypes/Vec2";
import GameEvent from "../../../Events/GameEvent";
import MathUtils from "../../../Utils/MathUtils";
import { CustomGameEventType } from "../../CustomGameEventType";
import Boid from "../Boid";

export default class RunAwayFromPlayer extends State {
    actor: Boid;
    runAwayDirection: Vec2;
    lastPlayerPosition: Vec2;

    timeElapsed: number;

    static RUN_AWAY_SPEED: number = 120;
    static MAX_STEER_FORCE: number = 300;
    static FEAR_RADIUS: number = 75;

    constructor(parent: StateMachine, actor: Boid){
        super(parent);
        this.actor = actor;
    }

    onEnter(): void {
        console.log("Entered Running away")
        this.runAwayDirection = Vec2.ZERO;
        this.lastPlayerPosition = Vec2.INF;
        this.timeElapsed = 0;
    }

    handleInput(event: GameEvent): void {
        if(event.type === CustomGameEventType.PLAYER_MOVE){
            this.lastPlayerPosition.copy(event.data.get("position"));

            if(this.actor.position.distanceSqTo(this.lastPlayerPosition)
                < RunAwayFromPlayer.FEAR_RADIUS*RunAwayFromPlayer.FEAR_RADIUS){
                // Reset our run away timer
                this.timeElapsed = 0;

                // Update the run away direction
                this.runAwayDirection.copy(this.actor.position).sub(event.data.get("position")).normalize();                
            }
        }
    }

    update(deltaT: number): void {
        this.timeElapsed += deltaT;

        // Run away for at least 500 ms
        if(this.timeElapsed > 0.5){
            // If it's been long enough, go back to what we were doing before
            this.finished("previous");
        }

        // Move away from the player
        let force = this.steerTowards(this.runAwayDirection.clone()).scaled(10);

        this.actor.acceleration = force;
        this.actor.velocity.add(this.actor.acceleration.scaled(deltaT));
        let speed = this.actor.velocity.mag();
        this.actor.velocity.normalize();
        this.actor.direction = this.actor.velocity.clone();
        speed = MathUtils.clamp(speed, RunAwayFromPlayer.RUN_AWAY_SPEED, RunAwayFromPlayer.RUN_AWAY_SPEED);
        this.actor.velocity.scale(speed);

        // Update the position
        this.actor.position.add(this.actor.velocity.scaled(deltaT));
        this.actor.position.x = (this.actor.position.x + this.actor.getScene().getWorldSize().x)%this.actor.getScene().getWorldSize().x;
        this.actor.position.y = (this.actor.position.y + this.actor.getScene().getWorldSize().y)%this.actor.getScene().getWorldSize().y;
    }

    onExit(): void {

    }

    steerTowards(vec: Vec2){
        let v = vec.normalize().scale(RunAwayFromPlayer.RUN_AWAY_SPEED).sub(this.actor.velocity);
        return MathUtils.clampMagnitude(v, RunAwayFromPlayer.MAX_STEER_FORCE);
    }

}