import GoapActionPlanner from "../../Wolfie2D/AI/GoapActionPlanner";
import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import StateMachineGoapAI from "../../Wolfie2D/AI/StateMachineGoapAI";
import GoapAction from "../../Wolfie2D/DataTypes/Interfaces/GoapAction";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Stack from "../../Wolfie2D/DataTypes/Stack";
import State from "../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import Weapon from "../GameSystems/items/Weapon";
import BattlerAI from "./BattlerAI";

import Patrol from "./EnemyStates/Patrol";
import { GameState, Statuses } from "../sword_enums";

import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";

import MathUtils from "../../Wolfie2D/Utils/MathUtils";

import { Player_Events } from "../sword_enums";
import InputWrapper from "../Tools/InputWrapper";
import Timer from "../../Wolfie2D/Timing/Timer";
import PlayerController from "../Player/PlayerController";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Color from "../../Wolfie2D/Utils/Color";
export default class EnemyAI extends StateMachineGoapAI implements BattlerAI {
    /** The owner of this AI */
    owner: AnimatedSprite;

    /** The total possible amount of health this entity has */
    maxHealth: number;

    /** The current amount of health this entity has */
    CURRENT_HP: number;

    /** The default movement speed of this AI */
    speed: number = 20;

    /** The weapon this AI has */
    weapon: Weapon;

    /** A reference to the player object */
    player: GameNode;

    // The current known position of the player
    playerPos: Vec2;

    // The last known position of the player
    lastPlayerPos: Vec2;

    // Attack range
    inRange: number;

    // Path to player
    //path: NavigationPath;

    // Path away from player
    retreatPath: NavigationPath;

    tilemap: OrthogonalTilemap;

    velocity: Vec2 = Vec2.ZERO;

    direction: number; //1 for right, -1 for left

    exp_val: number = 100; //exp value to give player when this dies

    poisonTimer : Timer;
    poisonCounter : number = 0;

    burnTimer : Timer ;
    burnCounter : number =0;

    bleedTimer : Timer;
    bleedCounter :number = 0;

    healthBar: Rect;
    poisonStat: Sprite;
    burnStat: Sprite;
    bleedStat: Sprite;

    attackTimer : Timer;


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void { 
        this.owner = owner;

        //add states
         // Patrol mode
        this.addState(EnemyStates.DEFAULT, new Patrol(this, owner));
        
        this.maxHealth = options.health;

        this.CURRENT_HP = options.health;

        this.weapon = options.weapon;

        this.player = options.player;

        this.inRange = options.inRange;

        this.goal = options.goal;

        this.currentStatus = options.status;

        this.possibleActions = options.actions;

        this.plan = new Stack<GoapAction>();

        this.planner = new GoapActionPlanner();

        //TODO - get correct tilemap
        this.tilemap = <OrthogonalTilemap>this.owner.getScene().getLayer("Wall").getItems()[0];
        // Initialize to the default state
        this.initialize(EnemyStates.DEFAULT);

        this.direction = 1; //default moving to the right

        //exp value
        this.exp_val = options.exp;

        //TODO - dots every 1 sec? can change
        this.burnTimer = new Timer(1000);
        this.bleedTimer = new Timer(1000);
        this.poisonTimer = new Timer(1000);

        this.attackTimer = new Timer(2500);
    }

    activate(options: Record<string, any>): void { }

    damage(damage: number): void {
        // enemy already dead, do not send new event
        if (this.CURRENT_HP <= 0) {
            return;
        }
        console.log(damage +" damage taken, "+this.CURRENT_HP+" hp left");
        this.CURRENT_HP -= damage;
        //TODO -
        this.owner.animation.play("HURT",false);
        console.log(damage +" damage taken, "+this.CURRENT_HP+" hp left");

        // If we're low enough, add Low Health status to enemy
        if (this.CURRENT_HP <= Math.floor(this.maxHealth/2)) {
            
        }

        // If health goes below 0, disable AI and fire enemyDied event
        if (this.CURRENT_HP <= 0) {
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            this.owner.visible = false;
            if (this.healthBar) {
                this.healthBar.destroy();
                this.healthBar = undefined;
            }
            if (this.poisonStat) {
                this.poisonStat.destroy();
                this.poisonStat = undefined;
            }
            if (this.burnStat) {
                this.burnStat.destroy();
                this.burnStat = undefined;
            }
            if (this.bleedStat) {
                this.bleedStat.destroy();
                this.bleedStat = undefined;
            }
            
            this.emitter.fireEvent(Player_Events.ENEMY_KILLED, {owner: this.owner.id, ai:this});


            if (Math.random() < 0.05) {
                // give buff maybe
                //this.emitter.fireEvent("giveBuff", { position: this.owner.position });
            }
        }
    }

