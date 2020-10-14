import State from "../../../DataTypes/State/State";
import Vec2 from "../../../DataTypes/Vec2";
import GameEvent from "../../../Events/GameEvent";
import InputReceiver from "../../../Input/InputReceiver";
import { PlayerStates } from "../PlayerController";

export default class IdleTopDown extends State {
    direction: Vec2 = Vec2.ZERO;
    input: InputReceiver = InputReceiver.getInstance();

    onEnter(): void {
        this.direction.zero();
    }

    handleInput(event: GameEvent): void {
        // Ignore inputs
    }

    update(deltaT: number): void {
        // If we're starting to move, change states
        this.direction.x = (this.input.isPressed("a") ? -1 : 0) + (this.input.isPressed("d") ? 1 : 0);
        this.direction.y = (this.input.isPressed("w") ? -1 : 0) + (this.input.isPressed("s") ? 1 : 0);

        if(!this.direction.isZero()){
            this.finished(PlayerStates.MOVE);
            return;
        }
    }

    onExit(): void {}
    
}