import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import SlimeAttack from "./EnemyStates/SlimeAttack";

export default class SlimeAI extends EnemyAI {
    speed: number = 15;
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new SlimeAttack(this, owner));
    }
}