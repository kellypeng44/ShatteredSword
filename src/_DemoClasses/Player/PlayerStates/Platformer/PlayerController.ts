import StateMachine from "../../../../DataTypes/State/StateMachine";
import Debug from "../../../../Debug/Debug";
import Player from "../../../MarioClone/Player";
import Idle from "./Idle";
import Jump from "./Jump";
import Walk from "./Walk";
import Run from "./Run";

export enum PlayerStates {
	WALK = "walk",
	RUN = "run",
	IDLE = "idle",
	JUMP = "jump",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachine {
    protected owner: Player;

    constructor(owner: Player){
        super();
        
		this.owner = owner;
		
		let idle = new Idle(this, owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, owner);
		this.addState(PlayerStates.JUMP, jump);
    }

	currentStateString: string = "";

    changeState(stateName: string): void {
		this.currentStateString = stateName;

        if(stateName === PlayerStates.JUMP){
            this.stack.push(this.stateMap.get(stateName));
        }
        super.changeState(stateName);
	}
	
	update(deltaT: number): void {
		super.update(deltaT);

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else {
			Debug.log("playerstate", "Player State: Idle");
		}
	}
}