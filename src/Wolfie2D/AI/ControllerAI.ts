import AI from "../DataTypes/Interfaces/AI";
import GameEvent from "../Events/GameEvent";
import GameNode from "../Nodes/GameNode";

/**
 * A very basic AI class that just runs a function every update
 */
export default class ControllerAI implements AI {
    protected owner: GameNode;

    initializeAI(owner: GameNode, options: Record<string, any>): void {
        this.owner = owner;
    }

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {}
}