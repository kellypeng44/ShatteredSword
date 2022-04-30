import EnemyAI, { EnemyStates } from "../EnemyAI";
import EnemyState from "./EnemyState";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

export default class Attack extends EnemyState {
    protected charged: string;
    protected attacked: string;

    onEnter(options: Record<string, any>): void {
        this.parent.attackTimer.start();
        this.parent.velocity.x = 0;
        this.parent.isCharging = true;
        this.charged = this.owner.id+"charged";
        this.attacked = this.owner.id+"attacked";

        // TODO replace DYING with CHARGING
        (<AnimatedSprite>this.owner).animation.play("CHARGE", false, this.charged);
        this.receiver.subscribe(this.charged);
        this.receiver.subscribe(this.attacked);
    }

    onExit(): Record<string, any> {
        this.parent.isCharging = false;
        (<AnimatedSprite>this.owner).animation.stop();
        return null;
    }
}