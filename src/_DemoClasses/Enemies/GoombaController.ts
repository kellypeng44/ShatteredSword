import { CustomGameEventType } from "../CustomGameEventType";
import Idle from "../Enemies/Idle";
import Jump from "../Enemies/Jump";
import Walk from "../Enemies/Walk";
import Afraid from "../Enemies/Afraid";
import GameNode from "../../Nodes/GameNode";
import Vec2 from "../../DataTypes/Vec2";
import StateMachineAI from "../../AI/StateMachineAI";
import GoombaState from "./GoombaState";

export enum GoombaStates {
	IDLE = "idle",
	WALK = "walk",
	JUMP = "jump",
	PREVIOUS = "previous",
	AFRAID = "afraid"
}

export default class GoombaController extends StateMachineAI {
	owner: GameNode;
	jumpy: boolean;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;
		this.jumpy = options.jumpy ? options.jumpy : false;

		this.receiver.subscribe(CustomGameEventType.PLAYER_MOVE);
		this.receiver.subscribe("playerHitCoinBlock");
		if(this.jumpy){
			this.receiver.subscribe(CustomGameEventType.PLAYER_JUMP);
			this.speed = 100;
		}

		let idle = new Idle(this, owner);
		this.addState(GoombaStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(GoombaStates.WALK, walk);
		let jump = new Jump(this, owner);
		this.addState(GoombaStates.JUMP, jump);

		this.initialize(GoombaStates.IDLE);
	}

	changeState(stateName: string): void {

        if(stateName === GoombaStates.JUMP || stateName === GoombaStates.AFRAID){
            this.stack.push(this.stateMap.get(stateName));
        }
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}