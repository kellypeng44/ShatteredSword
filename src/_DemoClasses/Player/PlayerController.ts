import StateMachineAI from "../../AI/StateMachineAI";
import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import GameNode from "../../Nodes/GameNode";
import IdleTopDown from "./PlayerStates/IdleTopDown";
import MoveTopDown from "./PlayerStates/MoveTopDown";
import Idle from "./PlayerStates/Platformer/Idle";
import Jump from "./PlayerStates/Platformer/Jump";
import Run from "./PlayerStates/Platformer/Run";
import Walk from "./PlayerStates/Platformer/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    MOVE = "move",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 400;
	MIN_SPEED: number = 400;
	MAX_SPEED: number = 1000;

    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        if(options.playerType === PlayerType.TOPDOWN){
            this.initializeTopDown(options.speed);
        } else {
            this.initializePlatformer();
        }
    }

    /**
     * Initializes the player controller for a top down player
     */
    initializeTopDown(speed: number): void {
        let idle = new IdleTopDown(this);
        let move = new MoveTopDown(this, this.owner);

        this.speed = speed ? speed : 150;

        this.addState(PlayerStates.IDLE, idle);
        this.addState(PlayerStates.MOVE, move);

        this.initialize(PlayerStates.IDLE);
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        if(stateName === PlayerStates.JUMP){
            this.stack.push(this.stateMap.get(stateName));
        }

        if(stateName === PlayerStates.MOVE){
            // If move, push to the stack
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
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if (this.currentState instanceof IdleTopDown){
			Debug.log("playerstate", "Player State: Idle");
		} else if (this.currentState instanceof MoveTopDown){
			Debug.log("playerstate", "Player State: Move");
		}
	}
}