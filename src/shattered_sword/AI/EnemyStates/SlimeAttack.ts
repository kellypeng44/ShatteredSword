import EnemyAI, { EnemyStates } from "../EnemyAI";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Attack from "./Attack";

export default class SlimeAttack extends Attack {
    onEnter(options: Record<string, any>): void {
    }
    update(deltaT: number): void {
        this.finished(EnemyStates.ALERT);
    }
    onExit(): Record<string, any> {
        return null;
    }
}