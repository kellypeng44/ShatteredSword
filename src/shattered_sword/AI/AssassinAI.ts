import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import AssassinAttack from "./EnemyStates/AssassinAttack";

export default class AssassinAI extends EnemyAI {
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new AssassinAttack(this, owner));
    }


    canAttack(position: Vec2): boolean {
        return this.attackTimer.isStopped() && this.owner.position.distanceTo(position)<=150;
    }

}