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
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

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
    FLAT_ATK  = "attack",
    PERCENT_ATK = "percent_attack",
    DEF = "defence",
    FLAT_HEALTH = "health",
    PERCENT_HEALTH = "percent_health",
    SPEED = "speed",
    RANGE = "range",
    ATKSPEED = "attackspeed",
    POISON = "poison",
    BLEED = "bleed",
    BURN = "burn",
    EXTRA_DOT = "extradot",
    SHIELD = "shield",
    SHIELD_DMG = "shielddmg",   //increase shield dmg ratio
    LIFESTEAL = "lifesteal",
    LIFESTEALBUFF = "lifestealbuff",
    EXTRALIFE= "extralife",
    ONESHOT = "oneshot",
    FULLHPBONUSDMG = "fullhpbonusdmg"
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
    CURRENT_ATK: number = 100;
    damage_multiplier: number = 1;
    CURRENT_EXP : number = 0;
    MAX_EXP : number = 100;
    CURRENT_SHIELD : number =0;
    MAX_SHIELD : number = 20;
    invincible : boolean = false;
    level : number = 1;

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
    
    static buffPool : Array<BuffCategory> = new Array();

    static appliedBuffs: Array<Buff> = new Array();

    //add to current_buffs later
    hasBleed : Boolean = false;
    hasPoison : Boolean = false;
    hasBurn : Boolean = false;
    hasShield : Boolean = false;
    shieldDamage : number = 1;
    hasLifesteal : Boolean = false;
    lifestealratio : number = 0; //percent of damage to steal
    hasOneShot: Boolean = false;
    extraDotDmg : number =0;
    lives: number = 1;
    cooldownMultiplier : number = 1;
    fullHpBonus: Boolean = false;

    poisonTimer : Timer;
    poisonCounter : number = 0;

    burnTimer : Timer ;
    burnCounter : number =0;

    bleedTimer : Timer;
    bleedCounter :number = 0;

    enemiesKilled : number =0;


    //TODO - get the correct tilemap
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
      
        this.inventory  = options.inventory;

        this.lookDirection = new Vec2();
        
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

        //initialize dot timers
        this.burnTimer = new Timer(1000);
        this.bleedTimer = new Timer(1000);
        this.poisonTimer = new Timer(1000);

        //to test the buffs
        //this.addBuff( {type:BuffType.HEALTH, value:1} );
        //this.addBuff({type:BuffType.BURN, value:1, category:BuffCategory.DOT});
        //this.addBuff({type:BuffType.BLEED, value:1, category:BuffCategory.DOT});
        //this.addBuff({type:BuffType.POISON, value:1, category:BuffCategory.DOT});
        
        
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

        //check dot effects
        if(this.burnTimer.isStopped() && this.burnCounter >0){
            this.burnCounter --;
            this.burnTimer.start();
            this.damage(5);
        }
        if(this.poisonTimer.isStopped() && this.poisonCounter >0){
            this.poisonCounter --;
            this.poisonTimer.start();
            this.damage( Math.round(this.CURRENT_HP/33) );
        }
        if(this.bleedTimer.isStopped() && this.bleedCounter >0){
            this.bleedCounter --;
            this.bleedTimer.start();
            this.damage( 2 + Math.round(this.CURRENT_HP/50) );
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
                damage *= this.damage_multiplier;
                damage = parseFloat(damage.toPrecision(2));
                this.CURRENT_HP -= damage;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "hurt", loop: false, holdReference: false});

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
            this.lives --;
            (<AnimatedSprite>this.owner).animation.play("DYING");
            (<AnimatedSprite>this.owner).animation.queue("DEAD", true, Player_Events.PLAYER_KILLED);
            this.emitter.fireEvent(Player_Events.PLAYER_KILLED);
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
        this.CURRENT_HP += health;
        if(this.CURRENT_HP > this.MAX_HP ){
            this.CURRENT_HP = this.MAX_HP ;
        }
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
            this.MAX_EXP += 50; //increase max exp needed for level up
            this.level++ ;
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_up", loop: false, holdReference: false});
            this.emitter.fireEvent(Player_Events.GIVE_REGULAR_BUFF);
        }
    }
    

    /**
     * generates an array of regular buffs
     * @param val optional value to give buff
     * @returns array of three buffs
     */
    generateRegularBuffs( val? : number) : Buff[]{

        //random number from 5 to 15 if no value given
        let num = Math.floor(Math.random() *10) +5;
        num = Math.round(num);
        if(typeof val !== 'undefined'){
            num = val;
        }

        let buffs = new Array();
        buffs.push({type:BuffType.FLAT_ATK, value:num, category: BuffCategory.EXTRA},
            {type:BuffType.SPEED, value:num, category: BuffCategory.EXTRA},
            {type:BuffType.FLAT_HEALTH, value:num, category: BuffCategory.SHIELD},
            {type:BuffType.RANGE, value:num/100, category: BuffCategory.ATTACK, string: "\n\nIncrease range \nby "+num+"%"},
            {type:BuffType.ATKSPEED, value:num, category: BuffCategory.ATTACK},
        );
        
        
        //shuffle pool of buffs
        buffs.sort(() => 0.5 - Math.random());
        // Get sub-array of first 3 elements after shuffled
        let selected = buffs.slice(0, 3); //3 buff categories
        return selected;
    }

    /**
     * generates an array of special buffs
     * @param val optional value to give the buff
     * @returns array of 3 Buffs
     */
    generateSpecialBuffs( val? : number) : Buff[]{
        //shuffle pool of buff categories 
        PlayerController.buffPool.sort(() => 0.5 - Math.random());

        // Get sub-array of first 3 elements after shuffled
        let shuffled = PlayerController.buffPool.slice(0, 3); //3 buff categories

        //random number from 5 to 15 if no value given
        let num = Math.floor(Math.random() *10) +5;
        num = Math.round(num);
        if(typeof val !== 'undefined'){
            num = val;
        }

        //TODO - implement better buff genertion - some buffs dont want multiple of
        let attackBuffs : Buff[] = [
            {type:BuffType.PERCENT_ATK, value:num/100, category: BuffCategory.ATTACK, string:"\n\nIncrease Attack \nby"+num+"%"}
        ];

        let dotBuffs : Buff[] = [
        ];
        if(!this.hasBleed){
            dotBuffs.push({type:BuffType.BLEED, value:1, category: BuffCategory.DOT, string: "\n\nYour hits \napply Bleed"});
        }
        if(!this.hasBurn){
            dotBuffs.push({type:BuffType.BURN, value:1, category: BuffCategory.DOT, string: "\n\nYour hits \napply Burn"});
        }
        if(!this.hasPoison){
            dotBuffs.push({type:BuffType.POISON, value:1, category: BuffCategory.DOT, string: "\n\nYour hits \napply poison"});
        }

        //only add extra dot if at least one dot is acquired
        for(let i=dotBuffs.length; i< 3 ; i++){
            dotBuffs.push({type:BuffType.EXTRA_DOT, value:num, category: BuffCategory.DOT, string: "\n\nIncrease your \nDOT damage"});
        }

        
        let shieldBuffs : Buff[] = [
            {type:BuffType.PERCENT_HEALTH, value:num/100, category: BuffCategory.SHIELD, string: "\n\nIncrease max hp \nby "+num+"%"},
        ];
        //if player doesnt have shield buff, give them the option, otherwise give buff shield option
        if(!this.hasShield){
            shieldBuffs.push({type:BuffType.SHIELD, value:1, category: BuffCategory.SHIELD, string: "\n\nGain Shield \nWhen Damaged \n Shields return \nthe damage taken \nto attacker"});
        }
        else{
            shieldBuffs.push({type:BuffType.SHIELD_DMG, value:num, category: BuffCategory.SHIELD, string: "\n\nIncrease damage \nreturned by shield"});
        }


        let healthBuffs : Buff[] = [
            {type:BuffType.DEF, value: num/100, category: BuffCategory.HEALTH, string: "\n\nDecrease damage \ntaken by "+num+"%"}
        ];
        if(!this.fullHpBonus){
            healthBuffs.push({type:BuffType.FULLHPBONUSDMG, value:1, category:BuffCategory.HEALTH, string:"\n\nDeal 10x damage \n when at full HP"})

        }
        if(!this.hasLifesteal){
            healthBuffs.push({type:BuffType.LIFESTEAL, value:1, category: BuffCategory.HEALTH, string:"\n\nGain lifesteal"});
        }
        else{
            healthBuffs.push({type:BuffType.LIFESTEALBUFF, value:num/100, category: BuffCategory.HEALTH, string:"\n\nIncrease Lifesteal \nstrength by "+ num+ "%"});
        }


        let extraBuffs : Buff[] = [
            {type:BuffType.EXTRALIFE, value:1, category: BuffCategory.EXTRA, string: "\n\nGain an \nExtra Life"},
        ];
        if(!this.hasOneShot){   //only add oneshot buff if it isnt already included 
            extraBuffs.push({type:BuffType.ONESHOT, value:1, category: BuffCategory.EXTRA, string: "\n\nYour hits hurt \n100x more but \nyour max health \nis set to 1 "});
        };


        let selected = new Array();
        while( shuffled.length != 0){
            let cat = shuffled.pop();
            switch(cat){
                case BuffCategory.ATTACK:
                    attackBuffs.sort(() => 0.5 - Math.random());
                    if(attackBuffs.length == 0){
                        selected.push({type:BuffType.PERCENT_HEALTH, value:num/100, category: BuffCategory.ATTACK, string: "\n\nIncrease attack \nby"+num+"%"});
                    }
                    else{
                        selected.push(attackBuffs.pop());
                    }
                    break;
                case BuffCategory.DOT:
                    dotBuffs.sort(() => 0.5 - Math.random());
                    if(dotBuffs.length == 0){
                        selected.push({type:BuffType.EXTRA_DOT, value:num, category: BuffCategory.DOT, string: "\n\nIncrease your \nDOT damage"});
                    }
                    else{
                        selected.push(dotBuffs.pop());
                    }
                    break;
                case BuffCategory.EXTRA:
                    extraBuffs.sort(() => 0.5 - Math.random());
                    if(extraBuffs.length ==0 ){
                        selected.push({type:BuffType.EXTRALIFE, value:1, category: BuffCategory.EXTRA, string: "\n\nGain an \nExtra Life"});
                    }
                    else{
                        selected.push(extraBuffs.pop());
                    }
                    break;
                case BuffCategory.HEALTH:
                    healthBuffs.sort(() => 0.5 - Math.random());
                    if(healthBuffs.length == 0){
                        selected.push({type:BuffType.DEF, value: num/100, category: BuffCategory.HEALTH, string: "\n\nDecrease damage\n taken by "+num+"%"});
                    }
                    else{
                        selected.push(healthBuffs.pop());
                    }
                    break;
                case BuffCategory.SHIELD:
                    shieldBuffs.sort(() => 0.5 - Math.random());
                    if(shieldBuffs.length ==0 ){
                        selected.push({type:BuffType.FLAT_HEALTH, value:num, category: BuffCategory.SHIELD});
                    }
                    else{
                        selected.push(shieldBuffs.pop());
                    }
                    break;
            }
        }

        return selected;
    }



    
    /**
	 * Add given buff to the player
	 * @param buff Given buff
     * @param init whether or not this is being used during the initialization of the player
	 */
    addBuff(buff: Buff, init? :Boolean ): void {
        
        
        //add buff to array of applied buffs if not being used to init
        if(init === undefined){
            //increase weight of selected buff category
            PlayerController.buffPool.push(buff.category);
            PlayerController.appliedBuffs.push(buff);
        }
        else if (!init){
            //increase weight of selected buff category
            PlayerController.buffPool.push(buff.category);
            PlayerController.appliedBuffs.push(buff);
        }
        // TODO
        let item = this.inventory.getItem();
        switch(buff.type){
            case BuffType.FLAT_HEALTH:
                //this.CURRENT_BUFFS.hp += buff.value;
                this.CURRENT_HP += buff.value;
                this.MAX_HP += buff.value;
                break;
            case BuffType.PERCENT_HEALTH:
                this.CURRENT_HP *= (1+buff.value);
                this.MAX_HP *= (1+buff.value) ;
                this.CURRENT_HP = Math.round(this.CURRENT_HP);
                this.MAX_HP = Math.round(this.MAX_HP);
                break;
            case BuffType.FLAT_ATK:
                this.CURRENT_ATK +=buff.value;
                break;
            case BuffType.PERCENT_ATK:
                this.CURRENT_ATK *=buff.value;
                this.CURRENT_ATK = Math.round(this.CURRENT_ATK);
                break;
            case BuffType.SPEED:
                this.speed += buff.value;
                break;
            case BuffType.DEF:
                this.damage_multiplier *= (1-buff.value);
                break;
            case BuffType.RANGE:
                
                if (item) {
                    (<Weapon>item).EXTRA_RANGE += buff.value;
                }
                break;
            case BuffType.BLEED:
                this.hasBleed = true;
                break;
            case BuffType.BURN:
                this.hasBurn = true;
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
                    this.cooldownMultiplier -= buff.value;
                    //reduce cooldowntimer 
                    (<Weapon>item).cooldownTimer = new Timer((<Weapon>item).cooldown * this.cooldownMultiplier )
                }
                break;
            case BuffType.SHIELD_DMG:
                this.shieldDamage += buff.value ;
                break;
            case BuffType.EXTRALIFE:
                this.lives ++;
                break;
            case BuffType.LIFESTEAL:
                this.hasLifesteal = true;
                this.lifestealratio = .2; //20% lifesteal
                break;
            case BuffType.LIFESTEALBUFF:
                this.lifestealratio += buff.value;
                break;
            case BuffType.ONESHOT:
                this.MAX_HP = 1;
                this.CURRENT_HP = 1;
                this.CURRENT_ATK *= 100;
                break;
            case BuffType.FULLHPBONUSDMG:
                this.fullHpBonus = true;
                break;
        }
    }

    /**
     * 
     * @returns record of the player stats
     */
    getStats(): Record<string, any>{
        let stats = {} as Record<string,any>;
        stats.CURRENT_HP = this.CURRENT_HP;
        stats.CURRENT_ATK = this.CURRENT_ATK;
        stats.CURRENT_SHIELD = this.CURRENT_SHIELD;
        stats.CURRENT_EXP = this.CURRENT_EXP;

        return 
    }
        

    toString(): string{
        return "";
    }

}