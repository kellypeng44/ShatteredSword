import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import PlayerController from "../Player/PlayerController";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import BullAttack from "./EnemyStates/BullAttack";

export default class BullAI extends EnemyAI {
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new BullAttack(this, owner));
        this.attackTimer = new Timer(4000);
    }

    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped();
    }

    collideWithPlayer(player: PlayerController): void {
        if (this.isAttacking ) {
            player.bleedCounter += 3;
        }
        player.damage(10);
    }
}