    //TODO - need to modify for side view
    
    isPlayerVisible(pos: Vec2): Vec2{
        //Check ifplayer is visible, taking into account walls

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = this.tilemap

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)) {
                        // We hit a wall, we can't see the player
                        //console.log("player not visible")
                        return null;
                    }
                }
            }
        }

        return pos;
    }
    

    

    /**
     * gets the position of the player
     * @returns position of the player if visible, else null
     */
    getPlayerPosition(): Vec2 {
        //TODO - check if player is visible
        if(this.isPlayerVisible(this.player.position))
            return this.player.position;
        else    
            return null;
    }
    update(deltaT: number){
        if (InputWrapper.getState() != GameState.GAMING) {
            this.owner.animation.pause();
            return;
        }
        this.owner.animation.resume();
        super.update(deltaT);

        // This is the plan that is executed in the Active state, so whenever we don't have a plan, acquire a new one given the current statuses the enemy has
        /*
        if (this.plan.isEmpty()) {
            //get a new plan
            if(this.possibleActions === undefined){
                console.log("undefined possiblse actions");
            }

            if(this.currentState === undefined){
                console.log("undefined current status");
            }
            this.plan = this.planner.plan(Statuses.REACHED_GOAL, this.possibleActions, this.currentStatus, null);
        }
        */
        
        //TODO 
        if(this.burnTimer.isStopped() && this.burnCounter >0){
            this.burnCounter --;
            this.burnTimer.start();
            this.damage(5 + (<PlayerController>this.player._ai).extraDotDmg + (<PlayerController>this.player._ai).CURRENT_ATK * .2);
        }
        if(this.poisonTimer.isStopped() && this.poisonCounter >0){
            this.poisonCounter --;
            this.poisonTimer.start();
            this.damage(5 + (<PlayerController>this.player._ai).extraDotDmg + (<PlayerController>this.player._ai).CURRENT_ATK * .2);
        }
        if(this.bleedTimer.isStopped() && this.bleedCounter >0){
            this.bleedCounter --;
            this.bleedTimer.start();
            this.damage(5 + (<PlayerController>this.player._ai).extraDotDmg + (<PlayerController>this.player._ai).CURRENT_ATK * .08);
        }


        


        if (this.healthBar) {
            this.healthBar.position = this.owner.collisionShape.center.clone().add(new Vec2(0, -((<AABB>this.owner.collisionShape).hh+5)));
            this.healthBar.fillWidth = this.CURRENT_HP/this.maxHealth * this.owner.collisionShape.hw * 3;
            if (this.CURRENT_HP/this.maxHealth >= 2/3) {
                this.healthBar.color = Color.GREEN;
            }
            else if (this.CURRENT_HP/this.maxHealth >= 1/3) {
                this.healthBar.color = Color.YELLOW;
            }
            else {
                this.healthBar.color = Color.RED;
            }
        }
        if (this.poisonStat) {
            this.poisonStat.position = this.owner.collisionShape.center.clone().add(new Vec2(-((<AABB>this.owner.collisionShape).hw)*1.5+10, -((<AABB>this.owner.collisionShape).hh+15)));
            this.poisonStat.visible = this.poisonCounter > 0;
        }
        if (this.burnStat) {
            this.burnStat.position = this.poisonStat.position.clone().add(new Vec2(15, 0));
            this.burnStat.visible = this.burnCounter > 0;
        }
        if (this.bleedStat) {
            this.bleedStat.position = this.poisonStat.position.clone().add(new Vec2(30, 0));
            this.bleedStat.visible = this.bleedCounter > 0;
        }   
    }
}

export enum EnemyStates {
    DEFAULT = "default",
    ALERT = "alert",
    PREVIOUS = "previous"
}
