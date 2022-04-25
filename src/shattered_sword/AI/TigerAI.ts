import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import TigerAttack from "./EnemyStates/TigerAttack";

export default class TigerAI extends EnemyAI {
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new TigerAttack(this, owner));
    }

    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped();
    }

    getPlayerPosition(): Vec2 {
        return this.player.position;
    }
}