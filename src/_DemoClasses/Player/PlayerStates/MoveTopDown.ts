import State from "../../../DataTypes/State/State";
import StateMachine from "../../../DataTypes/State/StateMachine";
import Vec2 from "../../../DataTypes/Vec2";
import GameEvent from "../../../Events/GameEvent";
import InputReceiver from "../../../Input/InputReceiver";
import CanvasNode from "../../../Nodes/CanvasNode";
import { CustomGameEventType } from "../../CustomGameEventType";

export default class MoveTopDown extends State {
    direction: Vec2 = Vec2.ZERO;
    speed: number = 0;
    input: InputReceiver = InputReceiver.getInstance();
    owner: CanvasNode;

    constructor(parent: StateMachine, owner: CanvasNode) {
        super(parent);
        this.owner = owner;
    }

    onEnter(): void {
        // Initialize or reset the direction and speed
        this.direction.zero();
        this.speed = 100;
    }

    handleInput(event: GameEvent): void {
        // Ignore input for now
    }

    update(deltaT: number): void {
        // Get direction
        this.direction.x = (this.input.isPressed("a") ? -1 : 0) + (this.input.isPressed("d") ? 1 : 0);
        this.direction.y = (this.input.isPressed("w") ? -1 : 0) + (this.input.isPressed("s") ? 1 : 0);

        if(this.direction.isZero()){
            this.finished("previous");
            return;
        }

        // Otherwise, we are still moving, so update position
        let velocity = this.direction.normalize().scale(this.speed);
        this.owner.move(velocity.scale(deltaT));

        // Emit an event to tell the world we are moving
        this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
    }

    onExit(): void {
        // Nothing special to do here
    }
}