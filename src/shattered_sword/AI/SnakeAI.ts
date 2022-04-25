import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI, { EnemyStates } from "./EnemyAI";
import SnakeAttack from "./EnemyStates/SnakeAttack";

export default class SnakeAI extends EnemyAI {
    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        super.initializeAI(owner, options);
        this.addState(EnemyStates.ATTACK, new SnakeAttack(this, owner));
    }
}