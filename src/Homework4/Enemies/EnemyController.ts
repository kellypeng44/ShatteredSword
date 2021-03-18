import Idle from "./Idle";
import Jump from "./Jump";
import Walk from "./Walk";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import { HW4_Events } from "../hw4_enums";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";

export enum EnemyStates {
	IDLE = "idle",
	WALK = "walk",
	JUMP = "jump",
	PREVIOUS = "previous"
}

export default class EnemyController extends StateMachineAI {
	owner: GameNode;
	jumpy: boolean;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;
		this.jumpy = options.jumpy ? options.jumpy : false;

		this.receiver.subscribe(HW4_Events.PLAYER_MOVE);
		if(this.jumpy){
			this.receiver.subscribe(HW4_Events.PLAYER_JUMP);
			this.speed = 100;

			// Give the owner a tween for the jump
			owner.tweens.add("jump", {
                startDelay: 0,
                duration: 300,
                effects: [
                    {
                        property: "rotation",
                        resetOnComplete: true,
                        start: -3.14/8,
                        end: 3.14/8,
                        ease: EaseFunctionType.IN_OUT_SINE
                    }
                ],
                reverseOnComplete: true,
            });
		}

		let idle = new Idle(this, owner);
		this.addState(EnemyStates.IDLE, idle);
		let walk = new Walk(this, owner);
		this.addState(EnemyStates.WALK, walk);
		let jump = new Jump(this, owner);
		this.addState(EnemyStates.JUMP, jump);

		this.initialize(EnemyStates.IDLE);
	}

	changeState(stateName: string): void {

        if(stateName === EnemyStates.JUMP){
            this.stack.push(this.stateMap.get(stateName));
        }
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}