import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlayerController from "../Player/PlayerController";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import TigerAttack from "./EnemyStates/TigerAttack";

export default class TigerAI extends EnemyAI {
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new TigerAttack(this, owner));
    }

    getPlayerPosition(): Vec2 {
        if (this.owner.position.distanceTo(this.player.position) <= 800) {
            return this.player.position;
        }
        return null;
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