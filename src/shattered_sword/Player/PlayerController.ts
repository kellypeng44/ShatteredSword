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
import BattlerAI from "../AI/BattlerAI";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import Weapon from "../GameSystems/items/Weapon";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import InputWrapper from "../Tools/InputWrapper";
import EnemyAI from "../AI/EnemyAI";
import Timer from "../../Wolfie2D/Timing/Timer";
import PlayerState from "./PlayerStates/PlayerState";


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
    ATK  = "attack",
    DEF = "defence",
    HEALTH = "health",
    SPEED = "speed",
    RANGE = "range",
    ATKSPEED = "attackspeed",
    DOUBLESTRIKE = "doublestrike",
    POISON = "poison",
    BLEED = "bleed",
    BURN = "burn",
    EXTRA_DOT = "extradot",
    SHIELD = "shield",
    SHIELD_DMG = "shielddmg",   //increase shield dmg ratio
    LIFESTEAL = "lifesteal",
    LIFESTEALBUFF = "lifestealbuff",
    EXTRALIFE= "extralife",
    ONESHOT = "oneshot"
}


export class Buff  {
    "type": BuffType;
    "value": number;
    //"bonus": boolean,         //need to determine what bonus gives
    "string"? : string;
    "category" : BuffCategory
}



//TODO - need better names 
export enum BuffCategory{
    ATTACK = "ATTACK",
    DOT = "DOT",
    SHIELD = "SHIELD",
    HEALTH = "HEALTH",
    EXTRA = "EXTRA"
}

//TODO - discuss max stats during refinement, unused for now
export default class PlayerController extends StateMachineAI implements BattlerAI{
    owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
    //will need to discuss redundant stats
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
    CURRENT_EXP : number = 0;
    MAX_EXP : number = 100;
    CURRENT_SHIELD : number =0;
    MAX_SHIELD : number = 20;
    invincible : boolean = false;

    godMode: boolean = false;

    tilemap: OrthogonalTilemap;

    //for doublejumps maybe = # of jumps in air allowed
    MAX_airjumps: number = 1;
    airjumps:number = 0;
    
    private lookDirection: Vec2;
    /** A list of items in the game world */
    private items: Array<Item>;

    // The inventory of the player
    inventory: InventoryManager;

	static invincibilityTimer: Timer;
    
    static buffPool : Array<BuffCategory>;

    //add to current_buffs later
    hasBleed : Boolean = false;
    hasPoison : Boolean = false;
    hasBurn : Boolean = false;
    hasShield : Boolean = false;
    shieldDamage : number = 1;
    hasDoubleStrike : Boolean = false;
    hasLifesteal : Boolean = false;
    lifestealratio : number = 0; //percent of damage to steal
    hasOneShot: Boolean = false;
    extraDotDmg : number =0;

    //TODO - add new buffs here
    CURRENT_BUFFS: {
        atk: number;    //flat value to add to weapon
        hp: number;     //flat value 
        def: number;    //flat value
        speed: number;  //flat value
        range:number;   //range will be a multiplier value: 1.5 = 150% range
    }
    
    
    

    //TODO - get the correct tilemap
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
      
        this.inventory  = options.inventory;

        this.lookDirection = new Vec2();

        this.CURRENT_BUFFS = {hp:0, atk:0, def:0, speed:0, range:0};
       
        
        //i frame timer
        PlayerController.invincibilityTimer = new Timer(2000);

        //initialize the buff pool - each has same weight at first 
        PlayerController.buffPool = new Array();
        for( let i=0 ; i< 4; i++){
            PlayerController.buffPool.push(BuffCategory.ATTACK);
            PlayerController.buffPool.push(BuffCategory.EXTRA);
            PlayerController.buffPool.push(BuffCategory.DOT);
            PlayerController.buffPool.push(BuffCategory.SHIELD);
            PlayerController.buffPool.push(BuffCategory.HEALTH);
        }

        //to test the buffs
        //this.addBuff( {type:BuffType.HEALTH, value:1} );
        this.addBuff({type:BuffType.BURN, value:1, category:BuffCategory.DOT});
        
        
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
        if(PlayerController.invincibilityTimer.isStopped()){
            this.invincible = false;
        }

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
        Debug.log("player speed", "player speed: x: " + this.velocity.x + ", y:" + this.velocity.y);
        Debug.log("player Coords:", "Player Coords:" +this.owner.position );

