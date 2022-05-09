import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import BossAttack from "./EnemyStates/BossAttack";
import Weapon from "../GameSystems/items/Weapon";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { Player_Events } from "../sword_enums";

export default class BossAI extends EnemyAI {

    /** The weapon this AI has */
    weapon: Weapon;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new BossAttack(this, owner));
        this.weapon = options.weapon;
    }

    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped() && this.owner.position.distanceTo(position)<=225;
    }

    damage(damage: number): void {
        // enemy already dead, do not send new event
        if (this.CURRENT_HP <= 0) {
            return;
        }
        //console.log(damage +" damage taken, "+this.CURRENT_HP+" hp left");
        this.CURRENT_HP -= damage;
        //TODO -
        if (!this.isAttacking && !this.isCharging) {
            this.owner.animation.play("HURT",false);
        }
        
        //console.log(damage +" damage taken, "+this.CURRENT_HP+" hp left");

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
            
            this.emitter.fireEvent("nextLevel", {owner: this.owner.id, ai:this});
        }
        this.damageTimer.start();
    }
}