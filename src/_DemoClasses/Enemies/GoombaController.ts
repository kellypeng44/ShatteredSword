import StateMachine from "../../DataTypes/State/StateMachine";
import { CustomGameEventType } from "../CustomGameEventType";
import Idle from "../Enemies/Idle";
import Jump from "../Enemies/Jump";
import Walk from "../Enemies/Walk";
import Debug from "../../Debug/Debug";
import GameNode from "../../Nodes/GameNode";
import Vec2 from "../../DataTypes/Vec2";

export enum GoombaStates {
	IDLE = "idle",
	WALK = "walk",
	JUMP = "jump",
	PREVIOUS = "previous"
}

export default class GoombaController extends StateMachine {
	owner: GameNode;
	jumpy: boolean;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;

	constructor(owner: GameNode, jumpy: boolean){
		super();

		this.owner = owner;
		this.jumpy = jumpy;

		this.receiver.subscribe(CustomGameEventType.PLAYER_MOVE);
		if(this.jumpy){
			this.receiver.subscribe(CustomGameEventType.PLAYER_JUMP);
		}

		let idle = new Idle(this, owner);
		this.addState(GoombaStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(GoombaStates.WALK, walk);
		let jump = new Jump(this, owner);
		this.addState(GoombaStates.JUMP, jump);
	}

	changeState(stateName: string): void {

        if(stateName === GoombaStates.JUMP){
            this.stack.push(this.stateMap.get(stateName));
        }
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.currentState instanceof Jump){
			Debug.log("goombastate", "GoombaState: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("goombastate", "GoombaState: Walk");
		} else {
			Debug.log("goombastate", "GoombaState: Idle");
		}
	}
}