        //testing the attacks here, may be moved to another place later
        if(InputWrapper.isAttackJustPressed()){
            let item = this.inventory.getItem();
            (<AnimatedSprite>this.owner).animation.play("ATTACK", true);
            //TODO - get proper look direction 
            this.lookDirection.x = (<Sprite>this.owner).invertX ? -1 : 1;
            // If there is an item in the current slot, use it
            if (item) {
                item.use(this.owner, "player", this.lookDirection);
            }
        }
        
	}

    

    // TODO - figure out attacker 
    damage(damage: number, attacker?: GameNode): void {
        if (this.godMode) {
            //console.log("godmode");
            return;
        }
        if( !this.invincible && PlayerState.dashTimer.isStopped()){
            //console.log("take damage");
            //i frame here
            PlayerController.invincibilityTimer.start();
            this.invincible = true;
            //shield absorbs the damage and sends dmg back to attacker
            if(this.CURRENT_SHIELD > 0){
                let newshield = Math.max(0, this.CURRENT_SHIELD - damage ); //calculate the new shield value
                if( attacker !== undefined){
                    (<EnemyAI>attacker._ai).damage((this.CURRENT_SHIELD - newshield) * this.shieldDamage); //damage the attacker the dmg taken to shield
                }
                this.CURRENT_SHIELD = newshield; //update shield value
            }
            else{
                //i frame here
                PlayerController.invincibilityTimer.start();
                this.invincible = true;
                //console.log("hurt anim");
                (<AnimatedSprite>this.owner).animation.play("HURT" );
                this.CURRENT_HP -= damage;
                //if player has shield buff give them shield when damaged
                if(this.hasShield){
                    this.CURRENT_SHIELD += damage * .5;
                }
               
            }
            
        }
        else{
            //console.log("player is invincible");
        }

        if(this.CURRENT_HP <= 0){
            (<AnimatedSprite>this.owner).animation.play("DYING");
            (<AnimatedSprite>this.owner).animation.queue("DEAD", true, Player_Events.PLAYER_KILLED);
        }
    }

    /**
     * gives the player a certain amount of shield
     * @param shield amount of shield to add to player
     */
    addShield(shield : number){
        this.CURRENT_SHIELD = (this.CURRENT_SHIELD + shield) % this.MAX_SHIELD;
    }

    /**
     * gives health to the player
     * @param health health to give player
     */
    addHealth(health : number){
        this.CURRENT_HP = (this.CURRENT_HP + health) %this.MAX_HP + this.CURRENT_BUFFS.hp;
    }

    /**
     * gives the player exp
     * @param exp amount of exp to give the player
     */
    giveExp(exp: number){
        this.CURRENT_EXP += exp;
        //if > than max exp level up (give buff)
        if(this.CURRENT_EXP >= this.MAX_EXP){
            this.CURRENT_EXP -= this.MAX_EXP;
            this.emitter.fireEvent(Player_Events.GIVE_BUFF);
        }
    }
    //TODO - balance buff value generation 
    /**
     * returns an array of three randomly generated buffs 
     * @param val optional value to give buff
     * @returns array of three Buffs
     */
    generateBuffs( val? : number) : Buff[]{
        //shuffle pool of buff categories 
        PlayerController.buffPool.sort(() => 0.5 - Math.random());

        // Get sub-array of first 3 elements after shuffled
        let shuffled = PlayerController.buffPool.slice(0, 3); //3 buff categories

        let num = Number(Math.random().toPrecision(1)) * 10;    //random number from 1 to 10 if no value given
        if(typeof val !== 'undefined'){
            num = val;
        }
        
        //TODO - implement better buff genertion - some buffs dont want multiple of
        let attackBuffs : Buff[] = [
            {type:BuffType.RANGE, value:num, category: BuffCategory.ATTACK},
            {type:BuffType.ATKSPEED, value:num, category: BuffCategory.ATTACK},
        ];
        if(!this.hasDoubleStrike){
            attackBuffs.push({type:BuffType.DOUBLESTRIKE, value:num, category: BuffCategory.ATTACK, string:"your attacks are followed by a weaker strike"});
        }

        let dotBuffs : Buff[] = [
            {type:BuffType.BLEED, value:1, category: BuffCategory.DOT, string: "Your hits apply Bleed"},
            {type:BuffType.BURN, value:1, category: BuffCategory.DOT, string: "Your hits apply Burn"},
            {type:BuffType.POISON, value:1, category: BuffCategory.DOT, string: "Your hits apply poison"},
            {type:BuffType.EXTRA_DOT, value:num, category: BuffCategory.DOT, string: "increase your DOT damage"},

        ];
        
        let shieldBuffs : Buff[] = [
            {type:BuffType.HEALTH, value:1, category: BuffCategory.SHIELD},
        ];
        //if player doesnt have shield buff, give them the option, otherwise give buff shield option
        if(!this.hasShield){
            shieldBuffs.push({type:BuffType.SHIELD, value:1, category: BuffCategory.SHIELD, string: "Gain Shield When Damaged"});
        }
        else{
            shieldBuffs.push({type:BuffType.SHIELD_DMG, value:num, category: BuffCategory.SHIELD});
        }


        let healthBuffs : Buff[] = [
            {type:BuffType.DEF, value:num, category: BuffCategory.HEALTH}
        ];
        if(!this.hasLifesteal){
            healthBuffs.push({type:BuffType.LIFESTEAL, value:1, category: BuffCategory.HEALTH, string:"Gain lifesteal"});
        }
        else{
            healthBuffs.push({type:BuffType.LIFESTEALBUFF, value:num, category: BuffCategory.HEALTH});
        }


        let extraBuffs : Buff[] = [
            {type:BuffType.EXTRALIFE, value:1, category: BuffCategory.EXTRA, string: "Gain an Extra Life"},
            {type:BuffType.SPEED, value:num, category: BuffCategory.EXTRA},
            {type:BuffType.ATK, value:num, category: BuffCategory.EXTRA}
        ];
        if(!this.hasOneShot){
            extraBuffs.push({type:BuffType.ONESHOT, value:1, category: BuffCategory.EXTRA, string: "Your hits hurt 100x more but you die in one shot"});
        };


        let selected = new Array();
        while( shuffled.length != 0){
            let cat = shuffled.pop();
            switch(cat){
                case BuffCategory.ATTACK:
                    attackBuffs.sort(() => 0.5 - Math.random());
                    selected.push(attackBuffs.pop());
                    break;
                case BuffCategory.DOT:
                    dotBuffs.sort(() => 0.5 - Math.random());
                    selected.push(dotBuffs.pop());
                    break;
                case BuffCategory.EXTRA:
                    extraBuffs.sort(() => 0.5 - Math.random());
                    selected.push(extraBuffs.pop());
                    break;
                case BuffCategory.HEALTH:
                    healthBuffs.sort(() => 0.5 - Math.random());
                    selected.push(healthBuffs.pop());
                    break;
                case BuffCategory.SHIELD:
                    shieldBuffs.sort(() => 0.5 - Math.random());
                    selected.push(shieldBuffs.pop());
                    break;
            }
        }

        return selected;
    }

    /**
	 * Add given buff to the player
	 * @param buff Given buff
	 */
    addBuff(buff: Buff): void {
        
        //increase weight of selected buff category
        PlayerController.buffPool.push(buff.category);

        // TODO
        let item = this.inventory.getItem();
        switch(buff.type){
            case BuffType.HEALTH:
                this.CURRENT_BUFFS.hp += buff.value;
                this.CURRENT_HP += buff.value;
                break;
            case BuffType.ATK:
                //TODO - decide what to do with atk stat
                this.CURRENT_BUFFS.atk += buff.value;
                this.CURRENT_ATK +=buff.value;
                break;
            case BuffType.SPEED:
                this.CURRENT_BUFFS.speed += buff.value;
                this.speed += buff.value;
                break;
            case BuffType.DEF:
                this.CURRENT_BUFFS.def += buff.value;
                this.CURRENT_DEF += buff.value;
                break;
            case BuffType.RANGE:
                this.CURRENT_BUFFS.range += buff.value;
                if (item) {
                    (<Weapon>item).EXTRA_RANGE += buff.value;
                }
                break;

            //TODO 
            case BuffType.BLEED:
                this.hasBleed = true;
                break;
            case BuffType.BURN:
                this.hasBleed = true;
                break;
            case BuffType.POISON:
                this.hasPoison = true;
                break;
            case BuffType.EXTRA_DOT:
                this.extraDotDmg += buff.value;
                break;
            case BuffType.SHIELD:
                this.hasShield = true;
                break;

            case BuffType.ATKSPEED:
                if (item) {
                    //reduce cooldowntimer 
                    //(<Weapon>item).cooldownTimer 
                }
                break;
            case BuffType.DOUBLESTRIKE:
                break;
            case BuffType.SHIELD_DMG:
                this.shieldDamage += buff.value/10 ;
                break;
            case BuffType.EXTRALIFE:

                break;
            case BuffType.LIFESTEAL:
                this.hasLifesteal = true;
                break;
            case BuffType.ONESHOT:
                this.MAX_HP = 1;
                this.CURRENT_HP = 1;
                this.CURRENT_ATK *= 100;
                break;
            }
        }
        

}