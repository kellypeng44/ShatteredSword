import Debug from "../../../../Debug/Debug";
import Idle from "./Idle";
import Jump from "./Jump";
import Walk from "./Walk";
import Run from "./Run";
import GameNode from "../../../../Nodes/GameNode";
import Vec2 from "../../../../DataTypes/Vec2";
import StateMachineAI from "../../../../AI/StateMachineAI";

export enum PlayerStates {
	WALK = "walk",
	RUN = "run",
	IDLE = "idle",
	JUMP = "jump",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
	protected owner: GameNode;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 400;
	MIN_SPEED: number = 400;
	MAX_SPEED: number = 400;

    initializeAI(owner: GameNode, config: Record<string, any>): void {
		this.owner = owner;
		
		let idle = new Idle(this, owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, owner);
		this.addState(PlayerStates.JUMP, jump);

		this.initialize(PlayerStates.IDLE);
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