import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import GameNode, { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { Player_Events } from "../sword_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Walk from "./PlayerStates/Walk";
import Debug from "../../Wolfie2D/Debug/Debug";
import Item from "../GameSystems/items/Item";
import InventoryManager from "../GameSystems/InventoryManager";
import Input from "../../Wolfie2D/Input/Input";
import BattlerAI from "../AI/BattlerAI";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";


export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export enum BuffType {
    ATK = "attack",
    DEF = "defence"
}

type Buff = {
    "type": BuffType,
    "value": number,
    "bonus": boolean,
}

type Buffs = [
    Buff, Buff, Buff
]


export default class PlayerController extends StateMachineAI implements BattlerAI{
    owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    BASE_HP: number = 100;
    MAX_HP: number = 100;
    CURRENT_HP: number = 100;
    BASE_ATK: number = 100;
    MAX_ATK: number = 100;
    CURRENT_ATK: number = 100;
    BASE_DEF: number = 100;
    MAX_DEF: number = 100;
    CURRENT_DEF: number = 100;
    tilemap: OrthogonalTilemap;

    // TODO - 
    damage(damage: number): void {
        this.CURRENT_HP -= damage;
    }

    private lookDirection: Vec2;


    /** A list of items in the game world */
    private items: Array<Item>;

    // The inventory of the player
    inventory: InventoryManager;

    CURRENT_BUFFS: {
        atk: 0;
        hp: 0;
        def: 0;
        speed: 0;
    }
    
    

	/**
	 * Returns three legal random generate buffs based on current state
	 * @returns Three buffs
	 */
    static getBuffs(): Buffs {
        // TODO
        return undefined;
    }

    /**
	 * Add given buff to the player
	 * @param buff Given buff
	 */
    setBuff(buff: Buff): void {
        // TODO
    }

    //TODO - get the correct tilemap
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
      
        this.inventory  = options.inventory;

        this.lookDirection = new Vec2();
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
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
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
        Debug.log("playerspeed", "x: " + this.velocity.x + ", y:" + this.velocity.y);


        //testing the attacks here, may be moved to another place latera
        if(Input.isJustPressed("attack")){
            let item = this.inventory.getItem();
            //TODO - get proper look direction 
            this.lookDirection.x = (<Sprite>this.owner).invertX ? -1 : 1;
            // If there is an item in the current slot, use it
            if (item) {
                item.use(this.owner, "player", this.lookDirection);
            }
        }
        

	}

    
}