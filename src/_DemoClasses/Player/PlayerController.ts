import StateMachine from "../../DataTypes/State/StateMachine";
import CanvasNode from "../../Nodes/CanvasNode";
import IdleTopDown from "./PlayerStates/IdleTopDown";
import MoveTopDown from "./PlayerStates/MoveTopDown";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    MOVE = "move",
    IDLE = "idle"
}

export default class PlayerController extends StateMachine {
    protected owner: CanvasNode;

    constructor(owner: CanvasNode, playerType: string){
        super();
        
        this.owner = owner;

        if(playerType === PlayerType.TOPDOWN){
            this.initializeTopDown();
        }
    }

    /**
     * Initializes the player controller for a top down player
     */
    initializeTopDown(): void {
        let idle = new IdleTopDown(this);
        let move = new MoveTopDown(this, this.owner);

        this.addState(PlayerStates.IDLE, idle);
        this.addState(PlayerStates.MOVE, move);

        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        if(stateName === PlayerStates.MOVE){
            // If move, push to the stack
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }
}