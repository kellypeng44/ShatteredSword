import Emitter from "../../Events/Emitter";
import GameEvent from "../../Events/GameEvent";
import { Updateable } from "../Interfaces/Descriptors";
import StateMachine from "./StateMachine";

export default abstract class State implements Updateable {
    protected parentStateMachine: StateMachine;
    protected emitter: Emitter;

    constructor(parent: StateMachine) {
        this.parentStateMachine = parent;
        this.emitter = new Emitter();
    }

    /**
     * A method that is called when this state is entered. Use this to initialize any variables before updates occur.
     */
    abstract onEnter(): void;

    /**
     * Handles an input event, such as taking damage.
     * @param event 
     */
    abstract handleInput(event: GameEvent): void;

    abstract update(deltaT: number): void;

    /**
     * Tells the state machine that this state has ended, and makes it transition to the new state specified
     * @param stateName The name of the state to transition to
     */
    protected finished(stateName: string): void {
        this.parentStateMachine.changeState(stateName);
    }

    /**
     * This is called when the state is ending.
     */
    abstract onExit(): void;
}